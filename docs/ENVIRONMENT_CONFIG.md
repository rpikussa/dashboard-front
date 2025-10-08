# Configuração de Variáveis de Ambiente

Este documento explica como configurar e usar variáveis de ambiente no projeto Dashboard Frontend.

## Arquivos de Ambiente

### `.env.development`
Usado durante o desenvolvimento local:
```bash
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Dashboard Admin
```

### `.env.production`
Usado durante o build de produção:
```bash
VITE_API_URL=https://c10rgiry67.execute-api.us-east-1.amazonaws.com/prod
VITE_APP_TITLE=Dashboard Admin
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

## Scripts Disponíveis

### Build com Environment Específico
```bash
# Build para produção (carrega .env.production)
npm run build:production

# Build para desenvolvimento (carrega .env.development)
npm run build:development

# Build padrão (usa configuração automática do Vite)
npm run build
```

### Carregar Variáveis Manualmente
```bash
# Carrega variáveis de produção
npm run env:load production

# Carrega variáveis de desenvolvimento
npm run env:load development

# Ou usando o script diretamente
source ./scripts/load-env.sh production
```

## Funcionamento no CI/CD

O workflow do GitHub Actions (`deploy-s3-cloudfront.yml`) agora:

1. **Carrega automaticamente** as variáveis do arquivo `.env.production`
2. **Valida** se as variáveis foram carregadas corretamente
3. **Aplica** as variáveis durante o processo de build
4. **Verifica** se as variáveis estão presentes no build final
5. **Exibe** um resumo das configurações no deploy

### Variáveis Verificadas no Deploy

- `VITE_API_URL`: URL da API backend
- `VITE_APP_TITLE`: Título da aplicação
- `VITE_APP_VERSION`: Versão da aplicação
- `VITE_ENVIRONMENT`: Ambiente (production/development)

## Troubleshooting

### Variáveis não carregadas
Se as variáveis não estão sendo carregadas:

1. Verifique se o arquivo `.env.production` existe
2. Confirme que as variáveis começam com `VITE_`
3. Execute o script de verificação:
   ```bash
   npm run env:load production
   ```

### Build sem variáveis corretas
Se o build não está usando as variáveis:

1. Use o script específico: `npm run build:production`
2. Verifique os logs do build para confirmação
3. Execute o build local e compare com o CI/CD

### Fallback Values
Se o arquivo `.env.production` não for encontrado, o sistema usa valores padrão:

- `VITE_API_URL`: `https://c10rgiry67.execute-api.us-east-1.amazonaws.com/prod`
- `VITE_APP_TITLE`: `Dashboard Admin`
- `VITE_APP_VERSION`: `1.0.0`
- `VITE_ENVIRONMENT`: `production`

## Exemplo de Uso Local

```bash
# 1. Carregar variáveis de produção
source ./scripts/load-env.sh production

# 2. Verificar se foram carregadas
echo $VITE_API_URL

# 3. Fazer build com as variáveis
npm run build

# 4. Ou usar o comando combinado
npm run build:production
```

## Logs de Deploy

Durante o deploy, você verá logs similares a:
```
🔧 Loading environment variables from .env.production...
✅ VITE_API_URL=https://c10rgiry67.execute-api.us-east-1.amazonaws.com/prod
✅ VITE_APP_TITLE=Dashboard Admin
✅ VITE_APP_VERSION=1.0.0
✅ VITE_ENVIRONMENT=production

🔨 Building application with production environment...
📦 Build completed successfully!

🔧 Environment Configuration:
🔗 API URL: https://c10rgiry67.execute-api.us-east-1.amazonaws.com/prod
🏷️  App Title: Dashboard Admin
📋 App Version: 1.0.0
🌍 Environment: production
```