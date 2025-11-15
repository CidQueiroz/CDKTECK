'use client';

import React from 'react';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    iframeUrl: string;
    githubLink?: string;
  } | null;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content dashboard-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2 id="modal-title">{project.title}</h2>
        <p id="modal-description">{project.description}</p>
        <div className="responsive-iframe">
          <iframe title={project.title} src={project.iframeUrl} frameBorder="0" allowFullScreen></iframe>
        </div>
        <div className="modal-actions">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="modal-button primary">
              <i className="fab fa-github"></i> Ver projeto no GitHub
            </a>
          )}
          <button onClick={onClose} className="modal-button secondary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardModal;