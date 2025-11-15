# CDK TECK - Landing Page e Portfólio (Next.js)

## Visão Geral

Esta é a landing page principal do projeto CDK TECK, agora reimplementada utilizando Next.js. Ela serve como um hub central e portfólio para diversas aplicações e soluções tecnológicas. A página foi projetada para ser uma vitrine interativa, apresentando as principais áreas de atuação e direcionando os usuários para os projetos específicos, com os benefícios de performance e desenvolvimento de uma aplicação Next.js.

## Funcionalidades

*   **Navegação Interativa:** A página utiliza uma animação de "cérebro de circuitos" com pontos clicáveis que representam as diferentes áreas de expertise.
*   **Modais de Informação:** Ao clicar em um ponto, um modal exibe informações detalhadas sobre a área, como "Análise de Dados", "Automação RPA", "Python/Django", "Business Intelligence", "SenseiDB" e "Certificações".
*   **Busca Integrada:** Uma funcionalidade de busca permite que os usuários encontrem rapidamente a área de interesse.
*   **Design Responsivo:** A página é projetada para ser acessível em diferentes dispositivos.
*   **Gerenciamento de Tema:** Alternância entre tema claro e escuro.

## Arquitetura e Tecnologias

| Componente | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Framework** | **Next.js (React)** | Construção da interface de usuário com renderização otimizada e roteamento. |
| **Linguagem** | **TypeScript** | Adiciona tipagem estática para maior robustez e manutenibilidade do código. |
| **Estilização** | **CSS Modules / Global CSS** | Estilização e animações, com foco em modularidade e escopo local para componentes. |
| **Implantação** | **Firebase Hosting** | Hospedagem estática e rápida da aplicação. |

## Estrutura do Projeto

```
/
├── public/                   # Arquivos estáticos (imagens, favicon, certificados)
├── src/
│   ├── app/                  # Rotas e páginas da aplicação (ex: /, /portfolio, /certificados)
│   │   ├── globals.css       # Estilos globais
│   │   ├── layout.tsx        # Layout principal da aplicação
│   │   └── page.tsx          # Página inicial
│   ├── components/           # Componentes React reutilizáveis (Header, Footer, Modals, CircuitPoint)
│   └── data/                 # Dados em JSON (ex: modalData)
├── next.config.ts            # Configuração do Next.js (incluindo exportação estática)
├── firebase.json             # Configuração do Firebase Hosting
├── package.json              # Dependências e scripts do projeto
└── README.md                 # Este arquivo
```

## Como Rodar Localmente

1.  **Instale as dependências**:
    ```bash
    npm install
    ```
2.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Implantação (Deployment)

Este projeto está configurado para implantação estática no Firebase Hosting.

1.  **Construa o projeto**:
    ```bash
    npm run build
    ```
    Isso gerará os arquivos estáticos na pasta `out/`.

2.  **Implante no Firebase Hosting**:
    Certifique-se de que o Firebase CLI está configurado para o projeto correto (`senseidb-rebranding`) e que o `firebase.json` aponta para o `target` correto (`cdkteck`).
    ```bash
    firebase deploy --only hosting
    ```

## Automação CI/CD (GitHub Actions)

O projeto inclui um workflow de GitHub Actions (`.github/workflows/release.yml`) para automatizar o processo de build e deploy no Firebase Hosting a cada `git push` na branch `main`. Certifique-se de configurar o `FIREBASE_SERVICE_ACCOUNT_CDKTECK` como um segredo no seu repositório GitHub.