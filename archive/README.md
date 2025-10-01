# 📁 Archived ECS Infrastructure

Esta pasta contém os arquivos da **infraestrutura antiga** baseada em **AWS ECS Fargate** que foi substituída por **S3 + CloudFront**.

## 🗂️ **Arquivos Arquivados:**

### Docker & Nginx (Deprecated)
- `Dockerfile` - Configuração multi-stage para ECS
- `docker-compose.yml` - Setup para desenvolvimento local
- `nginx.conf` - Configuração Nginx para container
- `test-deployment.sh` - Script de teste local

### AWS ECS (Deprecated) 
- `aws/setup.sh` - Script de setup da infraestrutura ECS
- `aws/task-definition.json` - Task definition do ECS Fargate
- `aws/README.md` - Documentação da infraestrutura ECS

### GitHub Actions (Removed)
- `deploy-frontend.yml` - Workflow para deploy no ECS (removido)

## 📊 **Comparação: Antes vs Depois**

| Aspecto | ECS Fargate (Arquivado) | S3 + CloudFront (Atual) |
|---------|------------------------|-------------------------|
| **Custo** | $60-85/mês | $5-15/mês |
| **Performance** | Single region | CDN global |
| **Deploy** | 10-15 minutos | 2-5 minutos |
| **Manutenção** | Alta (containers) | Zero (serverless) |
| **Escalabilidade** | Manual | Automática |

## 🚨 **Status: DEPRECATED**

Estes arquivos são mantidos apenas para:
- **Referência histórica**
- **Rollback de emergência** (se necessário)
- **Documentação** da migração realizada

## 🔄 **Rollback (Se Necessário)**

Para reverter para a infraestrutura ECS (não recomendado):

```bash
# 1. Restaurar arquivos
cp archive/ecs-infrastructure/Dockerfile .
cp archive/ecs-infrastructure/docker-compose.yml .
cp archive/ecs-infrastructure/nginx.conf .
cp -r archive/ecs-infrastructure/aws .

# 2. Restaurar workflow
cp archive/ecs-infrastructure/deploy-frontend.yml .github/workflows/

# 3. Reativar infraestrutura ECS
cd aws && ./setup.sh
```

## 💡 **Recomendação**

**Manter arquivado** por 3-6 meses após migração bem-sucedida, depois **remover permanentemente** para limpeza do repositório.

---

**Data de arquivamento**: 30 de Setembro de 2025  
**Motivo**: Migração para S3 + CloudFront (75-85% economia de custos)  
**Status**: ✅ Migração concluída com sucesso