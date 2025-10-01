#!/bin/bash

set -e

echo "🚀 Setting up frontend deployment infrastructure..."

# Variáveis
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
CLUSTER_NAME="auth-api-cluster"
ECR_REPO="dashboard-front"
SERVICE_NAME="dashboard-front-service"
REGION="us-east-1"

echo "AWS Account ID: $AWS_ACCOUNT_ID"
echo "Region: $REGION"
echo "Cluster: $CLUSTER_NAME"

# 1. Criar ECR Repository
echo "📦 Creating ECR repository..."
aws ecr create-repository \
    --repository-name $ECR_REPO \
    --image-scanning-configuration scanOnPush=true \
    --tags Key=Project,Value=dashboard-front \
    --region $REGION 2>/dev/null || echo "Repository already exists"

# 2. Criar CloudWatch Log Group
echo "📊 Creating CloudWatch log group..."
aws logs create-log-group \
    --log-group-name /ecs/dashboard-front \
    --tags Environment=Production,Service=dashboard-front \
    --region $REGION 2>/dev/null || echo "Log group already exists"

aws logs put-retention-policy \
    --log-group-name /ecs/dashboard-front \
    --retention-in-days 30 \
    --region $REGION 2>/dev/null || echo "Retention policy already set"

# 3. Obter informações da VPC existente
echo "🔍 Getting VPC information..."
VPC_ID=$(aws ec2 describe-vpcs \
    --filters "Name=is-default,Values=true" \
    --query 'Vpcs[0].VpcId' \
    --output text \
    --region $REGION)

if [ "$VPC_ID" = "None" ] || [ -z "$VPC_ID" ]; then
    echo "❌ Default VPC not found. Please ensure you have a VPC configured."
    exit 1
fi

echo "VPC ID: $VPC_ID"

# 4. Obter subnets públicas
echo "🔍 Getting subnet information..."
SUBNETS=$(aws ec2 describe-subnets \
    --filters "Name=vpc-id,Values=$VPC_ID" "Name=map-public-ip-on-launch,Values=true" \
    --query 'Subnets[0:2].SubnetId' \
    --output text \
    --region $REGION)

SUBNET_ARRAY=($SUBNETS)
SUBNET1_ID=${SUBNET_ARRAY[0]}
SUBNET2_ID=${SUBNET_ARRAY[1]}

echo "Subnet 1: $SUBNET1_ID"
echo "Subnet 2: $SUBNET2_ID"

# 5. Criar Security Group para ECS
echo "🛡️ Creating security group..."
SG_ID=$(aws ec2 create-security-group \
    --group-name dashboard-front-ecs-sg \
    --description "Security group for dashboard frontend ECS tasks" \
    --vpc-id $VPC_ID \
    --query 'GroupId' \
    --output text \
    --region $REGION 2>/dev/null || echo "Security group already exists")

if [ "$SG_ID" != "Security group already exists" ]; then
    # Adicionar regras de entrada
    aws ec2 authorize-security-group-ingress \
        --group-id $SG_ID \
        --protocol tcp \
        --port 80 \
        --cidr 0.0.0.0/0 \
        --region $REGION

    aws ec2 authorize-security-group-ingress \
        --group-id $SG_ID \
        --protocol tcp \
        --port 443 \
        --cidr 0.0.0.0/0 \
        --region $REGION

    echo "Security Group ID: $SG_ID"
else
    # Obter ID do security group existente
    SG_ID=$(aws ec2 describe-security-groups \
        --filters "Name=group-name,Values=dashboard-front-ecs-sg" \
        --query 'SecurityGroups[0].GroupId' \
        --output text \
        --region $REGION)
    echo "Using existing Security Group ID: $SG_ID"
fi

# 6. Criar Application Load Balancer
echo "⚖️ Creating Application Load Balancer..."
ALB_ARN=$(aws elbv2 create-load-balancer \
    --name dashboard-front-alb \
    --subnets $SUBNET1_ID $SUBNET2_ID \
    --security-groups $SG_ID \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4 \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text \
    --region $REGION 2>/dev/null || echo "Load balancer already exists")

if [ "$ALB_ARN" = "Load balancer already exists" ]; then
    ALB_ARN=$(aws elbv2 describe-load-balancers \
        --names dashboard-front-alb \
        --query 'LoadBalancers[0].LoadBalancerArn' \
        --output text \
        --region $REGION)
fi

echo "ALB ARN: $ALB_ARN"

# 7. Criar Target Group
echo "🎯 Creating target group..."
TG_ARN=$(aws elbv2 create-target-group \
    --name dashboard-front-tg \
    --protocol HTTP \
    --port 80 \
    --vpc-id $VPC_ID \
    --target-type ip \
    --health-check-path /health \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 10 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3 \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text \
    --region $REGION 2>/dev/null || echo "Target group already exists")

if [ "$TG_ARN" = "Target group already exists" ]; then
    TG_ARN=$(aws elbv2 describe-target-groups \
        --names dashboard-front-tg \
        --query 'TargetGroups[0].TargetGroupArn' \
        --output text \
        --region $REGION)
fi

echo "Target Group ARN: $TG_ARN"

# 8. Criar Listener para ALB
echo "👂 Creating ALB listener..."
LISTENER_ARN=$(aws elbv2 create-listener \
    --load-balancer-arn $ALB_ARN \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=$TG_ARN \
    --query 'Listeners[0].ListenerArn' \
    --output text \
    --region $REGION 2>/dev/null || echo "Listener already exists")

if [ "$LISTENER_ARN" = "Listener already exists" ]; then
    LISTENER_ARN=$(aws elbv2 describe-listeners \
        --load-balancer-arn $ALB_ARN \
        --query 'Listeners[0].ListenerArn' \
        --output text \
        --region $REGION)
fi

echo "Listener ARN: $LISTENER_ARN"

# 9. Registrar Task Definition
echo "📋 Registering task definition..."
aws ecs register-task-definition \
    --cli-input-json file://task-definition.json \
    --region $REGION

# 10. Criar ECS Service
echo "🚀 Creating ECS service..."
aws ecs create-service \
    --cluster $CLUSTER_NAME \
    --service-name $SERVICE_NAME \
    --task-definition dashboard-front:1 \
    --desired-count 1 \
    --launch-type FARGATE \
    --platform-version LATEST \
    --network-configuration "awsvpcConfiguration={
        subnets=[$SUBNET1_ID,$SUBNET2_ID],
        securityGroups=[$SG_ID],
        assignPublicIp=ENABLED
    }" \
    --load-balancers "targetGroupArn=$TG_ARN,containerName=dashboard-front,containerPort=80" \
    --deployment-configuration "maximumPercent=200,minimumHealthyPercent=50" \
    --health-check-grace-period-seconds 120 \
    --region $REGION 2>/dev/null || echo "Service already exists"

# 11. Obter DNS do Load Balancer
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --load-balancer-arns $ALB_ARN \
    --query 'LoadBalancers[0].DNSName' \
    --output text \
    --region $REGION)

echo ""
echo "✅ Frontend infrastructure setup completed!"
echo ""
echo "📊 Summary:"
echo "  - ECR Repository: $ECR_REPO"
echo "  - ECS Cluster: $CLUSTER_NAME"
echo "  - ECS Service: $SERVICE_NAME"
echo "  - ALB DNS: $ALB_DNS"
echo "  - Security Group: $SG_ID"
echo ""
echo "🌐 Your frontend will be available at: http://$ALB_DNS"
echo ""
echo "📝 Next steps:"
echo "  1. Push your code to trigger the GitHub Actions workflow"
echo "  2. Monitor the deployment in AWS ECS console"
echo "  3. Access your application using the ALB DNS above"