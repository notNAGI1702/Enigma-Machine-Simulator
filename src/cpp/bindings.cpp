#include <emscripten/bind.h>
#include <iostream>
#include <string>
#include <vector>
#include <utility>
#include <cctype>
#include <algorithm>
#include "enigma.h"

struct RotorConfig {
    int position;
};

struct AppConfig {
    std::vector<RotorConfig> rotors;
    std::vector<std::pair<char, char>> plugboard;
};

AppConfig parse_config(const std::string& json) {
    AppConfig config;
    
    // Parse rotors
    size_t search_pos = 0;
    for (int i = 0; i < 3; ++i) {
        size_t pos_idx = json.find("\"position\"", search_pos);
        if (pos_idx == std::string::npos) break;
        
        size_t colon_pos = json.find(":", pos_idx);
        int pos_val = 0;
        size_t idx = colon_pos + 1;
        while (idx < json.length() && (json[idx] == ' ' || json[idx] == '\t' || json[idx] == '\r' || json[idx] == '\n')) {
            idx++;
        }
        while (idx < json.length() && isdigit(json[idx])) {
            pos_val = pos_val * 10 + (json[idx] - '0');
            idx++;
        }
        
        config.rotors.push_back({pos_val});
        search_pos = pos_idx + 1;
    }
    
    // Parse plugboard
    size_t pb_start = json.find("\"plugboard\"");
    if (pb_start != std::string::npos) {
        size_t outer_bracket = json.find("[", pb_start);
        if (outer_bracket != std::string::npos) {
            size_t idx = outer_bracket + 1;
            int bracket_count = 1;
            while (idx < json.length() && bracket_count > 0) {
                if (json[idx] == '[') {
                    bracket_count++;
                    char c1 = '\0';
                    char c2 = '\0';
                    
                    while (idx < json.length() && json[idx] != ']' && json[idx] != '[') {
                        if (isupper(json[idx])) {
                            c1 = json[idx];
                            idx++;
                            break;
                        }
                        idx++;
                    }
                    while (idx < json.length() && json[idx] != ']' && json[idx] != '[') {
                        if (isupper(json[idx])) {
                            c2 = json[idx];
                            idx++;
                            break;
                        }
                        idx++;
                    }
                    if (c1 != '\0' && c2 != '\0') {
                        config.plugboard.push_back({c1, c2});
                    }
                    while (idx < json.length() && json[idx] != ']') {
                        idx++;
                    }
                    if (idx < json.length()) {
                        bracket_count--;
                    }
                } else if (json[idx] == ']') {
                    bracket_count--;
                }
                idx++;
            }
        }
    }
    
    return config;
}

static Enigma global_enigma;

void apply_config(const std::string& config_json) {
    AppConfig config = parse_config(config_json);
    if (config.rotors.size() == 3) {
        global_enigma.setRotorPositions(config.rotors[0].position, config.rotors[1].position, config.rotors[2].position);
    }
    global_enigma.setPlugboardPairs(config.plugboard);
}

std::string wasm_encode(std::string plaintext, std::string config_json) {
    apply_config(config_json);
    return global_enigma.encryptString(plaintext);
}

std::string wasm_decode(std::string ciphertext, std::string config_json) {
    apply_config(config_json);
    return global_enigma.encryptString(ciphertext);
}

std::string getRotorPositions() {
    int r1 = global_enigma.getRotor1Position();
    int r2 = global_enigma.getRotor2Position();
    int r3 = global_enigma.getRotor3Position();
    return "{\"r1\":" + std::to_string(r1) + ",\"r2\":" + std::to_string(r2) + ",\"r3\":" + std::to_string(r3) + "}";
}

EMSCRIPTEN_BINDINGS(enigma_module) {
    emscripten::function("encode", &wasm_encode);
    emscripten::function("decode", &wasm_decode);
    emscripten::function("getRotorPositions", &getRotorPositions);

    // Self-test
    std::string test_cfg = "{\"rotors\":[{\"position\":0},{\"position\":0},{\"position\":0}],\"plugboard\":[[\"A\",\"B\"],[\"C\",\"D\"]]}";
    std::string test_msg = "HELLOWORLD";
    std::string enc = wasm_encode(test_msg, test_cfg);
    std::string dec = wasm_decode(enc, test_cfg);
    if (dec == test_msg) {
        std::cout << "Enigma WASM Self-Test: PASS" << std::endl;
    } else {
        std::cout << "Enigma WASM Self-Test: FAIL" << std::endl;
    }
}
