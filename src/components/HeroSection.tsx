'use client'; 

import React from 'react';
import { useTheme, ThemeToggle } from '@cidqueiroz/cdkteck-ui';

export const HeroSection = () => {
  // Conectando a Lógica (App) com o Visual (Lib)
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className={`
      relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-4 transition-colors duration-700 overflow-hidden
      ${isDark ? 'bg-[#0B1120]' : 'bg-[#F0F4F8]'}
    `}>
      
      {/* 1. O Toggle (Vindo da lib cdkteck-ui) */}
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle 
          isDark={isDark} 
          onToggle={toggleTheme} 
        />
      </div>

      {/* 2. O Avatar da Dualidade (Cérebro vs. Lourdes) */}
      <div className="relative mb-10 group cursor-pointer z-10">
        <div className={`
            w-56 h-56 rounded-full flex items-center justify-center transition-all duration-700 backdrop-blur-sm
            ${isDark 
              ? 'bg-slate-900/50 shadow-[0_0_60px_rgba(0,174,239,0.25)] border border-cyan-900/30' 
              : 'bg-white/50 shadow-[0_0_60px_rgba(236,72,153,0.25)] border border-pink-200/50'}
        `}>
           <img 
             src={isDark ? "/logo_metalico_sem_fundo.jpg" : "/lourdes_out.jpg"} 
             alt="Avatar CDK TECK"
             className={`w-full h-full object-contain p-2 transition-transform duration-700 ${isDark ? 'scale-90' : 'scale-110'}`}
           />
        </div>
        
        {/* Tooltip Narrativo */}
        <div className={`
          absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 border
          ${isDark 
             ? 'bg-slate-900 text-cyan-400 border-cyan-800' 
             : 'bg-white text-purple-500 border-pink-200 shadow-lg'}
        `}>
           {isDark ? "System: CID_CORE_LOGIC_V1" : "Dream: LOURDES_CREATIVE_CLOUD"}
        </div>
      </div>

      {/* 3. Textos da História (Copywriting do Cid) */}
      <div className="max-w-5xl z-10 space-y-6">
        <h2 className={`
          text-sm font-bold tracking-[0.4em] uppercase transition-colors duration-500
          ${isDark ? 'text-cyan-600' : 'text-purple-400'}
        `}>
          {isDark ? "Engenharia & Inteligência" : "Imaginação & Nuvem"}
        </h2>

        <h1 className={`
          text-5xl md:text-7xl font-extrabold tracking-tight transition-colors duration-500
          ${isDark ? 'text-white' : 'text-slate-800'}
        `}>
          {isDark ? (
            <>CDK <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">TECK</span></>
          ) : (
            <>Universo <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Lourdes</span></>
          )}
        </h1>

        <p className={`
          text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed transition-colors duration-500 font-light
          ${isDark ? 'text-slate-400' : 'text-slate-600'}
        `}>
          {isDark
            ? "Onde a arquitetura precisa encontra o propósito. Transformando dados brutos em soberania financeira com IA e Soluções Robustas."
            : "A raridade do 'Profissional Unicórnio'. Habilidades técnicas raras envoltas em criatividade humana e design intuitivo."}
        </p>

        {/* Botões de Ação */}
        <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center items-center">
            <button className={`
                px-8 py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all transform hover:-translate-y-1 hover:shadow-2xl
                ${isDark 
                    ? 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-900/50' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-pink-300/50'}
            `}>
                Ver Projetos
            </button>
            <span className={`text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                {isDark ? "// Acessar Terminal" : "✨ Explorar Magia"}
            </span>
        </div>
      </div>
    </section>
  );
};