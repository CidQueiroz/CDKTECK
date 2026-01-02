from pathlib import Path
from pdf2image import convert_from_path
import re
import json
import datetime

def sanitize_filename(filename):
    """Remove a extensão e caracteres especiais para criar um nome de arquivo seguro."""
    name_without_ext = Path(filename).stem
    # Substitui caracteres que não são alfanuméricos por espaço, depois normaliza espaços e hífen
    sanitized_name = re.sub(r'[^\w\s-]', '', name_without_ext).strip()
    sanitized_name = re.sub(r'[\s_]+', '-', sanitized_name) # Substitui espaços/underscore por hífen
    return sanitized_name.lower() # Geralmente nomes de ID são em minúsculas

def generate_images_and_update_json():
    """
    Converte a primeira página de todos os arquivos PDF em um diretório para imagens PNG
    e atualiza o arquivo certificates.json.
    """
    project_root = Path(__file__).parent.parent
    pdfs_dir = project_root / "public" / "certificados"
    output_image_dir = pdfs_dir / "images"
    json_path = project_root / "src" / "data" / "certificates.json"

    print("Iniciando a geração de thumbnails e atualização do JSON dos certificados...")

    # Garante que o diretório de saída exista
    output_image_dir.mkdir(parents=True, exist_ok=True)
    print(f"Diretório de saída das imagens: {output_image_dir}")

    # Carrega o JSON existente ou cria um vazio
    certificates_data = []
    if json_path.exists():
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                certificates_data = json.load(f)
        except json.JSONDecodeError:
            print(f"Aviso: Arquivo JSON '{json_path}' está vazio ou corrompido. Iniciando com dados vazios.")
            certificates_data = []
    print(f"Certificados existentes no JSON: {len(certificates_data)}")

    pdf_files = list(pdfs_dir.glob("*.pdf"))

    if not pdf_files:
        print(f"Nenhum arquivo PDF encontrado em {pdfs_dir}. Nenhuma imagem será gerada ou JSON atualizado.")
        return

    print(f"Encontrados {len(pdf_files)} arquivos PDF. Iniciando conversão e atualização...")

    updated_ids = set() # Para rastrear IDs de certificados processados

    for pdf_path in pdf_files:
        cert_id = sanitize_filename(pdf_path.name)
        image_filename = cert_id + ".png"
        image_output_path = output_image_dir / image_filename
        thumbnail_url = f"/certificados/images/{image_filename}" # Caminho relativo para o Next.js

        # Verifica se o certificado já existe no JSON
        existing_cert = next((c for c in certificates_data if c["id"] == cert_id), None)
        
        if existing_cert:
            print(f"- Certificado '{cert_id}' já existe no JSON.")
            # Atualiza apenas a image_url se for diferente
            if existing_cert.get("image_url") != thumbnail_url:
                print(f"  -> Atualizando image_url para '{thumbnail_url}'")
                existing_cert["image_url"] = thumbnail_url
            # Garante que o ID é rastreado como atualizado
            updated_ids.add(cert_id)
        else:
            print(f"- Novo certificado '{cert_id}'. Adicionando ao JSON.")
            # Cria uma nova entrada (preencha com defaults)
            new_cert = {
                "id": cert_id,
                "title": pdf_path.stem.replace('-', ' ').title(), # Título inferido
                "issuer": "Desconhecido", # Placeholder
                "description": "Certificado de conclusão.", # Placeholder
                "image_url": thumbnail_url,
                "pdf_url": f"/certificados/{pdf_path.name}", # Caminho relativo para o Next.js
                "issue_date": datetime.date.today().isoformat() # Data atual
            }
            certificates_data.append(new_cert)
            updated_ids.add(cert_id)


        # Geração da imagem
        if not image_output_path.exists():
            try:
                print(f"- Convertendo '{pdf_path.name}' para imagem...")
                images = convert_from_path(
                    pdf_path,
                    first_page=1,
                    last_page=1,
                    fmt='png',
                    size=(600, None), # Define a largura, altura será proporcional
                    thread_count=1 # Adicionado para evitar problemas em alguns ambientes
                )

                if images:
                    images[0].save(image_output_path, "PNG")
                    print(f"  -> Imagem salva como '{image_output_path.name}'")
                else:
                    print(f"  !! Nenhuma imagem gerada para '{pdf_path.name}'.")

            except Exception as e:
                print(f"  !! Erro ao converter '{pdf_path.name}': {e}")
        else:
            print(f"- Imagem para '{pdf_path.name}' já existe. Pulando geração.")

    # Remove certificados do JSON que não têm mais um PDF correspondente
    initial_cert_count = len(certificates_data)
    certificates_data = [c for c in certificates_data if c["id"] in updated_ids]
    if len(certificates_data) < initial_cert_count:
        print(f"Removidos {initial_cert_count - len(certificates_data)} certificados do JSON (PDFs não encontrados).")

    # Salva o JSON atualizado
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(certificates_data, f, indent=2, ensure_ascii=False)
    print(f"\nArquivo JSON atualizado salvo em '{json_path}'.")
    print("Geração e atualização concluídas com sucesso!")

if __name__ == "__main__":
    generate_images_and_update_json()