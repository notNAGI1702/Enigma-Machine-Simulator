#ifndef ROTOR_H
#define ROTOR_H

#include <string>

class Rotor {
private:
    std::string wiring;
    int notch;
    int offset;

public:
    Rotor(const std::string& wiringStr, int notchPos);
    
    void setPosition(int pos);
    
    int getPosition() const;
    int getNotch() const;
    
    void stepForward();
    
    int encodeForward(int signal) const;
    int encodeBackward(int signal) const;
};

#endif // ROTOR_H
