# 🎯 Dashboard Frontend

Sistema de dashboard administrativo moderno desenvolvido com **Vue.js 3** + **Element Plus**, com deployment automatizado na **AWS ECS**.

## 🌐 **Aplicação em Produção**

� **URL**: http://dashboard-front-alb-1900448108.us-east-1.elb.amazonaws.com

## 🚀 **Tecnologias**

### Frontend Stack
- **Vue.js 3** - Framework frontend reativo com Composition API
- **Vite 7** - Build tool ultra-rápido com HMR
- **Element Plus** - Biblioteca de componentes UI moderna
- **Vue Router 4** - Roteamento SPA com guards
- **Pinia** - Gerenciamento de estado moderno
- **Axios** - Cliente HTTP para chamadas API
- **Chart.js** - Gráficos interativos
- **js-cookie** - Gerenciamento de cookies/sessão

### DevTools & Quality
- **Vitest** - Framework de testes unitários
- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **TypeScript Ready** - Suporte a TypeScript

### Deployment & Infrastructure
- **Docker** - Containerização multi-stage
- **Nginx** - Servidor web otimizado para SPA
- **AWS ECS Fargate** - Orquestração de containers
- **AWS ECR** - Registry de imagens Docker
- **GitHub Actions** - CI/CD automatizado
- **CloudWatch** - Logs e monitoramento

## 📁 **Estrutura do Projeto**

```
src/
├── components/           # Componentes reutilizáveis
│   └── HeaderBar.vue    # Header com navegação
├── views/               # Páginas da aplicação
│   ├── LoginView.vue    # Página de login
│   ├── RegisterView.vue # Página de registro
│   └── DashboardView.vue # Dashboard principal
├── stores/              # Stores Pinia
│   ├── auth.js         # Estado de autenticação
│   └── counter.js      # Store de exemplo
├── services/            # Serviços de API
│   ├── api.js          # Configuração Axios
│   └── authService.js  # Serviços de autenticação
├── router/              # Configuração de rotas
│   └── index.js        # Definição de rotas + guards
└── __tests__/           # Testes unitários

Infrastructure/
├── Dockerfile           # Build multi-stage
├── nginx.conf          # Configuração Nginx
├── docker-compose.yml  # Desenvolvimento local
├── aws/                # Configuração AWS
│   ├── setup.sh        # Script de infraestrutura
│   ├── task-definition.json # ECS Task
│   └── README.md       # Documentação AWS
└── .github/workflows/  # CI/CD
    └── deploy-frontend.yml
```

## 🔧 **Setup Local**

### Pré-requisitos
- **Node.js 20+** (obrigatório para Vite 7)
- **npm** ou **yarn**
- **Docker** (opcional, para desenvolvimento)

### Instalação
```bash
# 1. Clonar o repositório
git clone https://github.com/rpikussa/dashboard_front.git
cd dashboard_front

# 2. Instalar dependências
npm install

# 3. Executar em desenvolvimento
npm run dev
# Acesse: http://localhost:5173
```

### Scripts Disponíveis
```bash
# Desenvolvimento
npm run dev              # Servidor dev (porta 5173)
npm run build            # Build para produção
npm run preview          # Preview do build

# Qualidade de código
npm run lint             # ESLint
npm run format           # Prettier
npm run test:unit        # Testes unitários

# Docker
npm run docker:build     # Build da imagem
npm run docker:run       # Executar container
npm run docker:dev       # Desenvolvimento com Docker
npm run docker:prod      # Produção com Docker

# AWS
npm run aws:setup        # Configurar infraestrutura
./test-deployment.sh     # Testar deployment local
```

## 🌐 **Integração com Backend**

### API Configuration
- **Backend**: [dashboard-auth](https://github.com/rpikussa/dashboard-auth)
- **URL Local**: `http://localhost:3000`
- **Proxy**: `/api/*` → `localhost:3000` (desenvolvimento)
- **Autenticação**: JWT em cookies (`auth_token`)

### Variáveis de Ambiente
```env
# .env.local (desenvolvimento)
VITE_API_URL=http://localhost:3000
VITE_APP_TITLE=Dashboard Admin
VITE_ENVIRONMENT=development

# .env.production (produção)
VITE_API_URL=https://api.yourdomain.com
VITE_APP_TITLE=Dashboard Admin
VITE_ENVIRONMENT=production
```

## 📋 **Funcionalidades**

### ✅ **Implementadas**
- Sistema de autenticação completo (login/registro)
- Guards de rota automáticos
- Dashboard responsivo com estatísticas
- Interceptors para tratamento de erros 401
- Logout automático em token inválido
- Interface moderna com Element Plus
- Estado global com Pinia
- Deployment automatizado na AWS

### 🔄 **Em Desenvolvimento**
- Gráficos interativos (Chart.js)
- Tabelas de dados avançadas
- Sistema de notificações
- Filtros e busca
- Temas personalizáveis

## 🛣️ **Rotas**

| Rota | Descrição | Proteção |
|------|-----------|----------|
| `/` | Redireciona para `/dashboard` | - |
| `/login` | Página de login | Apenas não autenticados |
| `/register` | Página de registro | Apenas não autenticados |
| `/dashboard` | Dashboard principal | Requer autenticação |

## 🚀 **Deployment**

### Arquitetura AWS
```
Internet → ALB → ECS Fargate → Container (Nginx + Vue.js App)
                     ↓
               CloudWatch Logs
```

### CI/CD Pipeline
O deployment é **100% automatizado** via GitHub Actions:

1. **Push na branch `main`** → Dispara workflow
2. **Build da aplicação** Vue.js com Vite
3. **Criação da imagem Docker** (multi-stage)
4. **Push para AWS ECR**
5. **Deploy no ECS Fargate**
6. **Verificação de saúde**

### Infraestrutura AWS
- **Cluster**: `auth-api-cluster`
- **Service**: `dashboard-front-service`
- **ALB**: `dashboard-front-alb`
- **ECR**: `975050294854.dkr.ecr.us-east-1.amazonaws.com/dashboard-front`
- **Logs**: `/ecs/dashboard-front`

### Configuração de Secrets
No GitHub, configure os secrets:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Deploy Manual (se necessário)
```bash
# 1. Configurar AWS CLI
aws configure

# 2. Setup inicial da infraestrutura (apenas uma vez)
npm run aws:setup

# 3. Deploy via Git (recomendado)
git add .
git commit -m "Deploy: sua mensagem"
git push origin main

# 4. Ou build local para teste
npm run docker:build
./test-deployment.sh
```

## 🐳 **Docker**

### Dockerfile Multi-stage
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
# Build da aplicação Vue.js

# Stage 2: Production
FROM nginx:alpine AS production
# Serve arquivos estáticos com Nginx
```

### Nginx Configuration
- **SPA Support**: `try_files` para Vue Router
- **Gzip Compression**: Otimização de assets
- **Security Headers**: XSS, CSRF, etc.
- **Health Check**: Endpoint `/health`
- **Cache Strategy**: Assets com cache longo

## 📊 **Monitoramento**

### Health Checks
- **Container**: `wget http://localhost:80/health`
- **ALB**: Target Group health checks
- **Logs**: CloudWatch Logs automaticamente

### Métricas Disponíveis
- **ECS**: CPU, Memória, Tasks
- **ALB**: Latência, Requests, Errors
- **CloudWatch**: Logs estruturados

### Debugging
```bash
# Logs em tempo real
aws logs tail /ecs/dashboard-front --follow

# Status do serviço
aws ecs describe-services --cluster auth-api-cluster --services dashboard-front-service

# Tasks ativas
aws ecs list-tasks --cluster auth-api-cluster --service-name dashboard-front-service
```

## 🎨 **Convenções de Desenvolvimento**

### Código
- **Composition API** (`<script setup>`) em novos componentes
- **Element Plus** para todos os componentes UI
- **PascalCase** para componentes e arquivos Vue
- **Alias** `@/` para `src/` (configurado no Vite)
- **Centralização** de chamadas API em `src/services/`

### Git Workflow
```bash
# Feature branch
git checkout -b feature/nova-funcionalidade
git commit -m "feat: adicionar nova funcionalidade"
git push origin feature/nova-funcionalidade

# Deploy para produção
git checkout main
git merge feature/nova-funcionalidade
git push origin main  # 🚀 Deploy automático!
```

## 📱 **IDE Recomendada**

### VS Code + Extensões
- **Vue Language Features (Volar)** - Suporte Vue.js
- **Element Plus Snippets** - Snippets para componentes
- **ESLint** - Linting em tempo real
- **Prettier** - Formatação automática
- **Docker** - Suporte a Dockerfile

### Configuração Recomendada
```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## 🔧 **Troubleshooting**

### Problemas Comuns

**Build falhando**:
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Docker não inicia**:
```bash
# Verificar logs
docker logs <container_id>

# Health check manual
curl http://localhost:8080/health
```

**Deployment falhando**:
```bash
# Verificar secrets do GitHub
# Verificar logs do CloudWatch
# Verificar task definition no ECS
```

## � **Documentação**

### Links Úteis
- **[Vue.js 3 Guide](https://vuejs.org/guide/)**
- **[Element Plus Components](https://element-plus.org/en-US/component/)**
- **[Vite Configuration](https://vitejs.dev/config/)**
- **[Pinia State Management](https://pinia.vuejs.org/)**
- **[AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)**

### Arquitetura
- **[Frontend Guide](docs/FRONTEND.md)** - Guia detalhado do frontend
- **[AWS Infrastructure](aws/README.md)** - Documentação da infraestrutura
- **[API Integration](docs/API.md)** - Integração com backend

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando Vue.js + AWS**

🌟 **Star este repositório se foi útil para você!**