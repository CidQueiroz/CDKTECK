'use client';

import { CertificateCard, PageHeader, useModal } from '@cidqueiroz/cdkteck-ui';
import certificatesData from '@/data/certificates.json';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  description: string;
  image_url: string;
  pdf_url: string;
  issue_date: string;
}

const CertificateInfoContent = ({ certificate }: { certificate: Certificate }) => (
  <>
    <div className="info-section">
      <h3>Descrição</h3>
      <p>{certificate.description}</p>
    </div>
    <div className="info-section">
      <h3>Emissor</h3>
      <p>{certificate.issuer}</p>
    </div>
    <div className="modal-actions">
      <a 
        href={certificate.pdf_url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="modal-button primary"
      >
        Ver Certificado (PDF)
      </a>
    </div>
  </>
);

export default function CertificadosPage() {
  const { showModal } = useModal();

  const handleCardClick = (cert: Certificate) => {
    showModal(<CertificateInfoContent certificate={cert} />, cert.title);
  };

  return (
    <div className="portfolio-page">
      <PageHeader
        title="Certificações & Badges"
        description="Comprovação de Expertise Técnica e Desenvolvimento Contínuo"
      />

      <div className="card-grid">
        {(certificatesData as Certificate[]).map((cert) => (
          <CertificateCard
            key={cert.id}
            title={cert.title}
            imageUrl={cert.image_url}
            onClick={() => handleCardClick(cert)}
          />
        ))}
      </div>
    </div>
  );
}