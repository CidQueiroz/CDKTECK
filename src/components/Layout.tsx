"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import ContactModal from '@/components/ContactModal';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const pathname = usePathname();

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  const isUnicornPage = pathname === '/portfolio/unicorn';

  return (
    <>
      <main className={isUnicornPage ? '' : 'portfolio-page'}>{children}</main>
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
