import json
import base64
import re
import datetime
import unicodedata
from pathlib import Path
from pdf2image import convert_from_path
from pypdf import PdfReader

# =============================================================================
# UTILITÁRIOS
# =============================================================================

def sanitize_filename(filename):
    """Remove a extensão, acentos e caracteres especiais para criar um nome de arquivo seguro."""
    name_without_ext = Path(filename).stem
    # Normaliza para remover acentos
    nfkd_form = unicodedata.normalize('NFKD', name_without_ext)
    text_without_accents = "".join([c for c in nfkd_form if not unicodedata.combining(c)])
    
    sanitized_name = re.sub(r'[^\w\s-]', '', text_without_accents).strip()
    sanitized_name = re.sub(r'[\s_]+', '-', sanitized_name)
    return sanitized_name.lower()

def extract_details_from_pdf(pdf_path):
    """Extrai texto e tenta identificar o emissor de um arquivo PDF."""
    issuer = "Desconhecido"
    text = ""
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            text += page.extract_text() or ""
        
        known_issuers = ["Oracle", "Google", "Microsoft", "Alura", "Udemy", "Coursera", "Dataquest", "Udacity", "IBM", "AWS"]
        for known in known_issuers:
            if re.search(r'\b' + re.escape(known) + r'\b', text, re.IGNORECASE):
                issuer = known
                break
    except Exception as e:
        print(f"  !! Erro ao ler o texto do PDF '{pdf_path.name}': {e}")
    
    return issuer

def classify_certificate(title, issuer):
    """Classifica o certificado na categoria correta baseado no título e emissor."""
    title_lower = title.lower()
    issuer_lower = issuer.lower()

    # PRIORIDADE 1: CYBERSECURITY
    cyber_keywords = ["seguran", "security", "cyber", "network", "redes", "protect", "defense", "defesa", "hacking", "pentest", "identity", "identidade", "entra", "defender"]
    if any(k in title_lower for k in cyber_keywords):
        return "Cybersecurity"

    # PRIORIDADE 2: AI & LLMs (Destaque do PapoDados)
    ai_keywords = ["ai", "ia", "intelligence", "inteligencia", "generative", "generativa", "rag", "llm", "foundry", "agent", "agente", "machine-learning", "vertex", "gemini"]
    if any(k in title_lower for k in ai_keywords):
        return "Cloud_AI"

    # PRIORIDADE 3: ELITE (Alta senioridade/Arquitetura)
    elite_keywords = ["professional", "profissional", "architect", "arquiteto", "expert", "especialista", "specialist"]
    if any(k in title_lower for k in elite_keywords):
        return "Elite"
    
    # PRIORIDADE 4: DATA INTELLIGENCE
    data_keywords = ["bigquery", "data", "dados", "sql", "analysis", "analise", "dashboard", "power-bi", "fabric", "excel", "python", "looker"]
    if any(k in title_lower for k in data_keywords) or "data" in issuer_lower:
        return "Data_Intelligence"

    # PRIORIDADE 5: CLOUD (Generic)
    cloud_vendors = ["oracle", "google", "microsoft", "aws", "ibm", "azure", "cloud"]
    if any(v in issuer_lower for v in cloud_vendors) or any(v in title_lower for v in cloud_vendors):
        return "Cloud_AI"
    
    # PADRÃO
    return "Tools_Courses"

# =============================================================================
# ORQUESTRADOR PRINCIPAL
# =============================================================================

def generate_images_and_update_json():
    """Converte PDFs em imagens e sincroniza o certificates.json."""
    script_dir = Path(__file__).resolve().parent
    
    if script_dir.name == "scripts" and script_dir.parent.name == "CDKTECK":
        project_root = script_dir.parent / "cdkteck"
    else:
        project_root = script_dir.parent

    pdfs_dir = project_root / "public" / "certificados"
    output_image_dir = pdfs_dir / "images"
    json_path = project_root / "src" / "data" / "certificates.json"

    print("🛠️  Iniciando atualização do ecossistema de certificados...")
    output_image_dir.mkdir(parents=True, exist_ok=True)

    certificates_data = []
    if json_path.exists():
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                certificates_data = json.load(f)
        except json.JSONDecodeError:
            certificates_data = []
    
    # 1. Processar PDFs
    pdf_files = list(pdfs_dir.glob("*.pdf"))
    processed_pdf_ids = set()

    print(f"📄 Encontrados {len(pdf_files)} arquivos PDF para processar.")

    for pdf_path in pdf_files:
        cert_id = sanitize_filename(pdf_path.name)
        image_filename = cert_id + ".png"
        image_output_path = output_image_dir / image_filename
        thumbnail_url = f"/certificados/images/{image_filename}"

        existing_index = next((i for i, c in enumerate(certificates_data) if c["id"] == cert_id), None)

        if existing_index is not None:
            cert = certificates_data[existing_index]
            cert["image_url"] = thumbnail_url
            cert["type"] = "pdf"
            if "verify_url" not in cert:
                cert["verify_url"] = f"/certificados/{pdf_path.name}"
        else:
            title = pdf_path.stem.replace('-', ' ').replace('_', ' ').title()
            issuer = extract_details_from_pdf(pdf_path)
            certificates_data.append({
                "id": cert_id,
                "title": title,
                "issuer": issuer,
                "category_tier": classify_certificate(title, issuer),
                "type": "pdf",
                "image_url": thumbnail_url,
                "verify_url": f"/certificados/{pdf_path.name}"
            })
        
        processed_pdf_ids.add(cert_id)

        # Gera miniatura se não existir ou se for forçada (ex: para GCP coloridos novos)
        if not image_output_path.exists():
            try:
                images = convert_from_path(pdf_path, first_page=1, last_page=1, fmt='png', size=(600, None))
                if images:
                    images[0].save(image_output_path, "PNG")
                    print(f"  📸 Imagem gerada: {image_filename}")
            except Exception as e:
                print(f"  !! Erro ao converter PDF '{pdf_path.name}': {e}")

    # 2. Finalização e Deduplicação (SOBERANIA PDF)
    # Removemos qualquer registro que NÃO tenha um PDF físico correspondente ou que seja do tipo antigo 'badge'
    initial_count = len(certificates_data)
    certificates_data = [
        c for c in certificates_data 
        if c["id"] in processed_pdf_ids and c.get("type") == "pdf"
    ]
    
    removed = initial_count - len(certificates_data)
    if removed > 0:
        print(f"🧹 Limpeza concluída: {removed} cards duplicados/legado removidos.")

    # Re-classificar tudo para garantir integridade e emissores corretos
    for cert in certificates_data:
        cert["category_tier"] = classify_certificate(cert["title"], cert["issuer"])
        if cert["issuer"] == "Google":
            cert["issuer"] = "Google Cloud"
        if cert["issuer"] == "Desconhecido" and any(k in cert["title"].lower() for k in ["microsoft", "azure", "az-"]):
            cert["issuer"] = "Microsoft"

    # Salva o resultado final
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(certificates_data, f, indent=2, ensure_ascii=False)

    print(f"✨ Sincronização concluída! {len(certificates_data)} registros no portfólio.")

if __name__ == "__main__":
    generate_images_and_update_json()