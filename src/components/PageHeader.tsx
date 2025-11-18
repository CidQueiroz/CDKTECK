// src/components/PageHeader.tsx
import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="page-header">
      
        <div className="mascot-light">
        {/* Imagem para o TEMA CLARO (Mascote Lourdes Tech) */}
        <Image
              src="/assets/ia_tech.png"  
              alt="Mascote Lourdes Tech" 
              width={180} 
              height={180} 
              className="mascot-img"
              priority 
            />
        </div>

        {/* Imagem para o TEMA ESCURO (O Cérebro CDK) */}
        <div className="mascot-dark">
            <Image 
              src="/assets/logo_metalico_sem_fundo.png" 
              alt="Logo CDK TECK" 
              width={180} 
              height={180} 
              className="mascot-img"
              priority
            />
        </div>

        <div className="header-text">
            <h1 className="titulo">{title}</h1>
            <p className="subtitulo">{description}</p>
        </div>
      
    </div>
  );
}