#!/bin/bash

# Chryp Lite Deployment Script
# Deployment ID: 694c5103-06c0-4afb-8def-9cbcf6e97061

echo "🚀 Starting Chryp Lite deployment..."

# Set deployment environment variables
export NODE_ENV=production
export VITE_API_BASE_URL=https://chryp-lite-backend.onrender.com/api
export DEPLOYMENT_ID=694c5103-06c0-4afb-8def-9cbcf6e97061

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "🌐 Application ready for deployment to: https://694c5103-06c0-4afb-8def-9cbcf6e97061.netlify.app"

# Optional: Deploy to Netlify CLI if available
if command -v netlify &> /dev/null; then
    echo "🚀 Deploying to Netlify..."
    netlify deploy --prod --dir=dist
else
    echo "ℹ️  Netlify CLI not found. Please deploy manually or install with: npm install -g netlify-cli"
fi
