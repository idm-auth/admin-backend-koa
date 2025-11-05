#!/bin/bash

# Script para executar coverage com output limitado
# Uso: ./scripts/coverage-limited.sh [arquivo-teste-opcional]

set -e

echo "Executando coverage com output limitado..."

if [ $# -eq 0 ]; then
    # Coverage geral
    npm run test:coverage 2>&1 | tail -100
else
    # Coverage para arquivo específico
    npx vitest run --coverage "$1" 2>&1 | tail -100
fi

echo ""
echo "Coverage executado com sucesso. Output limitado a 100 linhas."