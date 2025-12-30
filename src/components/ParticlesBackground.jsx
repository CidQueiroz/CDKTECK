import React, { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    const particlesContainer = particlesRef.current;
    if (!particlesContainer) return;

    // Limpa partículas existentes
    particlesContainer.innerHTML = '';

    // Cria 50 partículas
    const createParticles = () => {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posição horizontal aleatória
        const leftPos = Math.random() * 100;
        particle.style.left = `${leftPos}%`;
        
        // Delay aleatório para cada partícula
        const delay = Math.random() * 6;
        particle.style.animationDelay = `${delay}s`;
        
        // Duração aleatória (entre 4 e 8 segundos)
        const duration = 4 + Math.random() * 4;
        particle.style.animationDuration = `${duration}s`;
        
        // Tamanho aleatório (entre 3px e 7px)
        const size = 3 + Math.random() * 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particlesContainer.appendChild(particle);
      }
    };

    createParticles();
  }, []);

  return (
    <>
      <style jsx>{`
        .particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .particles-container :global(.particle) {
          position: absolute;
          width: 5px;
          height: 5px;
          background: rgba(0, 255, 255, 0.6);
          border-radius: 50%;
          animation: float-down 6s infinite linear;
          top: -10vh;
        }

        @keyframes float-down {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }

        /* Variações de cor para algumas partículas */
        .particles-container :global(.particle:nth-child(3n)) {
          background: rgba(78, 205, 196, 0.5);
        }

        .particles-container :global(.particle:nth-child(5n)) {
          background: rgba(255, 140, 0, 0.4);
        }

        /* Ajuste para telas menores */
        @media (max-width: 900px) {
          .particles-container :global(.particle) {
            width: 3px;
            height: 3px;
          }
        }
      `}</style>
      
      <div className="particles-container" ref={particlesRef} />
    </>
  );
};

export default ParticlesBackground;