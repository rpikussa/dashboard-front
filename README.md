# Dashboard Frontend# dashboard-front



Sistema de dashboard administrativo desenvolvido com Vue.js 3 + Element Plus.This template should help get you started developing with Vue 3 in Vite.



## 🚀 Tecnologias## Recommended IDE Setup



- **Vue.js 3** - Framework frontend reativo[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

- **Vite** - Build tool e dev server ultra-rápido

- **Element Plus** - Biblioteca de componentes UI## Customize configuration

- **Vue Router** - Roteamento SPA

- **Pinia** - Gerenciamento de estado modernoSee [Vite Configuration Reference](https://vite.dev/config/).

- **Axios** - Cliente HTTP para API calls

- **Vitest** - Framework de testes unitários## Project Setup

- **js-cookie** - Gerenciamento de cookies

```sh

## 📁 Estrutura do Projetonpm install

```

```

src/### Compile and Hot-Reload for Development

├── components/         # Componentes reutilizáveis

│   └── HeaderBar.vue  # Header com navegação```sh

├── views/             # Páginas da aplicaçãonpm run dev

│   ├── LoginView.vue  # Página de login```

│   ├── RegisterView.vue # Página de registro

│   └── DashboardView.vue # Dashboard principal### Compile and Minify for Production

├── stores/            # Stores Pinia

│   ├── auth.js       # Estado de autenticação```sh

│   └── counter.js    # Store exemplonpm run build

├── services/          # Serviços de API```

│   ├── api.js        # Configuração Axios

│   └── authService.js # Serviços de autenticação### Run Unit Tests with [Vitest](https://vitest.dev/)

├── router/            # Configuração de rotas

│   └── index.js      # Definição de rotas + guards```sh

└── __tests__/         # Testes unitáriosnpm run test:unit

``````



## 🔧 Configuração e Instalação### Lint with [ESLint](https://eslint.org/)



```bash```sh

# Instalar dependênciasnpm run lint

npm install```


# Desenvolvimento (porta 8080)
npm run dev

# Build para produção
npm run build

# Executar testes unitários
npm run test:unit

# Lint do código
npm run lint
```

## 🌐 Integração com Backend

Este frontend se conecta ao backend [`dashboard-auth`](https://github.com/rpikussa/dashboard-auth) que deve estar rodando na porta 3000.

### Configuração da API
- URL base: `http://localhost:3000`
- Proxy automático: `/api/*` → `localhost:3000`
- Autenticação via JWT em cookies (`auth_token`)

## 📋 Funcionalidades

- ✅ Sistema de autenticação completo (login/registro)
- ✅ Guards de rota automáticos
- ✅ Dashboard responsivo com estatísticas
- ✅ Interceptors para tratamento de erros 401
- ✅ Logout automático em caso de token inválido
- ✅ Interface moderna com Element Plus
- ✅ Estado global com Pinia

## 🛣️ Rotas da Aplicação

- `/` → Redireciona para `/dashboard`
- `/login` → Página de login (acesso apenas sem autenticação)
- `/register` → Página de registro (acesso apenas sem autenticação)
- `/dashboard` → Dashboard principal (requer autenticação)

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local` (opcional):

```env
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Dashboard Admin
```

## 🎨 Convenções de Desenvolvimento

- **Composition API** (`<script setup>`) em novos componentes
- **Element Plus** para componentes UI (el-form, el-button, etc.)
- **Centralização** de chamadas API em `src/services/`
- **PascalCase** para componentes e arquivos
- **Alias** `@/` para `src/` (configurado no Vite)

## 📱 Configuração IDE Recomendada

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (desabilitar Vetur se instalado)

### Extensões Úteis:
- Vue Language Features (Volar)
- Element Plus Snippets
- ESLint
- Prettier

## 🚀 Deploy

```bash
# Build otimizado para produção
npm run build

# Preview do build localmente
npm run preview
```

## 📖 Documentação Adicional

- [Vite Configuration Reference](https://vite.dev/config/)
- [Vue.js 3 Documentation](https://vuejs.org/)
- [Element Plus Components](https://element-plus.org/)
- [Pinia State Management](https://pinia.vuejs.org/)