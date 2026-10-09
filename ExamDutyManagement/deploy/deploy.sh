#!/bin/bash
# ==============================================================================
# Hostinger VPS Application Deployment Script
# Builds and restarts Backend (NestJS / PM2) & Frontend (React / Vite / Nginx)
# ==============================================================================

set -e

APP_DIR="/var/www/exam-duty"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "============================================================"
echo " Starting Application Deployment on Hostinger VPS"
echo "============================================================"

# Check if application directory exists
if [ ! -d "$BACKEND_DIR" ]; then
  echo "[-] Backend directory $BACKEND_DIR not found!"
  exit 1
fi

# 1. Backend Build & PM2 Process Restart
echo "[1/4] Deploying Backend (NestJS)..."
cd "$BACKEND_DIR"

if [ ! -f ".env" ]; then
  if [ -f ".env.production.example" ]; then
    echo "[!] No .env found. Copying .env.production.example to .env..."
    cp .env.production.example .env
    echo "[!] Please verify and update your database credentials in $BACKEND_DIR/.env"
  fi
fi

# Create logs & uploads directory if missing
mkdir -p logs
mkdir -p uploads/attendance

echo "Installing backend dependencies..."
npm install --legacy-peer-deps

echo "Building backend..."
npm run build

echo "Starting/Reloading PM2 service..."
pm2 startOrRestart ecosystem.config.js
pm2 save

# 2. Frontend Build
echo "[2/4] Deploying Frontend (React + Vite)..."
cd "$FRONTEND_DIR"

if [ ! -f ".env" ]; then
  if [ -f ".env.production.example" ]; then
    cp .env.production.example .env
  fi
fi

echo "Installing frontend dependencies..."
npm install

echo "Building frontend production bundle..."
npm run build

# 3. Nginx Configuration
echo "[3/4] Checking Nginx configuration..."
if [ -f "$APP_DIR/deploy/nginx/exam-duty.conf" ]; then
  cp "$APP_DIR/deploy/nginx/exam-duty.conf" /etc/nginx/sites-available/exam-duty
  ln -sf /etc/nginx/sites-available/exam-duty /etc/nginx/sites-enabled/exam-duty
  # Remove default if present
  rm -f /etc/nginx/sites-enabled/default
fi

nginx -t
systemctl reload nginx

# 4. Summary & Verification
echo "[4/4] Verifying services..."
echo "------------------------------------------------------------"
pm2 status
echo "------------------------------------------------------------"
echo "✔ Deployment completed successfully!"
echo "Backend is running on PM2 and proxied via Nginx."
echo "Frontend is built in $FRONTEND_DIR/dist and served by Nginx."
echo "============================================================"
