import os
import time
import json
import re
import unicodedata
from pathlib import Path
from playwright.sync_api import sync_playwright

# =============================================================================
# CONFIGURAÇÕES E UTILITÁRIOS
# =============================================================================

PROFILE_URL = "https://learn.microsoft.com/pt-br/users/cyrdqueiroz-9281/achievements/"
OUTPUT_DIR = Path("/home/cidquei/CDKTECK/cdkteck/public/certificados")
# Fontes de dados
VIVA_DATA_SOURCE = Path("/home/cidquei/CDKTECK/cdkteck/scripts/raw_badges.json")
AUTH_FILE = Path("/home/cidquei/CDKTECK/cdkteck/scripts/ms_auth.json")

DELAY_BETWEEN_DOWNLOADS = 3  # segundos para evitar block

# Criar diretório se não existir
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def sanitize_filename(filename):
    """Cria um nome de arquivo seguro e limpo."""
    nfkd_form = unicodedata.normalize('NFKD', str(filename))
    text_without_accents = "".join([c for c in nfkd_form if not unicodedata.combining(c)])
    sanitized_name = re.sub(r'[^\w\s-]', '', text_without_accents).strip()
    sanitized_name = re.sub(r'[\s_]+', '-', sanitized_name)
    return sanitized_name.lower()

def run_nuclear():
    print("🚀 Iniciando Operação Nuclear 2.0 (MODO AUTH ABSORBED) 🔐")
    
    links_data = []

    # ESTRATÉGIA: Ler links da fonte de verdade local (raw_badges.json)
    if VIVA_DATA_SOURCE.exists():
        print(f"📖 Lendo {VIVA_DATA_SOURCE.name}...")
        try:
            with open(VIVA_DATA_SOURCE, "r", encoding="utf-8") as f:
                raw_data = json.load(f)
                for item in raw_data:
                    url = item.get("verify_url")
                    if url and "/print/" in url:
                        links_data.append({
                            "url": url,
                            "hint": item.get("title", "")
                        })
            print(f"📋 Importados {len(links_data)} links.")
        except Exception as e:
            print(f"⚠️ Erro ao ler JSON local: {e}")

    if not links_data:
        print("❌ FALHA: Nenhum link de certificado encontrado.")
        return

    # Verificação de Auth
    if not AUTH_FILE.exists():
        print(f"\n⚠️  ALERTA: Arquivo de autenticação {AUTH_FILE.name} não encontrado!")
        print("Certifique-se de rodar 'python3 ms_login_assistant.py' primeiro.")
        return

    # MOTOR DE DOWNLOAD (Missão Principal)
    print(f"🏗️ Preparado para baixar {len(links_data)} PDFs usando sua identidade.")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # Iniciar CONTEXTO com a IDENTIDADE ABSORVIDA
        print(f"🔑 Carregando cookies de {AUTH_FILE.name}...")
        context = browser.new_context(
            storage_state=str(AUTH_FILE),
            viewport={'width': 1280, 'height': 800}
        )
        
        page = context.new_page()

        for i, data in enumerate(links_data, 1):
            url = data["url"]
            print(f"[{i}/{len(links_data)}] Baixando: {url}")
            
            try:
                raw_title = data["hint"] or url.split("/")[-1]
                filename = sanitize_filename(raw_title) + ".pdf"
                filepath = OUTPUT_DIR / filename
                
                if filepath.exists():
                    print(f"  ⏩ Pulado (já existe)")
                    continue

                page.goto(url, wait_until="networkidle", timeout=45000)
                
                # Verificação de erro de "Conquista não disponível"
                # O texto geralmente é: "Opa, esta conquista não está disponível para exibição."
                page_content = page.content()
                if "disponível para exibição" in page_content or "conquista não está disponível" in page_content:
                    print(f"  ❌ ERRO: Acesso negado. A sessão no {AUTH_FILE.name} pode ter expirado.")
                    # Poderíamos dar break aqui para não desperdiçar tempo
                    # Mas vamos tentar o próximo por segurança
                    continue

                # Aguarda renderização do certificado
                try:
                    page.wait_for_selector("h2", timeout=5000)
                except:
                    pass

                page.pdf(
                    path=str(filepath),
                    format="A4",
                    landscape=True,
                    print_background=True,
                    margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"}
                )
                
                print(f"  ✅ PDF Gerado: {filename}")
                page.wait_for_timeout(DELAY_BETWEEN_DOWNLOADS * 1000)
                
            except Exception as e:
                print(f"  ❌ Erro em {url}: {e}")

        browser.close()
    
    print("\n🏁 Operação Concluída. Todos os certificados estão em public/certificados/")

if __name__ == "__main__":
    run_nuclear()
