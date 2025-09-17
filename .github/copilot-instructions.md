# Copilot Instructions for AI Agents - Frontend Vue.js

## Visão Geral do Projeto
- SPA (Single Page Application) Vue.js 3 com Vite, Element Plus para UI
- Aplicação companion: backend API (`dashboard-auth`) fornece autenticação
- Arquitetura: `src/views/` (páginas), `src/components/` (componentes reutilizáveis), `src/stores/` (Pinia), `src/services/` (API calls), `src/router/` (Vue Router)

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