import React, { useState } from 'react';
import { Shuffle, Copy, Clipboard } from 'lucide-react';
import type { EnigmaConfig, RotorConfig } from '../types/enigma.types';
import styles from './ConfigBar.module.css';

interface ConfigBarProps {
  config: EnigmaConfig;
  onChange: (newConfig: EnigmaConfig) => void;
}

export const ConfigBar: React.FC<ConfigBarProps> = ({ config, onChange }) => {
  const [copied, setCopied] = useState(false);

  const handleRandomize = () => {
    // Randomize rotor positions (0 to 25)
    const newRotors = Array.from({ length: 3 }, () => ({
      position: Math.floor(Math.random() * 26),
    })) as [RotorConfig, RotorConfig, RotorConfig];

    // Randomize plugboard connections (6 to 10 pairs)
    const numPairs = Math.floor(Math.random() * 5) + 6; // 6 to 10
    const available = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const newPlugboard: [string, string][] = [];

    for (let i = 0; i < numPairs; i++) {
      if (available.length < 2) break;
      const idx1 = Math.floor(Math.random() * available.length);
      const [a] = available.splice(idx1, 1);
      const idx2 = Math.floor(Math.random() * available.length);
      const [b] = available.splice(idx2, 1);
      newPlugboard.push([a, b]);
    }

    onChange({
      rotors: newRotors,
      plugboard: newPlugboard,
    });
  };

  const handleCopy = async () => {
    try {
      const configStr = JSON.stringify(config);
      await navigator.clipboard.writeText(configStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy config: ', err);
      // Fallback
      alert('Config copied: ' + JSON.stringify(config));
    }
  };

  const handlePaste = () => {
    const input = prompt('Paste your Enigma configuration JSON string here:');
    if (!input) return;

    try {
      const parsed = JSON.parse(input);
      // Basic validation of config shape
      if (
        parsed &&
        Array.isArray(parsed.rotors) &&
        parsed.rotors.length === 3 &&
        Array.isArray(parsed.plugboard)
      ) {
        // Further validate elements
        const validRotors = parsed.rotors.every(
          (r: any) =>
            typeof r.position === 'number' &&
            r.position >= 0 &&
            r.position < 26
        );

        const validPlugboard = parsed.plugboard.every(
          (p: any) =>
            Array.isArray(p) &&
            p.length === 2 &&
            typeof p[0] === 'string' &&
            p[0].length === 1 &&
            typeof p[1] === 'string' &&
            p[1].length === 1
        );

        if (validRotors && validPlugboard) {
          onChange(parsed as EnigmaConfig);
        } else {
          alert('Invalid configuration format values. Positions must be 0-25 and plugboard must be character pairs.');
        }
      } else {
        alert('Invalid configuration structure. Must contain rotors (3 elements) and plugboard array.');
      }
    } catch (err) {
      alert('Failed to parse JSON configuration. Please ensure it is a valid JSON string.');
    }
  };

  return (
    <div className={styles.bar}>
      <button className={styles.button} onClick={handleRandomize} title="Randomize all positions and connections">
        <Shuffle className={styles.icon} />
        Randomize
      </button>

      <button className={styles.button} onClick={handleCopy} title="Copy configuration to clipboard">
        <Copy className={styles.icon} />
        Copy Config
      </button>

      <button className={styles.button} onClick={handlePaste} title="Paste configuration from clipboard">
        <Clipboard className={styles.icon} />
        Paste Config
      </button>

      {copied && <span className={styles.notification}>Config Copied!</span>}
    </div>
  );
};
