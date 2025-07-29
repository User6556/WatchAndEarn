# Watch and Earn Website - Complete Deployment Guide

This guide covers deploying both the backend (Node.js/Express) to Render and the frontend (React) to Vercel.

## 🚀 Quick Start

1. **Backend (Render)**: Deploy first to get the API URL
2. **Frontend (Vercel)**: Deploy with the backend API URL
3. **Configure**: Set up environment variables and CORS

## 📋 Prerequisites

### Required Services
- **MongoDB Atlas**: Database hosting
- **Google Cloud Console**: OAuth credentials
- **Render**: Backend hosting
- **Vercel**: Frontend hosting
- **Git Repository**: GitHub, GitLab, or similar

### Required Credentials
- MongoDB connection string
- Google OAuth client ID and secret
- Email service credentials (optional)

## 🔧 Backend Deployment (Render)

### Step 1: Prepare MongoDB
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add your IP to the whitelist (or use 0.0.0.0/0 for Render)

### Step 2: Prepare Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback` (development)
   - `https://your-app-name.onrender.com/auth/google/callback` (production)

### Step 3: Deploy to Render
1. Push your code to Git repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Blueprint"
4. Connect your repository
5. Render will auto-detect `render.yaml` and configure the service

### Step 4: Configure Environment Variables
In your Render service settings, add these environment variables:

```bash
# Required
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/watch-and-earn
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-frontend-app.vercel.app

# Optional
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### Step 5: Update Google OAuth Callback
After deployment, update your Google OAuth callback URL to:
```
https://your-render-app-name.onrender.com/auth/google/callback
```

## 🎨 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory: `cd frontend`
3. Deploy: `vercel`
4. Follow the prompts to configure the project

### Step 2: Configure Environment Variables
In your Vercel project settings, add:

```bash
# Required
REACT_APP_API_URL=https://your-backend-app-name.onrender.com

# Optional
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GA_TRACKING_ID=your-ga-tracking-id
```

### Step 3: Update Backend CORS
In your Render backend, ensure the `FRONTEND_URL` environment variable includes your Vercel domain.

## 🔗 Connecting Frontend and Backend

### 1. Update API Configuration
The frontend is already configured to use environment variables. Make sure:
- `REACT_APP_API_URL` points to your Render backend
- Backend CORS allows your Vercel domain

### 2. Test the Connection
1. Visit your Vercel frontend
2. Try to register/login
3. Check browser console for API errors
4. Verify CORS headers in network tab

## 🛠️ Environment Variables Reference

### Backend (Render)
| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Set to `production` |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for JWT tokens |
| `SESSION_SECRET` | Yes | Secret for sessions |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `FRONTEND_URL` | Yes | Your Vercel frontend URL |

### Frontend (Vercel)
| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | Yes | Your Render backend URL |
| `REACT_APP_GOOGLE_CLIENT_ID` | No | Google OAuth client ID |

## 🔍 Troubleshooting

### Common Issues

#### Backend Issues
1. **Build Failures**
   - Check `package.json` has all dependencies
   - Verify Node.js version compatibility
   - Check Render build logs

2. **Database Connection**
   - Verify MongoDB URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database exists

3. **CORS Errors**
   - Verify `FRONTEND_URL` is set correctly
   - Check browser console for CORS errors
   - Ensure protocol (http/https) matches

#### Frontend Issues
1. **API Connection**
   - Verify `REACT_APP_API_URL` is correct
   - Check network tab for failed requests
   - Test API endpoints directly

2. **Build Failures**
   - Run `npm run build` locally first
   - Check for missing dependencies
   - Verify environment variables are set

### Debugging Steps
1. Check deployment logs in both platforms
2. Test API endpoints with Postman/curl
3. Check browser console for errors
4. Verify environment variables are set correctly
5. Test locally with production environment variables

## 📊 Monitoring and Maintenance

### Render (Backend)
- Monitor service logs in Render dashboard
- Set up alerts for service downtime
- Monitor MongoDB Atlas metrics
- Check for memory/CPU usage

### Vercel (Frontend)
- Use Vercel Analytics for performance monitoring
- Monitor build success rates
- Set up error tracking (Sentry, etc.)
- Monitor Core Web Vitals

## 🔄 Continuous Deployment

### Automatic Deployments
- **Render**: Deploys on Git push to main branch
- **Vercel**: Deploys on Git push to main branch

### Manual Deployments
- **Render**: Trigger from dashboard or `render deploy`
- **Vercel**: `vercel --prod` or from dashboard

## 🚨 Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Only allow necessary domains
3. **Rate Limiting**: Already configured in backend
4. **HTTPS**: Both platforms provide SSL certificates
5. **Database**: Use MongoDB Atlas with proper authentication

## 📞 Support

- **Render**: [Documentation](https://render.com/docs)
- **Vercel**: [Documentation](https://vercel.com/docs)
- **MongoDB Atlas**: [Documentation](https://docs.atlas.mongodb.com/)

## 🎯 Next Steps

After successful deployment:
1. Set up custom domains
2. Configure monitoring and alerts
3. Set up CI/CD pipelines
4. Implement backup strategies
5. Plan for scaling 