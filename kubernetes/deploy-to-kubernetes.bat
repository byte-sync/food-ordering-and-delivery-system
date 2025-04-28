@echo off
REM Script to deploy the food ordering system to Kubernetes on Windows

echo === Starting deployment of Food Ordering ^& Delivery System to Kubernetes ===
echo Deploying resources from directory: %~dp0
echo.

REM Function to apply a Kubernetes file with proper error handling
:apply_kubernetes_file
    echo Applying: %1
    kubectl apply -f "%1"
    if %ERRORLEVEL% neq 0 (
        echo X Failed to apply %1. Deployment aborted.
        exit /b 1
    ) else (
        echo √ Successfully applied %1
    )
    echo.
    REM Small delay to ensure resources are registered
    timeout /t 2 /nobreak >nul
    exit /b 0

REM Deploy namespace first
echo === Creating namespace ===
call :apply_kubernetes_file "%~dp000-namespace.yaml"

REM Deploy API Gateway ConfigMaps
echo === Deploying API Gateway ConfigMaps ===
call :apply_kubernetes_file "%~dp001-api-gateway-configmaps.yaml"

REM Deploy API Gateway
echo === Deploying API Gateway ===
call :apply_kubernetes_file "%~dp002-api-gateway.yaml"

REM Deploy Auth Service
echo === Deploying Auth Service ===
call :apply_kubernetes_file "%~dp003-auth-service.yaml"

REM Deploy Session Service
echo === Deploying Session Service ===
call :apply_kubernetes_file "%~dp004-session-service.yaml"

REM Deploy User Service
echo === Deploying User Service ===
call :apply_kubernetes_file "%~dp005-user-service.yaml"

REM Deploy Order Service
echo === Deploying Order Service ===
call :apply_kubernetes_file "%~dp006-order-service.yaml"

REM Deploy Menu Service (with MySQL)
echo === Deploying Menu Service ===
call :apply_kubernetes_file "%~dp007-menu-service.yaml"

REM Deploy Cart Service
echo === Deploying Cart Service ===
call :apply_kubernetes_file "%~dp008-cart-service.yaml"

REM Deploy Notification Service
echo === Deploying Notification Service ===
call :apply_kubernetes_file "%~dp009-notification-service.yaml"

REM Deploy Payment Service
echo === Deploying Payment Service ===
call :apply_kubernetes_file "%~dp010-payment-service.yaml"

REM Check if any additional service files exist and deploy them
if exist "%~dp011-delivery-service.yaml" (
  echo === Deploying Delivery Service ===
  call :apply_kubernetes_file "%~dp011-delivery-service.yaml"
)

if exist "%~dp012-ratings-reviews-service.yaml" (
  echo === Deploying Ratings and Reviews Service ===
  call :apply_kubernetes_file "%~dp012-ratings-reviews-service.yaml"
)

echo === Deployment completed! ===
echo Waiting for pods to become ready...
echo.

REM Wait for a moment to let pods initialize
timeout /t 10 /nobreak >nul

REM Check the status of the deployment
echo === Checking pod status ===
kubectl get pods -n nomnom-system

REM Get the API Gateway service information
echo.
echo === API Gateway Access Information ===
kubectl get service api-gateway -n nomnom-system

echo.
echo You can access the Food Ordering ^& Delivery System through the External IP/Port of the API Gateway
echo Note: If using Minikube, run 'minikube service api-gateway -n nomnom-system' to access the application

pause