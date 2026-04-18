import os
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

# =============================================================================
# CONFIGURAÇÕES
# =============================================================================
AUTH_FILE = Path("/home/cidquei/CDKTECK/cdkteck/scripts/ms_auth.json")
START_URL = "https://learn.microsoft.com/pt-br/"

def run_assistant():
    print("\n" + "="*60)
    print("🔐 ASSISTENTE DE ABSORÇÃO DE AUTH (CDKTECK NUCLEAR 2.1)")
    print("="*60)
    print(f"\n1. Vou abrir uma janela do Chromium visível no seu Linux.")
    print(f"2. Você terá **60 segundos** para fazer login e chegar na sua Home.")
    print(f"3. Após esse tempo, eu capturo os cookies automaticamente.")
    print(f"\n🚀 Iniciando navegador...\n")

    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=False, slow_mo=50)
            context = browser.new_context(viewport={'width': 1280, 'height': 800})
            
            page = context.new_page()
            page.set_default_timeout(120000)
            
            print(f"🌍 Abrindo {START_URL}...")
            page.goto(START_URL, wait_until="commit")
            
            print("\n🕒 CRONÔMETRO INICIADO: Você tem 60 segundos!")
            for i in range(60, 0, -1):
                sys.stdout.write(f"\r⏳ Tempo restante: {i}s ... [Faça login agora] ")
                sys.stdout.flush()
                time.sleep(1)
            
            print("\n\n📸 TEMPO ESGOTADO! Capturando identidade...")
            
            # Salvando o estado da sessão
            context.storage_state(path=str(AUTH_FILE))
            
            print(f"\n💾 Sessão salva em: {AUTH_FILE.name}")
            print("✔️  PROTOCOLO CONCLUÍDO! Já pode fechar o navegador e rodar o robô.")
            
            browser.close()
            
        except Exception as e:
            print(f"\n❌ ERRO: {e}")

if __name__ == "__main__":
    run_assistant()
