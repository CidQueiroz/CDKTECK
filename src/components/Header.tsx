"use client";
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Header = ({ openContactModal }: { openContactModal: () => void }) => {
  const [theme, setTheme] = useState('dark');
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (

    <header className="cabecalho">

      <Link href="/" className="cabecalho-logo">
        <Image src="/assets/favicon.png" alt="CDK TECK Logo" width={60} height={60} />
        <span>CDK TECK</span>
      </Link>

      <div className="header-actions">

        <button onClick={toggleTheme} className="btn-theme theme-toggle-btn" aria-label="Mudar tema">
          <span className="logo-tema-escuro">☀️</span>
          <span className="logo-tema-claro">🌙</span>
        </button>
        
        <nav className="main-nav">
          <div className="dropdown">
            <button className="dropdown-toggle">Universo CDK TECK</button>
            <div className="dropdown-menu">
              {pathname !== '/' && <Link href="/">Página Inicial</Link>}
              <a href="https://papodados.cdkteck.com.br" target="_blank" rel="noopener noreferrer">PapoDados</a>
              <a href="https://cacapreco.cdkteck.com.br" target="_blank" rel="noopener noreferrer">Caça-Preço</a>
              <a href="https://sensei.cdkteck.com.br" target="_blank" rel="noopener noreferrer">SenseiDB</a>
              <a href="https://gestao.cdkteck.com.br" target="_blank" rel="noopener noreferrer">Gestão RPD</a>
            </div>
          </div>
          <div className="dropdown">
            <button className="dropdown-toggle">Sobre</button>
            <div className="dropdown-menu">
              {pathname !== '/pbi' && <Link href="/pbi">Portfólio de Dashboards</Link>}
              {pathname !== '/portfolio' && <Link href="/portfolio">Laboratório de Projetos</Link>}
              {pathname !== '/certificados' && <Link href="/certificados">Certificados</Link>}
            </div>
          </div>
        </nav>

        {/* <button onClick={openContactModal} className="contato-btn">Contato</button> */}
      
      </div>
    
    </header>

  );

};

export default Header;
