#ifndef REFLECTOR_H
#define REFLECTOR_H

#include <string>

class Reflector {
private:
    std::string wiring;

public:
    Reflector(const std::string& wiringStr);
    int encode(int signal) const;
};

#endif // REFLECTOR_H
