#ifndef ENIGMA_H
#define ENIGMA_H

#include "rotor.h"
#include "plugboard.h"
#include "reflector.h"
#include <string>
#include <vector>
#include <utility>

class Enigma {
private:
    Rotor r1; // Left (Rotor I)
    Rotor r2; // Middle (Rotor II)
    Rotor r3; // Right (Rotor III)
    Plugboard plugboard;
    Reflector reflector;

public:
    Enigma();
    
    void setRotorPositions(int p1, int p2, int p3);
    void setPlugboardPairs(const std::vector<std::pair<char, char>>& pairs);
    
    int getRotor1Position() const;
    int getRotor2Position() const;
    int getRotor3Position() const;
    
    char encrypt(char c);
    std::string encryptString(const std::string& text);
};

#endif // ENIGMA_H
