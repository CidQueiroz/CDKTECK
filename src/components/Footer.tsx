import Link from 'next/link';

const Footer = ({ openContactModal }: { openContactModal: () => void }) => {
  return (
    <footer className="rodape">
      <p className="rodape_texto">© 2025 CDK TECK. Todos os direitos reservados.</p>
      <div className="rodape_links">
        <Link href="/privacidade" className="rodape_link">Privacidade</Link>
        <Link href="/termos" className="rodape_link">Termos</Link>
        <button onClick={openContactModal} className="rodape_link">Contato</button>
      </div>
    </footer>
  );
};

export default Footer;


