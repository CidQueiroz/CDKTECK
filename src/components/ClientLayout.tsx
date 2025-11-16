'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';
import { usePathname } from 'next/navigation'; // Importar usePathname

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);
  const pathname = usePathname(); // Obter o pathname atual

  const isHomePage = pathname === '/'; // Verificar se é a página inicial

  return (
    <>
      {!isHomePage && <Header openContactModal={openContactModal} />} {/* Renderiza Header condicionalmente */}
      {children}
      <Footer openContactModal={openContactModal} />
      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
      {!isHomePage && ( // Renderiza o botão condicionalmente
        <button 
          className="fixed-contact-button" 
          onClick={openContactModal}
          aria-label="Abrir formulário de contato"
        >
          <i className="fas fa-envelope"></i>
        </button>
      )}
    </>
  );
}
