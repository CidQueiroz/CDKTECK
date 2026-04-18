import json
import os

def cleanup():
    file_path = '/home/cidquei/CDKTECK/cdkteck/src/data/certificates.json'
    
    if not os.path.exists(file_path):
        print(f"❌ Arquivo não encontrado: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Filtra: Remove tudo que tem o ID bugado ou Título bugado
    original_count = len(data)
    cleaned_data = [
        cert for cert in data 
        if cert.get("id") != "ms-imprima-sua-conquista" 
        and cert.get("title") != "Imprima sua conquista"
        and not (cert.get("issuer") == "Microsoft" and cert.get("id", "").startswith("ms-badge") and "Pular para" in cert.get("title", ""))
    ]
    
    removed = original_count - len(cleaned_data)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Limpeza concluída!")
    print(f"🗑️ Removidos: {removed} entradas corrompidas.")
    print(f"📦 Restantes: {len(cleaned_data)} entradas íntegras.")

if __name__ == "__main__":
    cleanup()
