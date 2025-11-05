#!/bin/bash

# Script para mostrar apenas o resumo do coverage
# Uso: ./scripts/coverage-summary.sh

set -e

echo "Gerando resumo de coverage..."

# Executa coverage e filtra apenas as linhas importantes
npm run test:coverage 2>/dev/null | grep -E "(File|All files|---|%)" | tail -20

echo ""
echo "Resumo de coverage gerado."