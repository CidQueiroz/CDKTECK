import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function CertificadosPage() {
  const certsDirectory = path.join(process.cwd(), 'public', 'certificados');
  const filenames = fs.readdirSync(certsDirectory);

  const certificates = filenames.filter(filename => filename.endsWith('.pdf'));

  return (
    <div className="content-wrapper">
      <div className="titulo-wrapper">
        <h1 className="titulo">Certificações & Badges</h1>
        <p className="subtitulo">Comprovação de Expertise Técnica e Desenvolvimento Contínuo</p>
      </div>

      <div className="gallery-container">
        {certificates.map((filename, index) => (
          <Link key={index} href={`/certificados/${filename}`} passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer" className="project-card">
              <div className="card-content">
                <div className="project-info">
                  <p>{filename.replace('.pdf', '')}</p>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
