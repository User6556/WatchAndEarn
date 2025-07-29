# Frontend Deployment Guide - Vercel

## Prerequisites
- Vercel account
- Git repository with your frontend code
- Backend API URL (from Render deployment)

## Deployment Steps

### 1. Prepare Your Repository
Make sure your frontend code is in a Git repository (GitHub, GitLab, etc.)

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to your frontend directory:
   ```bash
   cd frontend
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Link to existing project or create new
   - Set project name
   - Confirm build settings

#### Option B: Using Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend` (if your repo contains both frontend and backend)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### 3. Environment Variables
Set the following environment variables in your Vercel project:

#### Required Variables:
- `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-backend.onrender.com`)

#### Optional Variables:
- `REACT_APP_GOOGLE_CLIENT_ID`: Your Google OAuth client ID (if using Google auth)
- `REACT_APP_GA_TRACKING_ID`: Google Analytics tracking ID
- `REACT_APP_ENABLE_ANALYTICS`: Enable/disable analytics (true/false)
- `REACT_APP_ENABLE_ADS`: Enable/disable ads (true/false)

### 4. Custom Domain (Optional)
1. In your Vercel project settings, go to "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed

### 5. Environment-Specific Deployments
You can set up different environments:

#### Development:
```bash
vercel --env REACT_APP_API_URL=http://localhost:5000
```

#### Production:
```bash
vercel --prod --env REACT_APP_API_URL=https://your-backend.onrender.com
```

## Configuration Files

### vercel.json
The `vercel.json` file is already configured for:
- Static build with React
- Client-side routing support
- Environment variable mapping

### Build Optimization
Your `package.json` already includes the necessary build script:
```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

## Important Notes

1. **Environment Variables**: All environment variables must be prefixed with `REACT_APP_` to be accessible in the React app.

2. **API URL**: Make sure your `REACT_APP_API_URL` points to your deployed backend on Render.

3. **CORS**: Ensure your backend CORS configuration allows requests from your Vercel domain.

4. **Build Process**: Vercel automatically runs `npm install` and `npm run build` during deployment.

5. **Automatic Deployments**: Vercel automatically deploys when you push to your main branch.

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Verify build script works locally: `npm run build`
   - Check Vercel build logs for specific errors

2. **API Connection Issues**:
   - Verify `REACT_APP_API_URL` is set correctly
   - Check CORS configuration on backend
   - Test API endpoints directly

3. **Routing Issues**:
   - The `vercel.json` includes a catch-all route for client-side routing
   - Ensure React Router is configured correctly

4. **Environment Variables**:
   - Remember to prefix with `REACT_APP_`
   - Redeploy after changing environment variables

### Performance Optimization:

1. **Image Optimization**: Vercel automatically optimizes images
2. **Caching**: Static assets are cached automatically
3. **CDN**: Global CDN for fast loading worldwide

## Post-Deployment

1. **Test Your Application**: Verify all features work correctly
2. **Update Backend CORS**: Add your Vercel domain to backend CORS settings
3. **Monitor Performance**: Use Vercel Analytics to monitor performance
4. **Set Up Monitoring**: Configure error tracking and monitoring

## Continuous Deployment

Vercel automatically deploys when you:
- Push to the main branch
- Create a pull request
- Merge a pull request

You can also trigger manual deployments from the Vercel dashboard. 