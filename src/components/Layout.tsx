"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactModal from '@/components/ContactModal';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const pathname = usePathname();

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  const isUnicornPage = pathname === '/portfolio/unicorn';

  return (
    <>
      <Header openContactModal={openContactModal} />
      <main className={isUnicornPage ? '' : 'portfolio-page'}>{children}</main>
      <Footer openContactModal={openContactModal} />
      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
      <button 
        className="fixed-contact-button" 
        onClick={openContactModal}
        aria-label="Abrir formulário de contato"
      >
        <i className="fas fa-envelope"></i>
      </button>
    </>
  );
}
