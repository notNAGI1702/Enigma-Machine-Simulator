#include "enigma.h"
#include <cctype>

Enigma::Enigma() 
    : r1("EKMFLGDQVZNTOWYHXUSPAIBRCJ", 16), // Rotor I, notch Q (16)
      r2("AJDKSIRUXBLHWTMCQGZNPYFVOE", 4),  // Rotor II, notch E (4)
      r3("BDFHJLCPRTXVZNYEIWGAKMUSQO", 21), // Rotor III, notch V (21)
      plugboard(),
      reflector("YRUHQSLDPXNGOKMIEBFZCWVJAT") // Reflector B
{}

void Enigma::setRotorPositions(int p1, int p2, int p3) {
    r1.setPosition(p1);
    r2.setPosition(p2);
    r3.setPosition(p3);
}


void Enigma::setPlugboardPairs(const std::vector<std::pair<char, char>>& pairs) {
    plugboard.setPairs(pairs);
}

int Enigma::getRotor1Position() const { return r1.getPosition(); }
int Enigma::getRotor2Position() const { return r2.getPosition(); }
int Enigma::getRotor3Position() const { return r3.getPosition(); }

char Enigma::encrypt(char c) {
    if (isalpha(c)) {
        bool is_lower = islower(c);
        char upper_c = toupper(c);
        
        bool step1 = (r2.getPosition() == r2.getNotch());
        bool step2 = (r2.getPosition() == r2.getNotch()) || (r3.getPosition() == r3.getNotch());
        bool step3 = true;
        
        if (step1) r1.stepForward();
        if (step2) r2.stepForward();
        if (step3) r3.stepForward();
        
        int signal = upper_c - 'A';
        signal = plugboard.encode(signal);
        signal = r3.encodeForward(signal);
        signal = r2.encodeForward(signal);
        signal = r1.encodeForward(signal);
        signal = reflector.encode(signal);
        signal = r1.encodeBackward(signal);
        signal = r2.encodeBackward(signal);
        signal = r3.encodeBackward(signal);
        signal = plugboard.encode(signal);
        
        char res = signal + 'A';
        return is_lower ? tolower(res) : res;
    }
    return c;
}

std::string Enigma::encryptString(const std::string& text) {
    std::string result = "";
    for (char c : text) {
        result += encrypt(c);
    }
    return result;
}
