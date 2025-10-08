# Recursos AWS do Dashboard

## API Gateway (dashboard-auth)

### Informações Básicas
- **Nome**: dashboard-auth-prod
- **ID**: c10rgiry67
- **Região**: us-east-1
- **Stage de Produção**: prod

### URL Base da API
```
https://c10rgiry67.execute-api.us-east-1.amazonaws.com/prod
```

### Rotas Disponíveis

| Rota | Métodos | Descrição |
|------|---------|-----------|
| `/auth/login` | POST, OPTIONS | Autenticação de usuário |
| `/auth/register` | POST, OPTIONS | Registro de novo usuário |
| `/auth/user/{id}` | GET, OPTIONS | Buscar dados do usuário |

### Exemplos de Uso

#### Login
```bash
curl -X POST https://c10rgiry67.execute-api.us-east-1.amazonaws.com/prod/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@example.com", "password": "senha123"}'
```

#### Registro
```bash
curl -X POST https://c10rgiry67.execute-api.us-east-1.amazonaws.com/prod/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@example.com", "password": "senha123", "name": "Nome Usuario"}'
```

#### Buscar Usuário
```bash
curl -X GET https://c10rgiry67.execute-api.us-east-1.amazonaws.com/prod/auth/user/123 \
  -H "Authorization: Bearer {token}"
```

## Funções Lambda Relacionadas

| Função | Runtime | Descrição |
|--------|---------|-----------|
| dashboard-auth-prod-LoginFunction-lIGd0KFp1CU5 | nodejs22.x | Função de login |
| dashboard-auth-prod-RegisterFunction-2g3Va9vqTIy0 | nodejs22.x | Função de registro |
| dashboard-auth-prod-UserFunction-KBbLZJPqxMed | nodejs22.x | Função de usuário |
| dashboard-auth-prod-AuthorizerFunction-oSKLrHwFCH4F | nodejs22.x | Função de autorização |

## Configuração Aplicada

### .env.production
```bash
VITE_API_URL=https://c10rgiry67.execute-api.us-east-1.amazonaws.com/prod
```

### Como Testar Localmente
1. Execute `npm run dev`
2. O frontend usará a API local em `http://localhost:3000` (conforme `.env.development`)
3. Para testar com a API de produção localmente, altere temporariamente o `VITE_API_URL` em `.env.development`

### Como Funciona em Produção
1. O build de produção (`npm run build`) usa automaticamente as variáveis de `.env.production`
2. O frontend deployado no S3/CloudFront fará chamadas para a API Gateway de produção
3. As rotas `/auth/*` serão redirecionadas para a API Gateway configurada

## Status de Conectividade
✅ **API Gateway acessível** - Testado em $(date)
- Resposta HTTP 401 (esperado para requisições não autenticadas)
- CORS configurado corretamente
- SSL/HTTPS funcionando

## Comandos Úteis para Redescoberta

```bash
# Listar APIs Gateway
aws apigateway get-rest-apis --query 'items[?contains(name, `dashboard`)].{Name: name, Id: id}'

# Verificar stages de uma API
aws apigateway get-stages --rest-api-id c10rgiry67

# Listar recursos de uma API
aws apigateway get-resources --rest-api-id c10rgiry67

# Testar conectividade
curl -s -o /dev/null -w "%{http_code}" "https://c10rgiry67.execute-api.us-east-1.amazonaws.com/prod/auth/login" -X OPTIONS
```

---
*Documentação gerada automaticamente em $(date)*