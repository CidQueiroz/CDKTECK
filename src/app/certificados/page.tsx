'use client';

import Layout from '@/components/Layout';
import CertificateCard from '@/components/CertificateCard';
import Modal from '@/components/Modal';
import { useState, useEffect } from 'react';
import certificatesData from '@/data/certificates.json';

type Certificate = (typeof certificatesData)[0];

export default function CertificadosPage() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Efeito para gerenciar a classe 'modal-open' no body
  useEffect(() => {
    if (selectedCert) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedCert]);

  return (
    <Layout>
      <>
        <div className="titulo-wrapper">
          <h1 className="titulo">Certificações & Badges</h1>
          <p className="subtitulo">Comprovação de Expertise Técnica e Desenvolvimento Contínuo</p>
        </div>

        <div className="gallery-container">
          {certificatesData.map((cert) => (
            <CertificateCard
              key={cert.id}
              title={cert.title}
              imageUrl={cert.image_url}
              onClick={() => setSelectedCert(cert)}
            />
          ))}
        </div>

        {selectedCert && (
          <Modal isOpen={!!selectedCert} onClose={() => setSelectedCert(null)}>
            <div className="info-modal-content">
              <h2 id="info-modal-title">{selectedCert.title}</h2>
              
              <div className="info-section">
                <h3>Descrição</h3>
                <p>{selectedCert.description}</p>
              </div>

              <div className="modal-actions">
                <a 
                  href={selectedCert.pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="modal-button primary"
                >
                  Ver Certificado (PDF)
                </a>
                <button onClick={() => setSelectedCert(null)} className="modal-button secondary">
                  Fechar
                </button>
              </div>
            </div>
          </Modal>
        )}
      </>
    </Layout>
  );
}
