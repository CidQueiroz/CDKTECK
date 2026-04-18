/**
 * MISSÃO 1: JS SCRAPER (Base64 Image Downloader)
 * Como rodar:
 * 1. Acesse https://learn.microsoft.com/pt-br/users/[SEU_ID]/achievements
 * 2. Cole este código no Console do Navegador e pressione Enter.
 * 3. O script irá processar todas as conquistas e baixar o arquivo 'ms_badges_export.json' no final.
 */

(async () => {
    console.log("🚀 Iniciando extração soberana de conquistas Microsoft...");

    const links = document.querySelectorAll('a[href*="/achievements/print/"]');
    const cards = Array.from(links); // Vamos iterar diretamente pelos links para garantir captura
    
    if (cards.length === 0) {
        console.error("❌ Nenhum link de conquista encontrado. Certifique-se de estar logado e na aba 'Conquistas'.");
        console.log("Dica: Role a página até o fim para carregar todos os itens antes de rodar.");
        return;
    }

    const results = [];
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < cards.length; i++) {
        const printLink = cards[i];
        
        const verifyUrl = printLink.href;
        const idHash = verifyUrl.split('/').pop();
        const badgeId = `ms-badge-${idHash}`;

        console.log(`[${i + 1}/${cards.length}] Processando: ${idHash}...`);

        try {
            const response = await fetch(verifyUrl);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');

            // Extração de dados da página de impressão
            // Nota: Os seletores podem variar, mas geralmente o título e imagem estão em áreas proeminentes.
            const titleElement = doc.querySelector('h1') || doc.querySelector('.achievement-title');
            const title = titleElement ? titleElement.innerText.trim() : "Microsoft Learn Badge";
            
            const dateElement = doc.querySelector('time') || doc.querySelector('.achievement-date');
            const issueDate = dateElement ? dateElement.innerText.trim() : "N/A";

            // Encontrar o selo colorido
            // Na página de impressão, o selo costuma estar em um img dentro de um container de conquista
            const badgeImg = doc.querySelector('img[src*="/achievements/"]') || doc.querySelector('.achievement-badge img');
            let base64 = null;

            if (badgeImg && badgeImg.src) {
                try {
                    const imgRes = await fetch(badgeImg.src);
                    const blob = await imgRes.blob();
                    base64 = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                } catch (imgErr) {
                    console.warn(`  ⚠️ Falha ao converter imagem para base64: ${badgeImg.src}`);
                }
            }

            results.push({
                id: badgeId,
                title: title,
                issuer: "Microsoft",
                category_tier: "Cloud_AI",
                type: "badge",
                verify_url: verifyUrl,
                issue_date: issueDate,
                image_base64: base64
            });

        } catch (err) {
            console.error(`  ❌ Erro ao processar ${verifyUrl}:`, err);
        }

        // Pequeno intervalo para evitar detecção de bot agressiva (opcional)
        await delay(300); 
    }

    console.log(`✅ Processamento concluído: ${results.length} conquistas extraídas.`);

    // Gerar o download automático do JSON
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ms_badges_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log("💾 Arquivo 'ms_badges_export.json' gerado com sucesso!");
})();
