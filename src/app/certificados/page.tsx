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

// 1. Dicionário Refatorado (Clean Data)
const TABS = [
  { id: 'Elite', icon: '🏆', label: 'THE UNICORN LAYER', desc: 'ELITE & ARCHITECTURES' },
  { id: 'Cloud_AI', icon: '☁️', label: 'CLOUD & AI', desc: 'GOOGLE, ORACLE, AWS, MS' },
  { id: 'Data_Intelligence', icon: '📊', label: 'DATA INTELLIGENCE', desc: 'ENGENHARIA & ANÁLISE' },
  { id: 'Cybersecurity', icon: '🛡️', label: 'CYBERSECURITY', desc: 'DEFESA & SEGURANÇA' },
  { id: 'Tools_Courses', icon: '🛠️', label: 'FERRAMENTAS & CURSOS', desc: 'SKILLS COMPLEMENTARES' },
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

  // 1. MÁGICA DOS DADOS: Conta quantos certificados existem em cada categoria
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    // Inicia os contadores no zero
    TABS.forEach(tab => { counts[tab.id] = 0; });

    // Varre o JSON e soma
    (certificatesData as Certificate[]).forEach(cert => {
      const tier = cert.category_tier || 'Tools_Courses'; // Padrão que você definiu
      if (counts[tier] !== undefined) {
        counts[tier]++;
      }
    });

    return counts;
  }, []);

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

      {/* 1. MUDANÇA: PageHeader movido para dentro do container soberano 
             Isso garante que o título, botões e cards fiquem milimetricamente alinhados na mesma margem. */}
      <div className="sovereign-layout-container">

        <PageHeader
          title="Certificações & Badges"
          description="Comprovação de Expertise Técnica e Desenvolvimento Contínuo"
        />

        <div className="sovereign-tabs-grid">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sovereign-tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              {/* LINHA 1: Ícone e Badge (separados nas pontas) */}
              <div className="tab-row-top">
                <span className="tab-emoji">{tab.icon}</span>
                <span className="tab-badge">{categoryCounts[tab.id]}</span>
              </div>

              {/* LINHA 2: Título Principal */}
              <span className="sovereign-tab-label">{tab.label}</span>

              {/* LINHA 3: Descrição Subtítulo */}
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
            <div className="empty-category-state">
              <p>Nenhuma credencial classificada nesta categoria no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}