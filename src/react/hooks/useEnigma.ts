import { useEffect, useState } from 'react';
import type { EnigmaConfig, EnigmaModule } from '../types/enigma.types';

declare global {
  interface Window {
    createEnigmaModule: any;
  }
}

export function useEnigma() {
  const [module, setModule] = useState<EnigmaModule | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initWasm = async () => {
      try {
        if (window.createEnigmaModule) {
          const wasmModule = await window.createEnigmaModule();
          setModule(wasmModule);
          setReady(true);
        } else {
          let retries = 0;
          const interval = setInterval(async () => {
            retries++;
            if (window.createEnigmaModule) {
              clearInterval(interval);
              const wasmModule = await window.createEnigmaModule();
              setModule(wasmModule);
              setReady(true);
            } else if (retries > 50) {
              clearInterval(interval);
              console.error('Failed to load Enigma WASM module');
            }
          }, 100);
        }
      } catch (err) {
        console.error('Error initializing Enigma WASM:', err);
      }
    };

    initWasm();
  }, []);

  const encode = (plaintext: string, config: EnigmaConfig): { ciphertext: string; finalPositions: { r1: number; r2: number; r3: number } } => {
    if (!module || !ready) {
      // Default fallback
      const initialPos = {
        r1: config.rotors[0].position,
        r2: config.rotors[1].position,
        r3: config.rotors[2].position,
      };
      return { ciphertext: plaintext, finalPositions: initialPos };
    }
    const configJson = JSON.stringify(config);
    const ciphertext = module.encode(plaintext, configJson);
    const posStr = module.getRotorPositions();
    const finalPositions = JSON.parse(posStr);
    return { ciphertext, finalPositions };
  };

  const decode = (ciphertext: string, config: EnigmaConfig): { plaintext: string; finalPositions: { r1: number; r2: number; r3: number } } => {
    if (!module || !ready) {
      // Default fallback
      const initialPos = {
        r1: config.rotors[0].position,
        r2: config.rotors[1].position,
        r3: config.rotors[2].position,
      };
      return { plaintext: ciphertext, finalPositions: initialPos };
    }
    const configJson = JSON.stringify(config);
    const plaintext = module.decode(ciphertext, configJson);
    const posStr = module.getRotorPositions();
    const finalPositions = JSON.parse(posStr);
    return { plaintext, finalPositions };
  };

  return { encode, decode, ready };
}
