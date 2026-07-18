import React, { useState } from 'react';
import type { EnigmaConfig } from '../types/enigma.types';
import styles from './PlugboardPanel.module.css';

interface PlugboardPanelProps {
  config: EnigmaConfig;
  onChange: (newConfig: EnigmaConfig) => void;
}

export const PlugboardPanel: React.FC<PlugboardPanelProps> = ({ config, onChange }) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const getPairedLetter = (char: string): string | null => {
    for (const [a, b] of config.plugboard) {
      if (a === char) return b;
      if (b === char) return a;
    }
    return null;
  };

  const handleLetterClick = (char: string) => {
    const partner = getPairedLetter(char);

    if (partner) {
      const newPlugboard = config.plugboard.filter(([a, b]) => a !== char && b !== char);
      onChange({ ...config, plugboard: newPlugboard });
      if (selectedLetter === char) {
        setSelectedLetter(null);
      }
    } else {
      if (selectedLetter) {
        if (selectedLetter === char) {
          setSelectedLetter(null);
        } else {
          if (config.plugboard.length >= 10) {
            setSelectedLetter(null);
            return;
          }
          const newPlugboard = [...config.plugboard, [selectedLetter, char] as [string, string]];
          onChange({ ...config, plugboard: newPlugboard });
          setSelectedLetter(null);
        }
      } else {
        setSelectedLetter(char);
      }
    }
  };

  const clearPlugboard = () => {
    setSelectedLetter(null);
    onChange({ ...config, plugboard: [] });
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Plugboard</h2>
      <div className={styles.grid}>
        {letters.map((char) => {
          const partner = getPairedLetter(char);
          const isSelected = selectedLetter === char;
          const isPaired = partner !== null;

          let btnClass = styles.letterButton;
          if (isSelected) btnClass += ` ${styles.selected}`;
          else if (isPaired) btnClass += ` ${styles.paired}`;

          return (
            <button
              key={char}
              className={btnClass}
              onClick={() => handleLetterClick(char)}
            >
              {char}
              {isPaired && <span className={styles.pairPartner}>{partner}</span>}
            </button>
          );
        })}
      </div>

      <div className={styles.infoSection}>
        <div className={styles.pairsTitle}>Active Connections</div>
        <div className={styles.pairsList}>
          {config.plugboard.length === 0 ? (
            <span style={{ color: 'var(--color-brass)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              No connections
            </span>
          ) : (
            config.plugboard.map(([a, b], idx) => (
              <span key={idx}>
                {a}↔{b}
              </span>
            ))
          )}
        </div>
        <button className={styles.clearButton} onClick={clearPlugboard}>
          Clear All Connections
        </button>
      </div>
    </div>
  );
};
