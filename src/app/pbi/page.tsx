'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import InfoModal from '@/components/InfoModal';
import DashboardModal from '@/components/DashboardModal';
import pbiProjects from '@/data/pbiProjects.json';
import Layout from '@/components/Layout';

type Project = (typeof pbiProjects)[0];

export default function PbiPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dashboardProject, setDashboardProject] = useState<Project | null>(null);

  // Efeito para gerenciar a classe 'modal-open' no body
  useEffect(() => {
    const isAnyModalOpen = !!selectedProject || !!dashboardProject;
    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedProject, dashboardProject]);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseInfoModal = () => {
    setSelectedProject(null);
  };

  const handleViewDashboard = () => {
    if (selectedProject) {
      setDashboardProject(selectedProject);
      setSelectedProject(null); // Fecha o modal de info
    }
  };

  const handleCloseDashboardModal = () => {
    setDashboardProject(null);
  };

  return (
    <Layout>
      <>
        <div className="titulo-wrapper">
          <h1 className="titulo">Portfólio de Dashboards</h1>
          <p className="subtitulo">Explore projetos interativos de Business Intelligence e Análise de Dados.</p>
        </div>

        <div className="gallery-container">
          {pbiProjects.map((project) => (
            <div key={project.id} className="project-card" onClick={() => handleCardClick(project)}>
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

        <InfoModal
          isOpen={!!selectedProject}
          onClose={handleCloseInfoModal}
          onViewProject={handleViewDashboard}
          project={selectedProject}
        />

        <DashboardModal
          isOpen={!!dashboardProject}
          onClose={handleCloseDashboardModal}
          title={dashboardProject?.title}
          iframeUrl={dashboardProject?.iframeUrl}
        />
      </>
    </Layout>
  );
}
