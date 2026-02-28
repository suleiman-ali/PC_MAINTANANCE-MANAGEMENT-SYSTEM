# Frontend Deployment Guide - PC Maintenance Management System

## 🔴 Issue Encountered: "vite: Permission denied"

### Root Cause
The vite executable in `node_modules/.bin/vite` doesn't have proper execute permissions in the Render.com environment. This happens because:
1. npm install doesn't properly set executable bits on Unix-like filesystems in some cases
2. Direct shell execution of node_modules binaries can fail
3. PATH issues with finding the vite executable

### ✅ Solutions Applied

#### 1. Use `npx` Instead of Direct `vite` Call
**CHANGE**: Modified build process to use `npx vite` which properly handles:
- Executable path resolution
- Node version compatibility
- Permission handling
- PATH configuration

#### 2. Create Proper Build Scripts
- **`frontend/build.sh`** - Frontend-only build script using npx
- **`fullstack-build.sh`** - Complete build for both frontend and backend

#### 3. Configuration Files Added
- **`frontend/Procfile`** - Process definition for Render.com
- **`frontend/render.yaml`** - Blueprint configuration (optional)
- **`frontend/.env.example`** - Environment variables template
- **`frontend/.env.local`** - Local development variables
- **`frontend/.gitignore`** - Proper Git ignore rules

---

## 🚀 Deployment Instructions

### Option 1: Deploy Frontend Only to Render.com (RECOMMENDED)

1. **Create Static Site Service on Render.com**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your frontend repository

2. **Configure Settings**
   - **Environment**: Select the repo branch
   - **Build command**: `npm install && npx vite build`
   - **Publish directory**: `dist`

3. **Set Environment Variables**
   - Go to "Environment"
   - Add: `VITE_API_URL=https://your-backend-domain.onrender.com/api`

4. **Deploy**
   - Click "Create Static Site"
   - Wait for build to complete

### Option 2: Deploy as Web Service (With Backend)

1. **Create Web Service on Render.com**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your root repository (fullstack project)

2. **Configure Settings**
   ```
   Build Command:  ./fullstack-build.sh
   Start Command:  cd frontend && npm run preview
   ```

3. **Set Environment Variables**
   - `VITE_API_URL=https://your-backend-domain.onrender.com/api`
   - `DATABASE_URL=postgresql://...`
   - `SECRET_KEY=...` (for backend)
   - And all other backend variables

4. **Deploy**

### Option 3: Deploy Frontend & Backend Separately (BEST PRACTICE)

**Frontend Service:**
- Type: Static Site
- Build: `npm install && npx vite build`
- Publish dir: `dist`
- Environment: `VITE_API_URL=https://your-backend-url/api`

**Backend Service:**
- Type: Web Service
- Build: `./build.sh` (in backend folder)
- Start: `gunicorn backend.wsgi`
- Environment: All Django variables (see DEPLOYMENT.md)

---

## 📋 Frontend Build Process

```bash
# Step 1: Install dependencies
npm install

# Step 2: Build optimized production bundle
npx vite build

# Step 3: Generate minified output in dist/
# dist/ folder is ready for deployment
```

### Output Structure
```
dist/
├── index.html          # Minified entry point
├── assets/
│   ├── index-*.js      # Minified React bundle
│   └── index-*.css     # Minified styles
└── vite.svg            # Assets
```

---

## 🔧 Troubleshooting

### Error: "vite: Permission denied"
**Solution**: Always use `npx vite` instead of `vite`
```bash
# ❌ DON'T
vite build

# ✅ DO
npx vite build
```

### Error: "Module not found"
**Solution**: Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
npx vite build
```

### Error: "Cannot find module 'react'"
**Solution**: Ensure all dependencies are installed
```bash
npm install --production=false
```

### Build Fails on Render
**Solution**: Check build logs
- Render Dashboard → Service → Logs tab
- Look for errors and fix accordingly
- Common issues:
  - Missing environment variables
  - Node version mismatch
  - Corrupted node_modules

---

## 🌐 API Configuration

### Local Development
```javascript
// .env.local
VITE_API_URL=http://localhost:8000/api
```

### Production Deployment
```javascript
// Set in Render Environment Variables
VITE_API_URL=https://your-backend.onrender.com/api
```

### Using API in Components
```javascript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export default apiClient
```

---

## 📦 Dependencies

**Production Dependencies:**
- React 18.2.0 - UI framework
- React Router DOM 6.20.0 - Client-side routing
- Axios 1.6.0 - HTTP client

**Development Dependencies:**
- Vite 5.0.0 - Build tool (MUCH faster than Create React App!)
- @vitejs/plugin-react 4.2.0 - React support
- TypeScript types for React (optional but recommended)

---

## ✨ Performance Improvements with Vite

✅ **Instant Server Start** - ~300ms vs 5000ms with CRA
✅ **Lightning Fast HMR** - Hot Module Replacement updates in <100ms
✅ **Optimized Build** - Smaller bundles, faster delivery
✅ **Native ES Modules** - Modern JavaScript support

---

## 🔒 Security Notes

1. **Never commit `.env` files** - Use environment variables only
2. **API URLs in environment** - Don't hardcode backend URLs
3. **CORS Configuration** - Backend must allow frontend origin
4. **HTTPS Only** - Always use HTTPS in production

---

## 📝 Environment Variables Reference

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_API_URL` | `http://localhost:8000/api` | Backend API endpoint |
| `VITE_APP_NAME` | `PC Maintenance` | Application title |
| `VITE_ENV` | `development` | Build environment |

---

## 🎯 Next Steps After Deployment

1. ✅ Test API connectivity from frontend
2. ✅ Verify login/authentication flow
3. ✅ Test all main features
4. ✅ Check browser console for errors
5. ✅ Monitor Render logs for issues
6. ✅ Set up custom domain (optional)

---

## 📞 Quick References

- **Render Docs**: https://render.com/docs
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev
- **Axios Docs**: https://axios-http.com

---

**Status**: ✅ Frontend deployment ready
**Last Updated**: February 28, 2026
**Build Tool**: Vite 5.0.0 (NOT Create React App)
