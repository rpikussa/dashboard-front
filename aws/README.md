# Dashboard Frontend Deployment

Este diretório contém a configuração para deployment do frontend Vue.js na AWS usando ECS Fargate.

## Arquivos de Configuração

- `Dockerfile` - Multi-stage build para produção com Nginx
- `nginx.conf` - Configurações do servidor web
- `aws/task-definition.json` - Definição da task ECS
- `aws/setup.sh` - Script para configurar infraestrutura AWS
- `.github/workflows/deploy-frontend.yml` - Pipeline CI/CD
- `docker-compose.yml` - Para desenvolvimento local

## Setup Inicial

1. **Configurar credenciais AWS**:
```bash
aws configure
```

2. **Executar setup da infraestrutura**:
```bash
npm run aws:setup
```

3. **Configurar secrets no GitHub**:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

## Scripts Disponíveis

```bash
# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Docker local
npm run docker:build
npm run docker:run
npm run docker:dev    # Modo desenvolvimento
npm run docker:prod   # Modo produção

# AWS
npm run aws:setup     # Configurar infraestrutura
```

## Estrutura AWS

- **ECS Cluster**: `auth-api-cluster` (compartilhado com backend)
- **Service**: `dashboard-front-service`
- **ALB**: `dashboard-front-alb`
- **ECR**: `dashboard-front`
- **Task Definition**: `dashboard-front`

## Deployment

O deployment é automatizado via GitHub Actions quando há push na branch `main` em arquivos do `dashboard-front/`.

## Monitoramento

- **Logs**: CloudWatch Logs Group `/ecs/dashboard-front`
- **Métricas**: CloudWatch ECS
- **Health Check**: `http://alb-dns/health`

## Desenvolvimento Local

```bash
# Com Docker
docker-compose up frontend-dev

# Sem Docker
npm run dev
```

## Troubleshooting

1. **Service não inicia**:
   - Verificar logs: `aws logs get-log-events --log-group-name /ecs/dashboard-front`
   - Verificar task definition e service configuration

2. **Health check falhando**:
   - Verificar se o endpoint `/health` está respondendo
   - Verificar configurações do target group

3. **Build falhando**:
   - Verificar se todas as dependências estão instaladas
   - Verificar variáveis de ambiente