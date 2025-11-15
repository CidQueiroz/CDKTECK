'use client';

import React from 'react';
import styles from './unicorn.module.css';

export default function UnicornPage() {
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