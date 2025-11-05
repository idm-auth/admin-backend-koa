#!/bin/bash

# Script para executar testes com output limitado
# Uso: ./scripts/test-limited.sh [arquivo-teste-opcional]

set -e

if [ $# -eq 0 ]; then
    echo "Executando todos os testes com output limitado..."
    npm test 2>&1 | tail -50
else
    echo "Executando teste específico: $1"
    npm test "$1" 2>&1 | tail -50
fi

echo ""
echo "Testes executados. Output limitado a 50 linhas."