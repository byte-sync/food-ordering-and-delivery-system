#!/bin/bash
# Script to create Kubernetes secrets from .env files in each service

# Set the namespace
NAMESPACE="nomnom-system"

# Create the namespace if it doesn't exist
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Auth Service
echo "Creating secret for Auth Service..."
kubectl create secret generic auth-service-secrets -n $NAMESPACE --from-env-file=../backend/auth-service/.env --dry-run=client -o yaml | kubectl apply -f -

# Session Service
echo "Creating secret for Session Service..."
kubectl create secret generic session-service-secrets -n $NAMESPACE --from-env-file=../backend/session-service/.env --dry-run=client -o yaml | kubectl apply -f -

# User Service
echo "Creating secret for User Service..."
kubectl create secret generic user-service-secrets -n $NAMESPACE --from-env-file=../backend/user-service/.env --dry-run=client -o yaml | kubectl apply -f -

# Order Service
echo "Creating secret for Order Service..."
kubectl create secret generic order-service-secrets -n $NAMESPACE --from-env-file=../backend/order-service/.env --dry-run=client -o yaml | kubectl apply -f -

# Menu Service
echo "Creating secret for Menu Service..."
kubectl create secret generic menu-service-secrets -n $NAMESPACE --from-env-file=../backend/menu-service/.env --dry-run=client -o yaml | kubectl apply -f -

# Cart Service
echo "Creating secret for Cart Service..."
kubectl create secret generic cart-service-secrets -n $NAMESPACE --from-env-file=../backend/cart-service/.env --dry-run=client -o yaml | kubectl apply -f -

# Notification Service
echo "Creating secret for Notification Service..."
kubectl create secret generic notification-service-secrets -n $NAMESPACE --from-env-file=../backend/notification-service/.env --dry-run=client -o yaml | kubectl apply -f -

# Payment Service
echo "Creating secret for Payment Service..."
kubectl create secret generic payment-service-secrets -n $NAMESPACE --from-env-file=../backend/payment-service/.env --dry-run=client -o yaml | kubectl apply -f -

# Delivery Service (if exists)
if [ -f "../backend/delivery-service/.env" ]; then
  echo "Creating secret for Delivery Service..."
  kubectl create secret generic delivery-service-secrets -n $NAMESPACE --from-env-file=../backend/delivery-service/.env --dry-run=client -o yaml | kubectl apply -f -
fi

# Ratings and Reviews Service (if exists)
if [ -f "../backend/ratings-and-reviews-service/.env" ]; then
  echo "Creating secret for Ratings and Reviews Service..."
  kubectl create secret generic ratings-reviews-service-secrets -n $NAMESPACE --from-env-file=../backend/ratings-and-reviews-service/.env --dry-run=client -o yaml | kubectl apply -f -
fi

echo "All secrets created successfully!"