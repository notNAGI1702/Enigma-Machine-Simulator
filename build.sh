#!/bin/bash
set -e

# Source Emscripten environment if em++ is not found
if ! command -v em++ &> /dev/null; then
    if [ -f "/Users/ronitsinghnagi/emsdk/emsdk_env.sh" ]; then
        echo "Sourcing emsdk_env.sh from /Users/ronitsinghnagi/emsdk/"
        source "/Users/ronitsinghnagi/emsdk/emsdk_env.sh"
    else
        echo "Error: em++ not found and /Users/ronitsinghnagi/emsdk/emsdk_env.sh does not exist."
        exit 1
    fi
fi

echo "Compiling WebAssembly module..."
em++ -O2 --bind \
  src/cpp/rotor.cpp \
  src/cpp/plugboard.cpp \
  src/cpp/reflector.cpp \
  src/cpp/enigma.cpp \
  src/cpp/bindings.cpp \
  -o public/enigma.js \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="createEnigmaModule" \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap"]' \
  -s ENVIRONMENT='web'

echo "Build complete! public/enigma.js and public/enigma.wasm generated."
