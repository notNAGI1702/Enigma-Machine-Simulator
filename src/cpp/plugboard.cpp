#include "plugboard.h"

Plugboard::Plugboard() {
    clear();
}

void Plugboard::clear() {
    for (int i = 0; i < 26; ++i) {
        mapping[i] = i;
    }
}

void Plugboard::setPairs(const std::vector<std::pair<char, char>>& pairs) {
    clear();
    for (const auto& pair : pairs) {
        int u = pair.first - 'A';
        int v = pair.second - 'A';
        if (u >= 0 && u < 26 && v >= 0 && v < 26) {
            mapping[u] = v;
            mapping[v] = u;
        }
    }
}

int Plugboard::encode(int signal) const {
    if (signal >= 0 && signal < 26) {
        return mapping[signal];
    }
    return signal;
}
