'use client';

import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProject: () => void;
  project: {
    title: string;
    desafio: string;
    solucao: string;
    ferramentas: string;
  } | null;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, onViewProject, project }) => {
  if (!isOpen || !project) return null;

  return (
    <div className="modal show" onClick={onClose}>
      <div className="modal-content info-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2 id="info-modal-title">{project.title}</h2>
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
          <button onClick={onViewProject} className="modal-button primary">
            <i className="fas fa-eye"></i> Visualizar Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;