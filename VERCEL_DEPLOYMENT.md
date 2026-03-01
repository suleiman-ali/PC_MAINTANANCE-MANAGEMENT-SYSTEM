# Frontend Deployment Guide - Vercel

## Prerequisites
- Vercel account (free tier is fine)
- Git repository connected to GitHub/GitLab/Bitbucket
- Backend API running on Render (or another host)

## Quick Start

### 1. Set Up Vercel Project

```bash
# Option A: Deploy from GitHub (recommended)
# 1. Push your repo to GitHub
# 2. Go to https://vercel.com/new
# 3. Import your repository
# 4. Framework: Vite
# 5. Build Command: npm run build
# 6. Output Directory: dist
# 7. Install Command: npm install
```

### 2. Configure Environment Variables

In the **Vercel dashboard** for your project:

1. Go to **Settings → Environment Variables**
2. Add the following:

```
VITE_API_URL=https://your-backend-render-app.onrender.com/api
```

Replace `your-backend-render-app` with your actual Render backend hostname.

### 3. Deploy

The deployment will happen automatically when you push to your main branch.

Vercel will:
- Run `npm install`
- Run `npm run build` 
- Serve the `dist/` folder as a static site

## Environment Variables Reference

| Variable | Example | Notes |
|----------|---------|-------|
| `VITE_API_URL` | `https://backend.onrender.com/api` | Required - points to your Django backend |
| `VITE_APP_NAME` | `PC Maintenance Management System` | Optional - app display name |
| `VITE_ENV` | `production` | Set automatically by Vercel |

## Building Locally for Testing

To test the production build locally:

```bash
# Set the production API URL
export VITE_API_URL=https://your-backend-render-app.onrender.com/api

# Build the project
npm run build

# Preview the build output
npm run preview
```

The app will be served at `http://localhost:4173/`.

## Troubleshooting

### CORS Errors
- Backend is unreachable or API URL is incorrect
- Check `VITE_API_URL` matches your Render backend hostname exactly
- Ensure backend has proper `CORS_ALLOWED_ORIGINS` set to include your Vercel domain

### 404 on API Calls
- Backend is down or not deployed
- Check Render service logs for errors
- Verify database connection and migrations ran successfully

### Build Fails
- Check the **Deployments** tab in Vercel for the full build log
- Common cause: missing environment variables
- Ensure `node_modules` is excluded from git (check `.gitignore`)

## Redeploying

- **Automatic**: Every push to main branch triggers a new deployment
- **Manual**: Click "Redeploy" in Vercel dashboard

## Monitoring

- Check **Deployments** tab to see build/deployment status
- View **Analytics** for performance metrics
- Check **Logs** for runtime errors on the client side

## API Requests Configuration

The frontend uses `VITE_API_URL` environment variable:

```javascript
// src/api - automatically uses environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

This allows seamless switching between:
- **Development**: `http://localhost:8000/api`
- **Production (Vercel)**: `https://your-backend-render-app.onrender.com/api`

## Notes

- `.env.local` is for local development only (git-ignored)
- `.env.production` is for production example only (you can commit it as reference)
- Never commit `.env` files with secrets
- Always use Vercel dashboard to manage production environment variables
