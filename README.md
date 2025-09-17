# Dashboard Frontend# Dashboard Front## 📁 Estrutura do Projetond



Sistema de dashboard administrativo desenvolvido com Vue.js 3 + Element Plus.Sistema de dashboard administrativo desenvolvido com Vue.js 3 + Element Plus.



## 🚀 Tecnologias## 🚀 Tecnologias



- **Vue.js 3** - Framework frontend reativo- **Vue.js 3** - Framework frontend reativo

- **Vite** - Build tool e dev server ultra-rápido- **Vite** - Build tool e dev server ultra-rápido

- **Element Plus** - Biblioteca de componentes UI- **Element Plus** - Biblioteca de componentes UI

- **Vue Router** - Roteamento SPA- **Vue Router** - Roteamento SPA

- **Pinia** - Gerenciamento de estado moderno- **Pinia** - Gerenciamento de estado moderno

- **Axios** - Cliente HTTP para API calls- **Axios** - Cliente HTTP para API calls

- **Vitest** - Framework de testes unitários- **Vitest** - Framework de testes unitários

- **js-cookie** - Gerenciamento de cookies- **js-cookie** - Gerenciamento de cookies



## 📁 Estrutura do Projeto



```## � Estrutura do Projeto

src/

├── components/         # Componentes reutilizáveis```

│   └── HeaderBar.vue  # Header com navegaçãosrc/

├── views/             # Páginas da aplicação├── components/         # Componentes reutilizáveis

│   ├── LoginView.vue  # Página de login│   └── HeaderBar.vue  # Header com navegação

│   ├── RegisterView.vue # Página de registro├── views/             # Páginas da aplicação

│   └── DashboardView.vue # Dashboard principal│   ├── LoginView.vue  # Página de login

├── stores/            # Stores Pinia│   ├── RegisterView.vue # Página de registro

│   ├── auth.js       # Estado de autenticação│   └── DashboardView.vue # Dashboard principal

│   └── counter.js    # Store exemplo├── stores/            # Stores Pinia

├── services/          # Serviços de API│   ├── auth.js       # Estado de autenticação

│   ├── api.js        # Configuração Axios│   └── counter.js    # Store exemplo

│   └── authService.js # Serviços de autenticação├── services/          # Serviços de API

├── router/            # Configuração de rotas│   ├── api.js        # Configuração Axios

│   └── index.js      # Definição de rotas + guards│   └── authService.js # Serviços de autenticação

└── __tests__/         # Testes unitários├── router/            # Configuração de rotas

```│   └── index.js      # Definição de rotas + guards

└── __tests__/         # Testes unitários

## 🔧 Configuração e Instalação```



```bash## 🔧 Configuração e Instalação

# Instalar dependências

npm install```bash

# Instalar dependências

# Desenvolvimento (porta 8080)npm install

npm run dev

# Desenvolvimento (porta 8080)

# Build para produçãonpm run dev

npm run build

# Build para produção

# Executar testes unitáriosnpm run build

npm run test:unit

# Executar testes unitários

# Lint do códigonpm run test:unit

npm run lint

```# Lint do código

npm run lint

## 🌐 Integração com Backend```



Este frontend se conecta ao backend [`dashboard-auth`](https://github.com/rpikussa/dashboard-auth) que deve estar rodando na porta 3000.## 🌐 Integração com Backend



### Configuração da APIEste frontend se conecta ao backend [`dashboard-auth`](https://github.com/rpikussa/dashboard-auth) que deve estar rodando na porta 3000.



- URL base: `http://localhost:3000`### Configuração da API

- Proxy automático: `/api/*` → `localhost:3000`

- Autenticação via JWT em cookies (`auth_token`)- URL base: `http://localhost:3000`

- Proxy automático: `/api/*` → `localhost:3000`

## 📋 Funcionalidades- Autenticação via JWT em cookies (`auth_token`)



- ✅ Sistema de autenticação completo (login/registro)## 📋 Funcionalidades

- ✅ Guards de rota automáticos

- ✅ Dashboard responsivo com estatísticas- ✅ Sistema de autenticação completo (login/registro)

- ✅ Interceptors para tratamento de erros 401- ✅ Guards de rota automáticos

- ✅ Logout automático em caso de token inválido- ✅ Dashboard responsivo com estatísticas

- ✅ Interface moderna com Element Plus- ✅ Interceptors para tratamento de erros 401

- ✅ Estado global com Pinia- ✅ Logout automático em caso de token inválido

- ✅ Interface moderna com Element Plus

## 🛣️ Rotas da Aplicação- ✅ Estado global com Pinia



- `/` → Redireciona para `/dashboard`## 🛣️ Rotas da Aplicação

- `/login` → Página de login (acesso apenas sem autenticação)

- `/register` → Página de registro (acesso apenas sem autenticação)- `/` → Redireciona para `/dashboard`

- `/dashboard` → Dashboard principal (requer autenticação)- `/login` → Página de login (acesso apenas sem autenticação)

- `/register` → Página de registro (acesso apenas sem autenticação)

## 🔐 Variáveis de Ambiente- `/dashboard` → Dashboard principal (requer autenticação)



Crie um arquivo `.env.local` (opcional):## 🔐 Variáveis de Ambiente



```envCrie um arquivo `.env.local` (opcional):

VITE_API_URL=http://localhost:3000

VITE_APP_TITLE=Dashboard Admin```env

```VITE_API_URL=http://localhost:3000

VITE_APP_TITLE=Dashboard Admin

## 🎨 Convenções de Desenvolvimento```



- **Composition API** (`<script setup>`) em novos componentes## 🎨 Convenções de Desenvolvimento

- **Element Plus** para componentes UI (el-form, el-button, etc.)

- **Centralização** de chamadas API em `src/services/`- **Composition API** (`<script setup>`) em novos componentes

- **PascalCase** para componentes e arquivos- **Element Plus** para componentes UI (el-form, el-button, etc.)

- **Alias** `@/` para `src/` (configurado no Vite)- **Centralização** de chamadas API em `src/services/`

- **PascalCase** para componentes e arquivos

## 📱 Configuração IDE Recomendada- **Alias** `@/` para `src/` (configurado no Vite)



[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (desabilitar Vetur se instalado)## 📱 Configuração IDE Recomendada



### Extensões Úteis:[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (desabilitar Vetur se instalado)

- Vue Language Features (Volar)

- Element Plus Snippets### Extensões Úteis:

- ESLint- Vue Language Features (Volar)

- Prettier- Element Plus Snippets

- ESLint

## 🚀 Deploy- Prettier



```bash## 🚀 Deploy

# Build otimizado para produção

npm run build```bash

# Build otimizado para produção

# Preview do build localmentenpm run build

npm run preview

```# Preview do build localmente

npm run preview

## 📖 Documentação Adicional```



- [Vite Configuration Reference](https://vite.dev/config/)## 📖 Documentação Adicional

- [Vue.js 3 Documentation](https://vuejs.org/)

- [Element Plus Components](https://element-plus.org/)- [Vite Configuration Reference](https://vite.dev/config/)

- [Pinia State Management](https://pinia.vuejs.org/)- [Vue.js 3 Documentation](https://vuejs.org/)
- [Element Plus Components](https://element-plus.org/)
- [Pinia State Management](https://pinia.vuejs.org/)