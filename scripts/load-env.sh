#!/bin/bash

# Script para carregar variáveis de ambiente do projeto
# Uso: source ./scripts/load-env.sh [environment]
# Exemplo: source ./scripts/load-env.sh production

set -e

ENVIRONMENT=${1:-production}
ENV_FILE=".env.${ENVIRONMENT}"

echo "🔧 Loading environment variables from ${ENV_FILE}..."

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Environment file $ENV_FILE not found!"
    echo "Available environment files:"
    ls -la .env* 2>/dev/null || echo "No .env files found"
    exit 1
fi

# Load variables from the environment file
echo "📋 Loading variables from $ENV_FILE:"
while IFS= read -r line || [ -n "$line" ]; do
    # Skip empty lines and comments
    if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
        continue
    fi
    
    # Export the variable
    if [[ "$line" =~ ^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
        var_name="${BASH_REMATCH[1]}"
        var_value="${BASH_REMATCH[2]}"
        
        # Remove quotes if present
        var_value=$(echo "$var_value" | sed 's/^["'\'']\|["'\'']$//g')
        
        export "$var_name"="$var_value"
        echo "✅ $var_name=$var_value"
    fi
done < "$ENV_FILE"

echo ""
echo "🔍 Environment variables loaded for ${ENVIRONMENT}:"
echo "VITE_API_URL=${VITE_API_URL:-'not set'}"
echo "VITE_APP_TITLE=${VITE_APP_TITLE:-'not set'}"
echo "VITE_APP_VERSION=${VITE_APP_VERSION:-'not set'}"
echo "VITE_ENVIRONMENT=${VITE_ENVIRONMENT:-'not set'}"
echo ""
echo "✅ Environment variables loaded successfully!"