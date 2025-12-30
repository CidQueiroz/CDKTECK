'use client';

import React, { useEffect } from 'react';
import styles from './unicorn.module.css';

export default function UnicornPage() {
  useEffect(() => {
    // 1. Salvar estado original (Tema e Botão)
    const originalTheme = document.body.getAttribute('data-theme');
    const themeBtn = document.querySelector('.theme-toggle-btn') as HTMLElement;
    const originalBtnDisplay = themeBtn ? themeBtn.style.display : '';

    // 2. Aplicar estado da página (Forçar Dark e Esconder Botão)
    document.body.setAttribute('data-theme', 'dark');
    if (themeBtn) themeBtn.style.display = 'none';

    // 3. Configurar o Observador (Vigia eficiente)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          if (document.body.getAttribute('data-theme') !== 'dark') {
            document.body.setAttribute('data-theme', 'dark'); // Corrige instantaneamente
          }
        }
      }
    });

    // Iniciar vigilância no body apenas para mudanças de atributos
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });

    // 4. Cleanup (Restaurar tudo ao sair)
    return () => {
      observer.disconnect(); // Dispensa o vigia
      
      // Restaura o botão
      if (themeBtn) themeBtn.style.display = originalBtnDisplay;

      // Restaura o tema original
      if (originalTheme) {
        document.body.setAttribute('data-theme', originalTheme);
      } else {
        document.body.removeAttribute('data-theme');
      }
    };
  }, []);

  return (
    <div className={styles.bg}>
      <div className={styles.clouds}>
        <div className={styles.cloud}></div>
        <div className={`${styles.cloud} ${styles.alt} ${styles.bot}`}></div>
      </div>
      
      <div className={styles.stars}>
        {[...Array(10)].map((_, i) => <div key={i} className={styles.star}></div>)}
      </div>
      
      <div className={styles.planets}>
        {[...Array(10)].map((_, i) => <div key={i} className={styles.planet}></div>)}
      </div>

      <div className={styles.unicorn_container}>
        <div className={styles.unicorn}>
          <div className={styles.header}>
            <div className={styles.horn}>
              <div className={styles.lines_container}></div>
            </div>
            <div className={styles.head}>
              <div className={styles.face}>
                <div className={styles.pink}></div>
                <div className={styles.white}></div>
              </div>
              <div className={styles.hair}>
                <div className={styles.inner_hair}></div>
              </div>
            </div>
            <div className={styles.neck}></div>
          </div>
          <div className={styles.body}>
            <div className={styles.main}></div>
            <div className={styles.tail}>
              <div className={styles.inner_tail}></div>
            </div>
          </div>
          <div className={styles.legs}>
            <div className={styles.leg}></div>
            <div className={styles.leg}></div>
            <div className={styles.leg}></div>
            <div className={styles.leg}></div>
          </div>
        </div>
      </div>
      
      <div className={styles.rainbow_container}>
        <div className={styles.rainbow}></div>
      </div>
    </div>
  );
}