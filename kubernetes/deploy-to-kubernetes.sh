#!/bin/bash
# Script to deploy the food ordering system to Kubernetes

# Set error handling
set -e
set -o pipefail

# Directory where Kubernetes YAML files are located
KUBE_DIR="$(dirname "$0")"

echo "=== Starting deployment of Food Ordering & Delivery System to Kubernetes ==="
echo "Deploying resources from directory: $KUBE_DIR"
echo

# Function to apply a Kubernetes file with proper error handling
apply_kubernetes_file() {
    local file="$1"
    echo "Applying: $file"
    kubectl apply -f "$file"
    if [ $? -eq 0 ]; then
        echo "✓ Successfully applied $file"
    else
        echo "✗ Failed to apply $file. Deployment aborted."
        exit 1
    fi
    echo
    # Small delay to ensure resources are registered
    sleep 2
}

# Deploy namespace first
echo "=== Creating namespace ==="
apply_kubernetes_file "$KUBE_DIR/00-namespace.yaml"

# Deploy API Gateway ConfigMaps
echo "=== Deploying API Gateway ConfigMaps ==="
apply_kubernetes_file "$KUBE_DIR/01-api-gateway-configmaps.yaml"

# Deploy API Gateway
echo "=== Deploying API Gateway ==="
apply_kubernetes_file "$KUBE_DIR/02-api-gateway.yaml"

# Deploy Auth Service
echo "=== Deploying Auth Service ==="
apply_kubernetes_file "$KUBE_DIR/03-auth-service.yaml"

# Deploy Session Service
echo "=== Deploying Session Service ==="
apply_kubernetes_file "$KUBE_DIR/04-session-service.yaml"

# Deploy User Service
echo "=== Deploying User Service ==="
apply_kubernetes_file "$KUBE_DIR/05-user-service.yaml"

# Deploy Order Service
echo "=== Deploying Order Service ==="
apply_kubernetes_file "$KUBE_DIR/06-order-service.yaml"

# Deploy Menu Service (with MySQL)
echo "=== Deploying Menu Service ==="
apply_kubernetes_file "$KUBE_DIR/07-menu-service.yaml"

# Deploy Cart Service
echo "=== Deploying Cart Service ==="
apply_kubernetes_file "$KUBE_DIR/08-cart-service.yaml"

# Deploy Notification Service
echo "=== Deploying Notification Service ==="
apply_kubernetes_file "$KUBE_DIR/09-notification-service.yaml"

# Deploy Payment Service
echo "=== Deploying Payment Service ==="
apply_kubernetes_file "$KUBE_DIR/10-payment-service.yaml"

# Check if any additional service files exist and deploy them
if [ -f "$KUBE_DIR/11-delivery-service.yaml" ]; then
  echo "=== Deploying Delivery Service ==="
  apply_kubernetes_file "$KUBE_DIR/11-delivery-service.yaml"
fi

if [ -f "$KUBE_DIR/12-ratings-reviews-service.yaml" ]; then
  echo "=== Deploying Ratings and Reviews Service ==="
  apply_kubernetes_file "$KUBE_DIR/12-ratings-reviews-service.yaml"
fi

echo "=== Deployment completed! ==="
echo "Waiting for pods to become ready..."
echo

# Wait for a moment to let pods initialize
sleep 10

# Check the status of the deployment
echo "=== Checking pod status ==="
kubectl get pods -n nomnom-system

# Get the API Gateway service information
echo
echo "=== API Gateway Access Information ==="
kubectl get service api-gateway -n nomnom-system

echo
echo "You can access the Food Ordering & Delivery System through the External IP/Port of the API Gateway"
echo "Note: If using Minikube, run 'minikube service api-gateway -n nomnom-system' to access the application"