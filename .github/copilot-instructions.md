# Copilot Instructions for AI Agents - Frontend Vue.js

## Visão Geral do Projeto
- SPA (Single Page Application) Vue.js 3 com Vite 7, Element Plus para UI
- Aplicação companion: backend API (`dashboard-auth`) fornece autenticação
- **Arquitetura de Deploy**: Migrado de ECS Fargate → **S3 + CloudFront** (75-85% economia de custos)
- **Estrutura**: `src/views/` (páginas), `src/components/` (componentes reutilizáveis), `src/stores/` (Pinia), `src/services/` (API calls), `src/router/` (Vue Router)
- **Deployment**: Infraestrutura automática via GitHub Actions

## Rotas e Navegação
- `/` → redireciona para `/dashboard`
- `/login` → página de login (só acesso sem autenticação)
- `/register` → página de registro (só acesso sem autenticação)
- `/dashboard` → página principal (requer autenticação)
- Router guards: `requiresAuth` e `requiresGuest` em `src/router/index.js`

## Fluxo de Autenticação
- Login → `authService.login()` → salva JWT em cookie `auth_token` (30 min)
- Logout → `authService.logout()` → remove cookie + redirect para `/login`
- Guards automáticos: 401 da API → logout automático
- Store Pinia (`useAuthStore`) gerencia estado de autenticação global

## Integração com Backend API
- API base: `http://localhost:3000` (configurável via `VITE_API_URL`)
- Proxy Vite: `/api/*` → `localhost:3000` para desenvolvimento
- Axios interceptors em `src/services/api.js`:
  - Request: adiciona `Authorization: Bearer <token>` automaticamente
  - Response: 401 → logout automático
- **Produção**: CORS configurado para aceitar CloudFront URL

## Convenções e Padrões
- Use Composition API (`<script setup>`) em novos componentes
- Centralize chamadas da API em `src/services/`
- Use Pinia stores para estado global (auth, etc.)
- Componentes em PascalCase, arquivos em PascalCase também
- Use alias `@/` para `src/` (configurado no Vite)
- Element Plus para componentes UI (el-form, el-button, etc.)

## Estrutura de Serviços
- `src/services/api.js`: configuração Axios + interceptors
- `src/services/authService.js`: métodos de autenticação
  - `login(email, password)` → retorna `{ success, data/message }`
  - `register(userData)` → retorna `{ success, data/message }`
  - `logout()` → remove cookie + redirect
  - `isAuthenticated()` → verifica se tem token

## Estado Global (Pinia)
- `src/stores/auth.js`: estado de autenticação
  - `isAuthenticated`, `user`, `loading`
  - Actions: `login()`, `register()`, `logout()`, `checkAuth()`
- `src/stores/counter.js`: exemplo de store (remover se não usado)

## Workflows de Desenvolvimento
- Instalar dependências: `npm install`
- Desenvolvimento: `npm run dev` (porta 8080, hot-reload)
- Build produção: `npm run build`
- Testes: `npm run test:unit` (Vitest)
- Lint: `npm run lint` (ESLint)
- **Setup AWS**: `npm run aws:setup` (script automatizado)
- **Deploy**: Push para `main` → deploy automático via GitHub Actions

## Configuração de Ambiente
- Variáveis no `.env` (opcional):
  ```
  VITE_API_URL=http://localhost:3000
  ```
- Proxy automático configurado no `vite.config.js` para desenvolvimento

## Componentes e Views Existentes
- `src/views/LoginView.vue`: formulário de login com Element Plus
- `src/views/RegisterView.vue`: formulário de registro
- `src/views/DashboardView.vue`: página principal após login
- `src/components/HeaderBar.vue`: header com navegação e dropdown de usuário

## Dependências Principais
- `vue`: framework principal
- `vue-router`: roteamento SPA
- `pinia`: gerenciamento de estado
- `axios`: cliente HTTP
- `js-cookie`: manipulação de cookies
- `element-plus`: biblioteca de componentes UI
- `@element-plus/icons-vue`: ícones Element Plus (auto-registrados)
- `chart.js` + `vue-chartjs`: gráficos interativos
- `vite`: build tool e dev server

## Padrões de Formulários
- Use Element Plus forms (`el-form`, `el-form-item`, `el-input`)
- Validação reativa com rules do Element Plus
- Loading states durante submissão
- Feedback visual com `ElMessage` para sucesso/erro

## Recomendações para Agentes
- Sempre use os serviços existentes para API calls
- Mantenha consistência visual com Element Plus
- Atualize o store de auth quando necessário
- Para novas páginas, configure rota + guard apropriado
- Trate estados de loading e erro adequadamente

## Arquitetura de Deploy (S3 + CloudFront)

### Migração Realizada
- **Antes**: ECS Fargate ($60-85/mês) - containers gerenciados
- **Depois**: S3 + CloudFront ($5-15/mês) - hosting estático serverless
- **Economia**: 75-85% redução de custos
- **Performance**: CDN global com <100ms latência mundial

### Infraestrutura Automática
- **Setup**: `./setup-s3-cloudfront.sh` - cria infraestrutura AWS automaticamente
- **CI/CD**: `.github/workflows/deploy-s3-cloudfront.yml` - deploy automático
- **Build**: Bundle splitting otimizado (vendor, ui, utils chunks)
- **Cache**: CloudFront com cache estratégico por tipo de arquivo

### Scripts de Deploy
```bash
npm run aws:setup        # Setup inicial da infraestrutura AWS
npm run build           # Build otimizado com chunks
npm run deploy:staging  # Build para staging
npm run deploy:production # Via GitHub Actions (automático)
```

### GitHub Actions Secrets Necessários
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
# Opcionais (para performance):
S3_BUCKET=dashboard-front-static-xxxxx
CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC
```

### Workflow de Deploy
1. Push para `main` → dispara workflow automaticamente
2. Job `infrastructure`: verifica/cria S3 bucket e CloudFront
3. Job `deploy`: testes → build → upload S3 → invalidação CloudFront
4. Deploy completo em 2-5 minutos vs 10-15 minutos do ECS

## Otimizações de Performance

### Bundle Splitting (vite.config.js)
- **vendor**: Vue core libraries (~105KB)
- **ui**: Element Plus components (~1MB) 
- **utils**: Axios, cookies, etc (~37KB)
- Cache de 1 ano para assets versionados

### Cache Strategy CloudFront
- `/assets/*`: Cache 1 ano (immutable)
- `*.js, *.css`: Cache 1 ano (versionados pelo Vite)
- `index.html`: Sem cache (sempre atualizado)
- Outros arquivos: Cache 1 hora

### Environment Variables
```env
# Desenvolvimento (.env.development)
VITE_API_URL=http://localhost:3000

# Produção (.env.production)  
VITE_API_URL=https://api.yourdomain.com
VITE_APP_TITLE=Dashboard Admin
VITE_ENVIRONMENT=production
```

## Arquivos Arquivados
- `archive/ecs-infrastructure/`: infraestrutura Docker/ECS antiga
- `archive/README.md`: documentação da migração
- Mantidos para referência e possível rollback de emergência

## Node.js Requirements
- **Versão obrigatória**: Node.js 20+ (necessário para Vite 7)
- **Engines**: especificado em package.json (`^20.19.0 || >=22.12.0`)
- **Desenvolvimento**: `npm run dev` na porta 8080 (não 5173)