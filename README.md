<div align="center">

# 🌐 CDK TECK - Landing Page e Portfólio
### Sua Jornada Pelo Universo da Inovação Tecnológica

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

[**Portfólio CDKTeck**](https://www.cdkteck.com.br) | [**LinkedIn do Autor**](https://www.linkedin.com/in/ciddy-queiroz/)

<br />
</div>

---

## 🚀 Visão Geral

Esta é a landing page principal do projeto CDK TECK, reimplementada com **Next.js** para oferecer performance e experiência de usuário de ponta. Ela serve como um hub central e portfólio, apresentando as diversas aplicações e soluções tecnológicas desenvolvidas. A página é uma vitrine interativa que destaca as principais áreas de atuação e direciona os visitantes para projetos específicos, tudo com a agilidade e os benefícios de desenvolvimento do Next.js.

---

## 🧠 Arquitetura & Tecnologias

Este projeto adota uma arquitetura moderna para garantir alta performance, escalabilidade e manutenibilidade.

| Camada | Tecnologias | Propósito |
| :--- | :--- | :--- |
| **Framework** | **Next.js (React)** | Construção da interface de usuário com renderização otimizada, roteamento e funcionalidades de servidor. |
| **Linguagem** | **TypeScript** | Garante tipagem estática, maior robustez e facilita a manutenção do código. |
| **Estilização** | **Tailwind CSS / CSS Modules** | Estilização rápida e responsiva com foco em utilitários e modularidade. |
| **Implantação** | **Firebase Hosting** | Hospedagem estática e escalável para entrega rápida de conteúdo globalmente. |
| **Automação** | **GitHub Actions** | CI/CD para automação de builds e deploys. |

---

## ✨ Funcionalidades Chave

- [x] **Navegação Interativa:** Uma animação de "cérebro de circuitos" com pontos clicáveis representa as áreas de expertise da CDK TECK.
- [x] **Modais de Informação:** Detalhes sobre "Análise de Dados", "Automação RPA", "Python/Django", "Business Intelligence", "SenseiDB" e "Certificações" são exibidos em modais.
- [x] **Busca Integrada:** Permite aos usuários encontrar rapidamente informações sobre áreas de interesse.
- [x] **Design Responsivo:** Acessibilidade garantida em diversos dispositivos e tamanhos de tela.
- [x] **Gerenciamento de Tema:** Alternância fluida entre temas claro e escuro para personalização da experiência.

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
* Node.js 18+

### 1. Clone o repositório

```bash
git clone https://github.com/CidQueiroz/cdkteck.git
cd cdkteck
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## 🚀 Implantação (Deployment)

Este projeto está configurado para implantação estática no **Firebase Hosting** e automatizado via **GitHub Actions**.

### Build do Projeto
```bash
npm run build
```
Isso gerará os arquivos estáticos na pasta `out/`.

### Deploy Manual (Firebase CLI)
Certifique-se de que o Firebase CLI está configurado corretamente e que o `firebase.json` aponta para o `target` adequado (`cdkteck`).
```bash
firebase deploy --only hosting
```

### Automação CI/CD (GitHub Actions)
Um workflow de GitHub Actions (`.github/workflows/release.yml`) automatiza o build e deploy no Firebase Hosting a cada `git push` na branch `main`. Configure `FIREBASE_SERVICE_ACCOUNT_CDKTECK` como um segredo no seu repositório GitHub.

---

## 🛣️ Roadmap

- [ ] **Otimização SEO:** Melhorar a indexação e visibilidade nos mecanismos de busca.
- [ ] **Integração com Blog:** Adicionar uma seção de blog para artigos e notícias.
- [ ] **Multi-idioma:** Suporte para diferentes idiomas.
- [ ] **Dashboard de Analytics:** Integração com ferramentas de análise para monitoramento de tráfego e comportamento do usuário.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

<img src="https://github.com/CidQueiroz.png" width="100px;" alt="Foto de Cidirclay"/>
**Cidirclay Queiroz** <br>
Solutions Architect AI | MLOps Engineer | OCI Specialist

[LinkedIn](https://www.linkedin.com/in/ciddy-queiroz/) | [Website](https://cdkteck.com.br/) | [Email](mailto:cydy.queiroz@cdkteck.com.br) | [Instagram](https://www.instagram.com/ciddyqueiroz/)

Especialista em transformar problemas de negócio complexos em soluções escaláveis na nuvem. Focado em Arquitetura Multi-Cloud e Engenharia de IA Generativa.

---

<div align="center"> <sub>Built with ☕ and 💡</sub> </div>