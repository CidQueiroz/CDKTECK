'use client';

import React from 'react';
import Image from 'next/image';
import { PageHeader, useModal } from '@cidqueiroz/cdkteck-ui';
import pbiProjects from '@/data/pbiProjects.json';

type Project = (typeof pbiProjects)[0];

const PbiInfoContent = ({ project, onViewDashboard }: { project: Project, onViewDashboard: () => void }) => (
  <>
    <div className="info-section">
      <h3>O Desafio</h3>
      <p>{project.desafio}</p>
    </div>
    <div className="info-section">
      <h3>A Solução</h3>
      <p>{project.solucao}</p>
    </div>
    <div className="info-section">
      <h3>Ferramentas Utilizadas</h3>
      <p>{project.ferramentas}</p>
    </div>
    <div className="modal-actions">
      <button onClick={onViewDashboard} className="modal-button primary">
        <i className="fas fa-eye"></i> Visualizar Dashboard
      </button>
    </div>
  </>
);

const DashboardContent = ({ project }: { project: Project }) => (
  <>
    <h2>{project.title}</h2>
    <div className="responsive-iframe">
      {project.iframeUrl && (
        <iframe
          title={project.title}
          src={project.iframeUrl}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      )}
    </div>
  </>
);

export default function PbiPage() {
  const { showModal, hideModal } = useModal();

  const handleCardClick = (project: Project) => {
    const handleViewDashboard = () => {
      // Ao clicar em 'Visualizar Dashboard', abre um novo modal com o iframe
      showModal(<DashboardContent project={project} />, project.title);
    };

    // Primeiro, abre o modal de informações
    showModal(<PbiInfoContent project={project} onViewDashboard={handleViewDashboard} />, project.title);
  };

  return (
    <div className="portfolio-page">
      <PageHeader
        title="Portfólio de Dashboards"
        description="Explore projetos onde dados ganham forma, sentido e propósito."
      />

      <div className="card-grid">
        {pbiProjects.map((project) => (
          <div key={project.id} className="card project-card" onClick={() => handleCardClick(project)}>
            <div className="card-content">
              <Image 
                src={project.thumbnail} 
                alt={`Thumbnail do projeto ${project.title}`} 
                width={400} 
                height={300} 
                style={{ objectFit: 'cover' }} 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM0Q0ODU1IiAvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiPkltYWdlbSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                  target.alt = 'Placeholder para o dashboard';
                }}
              />
              <div className="project-info">
                <p>{project.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}