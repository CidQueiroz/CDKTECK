'use client';

import React from 'react';
import { PageHeader, NarrativeCard } from '@cidqueiroz/cdkteck-ui';

export default function SobrePage() {
  return (
    <div className="portfolio-page">
      <PageHeader 
        title="A ESSÊNCIA CDK TECK" 
        description={
          <>
            Tecnologia com Mente. Futuro com Coração.<br /><br />
            Onde a lógica não sufoca a criatividade. O tema escuro pensa.<br />
            Onde a emoção não compromete a precisão. O tema claro sente.<br /><br />
            E juntos, constroem uma marca que entende que o futuro não será apenas mais rápido ou mais inteligente — ele precisa ser mais humano.
          </>
        }
      />
      
      <div className="mt-8 w-full max-w-4xl animate-fade-in-up">
        <NarrativeCard />
      </div>
    </div>
  );
}