'use client';

import Layout from '@/components/Layout';
import InfoModal from '@/components/InfoModal';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const projects = [
  {
    id: "numero-secreto",
    title: "Jogo do Número Secreto",
    thumbnail: "/assets/adivinha_numero.png",
    description: "Um jogo interativo de adivinhação de números construído com lógica de JavaScript pura.",
    desafio: "Criar um jogo de adivinhação de números que seja interativo e divertido para o usuário, utilizando apenas HTML, CSS e JavaScript.",
    solucao: "Desenvolvi um jogo onde o usuário precisa adivinhar um número secreto. O jogo dá dicas se o número é maior ou menor, e o usuário tem um número limitado de tentativas.",
    ferramentas: "HTML, CSS, JavaScript",
    projectUrl: "/portfolio/adivinha-numero",
  },
  {
    id: "analisador-api",
    title: "Analisador de API",
    thumbnail: "/assets/maps_api.png",
    description: "Uma ferramenta que consome e exibe dados de uma API REST pública de forma amigável.",
    desafio: "Construir uma aplicação que busca dados de uma API externa e os apresenta de forma clara e organizada para o usuário.",
    solucao: "Criei uma interface que permite ao usuário pesquisar por um CEP e exibe o endereço correspondente, utilizando a API ViaCEP. A aplicação foi desenvolvida com foco na usabilidade e na clareza das informações.",
    ferramentas: "JavaScript, API REST, Async/Await",
    projectUrl: "/portfolio/geocoding",
  },
  {
    id: "unicorn-css",
    title: "Unicórnio CSS",
    thumbnail: "/assets/ia.png",
    description: "Um projeto front-end que dá vida a um universo mágico de unicórnios através de estilização CSS e uma pitada de carinho.",
    desafio: "Construir uma página web com total liberdade criativa, explorando o potencial do CSS para criar uma atmosfera lúdica e encantadora.",
    solucao: "Criei esta página de unicórnio em homenagem à minha pequena princesa. Foi a oportunidade perfeita para unir técnica e afeto, resultando em uma interface alegre que reflete essa inspiração.",
    ferramentas: "HTML, CSS, JavaScript",
    projectUrl: "/portfolio/unicorn",
  }
];

type Project = typeof projects[0];

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Efeito para gerenciar a classe 'modal-open' no body
  useEffect(() => {
    if (selectedProject) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedProject]);


  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const handleViewProject = () => {
    if (selectedProject?.projectUrl) {
      // Abrir em nova aba se for link externo, ou navegar se for interno
      if (selectedProject.projectUrl.startsWith('http')) {
        window.open(selectedProject.projectUrl, '_blank');
      } else {
        window.location.href = selectedProject.projectUrl;
      }
      handleCloseModal();
    }
  };

  return (
    <Layout>
      <>
        <div className="titulo-wrapper">
          <h1 className="titulo">Laboratório de Projetos</h1>
          <p className="subtitulo">Uma coleção de estudos e aplicações práticas desenvolvidas para aprimorar e demonstrar novas habilidades.</p>
        </div>

        <div className="gallery-container">
          {projects.map((project) => (
            <div key={project.id} className="project-card" onClick={() => handleCardClick(project)}>
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
          isOpen={!!selectedProject}
          onClose={handleCloseModal}
          onViewProject={handleViewProject}
          project={selectedProject}
        />
      </>
    </Layout>
  );
}
