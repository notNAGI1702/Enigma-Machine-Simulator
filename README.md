# Enigma Machine Simulator

An interactive, high-fidelity WebAssembly-powered Enigma Machine M3 simulator. This simulator features an authentic WW2 aesthetic (Bakelite brown and crackle black chassis) and emulates the stateful rotor offsets, key-by-key stepping mechanics, double-stepping anomaly, and plugboard wire connections of the historical hardware.

## Tech Stack
* **Logic Core:** C++
* **Compilation Target:** WebAssembly (WASM) via Emscripten
* **User Interface:** React, TypeScript, and CSS Modules (Vanilla CSS)
* **Icons:** Lucide React

## Prerequisites
To compile and build this project locally, you will need:
* **Node.js** (v18+)
* **Emscripten (emsdk)** (v3.0+ to compile the C++ logic to WebAssembly)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/notNAGI1702/Enigma-Machine-Simulator.git
   cd Enigma-Machine-Simulator
   ```

2. **Initialize the Emscripten SDK:**
   ```bash
   # Source your local emsdk installation environment
   source /path/to/emsdk/emsdk_env.sh
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Compile the WebAssembly module:**
   ```bash
   npm run build:wasm
   ```

5. **Start the local development server:**
   ```bash
   npm run dev
   ```

## How It Works
1. **C++ Cryptographic Core:** The rotor stepping (including double-stepping), plugboard letter-swapping, and reflector mapping are implemented in pure C++ logic files.
2. **WASM Compilation:** The C++ source is compiled using `em++` with Emscripten Bindings (`bindings.cpp`). On initialization, the compiled WebAssembly code executes a self-test to verify cryptographic symmetry.
3. **TypeScript Integration:** React loads the compiled WASM module and passes keyboard configurations to the C++ core. When a key is typed or a string is modified, the C++ code performs the state changes and returns the results.
4. **Display Synchronization:** Rather than calculating position shifts in React, the frontend calls `getRotorPositions()` immediately following each operation. It uses the returned offsets purely to render the display bulbs.

## Screenshot
![App Screenshot](screenshot.png)

## License
MIT
