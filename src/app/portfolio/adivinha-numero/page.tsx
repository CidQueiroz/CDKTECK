'use client';

import React, { useState, useEffect } from 'react';
import styles from './adivinha-numero.module.css';
import Image from 'next/image';

export default function AdivinhaNumeroPage() {
  const [numeroSecreto, setNumeroSecreto] = useState(gerarNumeroAleatorio());
  const [tentativas, setTentativas] = useState(1);
  const [chute, setChute] = useState('');
  const [mensagem, setMensagem] = useState('Escolha um número entre 1 e 10:');
  const [titulo, setTitulo] = useState('Jogo do número Secreto');
  const [jogoFinalizado, setJogoFinalizado] = useState(false);

  function gerarNumeroAleatorio() {
    return Math.floor(Math.random() * 10 + 1);
  }

  function exibitTextoNaTela(tag: string, texto: string) {
    if (tag === 'h1') {
      setTitulo(texto);
    } else {
      setMensagem(texto);
    }
  }

  useEffect(() => {
    exibitTextoNaTela('h1', 'Jogo do número Secreto');
    exibitTextoNaTela('p', 'Escolha um número entre 1 e 10:');
  }, []);

  function verificarChute() {
    const palpite = parseInt(chute);

    if (isNaN(palpite)) {
        exibitTextoNaTela('p', 'Por favor, digite um número válido.');
        return;
    }

    if (palpite === numeroSecreto) {
      exibitTextoNaTela('h1', 'Acertou!');
      const palavraTentativas = tentativas > 1 ? 'tentativas' : 'tentativa';
      const mensagensTentativa = `Voce descobriu o numero secreto com ${tentativas} ${palavraTentativas}!`;
      exibitTextoNaTela('p', mensagensTentativa);
      setJogoFinalizado(true);
    } else {
      if (palpite > numeroSecreto) {
        exibitTextoNaTela('p', 'O numero secreto é menor');
      } else {
        exibitTextoNaTela('p', 'O numero secreto é maior');
      }
      setTentativas(tentativas + 1);
      setChute('');
    }
  }

  function reiniciarJogo() {
    setNumeroSecreto(gerarNumeroAleatorio());
    setChute('');
    setTentativas(1);
    exibitTextoNaTela('h1', 'Jogo do número Secreto');
    exibitTextoNaTela('p', 'Escolha um número entre 1 e 10:');
    setJogoFinalizado(false);
  }

  return (
    <main className="pagina-jogo">
      <div className={styles.container_informacoes_jogar}>
        <div className="titulo-wrapper">
          <h1 className="titulo">{titulo}</h1>
          <p className="subtitulo">{mensagem}</p>
        </div>

        <input
          type="number"
          id="palpite"
          min="1"
          max="10"
          className={styles.container_input_jogar}
          value={chute}
          onChange={(e) => setChute(e.target.value)}
        />

        <div className={styles.container_botoes_jogar}>
          <button onClick={verificarChute} className="btn btn-primario" disabled={jogoFinalizado}>
            Chutar
          </button>
          <button onClick={reiniciarJogo} className="btn btn-secundario" disabled={!jogoFinalizado}>
            Novo jogo
          </button>
        </div>
      </div>

      <div>
        <Image src="/assets/logo_escuro.png" alt="CDK TECK Logo" width={350} height={350} className={`${styles.container_imagem_jogar} logo-tema-escuro`} />
        <Image src="/assets/logo_claro.png" alt="CDK TECK Logo" width={350} height={350} className={`${styles.container_imagem_jogar} logo-tema-claro`} />
      </div>
    </main>
  );
}