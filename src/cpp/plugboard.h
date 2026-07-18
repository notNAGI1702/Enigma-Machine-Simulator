#ifndef PLUGBOARD_H
#define PLUGBOARD_H

#include <vector>
#include <utility>

class Plugboard {
private:
    int mapping[26];

public:
    Plugboard();
    
    void clear();
    void setPairs(const std::vector<std::pair<char, char>>& pairs);
    int encode(int signal) const;
};

#endif // PLUGBOARD_H
