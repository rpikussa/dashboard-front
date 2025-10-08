# Guia de Configuração com Variáveis Vite

## ✅ Implementação Concluída

Sua aplicação Vue.js agora usa um sistema centralizado de configuração baseado em **variáveis Vite**, adequado para aplicações estáticas hospedadas no S3.

## 📁 Arquivos Criados/Modificados

### Novo Serviço de Configuração
- `src/services/config.js` - Serviço centralizado de configuração

### Arquivos Atualizados
- `src/services/api.js` - Agora usa configService
- `src/services/authService.js` - Melhorias de logging e configuração
- `src/stores/auth.js` - Logs de debug em desenvolvimento
- `src/App.vue` - Configuração de título dinâmico
- `src/views/DashboardView.vue` - Debug info e configurações
- `src/views/LoginView.vue` - Título dinâmico
- `src/views/RegisterView.vue` - Logs de debug
- `src/components/HeaderBar.vue` - Configurações centralizadas
- `.env.development` - Configurações completas

## 🔧 Como Usar as Configurações

### 1. **Em componentes Vue**
```javascript
import { configService } from '@/services/config'

// Obter configurações específicas
const apiUrl = configService.getApiUrl()
const appTitle = configService.getAppTitle()
const isProduction = configService.isProduction()

// Verificar ambiente
if (configService.isDevelopment()) {
  console.log('Modo de desenvolvimento ativo')
}
```

### 2. **Variáveis disponíveis**
```javascript
// API
configService.getApiUrl()           // URL da API
configService.getApiTimeout()       // Timeout das requisições

// Aplicação  
configService.getAppTitle()         // Título da aplicação
configService.getAppVersion()       // Versão da aplicação
configService.getBaseUrl()          // Base URL

// Ambiente
configService.getEnvironment()      // Ambiente atual
configService.isDevelopment()       // Se é desenvolvimento
configService.isProduction()        // Se é produção
configService.isStaging()           // Se é staging

// Configuração geral
configService.get('VITE_CUSTOM')    // Qualquer variável personalizada
configService.getAll()              // Todas as configurações
```

### 3. **Adicionando novas variáveis**

**Passo 1:** Adicionar no arquivo `.env`
```bash
# .env.development (copie de .env.example)
VITE_NEW_FEATURE=enabled

# .env.production  
VITE_NEW_FEATURE=disabled
```

**Passo 2:** Atualizar o `configService` (opcional)
```javascript
// src/services/config.js
getNewFeature() {
  return this.config.NEW_FEATURE === 'enabled'
}
```

**Passo 3:** Usar na aplicação
```javascript
const isNewFeatureEnabled = configService.get('NEW_FEATURE') === 'enabled'
// ou
const isNewFeatureEnabled = configService.getNewFeature()
```

## 📂 Estrutura de Arquivos de Ambiente

```
├── .env.example             # Template consolidado para todos os ambientes
├── .env.production          # Produção (S3/CloudFront)
├── .env.development         # Desenvolvimento local  
└── .env.staging            # (opcional) Ambiente de staging
```

### Como Configurar um Novo Ambiente

1. **Copie o arquivo template:**
   ```bash
   cp .env.example .env.development
   ```

2. **Edite as configurações:**
   ```bash
   # .env.development
   VITE_API_URL=http://localhost:3000
   VITE_APP_TITLE="Dashboard Admin (Dev)"
   VITE_ENVIRONMENT=development
   VITE_DEBUG_MODE=true
   ```

## 🔍 Debug e Desenvolvimento

### Logs Automáticos
Em modo desenvolvimento, você verá logs automáticos no console:
- 🚀 Inicialização da aplicação
- 🔗 Configuração da API
- 📤/📥 Requisições e respostas da API
- 🔐 Operações de autenticação
- 🔧 Informações de debug no Dashboard

### Debug Info no Dashboard
No ambiente de desenvolvimento, o Dashboard mostra uma seção de debug com:
- Ambiente atual
- Versão da aplicação
- URL da API
- Modo do Vite

## ⚡ Benefícios da Implementação

### ✅ Para Aplicações Estáticas
- **Configuração em build-time**: Variáveis incorporadas durante o build
- **Compatível com S3**: Não requer servidor para ler configurações
- **Cache otimizado**: Configurações ficam no bundle otimizado
- **Segurança**: Apenas variáveis com prefixo `VITE_` são expostas

### ✅ Para Desenvolvimento
- **Logs inteligentes**: Apenas em desenvolvimento
- **Debug info**: Informações técnicas visíveis
- **Flexibilidade**: Diferentes configurações por ambiente
- **Facilidade**: Configuração centralizada e tipada

### ✅ Para Deploy
- **CI/CD compatível**: Variáveis definidas no GitHub Actions
- **Multi-ambiente**: development, staging, production
- **Build único**: Mesma base de código, configuração diferente
- **Validação**: Configurações obrigatórias são validadas

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Usa .env.development

# Build para produção  
npm run build            # Usa .env.production

# Preview do build
npm run preview          # Testa build localmente

# Debug de configuração
# (veja logs no console do browser em desenvolvimento)
```

## 🔒 Segurança

### ⚠️ Variáveis Expostas
- Todas as variáveis `VITE_*` ficam **visíveis no bundle**
- **Nunca** coloque senhas, chaves secretas ou tokens
- Use apenas configurações públicas (URLs, títulos, flags)

### ✅ Configurações Seguras
```bash
# ✅ Seguro - configurações públicas
VITE_API_URL=https://api.exemplo.com
VITE_APP_TITLE=Minha App
VITE_ENVIRONMENT=production

# ❌ NUNCA faça isso
VITE_SECRET_KEY=abc123        # Ficará visível no bundle!
VITE_DATABASE_PASSWORD=xyz    # Ficará visível no bundle!
```

## 📖 Exemplos Práticos

### Configuração Condicional por Ambiente
```javascript
// Comportamento diferente por ambiente
if (configService.isProduction()) {
  // Desabilitar logs em produção
  console.log = () => {}
} else {
  // Logs verbosos em desenvolvimento
  console.log('🔧 Debug mode ativo')
}

// Timeout da API baseado no ambiente
const timeout = configService.isProduction() ? 5000 : 10000
```

### Feature Flags
```javascript
// .env.development
VITE_FEATURE_CHARTS=enabled
VITE_FEATURE_ADVANCED_AUTH=disabled

// .env.production  
VITE_FEATURE_CHARTS=enabled
VITE_FEATURE_ADVANCED_AUTH=enabled

// No código
const showCharts = configService.get('FEATURE_CHARTS') === 'enabled'
const hasAdvancedAuth = configService.get('FEATURE_ADVANCED_AUTH') === 'enabled'
```

### URLs Dinâmicas
```javascript
// Diferentes APIs por ambiente
// .env.development
VITE_API_URL=http://localhost:3000

// .env.staging
VITE_API_URL=https://api-staging.exemplo.com

// .env.production
VITE_API_URL=https://c10rgiry67.execute-api.us-east-1.amazonaws.com/prod
```

## 🎯 Próximos Passos

1. **Teste a aplicação**: Abra `http://localhost:8080` e verifique os logs no console
2. **Adicione configurações**: Customize conforme suas necessidades
3. **Deploy**: As configurações funcionam automaticamente no pipeline de CI/CD
4. **Monitor**: Use os logs para debug e monitoramento

---

**✨ Implementação concluída com sucesso!** Sua aplicação agora usa configurações robustas e adequadas para aplicações estáticas no S3.