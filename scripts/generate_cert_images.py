from pathlib import Path
from pdf2image import convert_from_path
from pypdf import PdfReader
import re
import json
import datetime

def sanitize_filename(filename):
    """Remove a extensão e caracteres especiais para criar um nome de arquivo seguro."""
    name_without_ext = Path(filename).stem
    sanitized_name = re.sub(r'[^\w\s-]', '', name_without_ext).strip()
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
        
        # Heurística para encontrar o emissor
        known_issuers = ["Oracle", "Google", "Microsoft", "Alura", "Udemy", "Coursera", "Dataquest", "Udacity"]
        for known in known_issuers:
            if re.search(r'\b' + re.escape(known) + r'\b', text, re.IGNORECASE):
                issuer = known
                break
    except Exception as e:
        print(f"  !! Erro ao ler o texto do PDF '{pdf_path.name}': {e}")
    
    return issuer

def generate_images_and_update_json():
    """
    Converte a primeira página de todos os arquivos PDF em um diretório para imagens PNG
    e atualiza o arquivo certificates.json com dados extraídos.
    """
    project_root = Path(__file__).parent.parent
    pdfs_dir = project_root / "public" / "certificados"
    output_image_dir = pdfs_dir / "images"
    json_path = project_root / "src" / "data" / "certificates.json"

    print("Iniciando a geração de thumbnails e atualização do JSON dos certificados...")
    output_image_dir.mkdir(parents=True, exist_ok=True)
    print(f"Diretório de saída das imagens: {output_image_dir}")

    certificates_data = []
    if json_path.exists():
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                certificates_data = json.load(f)
        except json.JSONDecodeError:
            print(f"Aviso: JSON em '{json_path}' corrompido ou vazio. Começando do zero.")
            certificates_data = []
    
    print(f"Certificados existentes no JSON: {len(certificates_data)}")
    
    pdf_files = list(pdfs_dir.glob("*.pdf"))
    if not pdf_files:
        print(f"Nenhum arquivo PDF encontrado em {pdfs_dir}.")
        return

    print(f"Encontrados {len(pdf_files)} arquivos PDF. Processando...")

    processed_ids = set()

    for pdf_path in pdf_files:
        cert_id = sanitize_filename(pdf_path.name)
        image_filename = cert_id + ".png"
        image_output_path = output_image_dir / image_filename
        thumbnail_url = f"/certificados/images/{image_filename}"

        existing_cert_index = next((i for i, c in enumerate(certificates_data) if c["id"] == cert_id), None)

        if existing_cert_index is not None:
            print(f"- Certificado '{cert_id}' já existe. Verificando...")
            cert = certificates_data[existing_cert_index]
            # Atualiza a URL da imagem se necessário
            if cert.get("image_url") != thumbnail_url:
                print(f"  -> Atualizando image_url para '{thumbnail_url}'")
                cert["image_url"] = thumbnail_url
            
            # Se o emissor for "Desconhecido", tenta extrair novamente
            if cert.get("issuer", "Desconhecido") == "Desconhecido":
                print(f"  -> Tentando re-extrair emissor para '{cert_id}'...")
                issuer = extract_details_from_pdf(pdf_path)
                if issuer != "Desconhecido":
                    print(f"  -> Emissor encontrado: '{issuer}'")
                    cert["issuer"] = issuer

        else:
            print(f"- Novo certificado '{cert_id}'. Extraindo dados e adicionando.")
            
            title = pdf_path.stem.replace('-', ' ').replace('_', ' ').title()
            issuer = extract_details_from_pdf(pdf_path)
            description = f"Certificado de conclusão para o curso '{title}'."

            new_cert = {
                "id": cert_id,
                "title": title,
                "issuer": issuer,
                "description": description,
                "image_url": thumbnail_url,
                "pdf_url": f"/certificados/{pdf_path.name}",
                "issue_date": datetime.date.today().isoformat()
            }
            certificates_data.append(new_cert)
        
        processed_ids.add(cert_id)

        if not image_output_path.exists():
            try:
                print(f"  - Convertendo '{pdf_path.name}' para imagem...")
                images = convert_from_path(pdf_path, first_page=1, last_page=1, fmt='png', size=(600, None), thread_count=1)
                if images:
                    images[0].save(image_output_path, "PNG")
                    print(f"    -> Imagem salva como '{image_output_path.name}'")
            except Exception as e:
                print(f"    !! Erro ao converter '{pdf_path.name}': {e}")
        else:
            print(f"- Imagem para '{pdf_path.name}' já existe.")

    # Remove certificados do JSON se o PDF não existe mais
    initial_count = len(certificates_data)
    certificates_data = [c for c in certificates_data if c["id"] in processed_ids]
    if len(certificates_data) < initial_count:
        print(f"Removidos {initial_count - len(certificates_data)} certificados órfãos do JSON.")

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(certificates_data, f, indent=2, ensure_ascii=False)
    
    print(f"\nArquivo JSON atualizado em '{json_path}'.")
    print("Processo concluído.")

if __name__ == "__main__":
    generate_images_and_update_json()