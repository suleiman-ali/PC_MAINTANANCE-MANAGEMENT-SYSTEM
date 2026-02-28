#!/bin/bash
# Build script for frontend on Render.com
set -o errexit

echo "========== Installing Frontend Dependencies =========="
cd frontend
npm install

echo "========== Building Frontend with Vite =========="
# Use npx to ensure proper executable permissions
npx vite build

echo "========== Frontend build completed successfully! =========="
cd ..
