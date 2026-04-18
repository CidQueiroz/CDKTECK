console.log("Variáveis de Estado encontradas:");
for (let key in window) {
    if (key.includes("STATE") || key.includes("INITIAL") || key.includes("PRELOAD")) {
        console.log(`- ${key}:`, window[key]);
    }
}
