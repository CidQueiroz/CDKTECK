'use client';

import Image from 'next/image';

interface CertificateCardProps {
  title: string;
  imageUrl: string;
  onClick: () => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ title, imageUrl, onClick }) => {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="card-content">
        <Image 
          src={imageUrl} 
          alt={`Imagem do certificado ${title}`} 
          width={400} 
          height={280} 
          style={{ objectFit: 'cover', borderRadius: '15px' }}
          // Em um cenário real, teríamos imagens aqui.
          // Se a imagem não for encontrada, o alt text será mostrado.
          onError={(e) => {
            // Adiciona um placeholder visual se a imagem falhar
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM0Q0ODU1IiAvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiPkltYWdlbSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
            target.alt = 'Placeholder para o certificado';
          }}
        />
        <div className="project-info">
          <h3 style={{ marginTop: '15px', fontSize: '1rem' }}>{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
