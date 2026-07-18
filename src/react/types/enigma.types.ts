export interface RotorConfig {
  position: number;
}

export interface EnigmaConfig {
  rotors: [RotorConfig, RotorConfig, RotorConfig];
  plugboard: [string, string][];
}

export interface EnigmaModule {
  encode: (plaintext: string, configJson: string) => string;
  decode: (ciphertext: string, configJson: string) => string;
  getRotorPositions: () => string;
}
