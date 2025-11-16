'use client';

import React from 'react';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string | undefined;
  iframeUrl: string | undefined;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose, title, iframeUrl }) => {
  if (!isOpen || !iframeUrl) return null;

  return (
    <div id="projectModal" className="modal show" onClick={onClose}>
      <div className="modal-content dashboard-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2 id="modal-title">{title}</h2>
        <div className="responsive-iframe">
          <iframe
            title={title}
            src={iframeUrl}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="modal-button secondary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardModal;
