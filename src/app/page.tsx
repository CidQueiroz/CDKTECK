'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import CircuitPoint from '@/components/CircuitPoint';
import FilosofiaModal from "@/components/FilosofiaModal";
import ContactModal from "@/components/ContactModal";
import modalData from '@/data/modalData.json';

type ModalId = keyof typeof modalData;
type ModalInfo = (typeof modalData)[ModalId] & { isContact?: boolean };

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalContent, setModalContent] = useState<ModalInfo | null>(null);
  const [isFilosofiaModalOpen, setIsFilosofiaModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ModalInfo[]>([]);

  // Efeito para adicionar/remover a classe 'pagina-inicial' do body
  useEffect(() => {
    document.body.classList.add('pagina-inicial');
    // Cleanup function para remover a classe ao sair da página
    return () => {
      document.body.classList.remove('pagina-inicial');
    };
  }, []); // Array vazio garante que rode apenas uma vez (montagem/desmontagem)

  // Efeito para forçar o tema escuro na página inicial
  useEffect(() => {
    const originalTheme = document.body.getAttribute('data-theme');
    document.body.setAttribute('data-theme', 'dark');

    return () => {
      if (originalTheme) {
        document.body.setAttribute('data-theme', originalTheme);
      } else {
        document.body.removeAttribute('data-theme');
      }
    };
  }, []);

  // Efeito para animação de entrada e partículas
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
      for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = `${Math.random() * 4 + 4}s`;
        particlesContainer.appendChild(particle);
      }
    }
    return () => clearTimeout(timer);
  }, []);

  // Efeito para adicionar/remover classe 'loaded' do body
  useEffect(() => {
    if (isLoaded) document.body.classList.add('loaded');
    else document.body.classList.remove('loaded');
  }, [isLoaded]);

  // Efeito para gerenciar a classe 'modal-open' no body
  useEffect(() => {
    const isAnyModalOpen = !!modalContent || isFilosofiaModalOpen || isContactModalOpen;
    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    // Cleanup function para garantir que a classe seja removida ao desmontar o componente
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [modalContent, isFilosofiaModalOpen, isContactModalOpen]);

  // Efeito para a lógica de busca
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
    console.log("openModal called with:", data); // Log de diagnóstico
    if (data.isContact) {
      setIsContactModalOpen(true);
    } else {
      setModalContent(data);
    }
    setSearchQuery('');
  };

  const handleLogoClick = () => {
    console.log("Logo clicked, opening FilosofiaModal"); // Log de diagnóstico
    setIsFilosofiaModalOpen(true);
  };

  return (
    <main className="main-landing">
      <div className="particles" id="particles"></div>

      <div className="search-container">
        {/* A lógica de busca será implementada a seguir */}
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
              // onClick={handleLogoClick}
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
              'senseidb-button': { top: '48%', left: '11%', emoji: '🧠' },
              'suporte-button': { top: '30%', left: '18%', emoji: '🛠️' },
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

      <Modal 
        isOpen={!!modalContent}
        onClose={() => setModalContent(null)}
      >
        <h2>{modalContent?.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: modalContent?.description || '' }} />
        {modalContent?.redirectUrl && (
          <a href={modalContent.redirectUrl} target="_blank" rel="noopener noreferrer" className="modal-button primary">
            Visitar Página
          </a>
        )}
      </Modal>

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
