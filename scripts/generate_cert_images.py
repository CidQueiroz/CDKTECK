from pathlib import Path
from pdf2image import convert_from_path
import re

def sanitize_filename(filename):
    """Remove a extensão e caracteres especiais para criar um nome de arquivo seguro."""
    name_without_ext = Path(filename).stem
    # Substitui qualquer coisa que não seja letra, número ou hífen por um hífen
    sanitized_name = re.sub(r'[^a-zA-Z0-9-]', '-', name_without_ext)
    return sanitized_name

def generate_images():
    """
    Converte a primeira página de todos os arquivos PDF em um diretório para imagens PNG.
    """
    project_root = Path(__file__).parent.parent
    pdfs_dir = project_root / "public" / "certificados"
    output_dir = pdfs_dir / "images"

    print("Iniciando a geração de thumbnails dos certificados com Python...")

    try:
        # Garante que o diretório de saída exista
        output_dir.mkdir(exist_ok=True)
        print(f"Diretório de saída: {output_dir}")

        pdf_files = list(pdfs_dir.glob("*.pdf"))

        if not pdf_files:
            print(f"Nenhum arquivo PDF encontrado em {pdfs_dir}.")
            return

        print(f"Encontrados {len(pdf_files)} arquivos PDF. Iniciando conversão...")

        for pdf_path in pdf_files:
            image_name = sanitize_filename(pdf_path.name) + ".png"
            image_output_path = output_dir / image_name

            if image_output_path.exists():
                print(f"- Imagem para '{pdf_path.name}' já existe. Pulando.")
                continue

            try:
                print(f"- Convertendo '{pdf_path.name}'...")
                # Converte a primeira página do PDF
                images = convert_from_path(
                    pdf_path,
                    first_page=1,
                    last_page=1,
                    fmt='png',
                    size=(600, None) # Define a largura, altura será proporcional
                )

                if images:
                    # Salva a primeira (e única) imagem
                    images[0].save(image_output_path, "PNG")
                    print(f"  -> Salvo como '{image_output_path.name}'")

            except Exception as e:
                print(f"  !! Erro ao converter '{pdf_path.name}': {e}")

        print("\nConversão concluída com sucesso!")

    except Exception as e:
        print(f"\nOcorreu um erro durante a geração das imagens: {e}")

if __name__ == "__main__":
    generate_images()
