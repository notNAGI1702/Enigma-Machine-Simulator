import React from 'react';
import type { EnigmaConfig } from '../types/enigma.types';
import styles from './RotorPanel.module.css';

interface RotorPanelProps {
  config: EnigmaConfig;
  currentPositions: { r1: number; r2: number; r3: number };
  onChange: (newConfig: EnigmaConfig) => void;
}

export const RotorPanel: React.FC<RotorPanelProps> = ({
  config,
  currentPositions,
  onChange,
}) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handlePositionChange = (index: number, val: number) => {
    const updatedRotors = [...config.rotors] as [
      { position: number },
      { position: number },
      { position: number }
    ];
    updatedRotors[index] = { ...updatedRotors[index], position: val };
    onChange({ ...config, rotors: updatedRotors });
  };

  const rotorLabels = ['I (Left)', 'II (Middle)', 'III (Right)'];
  const displayPositions = [currentPositions.r1, currentPositions.r2, currentPositions.r3];

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Rotor Settings</h2>
      <div className={styles.rotorsContainer}>
        {config.rotors.map((rotor, idx) => (
          <div key={idx} className={styles.rotor}>
            <span className={styles.label}>{rotorLabels[idx]}</span>
            
            {/* Position Selector */}
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>Start Pos</span>
              <select
                className={styles.select}
                value={rotor.position}
                onChange={(e) => handlePositionChange(idx, parseInt(e.target.value))}
              >
                {letters.map((char, i) => (
                  <option key={i} value={i}>
                    {char}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Position Indicator */}
            <span className={styles.controlLabel}>Current</span>
            <div className={styles.indicator}>
              {letters[displayPositions[idx]] ?? 'A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
