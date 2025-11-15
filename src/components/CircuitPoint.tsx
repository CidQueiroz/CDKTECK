import React from 'react';
import styles from './CircuitPoint.module.css';

interface CircuitPointProps {
  id: string;
  title: string;
  top: string;
  left: string;
  emoji: string;
  onClick: () => void;
}

const CircuitPoint: React.FC<CircuitPointProps> = ({ id, title, top, left, emoji, onClick }) => {
  return (
    <div
      id={id}
      className={styles.circuit_point}
      title={title}
      style={{ top, left, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
      role="button"
      aria-label={title}
    >
      {emoji}
    </div>
  );
};

export default CircuitPoint;
