'use client';

import React from 'react';
import Image from 'next/image';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const socialLinks = [
  { name: 'LinkedIn', icon: 'fab fa-linkedin', url: 'https://www.linkedin.com/in/ciddy-queiroz/' },
  { name: 'GitHub', icon: 'fab fa-github', url: 'https://github.com/CidQueiroz' },
  { name: 'WhatsApp', icon: 'fab fa-whatsapp', url: 'https://api.whatsapp.com/send?phone=5521971583118' },
  { name: 'Instagram', icon: 'fab fa-instagram', url: 'https://www.instagram.com/ciddyqueiroz/' },
  { name: 'Facebook', icon: 'fab fa-facebook', url: 'https://www.facebook.com/cyrd.queiroz/' },
  { name: 'Currículo', icon: 'fas fa-download', url: '/assets/curriculo.pdf', download: true },
];

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;


  return (
    <div id="contact-modal" className="modal show" onClick={onClose}>
      <div className="modal-content contact-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        
        <Image 
          src="/assets/foto.jpg" 
          alt="Cidirclay Queiroz" 
          title="Cid Queiroz"
          className="profile-pic"
          width={120}
          height={120}
        />
        
        <h2 id="contact-title">Cidirclay Queiroz</h2>
        
        <p id="contact-description">
          Olá! 👋 Sou Cidirclay Queiroz, Arquiteto de Soluções Cloud em formação e Cientista de Dados OCI Certified. Minha especialidade não é apenas programar em Python/Django/React, mas sim transformar desafios de negócio em soluções de infraestrutura e automação. Sou um profissional unicórnio que une a competência técnica (CI/CD, Cloud) à visão estratégica para entregar projetos de alto desempenho e estabilidade. Se você precisa de lógica e resultados, vamos conversar.
        </p>

        <div className="social-links">
          {socialLinks.map(link => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="social-link-item">
              <i className={link.icon}></i>
              <span>{link.name}</span>
            </a>
          ))}
        </div>

        <button className="close-modal" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default ContactModal;
