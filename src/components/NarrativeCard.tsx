'use client';

import React, { useState } from 'react';
import { Brain, Cloud, Terminal, Sparkles, Cpu, Palette } from 'lucide-react';

const NarrativeCard: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Função para alternar o lado
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // --- COMPONENTE INTERNO: FACE DO CARD (Reutilizável para Front e Back) ---
  const CardFace = ({ type }: { type: 'logic' | 'soul' }) => {
    const isLogic = type === 'logic';
    
    const colors = {
      bg: isLogic ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
      border: isLogic ? '#06b6d4' : '#ec4899',
      text: isLogic ? '#f8fafc' : '#1e293b',
      subtext: isLogic ? '#94a3b8' : '#64748b',
      accent: isLogic ? '#22d3ee' : '#db2777',
      gradient: isLogic 
        ? 'linear-gradient(135deg, #0891b2 0%, #0369a1 100%)' 
        : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      shadow: isLogic 
        ? '0 0 40px rgba(6, 182, 212, 0.3)' 
        : '0 0 40px rgba(236, 72, 153, 0.3)'
    };

    return (
      <div style={{
        gridArea: '1 / 1', // Stack faces on top of each other in the grid
        width: '100%',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: isLogic ? 'rotateY(0deg)' : 'rotateY(180deg)',
        borderRadius: '24px',
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        boxShadow: colors.shadow,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-montserrat), sans-serif',
        color: colors.text,
      }}>
        {/* HEADER */}
        <div style={{
          padding: '1.5rem',
          borderBottom: `1px solid ${isLogic ? 'rgba(6, 182, 212, 0.2)' : 'rgba(236, 72, 153, 0.1)'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isLogic ? 'rgba(2, 6, 23, 0.5)' : 'rgba(255, 241, 242, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              padding: '0.6rem',
              borderRadius: '12px',
              background: isLogic ? 'rgba(6, 182, 212, 0.1)' : 'rgba(236, 72, 153, 0.1)',
              color: colors.accent
            }}>
              {isLogic ? <Cpu size={28} /> : <Palette size={28} />}
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '2px', color: colors.accent, marginBottom: '2px' }}>
                {isLogic ? 'CORE_PROCESSOR' : 'CREATIVE_FLOW'}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-orbitron)' }}>
                {isLogic ? 'CID_TECK_v3.0' : 'Lourdes Unicorn'}
              </div>
            </div>
          </div>

          <button 
            onClick={handleFlip}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '99px',
              border: `1px solid ${colors.accent}`,
              background: 'transparent',
              color: colors.accent,
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.3s'
            }}
          >
            {isLogic ? 'Conhecer o lado criativo 🌗' : 'Conhecer o lado racional 🌗'}
          </button>
        </div>

        {/* CORPO DO TEXTO */}
        <div style={{ padding: '2rem', textAlign: 'center', flex: 1 }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 900, 
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-orbitron)',
            lineHeight: 1.2
          }}>
            {isLogic ? 'A Mente que Estrutura o Futuro' : 'O Coração que Humaniza a Tecnologia'}
          </h2>

          <div style={{ 
            fontSize: '0.95rem', 
            lineHeight: '1.7', 
            color: colors.subtext,
            marginBottom: '1.5rem',
            fontWeight: 400,
            textAlign: 'left',
            whiteSpace: 'pre-line'
          }}>
            {isLogic ? (
              <>
               O tema escuro da CDK TECK representa o território onde o pensamento se organiza antes de se tornar realidade. É o espaço da lógica, da análise e da engenharia silenciosa que sustenta tudo o que funciona.
                <br/><br/>
                No centro da identidade está o cérebro — símbolo máximo da consciência humana — conectado a circuitos que emanam como ideias em expansão. Cada trilha eletrônica representa um pensamento, uma hipótese, uma tentativa. <br/>
                Algumas conexões se fecham em círculos completos, outras permanecem abertas, incompletas.<br/>
                Ideias boas. Ideias falhas. Tentativas descartadas. Aprendizado constante.<br/>
                Nada nasce perfeito — nasce processado pela mente.<br/>
                <br/>
                O símbolo central é dividido por uma linha vertical luminosa, formando a letra I, que separa e, ao mesmo tempo, conecta dois mundos.<br/>
                À esquerda, a metade do círculo cria o C: o domínio da lógica, do raciocínio, da precisão. À direita, a outra metade forma o D: o espaço da criatividade aplicada, da intuição estruturada, da visão além dos números.<br/>
                Juntas, essas formas constroem C I D — identidade, assinatura, origem.<br/><br/>

                Esse é o lado profissional da marca.<br/>
                O lado que valoriza método, clareza, performance e responsabilidade técnica. Onde dashboards não são apenas gráficos, mas ferramentas de decisão. Onde dados contam histórias reais e a tecnologia é usada com propósito.<br/><br/>

                <span style={{ color: colors.accent, fontWeight: 600 }}>O Dark Mode é o reino da mente disciplinada.<br/></span>
                <span style={{ color: colors.accent, fontWeight: 600 }}>Onde a tecnologia não impressiona — ela resolve.</span>
              </>
            ) : (
              <>
                O tema claro da CDK TECK nasce de algo que nenhuma máquina pode replicar:<br/>
                o vínculo humano.
                <br/><br/>
                
                Este modo é uma homenagem direta àquilo que dá sentido à tecnologia — a emoção, a imaginação e o afeto. Ele carrega o espírito da infância, da curiosidade sem medo e da capacidade de acreditar no impossível.
                <br/><br/>
                
                O unicórnio, aqui, não é fantasia gratuita.<br/>
                Ele simboliza o raro, o singular, aquilo que não se encontra facilmente. Assim como profissionais capazes de unir dados, cloud, inteligência artificial e visão estratégica — habilidades escassas em um mercado saturado de superficialidade.
                <br/><br/>
                
                Mas o unicórnio também tem nome.<br/>
                <strong>Lourdes</strong> é o mascote da CDK TECK, inspirado no apelido carinhoso de <strong>Ludmilla</strong>, filha e fonte de inspiração. Ela representa a magia que humaniza o futuro, a lembrança constante de que toda inovação deve preservar sensibilidade, empatia e beleza.
                <br/><br/>
                
                Neste universo, a tecnologia não desaparece — ela se suaviza.<br/>
                A estrutura permanece, mas agora envolta em cores leves, luz difusa e símbolos que remetem à imaginação. É o equilíbrio entre o rigor técnico e a liberdade criativa.
                <br/><br/>

                <span style={{ color: colors.accent, fontWeight: 600 }}>O Light Mode é o reino do coração.<br/></span>
                <span style={{ color: colors.accent, fontWeight: 600 }}>Onde a tecnologia ganha alma, propósito e significado.</span>
              </>
            )}
          </div>
          
          {/* SKILLS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: isLogic ? 'Engine' : 'Vibe', val: isLogic ? 'Python / OCI' : 'UX / Storytelling', icon: isLogic ? <Terminal size={16}/> : <Sparkles size={16}/> },
              { label: isLogic ? 'Focus' : 'Magic', val: isLogic ? 'RAG / MLOps' : 'Brand Identity', icon: isLogic ? <Brain size={16}/> : <Cloud size={16}/> }
            ].map((skill, i) => (
              <div key={i} style={{
                padding: '0.8rem',
                borderRadius: '16px',
                background: isLogic ? 'rgba(30, 41, 59, 0.5)' : '#fff',
                border: `1px solid ${isLogic ? 'rgba(6, 182, 212, 0.1)' : 'rgba(236, 72, 153, 0.1)'}`,
                boxShadow: isLogic ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.3rem', color: colors.accent }}>
                  {skill.icon}
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase' }}>{skill.label}</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{skill.val}</div>
              </div>
            ))}
          </div>
        
        </div>

        {/* FOOTER */}
        <div style={{
          padding: '1rem',
          textAlign: 'center',
          background: isLogic ? '#020617' : '#fff1f2',
          fontSize: '0.65rem',
          fontWeight: 800,
          letterSpacing: '2px',
          color: isLogic ? '#0e7490' : '#f472b6',
          borderTop: `1px solid ${isLogic ? 'rgba(6, 182, 212, 0.1)' : 'rgba(236, 72, 153, 0.1)'}`
        }}>
          TECNOLOGIA COM MENTE. FUTURO COM CORAÇÃO.
        </div>
      </div>    
    );
  };

  return (
    // CONTAINER DE PERSPECTIVA (CÂMERA 3D)
    <div style={{
      width: '100%',
      maxWidth: '800px', // Aumentado para caber mais conteúdo
      height: 'auto', // Altura automática para evitar scroll interno
      minHeight: '750px', // Garante uma altura mínima para o flip não "sumir"
      margin: '2rem auto',
      perspective: '1500px'
    }}>
      {/* WRAPPER QUE GIRA */}
      <div style={{
        position: 'relative',
        width: '100%',
        display: 'grid', // Enable grid stacking
        transition: 'transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}>
        {/* LADO DA FRENTE (LOGIC) */}
        <CardFace type="logic" />

        {/* LADO DE TRÁS (SOUL) */}
        <CardFace type="soul" />
      </div>
    </div>
  );
};

export default NarrativeCard;
