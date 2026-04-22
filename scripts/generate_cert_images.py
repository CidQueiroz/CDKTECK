import json
import re
import unicodedata
import os
from pathlib import Path
from pdf2image import convert_from_path
from pypdf import PdfReader

# =============================================================================
# UTILITÁRIOS
# =============================================================================

def sanitize_filename(text):
    """Cria um slug seguro para nomes de arquivos a partir de um texto qualquer."""
    # Normaliza para remover acentos
    nfkd_form = unicodedata.normalize('NFKD', text)
    text_without_accents = "".join([c for c in nfkd_form if not unicodedata.combining(c)])
    
    # Remove caracteres especiais e troca espaços por hífens
    sanitized = re.sub(r'[^\w\s-]', '', text_without_accents).strip()
    sanitized = re.sub(r'[\s_]+', '-', sanitized)
    return sanitized.lower()

def extract_metadata_from_pdf(pdf_path):
    """Extrai título, emissor e data de um arquivo PDF."""
    issuer = "Desconhecido"
    title = pdf_path.stem.replace('-', ' ').replace('_', ' ').title()
    issue_date = ""
    text = ""
    
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            text += page.extract_text() or ""
        
        # Identificação de Emissor
        known_issuers = ["Oracle", "Google", "Microsoft", "Alura", "Udemy", "Coursera", "Dataquest", "Udacity", "IBM", "AWS"]
        for known in known_issuers:
            if re.search(r'\b' + re.escape(known) + r'\b', text, re.IGNORECASE):
                issuer = known
                break
        
        # Lógica Específica Microsoft Learn
        if "Transcrição" in text and "concluídas com êxito" in text:
            issuer = "Microsoft"
            # Regex para pegar o título (linha logo após 'concluídas com êxito')
            match_title = re.search(r'concluídas com êxito\n(.+)', text)
            if match_title:
                extracted_title = match_title.group(1).strip()
                if len(extracted_title) > 5:
                    title = extracted_title
            
            # Regex para pegar a data (linha logo após o título)
            # Geralmente: "17 de abril de 2026"
            match_date = re.search(r'concluídas com êxito\n.+\n(.+)', text)
            if match_date:
                raw_date = match_date.group(1).strip()
                # Tenta converter para YYYY-MM-DD ou mantém se não conseguir
                months = {
                    "janeiro": "01", "fevereiro": "02", "março": "03", "abril": "04",
                    "maio": "05", "junho": "06", "julho": "07", "agosto": "08",
                    "setembro": "09", "outubro": "10", "novembro": "11", "dezembro": "12"
                }
                for m_name, m_num in months.items():
                    if m_name in raw_date.lower():
                        day_match = re.search(r'(\d+)', raw_date)
                        year_match = re.search(r'(\d{4})', raw_date)
                        if day_match and year_match:
                            issue_date = f"{year_match.group(1)}-{m_num}-{day_match.group(1).zfill(2)}"
                        break

    except Exception as e:
        print(f"  !! Erro ao extrair metadados do PDF '{pdf_path.name}': {e}")
    
    return title, issuer, issue_date

def classify_certificate(title, issuer):
    """Classifica o certificado na categoria correta baseado no título e emissor."""
    title_lower = title.lower()
    issuer_lower = issuer.lower()

    # Cybersecurity
    cyber_keywords = ["seguran", "security", "cyber", "network", "redes", "protect", "defense", "defesa", "hacking", "pentest", "identity", "identidade", "entra", "defender"]
    if any(k in title_lower for k in cyber_keywords):
        return "Cybersecurity"

    # AI & Cloud
    ai_keywords = ["ai", "ia", "intelligence", "inteligencia", "generative", "generativa", "rag", "llm", "foundry", "agent", "agente", "machine-learning", "vertex", "gemini", "bedrock"]
    if any(k in title_lower for k in ai_keywords):
        return "Cloud_AI"

    # Elite
    elite_keywords = ["professional", "profissional", "architect", "arquiteto", "expert", "especialista", "specialist"]
    if any(k in title_lower for k in elite_keywords):
        return "Elite"
    
    # Data
    data_keywords = ["bigquery", "data", "dados", "sql", "analysis", "analise", "dashboard", "power-bi", "fabric", "excel", "python", "looker", "mineracao", "bi"]
    if any(k in title_lower for k in data_keywords) or "data" in issuer_lower:
        return "Data_Intelligence"

    # Vendors
    cloud_vendors = ["oracle", "google", "microsoft", "aws", "ibm", "azure", "cloud"]
    if any(v in issuer_lower for v in cloud_vendors) or any(v in title_lower for v in cloud_vendors):
        return "Cloud_AI"
    
    return "Tools_Courses"

# =============================================================================
# ORQUESTRADOR PRINCIPAL
# =============================================================================

def generate_images_and_update_json():
    """Processa PDFs, renomeia arquivos para nomes descritivos e atualiza o JSON."""
    project_root = Path(__file__).resolve().parent.parent
    pdfs_dir = project_root / "public" / "certificados"
    output_image_dir = pdfs_dir / "images"
    json_path = project_root / "src" / "data" / "certificates.json"

    print("🛠️  Iniciando processamento inteligente e renomeação de certificados...")
    output_image_dir.mkdir(parents=True, exist_ok=True)

    certificates_data = []
    
    # Processar todos os PDFs na pasta
    pdf_files = list(pdfs_dir.glob("*.pdf"))
    print(f"📄 Encontrados {len(pdf_files)} arquivos PDF para análise.")

    processed_ids = set()

    for pdf_path in pdf_files:
        # 1. Extrair metadados reais
        title, issuer, issue_date = extract_metadata_from_pdf(pdf_path)
        
        # 2. Gerar novo ID amigável (slug)
        # Se for Microsoft, prefixamos com 'microsoft-'
        base_slug = sanitize_filename(title)
        if issuer == "Microsoft" and not base_slug.startswith("microsoft"):
            cert_id = f"microsoft-{base_slug}"
        else:
            cert_id = base_slug
            
        # Evitar colisões de ID (ex: cursos com mesmo nome)
        if cert_id in processed_ids:
            cert_id = f"{cert_id}-{pdf_path.stem[-8:]}" # Adiciona parte do ID original do arquivo

        # 3. Renomear arquivo PDF fisicamente
        new_pdf_name = f"{cert_id}.pdf"
        new_pdf_path = pdfs_dir / new_pdf_name
        
        if pdf_path.name != new_pdf_name:
            # Se o arquivo de destino já existe, removemos o antigo se for diferente
            if new_pdf_path.exists() and new_pdf_path != pdf_path:
                os.remove(pdf_path)
                print(f"  ⚠️ Ignorado duplicata: {pdf_path.name}")
                continue
            
            pdf_path.rename(new_pdf_path)
            print(f"  📝 Renomeado: {pdf_path.name} -> {new_pdf_name}")
            pdf_path = new_pdf_path # Atualiza referência mas mantendo o objeto Path

        # 4. Gerar Imagem
        image_filename = f"{cert_id}.png"
        image_output_path = output_image_dir / image_filename
        
        if not image_output_path.exists():
            try:
                images = convert_from_path(pdf_path, first_page=1, last_page=1, fmt='png', size=(600, None))
                if images:
                    images[0].save(image_output_path, "PNG")
                    print(f"  📸 Imagem gerada: {image_filename}")
            except Exception as e:
                print(f"  !! Erro ao converter PDF '{pdf_path.name}': {e}")

        # 5. Adicionar ao JSON
        description = f"Certificação da {issuer} em {title}, comprovando habilidades técnicas na área."
        
        certificates_data.append({
            "id": cert_id,
            "title": title,
            "issuer": issuer if issuer != "Google" else "Google Cloud",
            "description": description,
            "image_url": f"/certificados/images/{image_filename}",
            "pdf_url": f"/certificados/{new_pdf_name}",
            "issue_date": issue_date,
            "type": "pdf",
            "verify_url": f"/certificados/{new_pdf_name}",
            "category_tier": classify_certificate(title, issuer)
        })
        
        processed_ids.add(cert_id)

    # Ordenar por data (mais recentes primeiro)
    certificates_data.sort(key=lambda x: x.get("issue_date", ""), reverse=True)

    # Salva o resultado final
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(certificates_data, f, indent=2, ensure_ascii=False)

    print(f"✨ Processamento concluído! {len(certificates_data)} certificados organizados e humanizados.")

if __name__ == "__main__":
    generate_images_and_update_json()

if __name__ == "__main__":
    generate_images_and_update_json()