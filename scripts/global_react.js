import React, { useState, useEffect } from 'react';

// ======================================================
// HOOK PERSONALIZADO PARA TEMA
// ======================================================
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
};

// ======================================================
// HOOK PARA BOTÃO VOLTAR AO TOPO
// ======================================================
const useBackToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { showButton, scrollToTop };
};

// ======================================================
// COMPONENTE MODAL REUTILIZÁVEL
// ======================================================
const Modal = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// ======================================================
// COMPONENTE DE CONTATO (EXEMPLO)
// ======================================================
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados enviados:', formData);
    alert('Formulário enviado com sucesso!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nome
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mensagem
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          required
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Enviar
      </button>
    </div>
  );
};

// ======================================================
// COMPONENTE HEADER
// ======================================================
const Header = ({ onContactClick, onThemeToggle, theme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            MeuSite
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Início
            </a>
            <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Sobre
            </a>
            <a href="#services" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Serviços
            </a>
            <button
              onClick={onContactClick}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contato
            </button>
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <a href="#home" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Início
            </a>
            <a href="#about" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Sobre
            </a>
            <a href="#services" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Serviços
            </a>
            <button
              onClick={() => {
                onContactClick();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contato
            </button>
            <button
              onClick={onThemeToggle}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
            >
              <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
              <span>Tema {theme === 'dark' ? 'Claro' : 'Escuro'}</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

// ======================================================
// COMPONENTE PRINCIPAL - APP
// ======================================================
const App = () => {
  const { theme, toggleTheme } = useTheme();
  const { showButton, scrollToTop } = useBackToTop();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header 
        onContactClick={() => setIsContactModalOpen(true)}
        onThemeToggle={toggleTheme}
        theme={theme}
      />

      <main className="container mx-auto px-4 py-8">
        <section id="home" className="mb-16">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Bem-vindo ao Seu Site!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Conversão completa de scripts HTML/CSS/JS para React com hooks modernos.
          </p>
        </section>

        <section id="about" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Sobre
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Este projeto demonstra como converter funcionalidades JavaScript vanilla para React,
            incluindo gerenciamento de tema, modais e navegação.
          </p>
        </section>

        {/* Conteúdo de exemplo para testar o scroll */}
        {[...Array(8)].map((_, i) => (
          <section key={i} className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
              Seção {i + 1}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Conteúdo de exemplo para demonstrar o funcionamento completo da aplicação.
              Role para baixo para ver o botão "voltar ao topo" aparecer automaticamente
              após rolar mais de 300px. O tema escuro/claro persiste entre sessões usando localStorage.
            </p>
          </section>
        ))}
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 MeuSite. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Modal de Contato */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Entre em Contato"
      >
        <ContactForm />
      </Modal>

      {/* Botão Voltar ao Topo */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40 hover:scale-110"
          aria-label="Voltar ao topo"
        >
          <span className="text-xl">↑</span>
        </button>
      )}
    </div>
  );
};

export default App;