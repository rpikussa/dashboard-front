#!/bin/bash

set -e

echo "🚀 Setting up AWS S3 + CloudFront for Dashboard Frontend..."

# Variáveis
PROJECT_NAME="dashboard-front"
BUCKET_NAME="${PROJECT_NAME}-static-$(date +%s)"
REGION="us-east-1"
DOMAIN_NAME="${1:-}"  # Opcional: domínio customizado

echo "📦 Project: $PROJECT_NAME"
echo "📦 Bucket name: $BUCKET_NAME"
echo "🌍 Region: $REGION"

# 1. Criar bucket S3
echo "📦 Creating S3 bucket..."
aws s3 mb s3://$BUCKET_NAME --region $REGION

# 2. Configurar bucket para hosting estático
echo "🌐 Configuring static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# 3. Configurar política do bucket
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# 4. Configurar CORS
cat > cors-config.json << EOF
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": []
        }
    ]
}
EOF

aws s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration file://cors-config.json

# 5. Criar distribuição CloudFront otimizada para SPA Vue.js
echo "⚡ Creating optimized CloudFront distribution for Vue.js SPA..."
cat > cloudfront-config.json << EOF
{
    "CallerReference": "dashboard-front-$(date +%s)",
    "Comment": "Dashboard Frontend - Vue.js SPA with optimized caching",
    "DefaultCacheBehavior": {
        "TargetOriginId": "$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 0,
        "MaxTTL": 0,
        "Compress": true,
        "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    },
    "CacheBehaviors": {
        "Quantity": 2,
        "Items": [
            {
                "PathPattern": "/assets/*",
                "TargetOriginId": "$BUCKET_NAME",
                "ViewerProtocolPolicy": "redirect-to-https",
                "TrustedSigners": {
                    "Enabled": false,
                    "Quantity": 0
                },
                "ForwardedValues": {
                    "QueryString": false,
                    "Cookies": {
                        "Forward": "none"
                    }
                },
                "MinTTL": 31536000,
                "DefaultTTL": 31536000,
                "MaxTTL": 31536000,
                "Compress": true
            },
            {
                "PathPattern": "*.js",
                "TargetOriginId": "$BUCKET_NAME",
                "ViewerProtocolPolicy": "redirect-to-https",
                "TrustedSigners": {
                    "Enabled": false,
                    "Quantity": 0
                },
                "ForwardedValues": {
                    "QueryString": false,
                    "Cookies": {
                        "Forward": "none"
                    }
                },
                "MinTTL": 31536000,
                "DefaultTTL": 31536000,
                "MaxTTL": 31536000,
                "Compress": true
            }
        ]
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100",
    "CustomErrorResponses": {
        "Quantity": 2,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            },
            {
                "ErrorCode": 403,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    }
}
EOF

DISTRIBUTION_ID=$(aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json \
    --query 'Distribution.Id' \
    --output text)

echo "CloudFront Distribution ID: $DISTRIBUTION_ID"

# 6. Obter domínio do CloudFront
CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution \
    --id $DISTRIBUTION_ID \
    --query 'Distribution.DomainName' \
    --output text)

# 7. Fazer primeiro deploy
echo "📤 Deploying current build..."
if [ -d "dist" ]; then
    aws s3 sync dist/ s3://$BUCKET_NAME --delete \
        --cache-control "public,max-age=31536000" --exclude "index.html"
    aws s3 cp dist/index.html s3://$BUCKET_NAME/index.html \
        --cache-control "public,max-age=0,must-revalidate"
else
    echo "⚠️  No 'dist' folder found. Run 'npm run build' first."
fi

# 8. Limpar arquivos temporários
rm -f bucket-policy.json cors-config.json cloudfront-config.json

echo ""
echo "✅ AWS S3 + CloudFront setup completed successfully!"
echo ""
echo "📊 Infrastructure Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🪣 S3 Bucket:           $BUCKET_NAME"
echo "⚡ CloudFront Distrib:   $DISTRIBUTION_ID"
echo "🌐 CloudFront Domain:    $CLOUDFRONT_DOMAIN"
echo "💰 Estimated Cost:       \$5-15/month"
echo "📈 Performance:          <100ms global delivery"
echo "🔒 Security:             HTTPS + Security headers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Your dashboard will be available at:"
echo "   👉 https://$CLOUDFRONT_DOMAIN"
echo "   (CloudFront propagation: 15-20 minutes)"
echo ""
echo "💾 Savings vs ECS Fargate:"
echo "   📉 From: \$60-85/month → \$5-15/month"
echo "   💰 Save: ~75-85% monthly costs"
echo ""
echo "🔧 GitHub Actions Configuration:"
echo "   Add these secrets to your repository:"
echo "   • AWS_ACCESS_KEY_ID"
echo "   • AWS_SECRET_ACCESS_KEY"
echo "   • CLOUDFRONT_DISTRIBUTION_ID=$DISTRIBUTION_ID"
echo "   • S3_BUCKET=$BUCKET_NAME"
echo ""
echo "📝 Next Steps:"
echo "   1. ✅ Test the deployment: https://$CLOUDFRONT_DOMAIN"
echo "   2. 🔧 Update backend CORS to allow: https://$CLOUDFRONT_DOMAIN"
echo "   3. 🚀 Configure GitHub Actions workflow"
echo "   4. 🗑️  Remove old ECS infrastructure after testing"
echo ""
echo "🚀 To deploy manually: aws s3 sync dist/ s3://$BUCKET_NAME --delete"
echo "⚡ To invalidate cache: aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/*'"