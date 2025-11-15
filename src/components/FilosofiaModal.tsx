'use client';

import React from 'react';

interface FilosofiaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ratingData = [
  { label: 'Hierarquia de layout', score: '8.5 / 10' },
  { label: 'UX e Legibilidade', score: '8.5 / 10' },
  { label: 'Coerência entre temas', score: '9 / 10' },
  { label: 'Estilo Visual', score: '9 / 10' },
  { label: 'Identidade visual', score: '9.5 / 10' },
  { label: 'Potencial de Marca', score: '10 / 10' },
];

const FilosofiaModal: React.FC<FilosofiaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div id="marca-filosofia-modal" className="modal show" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2 className="filosofia-title">O DNA da CDK TECK</h2>
        <p className="filosofia-narrative">
          CDK TECK é a união da <strong>Engenharia de IA</strong> (a Lógica) com a <strong>Criatividade Humana</strong> (o Unicórnio). 
          É onde a arquitetura precisa encontra o propósito, e o circuito encontra o coração.
        </p>
        <div className="filosofia-ratings">
          {ratingData.map((item, index) => (
            <div className="rating-item" key={index}>
              <span>{item.label}</span>
              <span className="rating-score">⭐ {item.score}</span>
            </div>
          ))}
        </div>
        <blockquote className="filosofia-quote">
          "Onde a Lógica encontra o seu Unicórnio."
        </blockquote>
        {/* A versão pode ser passada como prop se necessário */}
        <p id="app-version"></p>
      </div>
    </div>
  );
};

export default FilosofiaModal;
