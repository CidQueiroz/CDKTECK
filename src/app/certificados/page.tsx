'use client';
import { useState, useMemo } from 'react';
import { CertificateCard, PageHeader, useModal } from '@cidqueiroz/cdkteck-ui';
import certificatesData from '@/data/certificates.json';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  category_tier?: string;
  type?: string;
  image_url: string;
  verify_url?: string;
  pdf_url?: string;
  description?: string;
  issue_date?: string;
}

const TABS = [
  { id: 'Elite', label: '🏆 THE UNICORN LAYER', desc: 'Elite & Architectures' },
  { id: 'Cloud_AI', label: '☁️ CLOUD & AI', desc: 'Google, Oracle, AWS, MS' },
  { id: 'Cybersecurity', label: '🛡️ CYBERSECURITY', desc: 'Defesa & Segurança' },
  { id: 'Tools_Courses', label: '🛠️ FERRAMENTAS & CURSOS', desc: 'Skills Complementares' }
];

const CertificateInfoContent = ({ certificate }: { certificate: Certificate }) => {
  const isBadge = certificate.type === 'badge';
  const url = certificate.verify_url || certificate.pdf_url;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
      {/* Imagem do Selo no Topo */}
      {isBadge && certificate.image_url && (
        <div style={{ 
          background: '#1c2431', 
          padding: '20px', 
          borderRadius: '50%', 
          marginBottom: '15px', 
          boxShadow: '0 0 20px rgba(0, 174, 239, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '140px',
          height: '140px'
        }}>
          <img 
            src={certificate.image_url} 
            alt={certificate.title} 
            style={{ width: '100px', height: '100px', objectFit: 'contain' }} 
            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/logo_metalico_sem_fundo.png' }}
          />
        </div>
      )}

      {/* Info Sections */}
      <div style={{ width: '100%', textAlign: 'left' }}>
        <div className="info-section">
          <h3>Emissor</h3>
          <p>
            {certificate.issuer} 
            <br />
            {certificate.issue_date && certificate.issue_date !== "N/A" && (
              <span style={{ fontSize: '0.85rem', color: '#00AEEF' }}>Concluído em: {certificate.issue_date}</span>
            )}
          </p>
        </div>
        
        {certificate.description && (
          <div className="info-section">
            <h3>Descrição</h3>
            <p>{certificate.description}</p>
          </div>
        )}
      </div>

      <div className="modal-actions" style={{ width: '100%', marginTop: '15px' }}>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="modal-button primary"
          style={{ width: '100%', textAlign: 'center', display: 'block' }}
        >
          {isBadge ? 'Verificar Credencial Pública' : 'Visualizar Documento (PDF)'}
        </a>
      </div>
    </div>
  );
};

export default function CertificadosPage() {
  const { showModal } = useModal();
  const [activeTab, setActiveTab] = useState<string>('Elite');

  const filteredCerts = useMemo(() => {
    return (certificatesData as Certificate[]).filter(
      (cert) => (cert.category_tier || 'Tools_Courses') === activeTab
    );
  }, [activeTab]);

  const handleCardClick = (cert: Certificate) => {
    showModal(<CertificateInfoContent certificate={cert} />, cert.title);
  };

  return (
    <div className="portfolio-page">
      <PageHeader
        title="Certificações & Badges"
        description="Comprovação de Expertise Técnica e Desenvolvimento Contínuo"
      />

      {/* Conteúdo envolto em container soberano para alinhamento com PageHeader */}
      <div className="sovereign-layout-container">
        <div className="sovereign-tabs-grid">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sovereign-tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="sovereign-tab-label">{tab.label}</span>
              <span className="sovereign-tab-desc">{tab.desc}</span>
            </button>
          ))}
        </div>

        <div className="sovereign-card-grid">
          {filteredCerts.length > 0 ? (
            filteredCerts.map((cert) => (
              <CertificateCard
                key={cert.id}
                title={cert.title}
                imageUrl={cert.image_url}
                onClick={() => handleCardClick(cert)}
              />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#A9B2C3', border: '1px dashed #3D4855', borderRadius: '12px' }}>
              <p>Nenhuma credencial classificada nesta categoria no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}