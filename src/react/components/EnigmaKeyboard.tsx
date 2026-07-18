import React, { useEffect, useState, useRef } from 'react';
import styles from './EnigmaKeyboard.module.css';

interface EnigmaKeyboardProps {
  onKeyPressStart: (char: string) => void;
  onKeyPressEnd: (char: string) => void;
  disabled?: boolean;
}

export const EnigmaKeyboard: React.FC<EnigmaKeyboardProps> = ({
  onKeyPressStart,
  onKeyPressEnd,
  disabled = false,
}) => {
  const rows = [
    'QWERTYUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    'ZXCVBNM'.split(''),
  ];

  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const pressedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      
      const char = e.key.toUpperCase();
      if (char.length === 1 && char >= 'A' && char <= 'Z') {
        e.preventDefault();
        if (pressedKeysRef.current.has(char)) return;
        
        pressedKeysRef.current.add(char);
        setActiveKeys(new Set(pressedKeysRef.current));
        onKeyPressStart(char);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const char = e.key.toUpperCase();
      if (pressedKeysRef.current.has(char)) {
        pressedKeysRef.current.delete(char);
        setActiveKeys(new Set(pressedKeysRef.current));
        onKeyPressEnd(char);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyPressStart, onKeyPressEnd, disabled]);

  const handleMouseDown = (char: string) => {
    if (disabled) return;
    if (pressedKeysRef.current.has(char)) return;
    
    pressedKeysRef.current.add(char);
    setActiveKeys(new Set(pressedKeysRef.current));
    onKeyPressStart(char);
  };

  const handleMouseUp = (char: string) => {
    if (pressedKeysRef.current.has(char)) {
      pressedKeysRef.current.delete(char);
      setActiveKeys(new Set(pressedKeysRef.current));
      onKeyPressEnd(char);
    }
  };

  return (
    <div className={styles.keyboard}>
      <h2 className={styles.title}>Keyboard</h2>
      <div className={styles.keyboardLayout}>
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className={styles.row}>
            {row.map((char) => {
              const isPressed = activeKeys.has(char);
              return (
                <button
                  key={char}
                  className={`${styles.key} ${isPressed ? styles.keyPressed : ''}`}
                  onMouseDown={() => handleMouseDown(char)}
                  onMouseUp={() => handleMouseUp(char)}
                  onMouseLeave={() => handleMouseUp(char)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleMouseDown(char);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleMouseUp(char);
                  }}
                >
                  {char}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
