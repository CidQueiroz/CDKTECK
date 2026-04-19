"""
Microsoft Learn — Certificate Scraper (CDK TECK)
=================================================
Fluxo de 3 fases:
  1. AUTH  → Se ms_auth.json não existe, abre browser visível para login (90s)
  2. DISCOVER → Navega no perfil de conquistas e coleta links /achievements/print/
  3. DOWNLOAD → Salva cada certificado como PDF em public/certificados/

Após rodar, execute: python3 generate_cert_images.py
"""

import sys
import re
import time
import unicodedata
from pathlib import Path

from playwright.sync_api import sync_playwright

# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURAÇÕES
# ─────────────────────────────────────────────────────────────────────────────

PROFILE_URL = "https://learn.microsoft.com/pt-br/users/cyrdqueiroz-9281/achievements/"
OUTPUT_DIR  = Path(__file__).resolve().parent.parent / "public" / "certificados"
AUTH_FILE   = Path(__file__).resolve().parent / "ms_auth.json"

DELAY_BETWEEN_DOWNLOADS = 3   # segundos entre requisições (evita bloqueio)
MAX_SCROLL_ATTEMPTS     = 25  # scroll infinito máximo de tentativas

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ─────────────────────────────────────────────────────────────────────────────
# UTILITÁRIOS
# ─────────────────────────────────────────────────────────────────────────────

def sanitize_filename(name: str) -> str:
    """Converte um título livre em nome de arquivo seguro e padronizado."""
    nfkd = unicodedata.normalize("NFKD", str(name))
    text = "".join(c for c in nfkd if not unicodedata.combining(c))
    text = re.sub(r"[^\w\s-]", "", text).strip()
    return re.sub(r"[\s_]+", "-", text).lower()


# ─────────────────────────────────────────────────────────────────────────────
# FASE 1 — AUTH: Absorção da sessão do usuário
# ─────────────────────────────────────────────────────────────────────────────

def absorb_auth(playwright) -> None:
    """
    Abre um browser visível para o usuário fazer login manual.
    Após 90 segundos, captura e persiste os cookies em ms_auth.json.
    """
    print("\n" + "=" * 60)
    print("🔐 FASE 1: ABSORÇÃO DE AUTENTICAÇÃO MICROSOFT")
    print("=" * 60)
    print("  1. Uma janela do Chromium vai abrir.")
    print("  2. Faça login com sua conta Microsoft.")
    print("  3. Você tem 90 segundos — os cookies serão capturados automaticamente.")
    print("\n🚀 Abrindo navegador...\n")

    browser = playwright.chromium.launch(headless=False, slow_mo=50)
    context = browser.new_context(viewport={"width": 1280, "height": 800})
    page    = context.new_page()

    page.goto("https://learn.microsoft.com/pt-br/", wait_until="commit")

    for remaining in range(90, 0, -1):
        sys.stdout.write(f"\r⏳ {remaining:2d}s restantes — Faça login agora...  ")
        sys.stdout.flush()
        time.sleep(1)

    print("\n\n📸 Capturando sessão...")
    context.storage_state(path=str(AUTH_FILE))
    browser.close()
    print(f"✅ Sessão salva em '{AUTH_FILE.name}'")


# ─────────────────────────────────────────────────────────────────────────────
# FASE 2 — DISCOVER: Coleta links /achievements/print/
# ─────────────────────────────────────────────────────────────────────────────

def discover_print_links(page) -> list[dict]:
    """
    Navega no perfil de conquistas com scroll automático e retorna
    todos os links de impressão encontrados com seus títulos.
    """
    print(f"\n🌍 Acessando perfil: {PROFILE_URL}")
    page.goto(PROFILE_URL, wait_until="networkidle", timeout=60_000)

    # Scroll até o fim para carregar todos os itens (lista com lazy load)
    print("📜 Fazendo scroll para carregar todos os certificados...")
    prev_height = 0
    for _ in range(MAX_SCROLL_ATTEMPTS):
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1_500)
        height = page.evaluate("document.body.scrollHeight")
        if height == prev_height:
            break
        prev_height = height

    # Extrai href + título de cada link de impressão
    links = page.eval_on_selector_all(
        'a[href*="/achievements/print/"]',
        """els => els.map(el => ({
            href:  el.href,
            title: (
                el.closest('[class*="achievement"]')?.querySelector('h3,h2,[class*="title"]')?.innerText
                || el.getAttribute('aria-label')
                || el.getAttribute('title')
                || ''
            ).trim()
        }))"""
    )

    # Deduplicação por href (evita duplicatas de elementos clonados em DOM)
    seen  = set()
    unique = []
    for item in links:
        if item["href"] not in seen:
            seen.add(item["href"])
            unique.append(item)

    print(f"📦 {len(unique)} links únicos de certificado encontrados.")
    return unique


# ─────────────────────────────────────────────────────────────────────────────
# FASE 3 — DOWNLOAD: Gera PDF para cada certificado
# ─────────────────────────────────────────────────────────────────────────────

def download_pdfs(page, links: list[dict]) -> None:
    """
    Para cada link, navega até a página de impressão e salva como PDF.
    Arquivos já existentes são pulados automaticamente.
    """
    total      = len(links)
    downloaded = skipped = errors = 0

    print(f"\n🏗️  Iniciando download de {total} PDFs...\n")

    for i, item in enumerate(links, 1):
        url   = item["href"]
        hint  = item.get("title", "").strip()

        # Monta nome do arquivo: prefixa com 'microsoft-' para identificação
        base = sanitize_filename(hint) if hint else "badge-" + url.split("/")[-1]
        filename = f"microsoft-{base}.pdf"
        filepath = OUTPUT_DIR / filename

        print(f"[{i:02d}/{total}] {hint or url}")

        if filepath.exists():
            print("  ⏩ Pulado (já existe)")
            skipped += 1
            continue

        try:
            page.goto(url, wait_until="networkidle", timeout=45_000)

            # Detecta sessão expirada
            content = page.content()
            if "disponível para exibição" in content or "não está disponível" in content:
                print("  ❌ Acesso negado — sessão expirada.")
                print("     Delete 'ms_auth.json' e rode novamente para re-autenticar.")
                errors += 1
                continue

            # Aguarda renderização do certificado
            try:
                page.wait_for_selector(
                    "h2, h1, .certificate-title, .achievement-title",
                    timeout=5_000
                )
            except Exception:
                pass  # Continua mesmo sem encontrar o seletor

            page.pdf(
                path=str(filepath),
                format="A4",
                landscape=True,
                print_background=True,
                margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"},
            )
            print(f"  ✅ {filename}")
            downloaded += 1
            page.wait_for_timeout(DELAY_BETWEEN_DOWNLOADS * 1_000)

        except Exception as e:
            print(f"  ❌ Erro: {e}")
            errors += 1

    print(f"\n{'─'*60}")
    print(f"🏁 Download concluído!")
    print(f"   ✅ {downloaded} baixados  |  ⏩ {skipped} pulados  |  ❌ {errors} erros")
    print(f"\n👉 Próximo passo: python3 generate_cert_images.py")


# ─────────────────────────────────────────────────────────────────────────────
# ORQUESTRADOR PRINCIPAL
# ─────────────────────────────────────────────────────────────────────────────

def run() -> None:
    print("\n" + "=" * 60)
    print("🎓 MICROSOFT LEARN — Certificate Scraper  (CDK TECK)")
    print("=" * 60)

    with sync_playwright() as p:

        # ── Fase 1: Auth ──────────────────────────────────────────────────────
        if not AUTH_FILE.exists():
            absorb_auth(p)
        else:
            print(f"✔️  Sessão encontrada: '{AUTH_FILE.name}' — pulando login.")
            print("   (Delete esse arquivo para forçar re-autenticação)")

        # ── Fase 2 + 3: Descoberta e Download ────────────────────────────────
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            storage_state=str(AUTH_FILE),
            viewport={"width": 1280, "height": 800},
        )
        page = context.new_page()

        links = discover_print_links(page)

        if links:
            download_pdfs(page, links)
        else:
            print("\n❌ Nenhum link encontrado.")
            print("   Verifique se a URL do perfil está correta ou se a sessão é válida.")

        browser.close()


if __name__ == "__main__":
    run()
