# 🔧 OAuth redirect_uri_mismatch Fix Guide

## 🚨 The Problem
Your Google OAuth is failing with `redirect_uri_mismatch` error because:
1. Missing `BACKEND_URL` and `FRONTEND_URL` environment variables
2. Google Cloud Console redirect URIs don't match what your backend sends
3. Environment-specific URLs are not properly configured

## 🔍 Current Status
- **Backend URL**: `https://watchandearn-e53r.onrender.com`
- **Frontend URL**: `https://watch-and-earn-q5dc.vercel.app`
- **Development Backend**: `http://localhost:5000`
- **Development Frontend**: `http://localhost:3000`

## 📝 Step 1: Fix Backend Environment Variables

### For Development (.env file)
Add these lines to your `backend/.env` file:

```env
# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL=http://localhost:3000

# Backend URL (for OAuth callbacks)
BACKEND_URL=http://localhost:5000
```

### For Production (Render Dashboard)
Go to your Render dashboard → Environment → Environment Variables and add:

```env
BACKEND_URL=https://watchandearn-e53r.onrender.com
FRONTEND_URL=https://watch-and-earn-q5dc.vercel.app
NODE_ENV=production
```

## 🔧 Step 2: Fix Google Cloud Console Configuration

### 2.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find and edit your **OAuth 2.0 Client ID**

### 2.2 Authorized Redirect URIs
Add these exact URLs to "Authorized redirect URIs":

**For Production:**
```
https://watchandearn-e53r.onrender.com/auth/google/callback
```

**For Development (if testing locally):**
```
http://localhost:5000/auth/google/callback
```

### 2.3 Authorized JavaScript Origins
Add these URLs to "Authorized JavaScript origins":

**For Production:**
```
https://watch-and-earn-q5dc.vercel.app
https://watchandearn-e53r.onrender.com
```

**For Development (if testing locally):**
```
http://localhost:3000
http://localhost:5000
```

## 🚀 Step 3: Fix Frontend Environment Variables

### For Production (Vercel Dashboard)
Go to your Vercel dashboard → Settings → Environment Variables and add:

```env
REACT_APP_API_URL=https://watchandearn-e53r.onrender.com
```

### For Development (.env file in frontend)
Create `frontend/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
```

## 🔄 Step 4: Restart and Test

### 4.1 Restart Backend
```bash
# Stop your backend server (Ctrl+C)
# Then restart it
npm start
```

### 4.2 Restart Frontend
```bash
# Stop your frontend server (Ctrl+C)
# Then restart it
npm start
```

### 4.3 Test the Configuration
Run the debug script to verify:
```bash
cd backend
node debug-urls.js
```

You should see:
```
Callback URL: https://watchandearn-e53r.onrender.com/auth/google/callback
```

## ✅ Step 5: Verify Everything Works

### 5.1 Test OAuth Flow
1. Go to your frontend app
2. Click "Sign in with Google"
3. Complete the OAuth flow
4. You should be redirected back successfully

### 5.2 Check Backend Health
Visit: `https://watchandearn-e53r.onrender.com/api/health`

You should see:
```json
{
  "status": "OK",
  "callbackUrl": "https://watchandearn-e53r.onrender.com/auth/google/callback",
  "backendUrl": "https://watchandearn-e53r.onrender.com",
  "frontendUrl": "https://watch-and-earn-q5dc.vercel.app"
}
```

## 🛠️ Troubleshooting

### If you still get redirect_uri_mismatch:

1. **Double-check Google Cloud Console**:
   - Make sure the redirect URI is exactly: `https://watchandearn-e53r.onrender.com/auth/google/callback`
   - No extra spaces, no trailing slashes (unless you have them in your code)

2. **Clear Browser Cache**:
   - Clear all browser data for your domain
   - Try in incognito/private mode

3. **Check Environment Variables**:
   - Verify `BACKEND_URL` is set correctly in Render
   - Verify `REACT_APP_API_URL` is set correctly in Vercel

4. **Check Backend Logs**:
   - Look at Render logs for any errors
   - Check the `/api/health` endpoint response

### Common Mistakes to Avoid:

❌ **Wrong Protocol**: Using `http://` instead of `https://` in production
❌ **Wrong Domain**: Using localhost URLs in production
❌ **Extra Slashes**: Having trailing slashes when they shouldn't be there
❌ **Case Sensitivity**: URLs are case-sensitive
❌ **Missing Environment Variables**: Not setting `BACKEND_URL` and `FRONTEND_URL`

## 📞 Need Help?

If you're still having issues:

1. Run the debug script: `node debug-urls.js`
2. Check the health endpoint: `/api/health`
3. Verify all environment variables are set correctly
4. Make sure Google Cloud Console URLs match exactly

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use strong, unique secrets for `JWT_SECRET` and `SESSION_SECRET`
- Regularly rotate your Google OAuth credentials
- Use HTTPS in production environments
