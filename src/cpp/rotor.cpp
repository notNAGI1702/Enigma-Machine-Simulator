#include "rotor.h"

Rotor::Rotor(const std::string& wiringStr, int notchPos) 
    : wiring(wiringStr), notch(notchPos), offset(0) {}

void Rotor::setPosition(int pos) {
    offset = (pos % 26 + 26) % 26;
}

int Rotor::getPosition() const {
    return offset;
}

int Rotor::getNotch() const {
    return notch;
}

void Rotor::stepForward() {
    offset = (offset + 1) % 26;
}

int Rotor::encodeForward(int signal) const {
    int shift = offset;
    int in_contact = (signal + shift) % 26;
    int out_contact = wiring[in_contact] - 'A';
    int result = (out_contact - shift + 26) % 26;
    return result;
}

int Rotor::encodeBackward(int signal) const {
    int shift = offset;
    int in_contact = (signal + shift) % 26;
    
    int out_contact = -1;
    for (int i = 0; i < 26; ++i) {
        if (wiring[i] - 'A' == in_contact) {
            out_contact = i;
            break;
        }
    }
    
    int result = (out_contact - shift + 26) % 26;
    return result;
}
