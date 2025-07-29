# Backend Deployment Guide - Render

## Prerequisites
- MongoDB database (MongoDB Atlas recommended)
- Google OAuth credentials
- Email service credentials

## Deployment Steps

### 1. Prepare Your Repository
Make sure your backend code is in a Git repository (GitHub, GitLab, etc.)

### 2. Deploy to Render

#### Option A: Using render.yaml (Recommended)
1. Push your code to your Git repository
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" and select "Blueprint"
4. Connect your Git repository
5. Render will automatically detect the `render.yaml` file and configure the service

#### Option B: Manual Setup
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `watch-and-earn-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid plan)

### 3. Environment Variables
Set the following environment variables in your Render service:

#### Required Variables:
- `NODE_ENV`: `production`
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret key for JWT tokens
- `SESSION_SECRET`: A strong secret key for sessions
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `FRONTEND_URL`: Your frontend URL (e.g., `https://your-app.vercel.app`)

#### Optional Variables:
- `EMAIL_HOST`: SMTP host for email service
- `EMAIL_PORT`: SMTP port (usually 587)
- `EMAIL_USER`: Email username
- `EMAIL_PASS`: Email password
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 100)
- `BCRYPT_SALT_ROUNDS`: Salt rounds for password hashing (default: 12)
- `MAX_VIDEO_DURATION`: Maximum video duration in seconds (default: 3600)
- `MIN_VIDEO_DURATION`: Minimum video duration in seconds (default: 10)
- `MAX_REWARD_PER_VIDEO`: Maximum reward per video (default: 4.00)
- `MIN_REWARD_PER_VIDEO`: Minimum reward per video (default: 3.00)
- `MIN_WITHDRAWAL_AMOUNT`: Minimum withdrawal amount (default: 50)
- `MAX_WITHDRAWAL_AMOUNT`: Maximum withdrawal amount (default: 10000)
- `WITHDRAWAL_WAITING_PERIOD_DAYS`: Waiting period for withdrawals (default: 30)
- `REFERRAL_BONUS_REFERRER`: Referral bonus for referrer (default: 1.00)
- `REFERRAL_BONUS_REFERRED`: Referral bonus for referred user (default: 0.50)

### 4. Update Google OAuth Callback URL
After deployment, update your Google OAuth callback URL to:
```
https://your-render-app-name.onrender.com/auth/google/callback
```

### 5. Update Frontend API URL
Update your frontend's `REACT_APP_API_URL` environment variable to point to your Render backend URL.

## Important Notes

1. **Free Plan Limitations**: Render's free plan has limitations:
   - Service sleeps after 15 minutes of inactivity
   - Limited bandwidth and build minutes
   - Consider upgrading for production use

2. **Environment Variables**: Never commit sensitive environment variables to your repository. Use Render's environment variable management.

3. **CORS Configuration**: Make sure your `FRONTEND_URL` environment variable is set correctly to avoid CORS issues.

4. **Database**: Use MongoDB Atlas for production database hosting.

## Troubleshooting

### Common Issues:
1. **Build Failures**: Check that all dependencies are in `package.json`
2. **CORS Errors**: Verify `FRONTEND_URL` is set correctly
3. **Database Connection**: Ensure `MONGODB_URI` is correct and accessible
4. **Google OAuth**: Verify callback URLs are updated in Google Console

### Logs:
Check deployment logs in the Render dashboard for detailed error information. 