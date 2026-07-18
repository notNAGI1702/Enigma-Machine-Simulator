import React from 'react';
import styles from './LampBoard.module.css';

interface LampBoardProps {
  activeLetter: string | null;
}

export const LampBoard: React.FC<LampBoardProps> = ({ activeLetter }) => {
  const rows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    'ZXCVBNM'.split(''),
  ];

  return (
    <div className={styles.board}>
      <h2 className={styles.title}>Lampboard</h2>
      <div className={styles.keyboardLayout}>
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className={styles.row}>
            {row.map((char) => {
              const isLit = activeLetter?.toUpperCase() === char;
              return (
                <div
                  key={char}
                  className={`${styles.lamp} ${isLit ? styles.lit : ''}`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
