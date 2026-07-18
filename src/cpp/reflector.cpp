#include "reflector.h"

Reflector::Reflector(const std::string& wiringStr) : wiring(wiringStr) {}

int Reflector::encode(int signal) const {
    if (signal >= 0 && signal < 26) {
        return wiring[signal] - 'A';
    }
    return signal;
}
