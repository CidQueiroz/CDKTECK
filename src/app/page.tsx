'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import { useModal, ContactModal, FilosofiaModal, useTheme } from '@cidqueiroz/cdkteck-ui';
import CircuitPoint from '@/components/CircuitPoint';
import modalData from '@/data/modalData.json';

type ModalId = keyof typeof modalData;
type ModalInfo = (typeof modalData)[ModalId] & { isContact?: boolean; external?: boolean };

// Componente de conteúdo para o modal genérico
const GenericModalContent = ({ modalContent }: { modalContent: ModalInfo | null }) => {
  if (!modalContent) return null;
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: modalContent.description || '' }} />
      {modalContent.redirectUrl && (
        <div className="modal-actions">
          <a 
            href={modalContent.redirectUrl} 
            target={modalContent?.external ? "_blank" : "_self"} 
            rel={modalContent?.external ? "noopener noreferrer" : ""} 
            className="modal-button primary"
          >
            Visitar Página
          </a>
        </div>
      )}
    </>
  );
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  // Estados locais para os modais específicos
  const [isFilosofiaModalOpen, setIsFilosofiaModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ModalInfo[]>([]);
  const { showModal } = useModal(); // Apenas para os modais genéricos
  
  useEffect(() => {
    document.body.classList.add('pagina-inicial');
    document.body.setAttribute('data-theme', 'dark');
    
    const timer = setTimeout(() => setIsLoaded(true), 500);
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
      for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 110 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
      }
    }
    
    return () => {
      document.body.classList.remove('pagina-inicial');
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isLoaded) document.body.classList.add('loaded');
  }, [isLoaded]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = Object.values(modalData).filter(item => {
        const query = searchQuery.toLowerCase();
        const hasKeyword = item.keywords.some(keyword => keyword.toLowerCase().includes(query));
        return item.title.toLowerCase().includes(query) || hasKeyword;
      });
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const openModal = (data: ModalInfo) => {
    setSearchQuery('');
    if (data.isContact) {
      setIsContactModalOpen(true); // Usa o estado local
    } else {
      // Usa o sistema global para os outros
      showModal(<GenericModalContent modalContent={data} />, data.title);
    }
  };

  const handleLogoClick = () => {
    setIsFilosofiaModalOpen(true); // Usa o estado local
  };

  return (
    <main className="main-landing">
      <div className="particles" id="particles"></div>
      
      <div className="search-container">
        <button id="search-toggle" className="search-toggle-btn"><i className="fas fa-search"></i></button>
        <input 
          type="text" 
          id="search-input" 
          placeholder="O que você procura?" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul id="search-results" style={{ display: 'block' }}>
            {searchResults.map(item => (
              <li key={item.id} onClick={() => openModal(item)}>
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="container">
        <div className="logo-container">
          <div className="animated-logo cdk-logo">CDK</div>
          <div className="animated-logo teck-logo">TECK</div>

          <div className="brain-core">
            <Image
              className="logo-image"
              src="/assets/logo_metalico_sem_fundo.png"
              alt="CDK TECK Logo"
              title="CDK TECK"
              width={600} height={600}
              priority
              style={{ cursor: 'pointer' }}
            />
            <div 
              className="logo-hitbox" 
              onClick={handleLogoClick}
              title="Descubra o DNA da CDK TECK"
            ></div>
          </div>

          {Object.keys(modalData).map((key) => {
            const id = key as ModalId;
            const point = modalData[id];
            const originalPoints: { [id: string]: { top: string, left: string, emoji: string } } = {
              'automacao-button': { top: '12%', left: '50%', emoji: '🤖' },
              'papodados-button': { top: '24%', left: '84%', emoji: '📊' },
              'gestaorpd-button': { top: '42%', left: '91%', emoji: '📝' },
              'contato-button': { top: '70%', left: '85%', emoji: '👤' },
              'BI-button': { top: '89%', left: '53%', emoji: '📊' },
              'integracao-button': { top: '80%', left: '23%', emoji: '🔗' },
              'senseidb-button': { top: '48%', left: '10%', emoji: '🧠' },
              'suporte-button': { top: '31%', left: '18%', emoji: '🛠️' },
            };
            const style = originalPoints[id];
            if (!style) return null;

            return (
              <CircuitPoint
                key={id}
                id={id}
                title={point.title}
                top={style.top}
                left={style.left}
                emoji={style.emoji}
                onClick={() => openModal(point)}
              />
            );
          })}
        </div>
      </div>

      {/* Renderiza os modais específicos com seu estado local */}
      <FilosofiaModal 
        isOpen={isFilosofiaModalOpen}
        onClose={() => setIsFilosofiaModalOpen(false)}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </main>
  );
}
