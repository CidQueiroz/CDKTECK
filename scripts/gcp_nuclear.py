import os
import time
import json
import re
import unicodedata
from pathlib import Path
from playwright.sync_api import sync_playwright

# =============================================================================
# CONFIGURAÇÕES
# =============================================================================

PROFILE_URL = "https://www.skills.google/public_profiles/3173b2da-2150-4c06-b953-7b2c0222f450"
OUTPUT_DIR = Path("/home/cidquei/CDKTECK/cdkteck/public/certificados")
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

def run_gcp_nuclear():
    print("\n" + "="*60)
    print("☁️  OPERAÇÃO NUCLEAR GCP: GOOGLE CLOUD SKILLS SCRAPER")
    print("="*60)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        
        print(f"🌍 Acessando perfil público: {PROFILE_URL}")
        page.goto(PROFILE_URL, wait_until="networkidle")
        
        # Encontrar todos os links de badges
        badge_links = []
        # Selector baseado na análise do DOM: .badge-image é o link que envolve a imagem
        selectors = page.locator("a.badge-image").all()
        for s in selectors:
            href = s.get_attribute("href")
            if href:
                if not href.startswith("http"):
                    href = "https://www.skills.google" + href
                badge_links.append(href)
        
        print(f"📦 Encontrados {len(badge_links)} badges para processamento.")
        
        for i, url in enumerate(badge_links, 1):
            print(f"[{i}/{len(badge_links)}] Analisando: {url}")
            
            try:
                # 1. Navegar para a página de detalhes da badge
                page.goto(url, wait_until="networkidle")
                
                # 2. Extrair dados do elemento <ql-badge> (Contém JSON no atributo 'badge')
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
                completed_at = data.get("completedAt", "")
                
                # 3. Formatar nome do arquivo com data
                date_suffix = ""
                if completed_at:
                    try:
                        from datetime import datetime
                        dt = datetime.strptime(completed_at, "%b %d, %Y")
                        date_suffix = dt.strftime("%Y-%m-%d")
                    except:
                        date_suffix = sanitize_filename(completed_at)
                
                base_name = sanitize_filename(title)
                filename = f"google-cloud-{base_name}-{date_suffix}.pdf" if date_suffix else f"google-cloud-{base_name}.pdf"
                filepath = OUTPUT_DIR / filename
                
                if filepath.exists():
                    print(f"  ⏩ Pulado (já existe: {filename})")
                    continue
                
                # 4. DOWNLOAD E IMPRESSÃO DA IMAGEM (SOBERANIA ESTÉTICA)
                image_url = data.get("imageSrc")
                if image_url:
                    print(f"  🎨 Capturando imagem do selo: {image_url}")
                    # Navega diretamente para a imagem
                    page.goto(image_url, wait_until="networkidle")
                    
                    # Imprime a imagem como PDF (focado nela)
                    page.pdf(
                        path=str(filepath),
                        format="A4",
                        landscape=True,
                        print_background=True,
                        margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"}
                    )
                else:
                    # Fallback para a página inteira se não houver imagem
                    page.pdf(path=str(filepath), format="A4", landscape=True)

                print(f"  ✅ PDF Gerado: {filename}")
                time.sleep(DELAY_BETWEEN_DOWNLOADS)
                
            except Exception as e:
                print(f"  ❌ Erro ao baixar {url}: {e}")

        browser.close()
    
    print("\n🏁 Operação concluída! Rode 'python3 generate_cert_images.py' para sincronizar.")

if __name__ == "__main__":
    run_gcp_nuclear()
