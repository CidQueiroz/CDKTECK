'use client';

import React, { useState } from 'react';
import { Header, Footer, ContactModal, ThemeProvider, ModalProvider } from '@cidqueiroz/cdkteck-ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const pathname = usePathname();

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);
  
  const NextLink = ({ href, className, children, ...props }: any) => (
    <Link href={href} className={className} {...props}>{children}</Link>
  );

  const isHomePage = pathname === '/';

  return (
    <ThemeProvider>
      <ModalProvider> {/* Provider para os modais das páginas filhas */}
        {!isHomePage && <Header 
          LinkComponent={NextLink}
          usePathname={() => pathname}
          />}
        
        <main>{children}</main>

         {!isHomePage && <Footer
            openContactModal={openContactModal}
            LinkComponent={NextLink}
          />}
        
        {/* O ContactModal é gerenciado de forma independente */}
        <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
        
        {!isHomePage && (
          <button 
            className="fixed-contact-button" 
            onClick={openContactModal}
            aria-label="Abrir formulário de contato"
          >
            <i className="fas fa-envelope"></i>
          </button>
        )}
      </ModalProvider>
    </ThemeProvider>
  );
}