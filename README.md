
##  Food Ordering & Delivery System Deployment Guide

This guide provides instructions for deploying the Food Ordering & Delivery System using Docker and Kubernetes with kind.

--------------------------------------------------------------------------------

### 🐳 Deployment with Docker

Prerequisites:
- Docker installed
- Docker Compose installed

Steps:
1. Navigate to the backend directory:
   ```cd backend```

2. Start the services using Docker Compose:
   ```docker-compose up --build```

3. Verify that all services are running:
   ```docker ps```

4. Access the application:
   http://localhost

--------------------------------------------------------------------------------

### ☸️ Deployment with Kubernetes (kind)

Prerequisites:
- kind installed
- kubectl CLI installed and configured

Using kind for Kubernetes Deployment:

1. Create a kind cluster:
   ```kind create cluster --name nomnom-system```

2. Load Docker images into the kind cluster:
   ```kind load docker-image <image-name> --name nomnom-system```

3. Navigate to the Kubernetes manifests directory:
   ```cd kubernetes```

4. Deploy the application:
   ```kubectl apply -f .```

5. Monitor the deployment:
   ```bash
   kubectl get pods -n nomnom-system
   kubectl get services -n nomnom-system
   ```

6. Access the application:

   If using kind, forward the API Gateway port:
   kubectl port-forward service/api-gateway 8080:80 -n nomnom-system

   Then open in your browser:
   http://localhost:8080

--------------------------------------------------------------------------------

#### 📝 Notes:
- Ensure all .env files are properly configured before deployment.
- For production:
  - Use a managed Kubernetes service
  - Store secrets using Kubernetes Secrets
  - Use TLS, ingress, and monitoring tools.
