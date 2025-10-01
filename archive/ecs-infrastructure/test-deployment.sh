#!/bin/bash

# Script para testar o deployment localmente antes de fazer push

set -e

echo "🧪 Testing frontend deployment configuration..."

# 1. Verificar se o build funciona
echo "📦 Testing build..."
npm run build

# 2. Verificar se o Docker build funciona
echo "🐳 Testing Docker build..."
docker build -t dashboard-front-test .

# 3. Testar container localmente
echo "🚀 Testing container startup..."
CONTAINER_ID=$(docker run -d -p 8081:80 dashboard-front-test)

# Aguardar container inicializar
sleep 10

# 4. Testar health check
echo "🔍 Testing health check..."
if curl -f http://localhost:8081/health; then
    echo "✅ Health check passed!"
else
    echo "❌ Health check failed!"
    docker logs $CONTAINER_ID
    docker stop $CONTAINER_ID
    exit 1
fi

# 5. Testar aplicação principal
echo "🌐 Testing main application..."
if curl -f http://localhost:8081/ | grep -q "<!DOCTYPE html>"; then
    echo "✅ Application is serving HTML!"
else
    echo "❌ Application test failed!"
    docker logs $CONTAINER_ID
    docker stop $CONTAINER_ID
    exit 1
fi

# 6. Cleanup
echo "🧹 Cleaning up..."
docker stop $CONTAINER_ID
docker rmi dashboard-front-test

echo ""
echo "✅ All tests passed! Your frontend is ready for deployment."
echo ""
echo "📝 Next steps:"
echo "  1. Commit and push your changes"
echo "  2. Run: npm run aws:setup (if not done yet)"
echo "  3. Configure GitHub secrets (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)"
echo "  4. Push to main branch to trigger deployment"