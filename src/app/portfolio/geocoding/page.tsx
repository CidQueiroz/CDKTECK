'use client';

import React, { useState } from 'react';
import styles from './geocoding.module.css';
import Image from 'next/image';
import Modal from '@/components/Modal';

export default function GeocodingPage() {
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [resultado, setResultado] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGeocode = () => {
    if (!cep || !numero) {
      setResultado('<p>Por favor, preencha o CEP e o número.</p>');
      setIsModalOpen(true);
      return;
    }

    setResultado('<p>Buscando...</p>');
    setIsModalOpen(true);

    fetch(`https://cep.awesomeapi.com.br/json/${cep}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 404) {
          setResultado('<p>CEP não encontrado.</p>');
        } else {
          setResultado(`
            <h2>Resultado</h2>
            <p><b>Endereço:</b> ${data.address}, <b>Numero</b> ${numero}</p>
            <p><b>Bairro:</b> ${data.district}</p>
            <p><b>Cidade:</b> ${data.city} -  <b>Estado:</b> ${data.state}</p>
            <p><b>CEP:</b> ${cep}</p>
            <p><b>Latitude:</b> ${data.lat} <b>Longitude:</b> ${data.lng}</p>
          `);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar CEP:', error);
        setResultado('<p>Ocorreu um erro ao buscar o CEP.</p>');
      });
  };

  return (
    <main className="pagina-jogo">
      <div className={styles.container_informacoes_geocoding}>
        <div className="titulo-wrapper">
          <h1 className="titulo">Geocodificação de Endereço</h1>
          <p className="subtitulo">Digite um endereço para obter a latitude e longitude.</p>
        </div>

        <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} placeholder="Logradouro" className="form-input" />
        <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número (obrigatório)" className="form-input" />
        <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" className="form-input" />
        <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Estado" className="form-input" />
        <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="CEP (obrigatório)" className="form-input" />

        <div className={styles.container_botoes_geocoding}>
          <button onClick={handleGeocode} className="btn btn-primario">Buscar</button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div dangerouslySetInnerHTML={{ __html: resultado }} />
      </Modal>

      <div>
        <Image src="/assets/logo_escuro.png" alt="CDK TECK Logo" width={350} height={350} className={`${styles.container_imagem_geocoding} logo-tema-escuro`} />
        <Image src="/assets/logo_claro.png" alt="CDK TECK Logo" width={350} height={350} className={`${styles.container_imagem_geocoding} logo-tema-claro`} />
      </div>
    </main>
  );
}