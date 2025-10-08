# Scripts do Dashboard Frontend

Esta pasta contém scripts utilitários para configuração e verificação do projeto.

## Scripts Disponíveis

### 🔧 `setup-s3-cloudfront.sh`
**Descrição**: Script de setup automatizado para infraestrutura AWS S3 + CloudFront

**Uso**:
```bash
./scripts/setup-s3-cloudfront.sh
# ou
npm run aws:setup
```

**O que faz**:
- Cria bucket S3 para hosting estático
- Configura CloudFront para CDN global
- Otimiza cache para aplicações Vue.js SPA
- Gera saída com URLs e IDs para CI/CD

### 🔍 `verify-api-config.sh`
**Descrição**: Script de verificação da configuração da API do backend

**Uso**:
```bash
./scripts/verify-api-config.sh
# ou
npm run aws:verify
```

**O que faz**:
- Verifica arquivos `.env.production` e `.env.development`
- Testa conectividade com a API Gateway
- Valida se o build contém a URL correta da API
- Exibe status geral da configuração

## Scripts Disponíveis via npm

Você pode executar os scripts através do npm para maior conveniência:

```bash
# Setup da infraestrutura AWS
npm run aws:setup

# Verificação da configuração da API
npm run aws:verify

# Build de produção
npm run build

# Desenvolvimento local
npm run dev
```

## Estrutura de Configuração

### Ambientes
- **Desenvolvimento**: API local em `http://localhost:3000`
- **Produção**: API Gateway real descoberta automaticamente

### Arquivos de Configuração
- `.env.development` - Configurações para desenvolvimento local
- `.env.production` - Configurações para produção (API Gateway real)

### Verificação de Status
Execute `npm run aws:verify` para ver o status completo da configuração:

- ✅ Arquivos de configuração
- ✅ Conectividade da API
- ✅ Build de produção
- ✅ Pronto para deploy

## Solução de Problemas

### API não acessível
Se o script de verificação mostrar que a API não está acessível:
1. Verifique se a API Gateway está deployada
2. Confirme se as funções Lambda estão ativas
3. Verifique configurações de CORS

### Build não contém URL da API
Se a URL da API não estiver no build:
1. Execute `npm run build` novamente
2. Verifique se `.env.production` está correto
3. Confirme se as variáveis `VITE_*` estão sendo aplicadas

### Permissões AWS
Os scripts requerem permissões AWS para:
- S3 (criar buckets, configurar hosting)
- CloudFront (criar distribuições)
- API Gateway (listar recursos)

---

**📁 Localização**: `/scripts/`  
**🔄 Última atualização**: Configuração da API aplicada automaticamente