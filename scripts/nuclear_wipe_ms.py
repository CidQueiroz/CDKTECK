import json
import os

def nuclear_wipe():
    file_path = '/home/cidquei/CDKTECK/cdkteck/src/data/certificates.json'
    
    if not os.path.exists(file_path):
        print(f"❌ Arquivo não encontrado: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    original_count = len(data)
    
    # REMOÇÃO TOTAL: Se o emissor for Microsoft, tchau.
    # Isso limpa os IDs errados, os títulos errados e as duplicatas.
    cleaned_data = [
        cert for cert in data 
        if cert.get("issuer") != "Microsoft"
    ]
    
    removed = original_count - len(cleaned_data)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(cleaned_data, f, indent=2, ensure_ascii=False)
    
    print(f"🚀 NUCLEAR WIPE CONCLUÍDO!")
    print(f"🗑️ Removidos: {removed} registros (Todos da Microsoft).")
    print(f"📦 Restantes: {len(cleaned_data)} (Outros certificados mantidos).")

if __name__ == "__main__":
    nuclear_wipe()
