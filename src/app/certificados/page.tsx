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
  { id: 'Elite', label: '🏆 THE UNICORN LAYER', desc: 'ELITE & ARCHITECTURES' },
  { id: 'Cloud_AI', label: '☁️', title: 'CLOUD & AI', desc: 'GOOGLE, ORACLE, AWS, MS' },
  { id: 'Data_Intelligence', label: '📊 DATA INTELLIGENCE', desc: 'ENGENHARIA & ANÁLISE' },
  { id: 'Cybersecurity', label: '🛡️ CYBERSECURITY', desc: 'DEFESA & SEGURANÇA' },
  { id: 'Tools_Courses', label: '🛠️ FERRAMENTAS & CURSOS', desc: 'SKILLS COMPLEMENTARES' },
];

const CertificateInfoContent = ({ certificate }: { certificate: Certificate }) => {
  const isBadge = certificate.type === 'badge';
  const url = certificate.verify_url || certificate.pdf_url;

  return (
    <div className="cert-modal-container">
      {/* Badge/Document Image Wrapper 
      {certificate.image_url && (
        <div className="cert-badge-wrapper">
          <img 
            src={certificate.image_url} 
            alt={certificate.title} 
            onError={(e) => { (e.target as HTMLImageElement).src = '/assets/logo_metalico_sem_fundo.png' }}
          />
        </div>
      )}*/}

      {/* Metadata Grid */}
      <div className="cert-info-grid">
        <div className="cert-meta-item">
          <span className="cert-label">
            <i className="fa-solid fa-building-columns"></i> Emissor
          </span>
          <span className="cert-value">{certificate.issuer}</span>
        </div>

        {certificate.issue_date && certificate.issue_date !== "N/A" && (
          <div className="cert-meta-item">
            <span className="cert-label">
              <i className="fa-solid fa-calendar-check"></i> Conclusão
            </span>
            <span className="cert-value">{certificate.issue_date}</span>
          </div>
        )}
      </div>

      {/* Description Section */}
      {certificate.description && (
        <div className="cert-description-card">
          <h4><i className="fa-solid fa-info-circle"></i> Descrição Profissional</h4>
          <p className="cert-description-text">{certificate.description}</p>
        </div>
      )}

      {/* Actions */}
      <div className="modal-actions-wrapper">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="modal-button premium-action"
        >
          <i className="fa-solid fa-file-contract"></i> {isBadge ? 'Verificar Credencial Pública' : 'Visualizar Documento (PDF)'}
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