'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import InfoModal from '@/components/InfoModal';
import DashboardModal from '@/components/DashboardModal';

const projects = [
    {
        title: "Dashboard de Vendas",
        thumbnail: "/pbi/PBI_Portfolio/thumb_vendas01.png",
        description: "O dashboard oferece uma análise 360º da performance de vendas e dos fatores que influenciam o churn de clientes. A solução permite a exploração de dados por múltiplas dimensões, como perfil do cliente, tempo de contrato, geografia e performance de produtos, facilitando a identificação de padrões e a tomada de decisão estratégica.",
        desafio: "A empresa estava enfrentando um aumento na taxa de churn de clientes e precisava entender os principais motivos. As análises existentes eram manuais e demoradas, impedindo uma ação rápida.",
        solucao: "Criei um dashboard 360º que não apenas monitora as vendas em tempo real, mas também cruza informações de perfil de cliente, tempo de contrato e performance de produtos para identificar os fatores que mais contribuem para o churn. Isso permitiu à equipe de retenção criar campanhas mais eficazes e personalizadas.",
        ferramentas: "Power BI, Power Query, DAX, Modelagem de Dados (Star Schema), CSV e Excel.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/DashVendas01",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiN2VhOTIyZTktNWZhMi00NTY3LTg1NzctOGUwNWViZDIwYzg3IiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Engenharia de Produção",
        thumbnail:  "/pbi/PBI_Portfolio/thumb_engenharia_producao.png", 
        description: "Este projeto apresenta um dashboard em Power BI focado na análise de séries temporais de dados de produção, com o objetivo de prever a performance futura e otimizar a eficiência do processo produtivo.",
        desafio: "A equipe de engenharia de produção necessitava de uma forma de prever a demanda e a capacidade produtiva para otimizar o planejamento e evitar gargalos na produção.",
        solucao: "Implementei um dashboard com análise de séries temporais e modelos de forecasting para prever a produção futura com base em dados históricos. O painel também permite a análise de estacionaridade, tendência e sazonalidade, fornecendo insights valiosos para o planejamento da produção.",
        ferramentas: "Power BI, Power Query, DAX, Análise de Séries Temporais, Forecasting, CSV/Excel.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/DashEngProducao",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiYmQxN2JiNGEtNDc1NS00YWVkLWI2NTAtNDU4ZTI1MDIxZTkzIiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Balanço Patrimonial",
        thumbnail: "/pbi/PBI_Portfolio/thumb_balanco_patrimonial.png",
        description: "Este projeto consiste em um dashboard para análise da estrutura de capital da empresa, com foco em liquidez, endividamento e ROI.",
        desafio: "A diretoria financeira precisava de uma ferramenta visual para analisar a saúde financeira da empresa, com foco em liquidez, endividamento e ROI, de forma rápida e intuitiva.",
        solucao: "Construí um dashboard que traduz o balanço patrimonial em gráficos e indicadores de fácil interpretação. A solução permite a análise da estrutura de capital, a evolução do endividamento e o retorno sobre o investimento, apoiando a tomada de decisão estratégica.",
        ferramentas: "Power BI, Power Query, DAX, Excel.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/DashBalancoPatrimonial",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiYjExOGFiOWEtOGUyYy00ZDFlLThkZDYtMWNhYWE2YTZjYWY0IiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Análise Financeira",
        thumbnail: "/pbi/PBI_Portfolio/thumb_financeiro.png",
        description: "Este projeto apresenta um dashboard para análise de DRE (Demonstração do Resultado do Exercício) e Fluxo de Caixa, com foco em margem de lucro, EBITDA e rentabilidade por centro de custo.",
        desafio: "A empresa precisava de uma visão clara da sua performance financeira, mas a análise do DRE e do Fluxo de Caixa era complexa e demorada, dificultando a identificação de oportunidades de melhoria.",
        solucao: "Desenvolvi um dashboard que automatiza a análise do DRE e do Fluxo de Caixa, destacando a margem de lucro, o EBITDA e a rentabilidade por centro de custo. O painel permite uma análise detalhada da saúde financeira da empresa, facilitando a identificação de áreas para otimização de custos e aumento da rentabilidade.",
        ferramentas: "Power BI, Power Query, DAX, Excel.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/DashFinanceiro",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiZGRmNDk0NDYtNzBiMC00YzFhLWJlNWMtMWZiZWM1OTQ3OWIzIiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Análise de Logística",
        thumbnail: "/pbi/PBI_Portfolio/thumb_logistica.png",
        description: "O dashboard oferece uma análise completa da performance logística, permitindo a exploração de dados por múltiplas dimensões, como custos de transporte, eficiência de rotas e desempenho de entregas.",
        desafio: "A empresa enfrentava altos custos de transporte e baixa eficiência nas entregas. Era necessário identificar as rotas mais caras e os principais gargalos na operação logística.",
        solucao: "Criei um dashboard que oferece uma visão completa da performance logística, permitindo a análise de custos por rota, tempo de entrega e eficiência por transportadora. A solução ajudou a identificar as rotas mais ineficientes e a renegociar contratos com transportadoras, resultando em uma redução significativa nos custos logísticos.",
        ferramentas: "Power BI, Power Query, DAX, Excel.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/DashLogistica",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiYzBlY2Q2NzAtNTQ5Zi00Yjg1LThlMTQtMzY0NDljOTE0MzczIiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Machine Learning",
        thumbnail: "/pbi/PBI_Portfolio/thumb_ml.png",
        description: "Desenvolver um dashboard abrangente no Power BI para analisar a eficácia de campanhas de marketing e realizar a segmentação de clientes com base em seu comportamento de compra e dados demográficos.",
        desafio: "A equipe de marketing queria personalizar suas campanhas, mas não tinha uma forma eficaz de segmentar os clientes com base em seu comportamento de compra.",
        solucao: "Utilizei um modelo de K-Means em Python para segmentar os clientes em clusters com base em seus padrões de compra. Em seguida, integrei os resultados a um dashboard no Power BI, que permite à equipe de marketing visualizar os diferentes segmentos e criar campanhas direcionadas para cada um, aumentando a eficácia das ações de marketing.",
        ferramentas: "Python (Pandas, Scikit-learn), Jupyter Notebook, Power BI, CSV.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/DashMarketing",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiZTg1YzM4Y2UtNjVkMy00OWIyLWIyMDAtMmQyNzY1OTIzNGFkIiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Marketing",
        thumbnail: "/pbi/PBI_Portfolio/thumb_marketing.png",
        description: "Desenvolver um dashboard abrangente no Power BI para analisar a eficácia de campanhas de marketing e realizar a segmentação de clientes com base em seu comportamento de compra e dados demográficos.",
        desafio: "A equipe de marketing precisava de uma forma de medir o ROI de suas campanhas e entender o comportamento do consumidor, mas os dados estavam dispersos e a análise era manual.",
        solucao: "Desenvolvi um dashboard que centraliza os dados de marketing e permite a análise da eficácia de cada campanha, o cálculo do ROI e a segmentação de clientes por meio da análise RFM (Recência, Frequência, Valor Monetário). O painel fornece insights valiosos para otimizar os investimentos em marketing.",
        ferramentas: "Power BI, Power Query, DAX, CSV.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/blob/main/Recursos_Humanos.pbix",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiOTg0ZjhlYjUtMGUwNC00YzFiLWI5MWUtN2ViZjM5NWU5YzI0IiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Mercado de Ações",
        thumbnail: "/pbi/PBI_Portfolio/thumb_mercadoacoes.png",
        description: "Este projeto apresenta um dashboard para análise de dados do mercado de ações, permitindo o acompanhamento de cotações e o cálculo de indicadores.",
        desafio: "Um investidor precisava de uma ferramenta para acompanhar a cotação de suas ações e analisar indicadores de mercado de forma rápida e visual, sem a necessidade de consultar múltiplas fontes.",
        solucao: "Criei um dashboard que utiliza web scraping para extrair dados de cotações em tempo real e apresenta as informações em gráficos interativos. O painel também calcula indicadores importantes, como médias móveis e volatilidade, auxiliando o investidor na tomada de decisões.",
        ferramentas: "Power BI, Power Query, DAX, Web Scraping, Excel.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/DashMercadoAcoes",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiMTE1ZDg1YWItYWJlYi00MDhmLTlmYWQtNWU1MjVlNjE5ZmEyIiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Recursos Humanos",
        thumbnail: "/pbi/PBI_Portfolio/thumb_rh.png",
        description: "O dashboard oferece uma análise completa da performance de Recursos Humanos, permitindo a exploração de dados por múltiplas dimensões, como demografia dos funcionários, satisfação, desempenho e turnover.",
        desafio: "O departamento de RH precisava de uma forma de analisar a alta taxa de turnover e entender os fatores que influenciavam a satisfação dos funcionários.",
        solucao: "Desenvolvi um dashboard que analisa dados de demografia, satisfação e desempenho dos funcionários para identificar os principais motivos do turnover. O painel permite que o RH crie planos de ação mais eficazes para reter talentos e melhorar o clima organizacional.",
        ferramentas: "Power BI, Power Query, DAX, CSV.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/DashRH",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiYmMzMzdhMzMtMzgxZi00ZGM3LTliNDItM2NkODNmYmMwYTFlIiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Vendas",
        thumbnail: "/pbi/PBI_Portfolio/thumb_vendas02.png",
        description: "O principal objetivo é construir um modelo de dados relacional (esquema estrela) para permitir análises de vendas mais complexas e segmentadas.",
        desafio: "A empresa precisava de uma análise de vendas mais profunda, que permitisse cruzar informações de clientes, produtos e pedidos, mas os dados estavam em tabelas separadas, o que dificultava a criação de relatórios complexos.",
        solucao: "Criei um modelo de dados relacional (esquema estrela) no Power BI, que conecta as tabelas de clientes, produtos, pedidos e vendas. Isso permitiu a criação de um dashboard dinâmico, onde é possível analisar as vendas por diversas dimensões e obter insights mais ricos sobre o negócio.",
        ferramentas: "Power BI, Power Query, DAX, Modelagem de Dados (Esquema Estrela), CSV.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/DashVendas02",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiNjYwYjBlZTctZTMzNS00YjMyLWI0YTUtMzA4ZTk0NWQyNTJhIiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Estatísticas",
        thumbnail: "/pbi/PBI_Portfolio/thumb_estatisticas.png",
        description: "Este projeto apresenta um dashboard para análise estatística de dados de clientes, com foco em medidas de tendência central e dispersão.",
        desafio: "A empresa queria entender melhor o perfil de seus clientes, mas não tinha uma forma visual de analisar as principais medidas estatísticas de seus dados.",
        solucao: "Criei um dashboard que apresenta as principais medidas de tendência central (média, mediana, moda) e dispersão (desvio padrão) dos dados dos clientes. O painel utiliza histogramas e boxplots para facilitar a visualização e a compreensão do perfil dos clientes.",
        ferramentas: "Power BI, Power Query, DAX, CSV.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/Estatisticas",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiZjQ0MTU3MzMtOWQ1My00NmNiLTg3MGItMTUzNDViYWZhMjgzIiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Linguagem R",
        thumbnail: "/pbi/PBI_Portfolio/thumb_linguagem_r.png",
        description: "Este projeto demonstra a integração avançada entre a linguagem R e o Microsoft Power BI para realizar análises preditivas e visualizar os resultados de forma interativa.",
        desafio: "A empresa queria utilizar modelos preditivos em R para prever a demanda futura, mas precisava de uma forma de visualizar os resultados de forma interativa e acessível para a equipe de negócios.",
        solucao: "Integrei um script em R ao Power BI para executar um modelo de série temporal e gerar previsões de demanda. O resultado é um dashboard que não apenas exibe as previsões, mas também permite que os usuários ajustem os parâmetros do modelo e vejam o impacto nas previsões em tempo real.",
        ferramentas: "Power BI, Linguagem R, Power Query, CSV.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/LinguagemR",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiZDE4ZTE4ZWEtM2Y0ZC00ZTVkLTk3NTUtODk3NzkzOWM3MGZlIiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Dashboard de Limpeza de dados",
        thumbnail: "/pbi/PBI_Portfolio/thumb_limpeza.png",
        description: "Este projeto apresenta um dashboard para análise de dados de pacientes, permitindo a exploração de informações demográficas e de saúde.",
        desafio: "Uma instituição de saúde precisava analisar dados de pacientes, mas as informações estavam em um formato inconsistente e com muitos erros, o que inviabilizava a análise.",
        solucao: "Desenvolvi um processo de ETL (Extração, Transformação e Carga) no Power Query para limpar, padronizar e enriquecer os dados dos pacientes. O resultado é um conjunto de dados limpo e confiável, que foi utilizado para criar um dashboard para a análise de informações demográficas e de saúde dos pacientes.",
        ferramentas: "Power BI, Power Query, CSV.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/DadosPacientes",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiNGM2ZDUxZmMtNzg3Yi00NTY1LWFiZDMtYmIzMWI3MjA1ZWMyIiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    },
    {
        title: "Análise de Acidentes em Rodovias Federais",
        thumbnail: "/pbi/PBI_Portfolio/thumb_acidentes.png",
        description: "Este projeto consiste na criação de um dashboard para análise de acidentes ocorridos nas rodovias federais da região Sudeste do Brasil, utilizando dados da Polícia Rodoviária Federal (PRF).",
        desafio: "Analisar dados de acidentes da PRF na região Sudeste para identificar padrões e pontos críticos, visando a melhoria da segurança na rodovias.",
        solucao: "Criação de um dashboard interativo com mapas, gráficos e tabelas para apresentar os insights de forma clara e objetiva, permitindo a exploração de dados por rodovia, estado, período do ano e tipo de acidente.",
        ferramentas: "Power BI, Power Query, DAX, Modelagem de Dados, Excel.",
        githubLink: "https://github.com/CidQueiroz/PBI_Portfolio/tree/main/AcidentesRodovia",
        iframeUrl: "https://app.powerbi.com/view?r=eyJrIjoiMzg5YzI1OWYtMWM4Ny00ODkwLWI4NWEtMzFjZWNmZmJkN2ZmIiwidCI6ImY0MTE4N2VhLTlkNmItNDNlNy04YjNiLWU1NmFmNjQ4N2IwYSJ9"
    }
];

type Project = typeof projects[0];

export default function PbiPage() {
  const [infoProject, setInfoProject] = useState<Project | null>(null);
  const [dashboardProject, setDashboardProject] = useState<Project | null>(null);

  const handleCardClick = (project: Project) => {
    setInfoProject(project);
  };

  const handleViewDashboard = () => {
    setDashboardProject(infoProject);
    setInfoProject(null);
  };

  return (
    <div className="content-wrapper">
      <div className="titulo-wrapper">
        <h1 className="titulo">Portfólio de Dashboards</h1>
        <p className="subtitulo">Explore projetos interativos de Business Intelligence e Análise de Dados.</p>
      </div>

      <div className="gallery-container">
        {projects.map((project, index) => (
          <div key={index} className="project-card" onClick={() => handleCardClick(project)}>
            <div className="card-content">
              <Image src={project.thumbnail} alt={`Thumbnail do projeto ${project.title}`} width={400} height={300} style={{ objectFit: 'cover' }} />
              <div className="project-info">
                <p>{project.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <InfoModal
        isOpen={!!infoProject}
        onClose={() => setInfoProject(null)}
        onViewProject={handleViewDashboard}
        project={infoProject}
      />

      <DashboardModal
        isOpen={!!dashboardProject}
        onClose={() => setDashboardProject(null)}
        project={dashboardProject}
      />
    </div>
  );
}
