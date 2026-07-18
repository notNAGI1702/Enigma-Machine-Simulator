import React, { useState } from 'react';
import { useEnigma } from './hooks/useEnigma';
import type { EnigmaConfig } from './types/enigma.types';
import { RotorPanel } from './components/RotorPanel';
import { PlugboardPanel } from './components/PlugboardPanel';
import { LampBoard } from './components/LampBoard';
import { EnigmaKeyboard } from './components/EnigmaKeyboard';
import { ConfigBar } from './components/ConfigBar';
import styles from './App.module.css';

const DEFAULT_CONFIG: EnigmaConfig = {
  rotors: [
    { position: 0 }, // Rotor I (Left)
    { position: 0 }, // Rotor II (Middle)
    { position: 0 }, // Rotor III (Right)
  ],
  plugboard: [],
};

export const App: React.FC = () => {
  const { encode, decode, ready } = useEnigma();

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [enigmaConfig, setEnigmaConfig] = useState<EnigmaConfig>(DEFAULT_CONFIG);
  
  const [currentPositions, setCurrentPositions] = useState({
    r1: DEFAULT_CONFIG.rotors[0].position,
    r2: DEFAULT_CONFIG.rotors[1].position,
    r3: DEFAULT_CONFIG.rotors[2].position,
  });

  const [activeLamp, setActiveLamp] = useState<string | null>(null);

  const handleConfigChange = (newConfig: EnigmaConfig) => {
    setEnigmaConfig(newConfig);
    
    const newStartPos = {
      r1: newConfig.rotors[0].position,
      r2: newConfig.rotors[1].position,
      r3: newConfig.rotors[2].position,
    };
    setCurrentPositions(newStartPos);

    if (mode === 'encode') {
      if (plaintext) {
        const res = encode(plaintext, newConfig);
        setCiphertext(res.ciphertext);
        setCurrentPositions(res.finalPositions);
      }
    } else {
      if (ciphertext) {
        const res = decode(ciphertext, newConfig);
        setPlaintext(res.plaintext);
        setCurrentPositions(res.finalPositions);
      }
    }
  };

  const handleKeyPressStart = (char: string) => {
    const activeConfig: EnigmaConfig = {
      ...enigmaConfig,
      rotors: [
        { position: currentPositions.r1 },
        { position: currentPositions.r2 },
        { position: currentPositions.r3 },
      ],
    };

    if (mode === 'encode') {
      const res = encode(char, activeConfig);
      setPlaintext((prev) => prev + char);
      setCiphertext((prev) => prev + res.ciphertext);
      setCurrentPositions(res.finalPositions);
      setActiveLamp(res.ciphertext);
    } else {
      const res = decode(char, activeConfig);
      setCiphertext((prev) => prev + char);
      setPlaintext((prev) => prev + res.plaintext);
      setCurrentPositions(res.finalPositions);
      setActiveLamp(res.plaintext);
    }
  };

  const handleKeyPressEnd = () => {
    setActiveLamp(null);
  };

  const handlePlaintextChange = (val: string) => {
    setPlaintext(val);
    if (!val) {
      setCiphertext('');
      setCurrentPositions({
        r1: enigmaConfig.rotors[0].position,
        r2: enigmaConfig.rotors[1].position,
        r3: enigmaConfig.rotors[2].position,
      });
      return;
    }
    const res = encode(val, enigmaConfig);
    setCiphertext(res.ciphertext);
    setCurrentPositions(res.finalPositions);
  };

  const handleCiphertextChange = (val: string) => {
    setCiphertext(val);
    if (!val) {
      setPlaintext('');
      setCurrentPositions({
        r1: enigmaConfig.rotors[0].position,
        r2: enigmaConfig.rotors[1].position,
        r3: enigmaConfig.rotors[2].position,
      });
      return;
    }
    const res = decode(val, enigmaConfig);
    setPlaintext(res.plaintext);
    setCurrentPositions(res.finalPositions);
  };

  const handleReset = () => {
    setPlaintext('');
    setCiphertext('');
    setCurrentPositions({
      r1: enigmaConfig.rotors[0].position,
      r2: enigmaConfig.rotors[1].position,
      r3: enigmaConfig.rotors[2].position,
    });
    setActiveLamp(null);
  };

  const toggleMode = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    handleReset();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Enigma Machine</h1>
        <div className={styles.subtitle}>M3 WASM Simulator</div>
        <div className={styles.wasmStatus}>
          {ready ? (
            <span className={styles.statusReady}>Engine: Operational (WASM)</span>
          ) : (
            <span className={styles.statusLoading}>Engine: Booting...</span>
          )}
        </div>
      </header>

      {/* Structured Machine Grid */}
      <div className={styles.machineGrid}>
        
        {/* Row 1: Rotor settings (25%) & Plugboard (75%) */}
        <div className={styles.row1}>
          <RotorPanel
            config={enigmaConfig}
            currentPositions={currentPositions}
            onChange={handleConfigChange}
          />
          <PlugboardPanel
            config={enigmaConfig}
            onChange={handleConfigChange}
          />
        </div>

        {/* Row 2: Lampboard (left) & Keyboard (right) */}
        <div className={styles.row2}>
          <LampBoard activeLetter={activeLamp} />
          <EnigmaKeyboard
            onKeyPressStart={handleKeyPressStart}
            onKeyPressEnd={handleKeyPressEnd}
            disabled={!ready}
          />
        </div>

        {/* Row 3: Operations & Configuration */}
        <div className={styles.row3}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Operations</h2>
            
            <div className={styles.toggleContainer}>
              <button
                className={`${styles.toggleButton} ${mode === 'encode' ? styles.toggleButtonActive : ''}`}
                onClick={() => toggleMode('encode')}
              >
                Encode
              </button>
              <button
                className={`${styles.toggleButton} ${mode === 'decode' ? styles.toggleButtonActive : ''}`}
                onClick={() => toggleMode('decode')}
              >
                Decode
              </button>
            </div>

            <div className={styles.textAreasContainer}>
              <div className={styles.textAreaGroup}>
                <label className={styles.textAreaLabel}>Plaintext</label>
                <textarea
                  className={styles.textArea}
                  value={plaintext}
                  onChange={(e) => handlePlaintextChange(e.target.value)}
                  readOnly={mode === 'decode'}
                  placeholder={mode === 'decode' ? 'Decrypted output will appear here...' : 'Type or paste plaintext...'}
                />
              </div>

              <div className={styles.textAreaGroup}>
                <label className={styles.textAreaLabel}>Ciphertext</label>
                <textarea
                  className={styles.textArea}
                  value={ciphertext}
                  onChange={(e) => handleCiphertextChange(e.target.value)}
                  readOnly={mode === 'encode'}
                  placeholder={mode === 'encode' ? 'Encrypted output will appear here...' : 'Type or paste ciphertext...'}
                />
              </div>
            </div>

            <button className={styles.actionButton} onClick={handleReset}>
              Reset Machine
            </button>
          </div>

          <ConfigBar config={enigmaConfig} onChange={handleConfigChange} />
        </div>

      </div>
    </div>
  );
};
