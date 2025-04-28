#!/bin/bash

DOCKER_USERNAME="dasunwickr"

# List of services to build and push
services=(
  auth-service
  session-service
  user-service
  payment-service
  order-service
  menu-service
  cart-service
  notification-service
)

# Docker image tag (you can also pass this as an argument)
IMAGE_TAG="latest"

# Loop through each service
for service in "${services[@]}"; do
  echo "🚀 Building $service..."

  docker build -t "$DOCKER_USERNAME/$service:$IMAGE_TAG" "./$service"

  echo "✅ Built $service image."

  echo "📤 Pushing $service to Docker registry..."

  docker push "$DOCKER_USERNAME/$service:$IMAGE_TAG"

  echo "✅ Pushed $service successfully."
  echo "---------------------------------"
done

echo "🎉 All services built and pushed!"
