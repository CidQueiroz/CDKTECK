import os
import time
import json
import re
import unicodedata
from pathlib import Path
from datetime import datetime
from playwright.sync_api import sync_playwright

# =============================================================================
# CONFIGURAÇÕES (ROADMAP 3.0)
# =============================================================================

PROFILE_URL = "https://www.skills.google/public_profiles/3173b2da-2150-4c06-b953-7b2c0222f450"

# Caminhos Dinâmicos
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "certificados"
JSON_PATH = PROJECT_ROOT / "src" / "data" / "certificates.json"

DELAY_BETWEEN_DOWNLOADS = 3  # segundos para evitar block

# Criar diretório se não existir
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# =============================================================================
# UTILITÁRIOS
# =============================================================================

def sanitize_filename(filename):
    """Cria um nome de arquivo seguro e limpo."""
    nfkd_form = unicodedata.normalize('NFKD', str(filename))
    text_without_accents = "".join([c for c in nfkd_form if not unicodedata.combining(c)])
    sanitized_name = re.sub(r'[^\w\s-]', '', text_without_accents).strip()
    sanitized_name = re.sub(r'[\s_]+', '-', sanitized_name)
    return sanitized_name.lower()

def format_date_br(iso_date_str):
    """Converte 'Oct 28, 2025' ou ISO para 'DD/MM/AAAA'."""
    try:
        # GCP costuma vir como 'Oct 28, 2025'
        dt = datetime.strptime(iso_date_str, "%b %d, %Y")
        return dt.strftime("%d/%m/%Y")
    except:
        try:
            # Fallback para ISO se necessário
            dt = datetime.fromisoformat(iso_date_str.replace('Z', '+00:00'))
            return dt.strftime("%d/%m/%Y")
        except:
            return iso_date_str

# =============================================================================
# OPERAÇÃO NUCLEAR GCP v2.0
# =============================================================================

def run_gcp_nuclear():
    print("\n" + "="*60)
    print("☁️  OPERAÇÃO NUCLEAR GCP v2.0: DATA OPS & SOBERANIA")
    print("="*60)
    
    new_entries = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()
        
        # --- FASE 1: DISCOVER ---
        print(f"🌍 Acessando perfil público: {PROFILE_URL}")
        page.goto(PROFILE_URL, wait_until="networkidle")
        
        badge_links = []
        selectors = page.locator("a.badge-image").all()
        for s in selectors:
            href = s.get_attribute("href")
            if href:
                if not href.startswith("http"):
                    href = "https://www.skills.google" + href
                badge_links.append(href)
        
        print(f"📦 Encontrados {len(badge_links)} badges para processamento.")
        
        # --- FASE 2: DOWNLOAD & EXTRACT ---
        for i, url in enumerate(badge_links, 1):
            print(f"[{i}/{len(badge_links)}] Analisando: {url}")
            
            try:
                page.goto(url, wait_until="networkidle")
                
                # Extrair dados do elemento <ql-badge>
                badge_element = page.locator("ql-badge")
                if not badge_element.count():
                    print("  ⚠️ Elemento <ql-badge> não encontrado. Pulando...")
                    continue
                
                badge_data_json = badge_element.get_attribute("badge")
                if not badge_data_json:
                    print("  ⚠️ Atributo 'badge' vazio. Pulando...")
                    continue
                
                data = json.loads(badge_data_json)
                title = data.get("title", "GCP Achievement")
                completed_at_raw = data.get("completedAt", "")
                
                # Formatação de Datas
                issue_date_br = format_date_br(completed_at_raw)
                date_suffix = ""
                if completed_at_raw:
                    try:
                        dt = datetime.strptime(completed_at_raw, "%b %d, %Y")
                        date_suffix = dt.strftime("%Y-%m-%d")
                    except:
                        date_suffix = sanitize_filename(completed_at_raw)
                
                base_name = sanitize_filename(title)
                # Mantendo o sufixo de data conforme aprovado pelo usuário
                filename = f"google-cloud-{base_name}-{date_suffix}.pdf" if date_suffix else f"google-cloud-{base_name}.pdf"
                cert_id = filename.replace('.pdf', '')
                filepath = OUTPUT_DIR / filename
                
                # Preparar entrada para o JSON
                entry = {
                    "id": cert_id,
                    "title": title,
                    "issuer": "Google Cloud",
                    "description": "", # Deixado vazio para o Ollama preencher via sanitize-certificates.js
                    "image_url": f"/certificados/images/{cert_id}.png",
                    "pdf_url": f"/certificados/{filename}",
                    "issue_date": issue_date_br,
                    "type": "pdf",
                    "verify_url": url,
                    "category_tier": "Cloud_AI"
                }
                new_entries.append(entry)

                if filepath.exists():
                    print(f"  ⏩ PDF já existe: {filename}")
                else:
                    # GERAÇÃO DE PDF (Soberania de Texto para RAG)
                    # Imprimimos a página inteira em landscape para garantir que o texto do título e data estejam no PDF
                    page.pdf(
                        path=str(filepath),
                        format="A4",
                        landscape=True,
                        print_background=True,
                        margin={"top": "20px", "right": "20px", "bottom": "20px", "left": "20px"}
                    )
                    print(f"  ✅ PDF Gerado: {filename}")
                    time.sleep(DELAY_BETWEEN_DOWNLOADS)
                
            except Exception as e:
                print(f"  ❌ Erro em {url}: {e}")

        browser.close()
    
    # --- FASE 3: SYNC JSON ---
    if JSON_PATH.exists():
        print(f"\n🔄 Sincronizando {len(new_entries)} registros com o banco de dados...")
        try:
            with open(JSON_PATH, 'r', encoding='utf-8') as f:
                current_data = json.load(f)
            
            # Criar dicionário para busca rápida por ID
            data_dict = {item['id']: item for item in current_data}
            
            added = 0
            updated = 0
            for entry in new_entries:
                if entry['id'] in data_dict:
                    # Atualiza apenas campos básicos se já existir
                    data_dict[entry['id']]['verify_url'] = entry['verify_url']
                    data_dict[entry['id']]['issue_date'] = entry['issue_date']
                    updated += 1
                else:
                    current_data.append(entry)
                    added += 1
            
            with open(JSON_PATH, 'w', encoding='utf-8') as f:
                json.dump(current_data, f, indent=2, ensure_ascii=False)
            
            print(f"  ✨ JSON Atualizado: {added} novos, {updated} atualizados.")
        except Exception as e:
            print(f"  ❌ Erro ao atualizar JSON: {e}")

    print("\n🏁 Operação concluída!")
    print("👉 PRÓXIMO PASSO: node scripts/sanitize-certificates.js (Para preencher as descrições via Llama 3)")

if __name__ == "__main__":
    run_gcp_nuclear()
