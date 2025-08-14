#!/usr/bin/env node

// Script to fix OAuth redirect_uri_mismatch issues
require('dotenv').config();

console.log('🔧 OAuth Configuration Fix Script\n');

// Current environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

console.log('📋 Current Environment:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`Is Production: ${isProduction}`);
console.log(`Is Development: ${isDevelopment}\n`);

// Define the correct URLs for each environment
const config = {
  development: {
    BACKEND_URL: 'http://localhost:5000',
    FRONTEND_URL: 'http://localhost:3000',
    callbackUrl: 'http://localhost:5000/auth/google/callback'
  },
  production: {
    BACKEND_URL: 'https://watchandearn-e53r.onrender.com',
    FRONTEND_URL: 'https://watch-and-earn-q5dc.vercel.app',
    callbackUrl: 'https://watchandearn-e53r.onrender.com/auth/google/callback'
  }
};

const currentConfig = isProduction ? config.production : config.development;

console.log('🔗 Required URLs for current environment:');
console.log(`BACKEND_URL: ${currentConfig.BACKEND_URL}`);
console.log(`FRONTEND_URL: ${currentConfig.FRONTEND_URL}`);
console.log(`Callback URL: ${currentConfig.callbackUrl}\n`);

// Check current .env values
console.log('📊 Current .env values:');
console.log(`BACKEND_URL: ${process.env.BACKEND_URL || '❌ NOT SET'}`);
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL || '❌ NOT SET'}`);
console.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ NOT SET'}`);
console.log(`GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ NOT SET'}\n`);

// Generate .env content
const envContent = `# Server Configuration
PORT=5000
NODE_ENV=${isProduction ? 'production' : 'development'}

# Database Configuration
MONGODB_URI=${process.env.MONGODB_URI || 'mongodb://localhost:27017/watch-and-earn'}

# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL=${currentConfig.FRONTEND_URL}

# Backend URL (for OAuth callbacks)
BACKEND_URL=${currentConfig.BACKEND_URL}

# JWT Configuration
JWT_SECRET=${process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'}

# Email Configuration (for password reset, etc.)
EMAIL_HOST=${process.env.EMAIL_HOST || 'smtp.gmail.com'}
EMAIL_PORT=${process.env.EMAIL_PORT || '587'}
EMAIL_USER=${process.env.EMAIL_USER || 'your-email@gmail.com'}
EMAIL_PASS=${process.env.EMAIL_PASS || 'your-email-password'}

# Rate Limiting
RATE_LIMIT_WINDOW_MS=${process.env.RATE_LIMIT_WINDOW_MS || '900000'}
RATE_LIMIT_MAX_REQUESTS=${process.env.RATE_LIMIT_MAX_REQUESTS || '100'}

# Security
BCRYPT_SALT_ROUNDS=${process.env.BCRYPT_SALT_ROUNDS || '12'}

# Video Configuration
MAX_VIDEO_DURATION=${process.env.MAX_VIDEO_DURATION || '3600'}
MIN_VIDEO_DURATION=${process.env.MIN_VIDEO_DURATION || '10'}
MAX_REWARD_PER_VIDEO=${process.env.MAX_REWARD_PER_VIDEO || '4.00'}
MIN_REWARD_PER_VIDEO=${process.env.MIN_REWARD_PER_VIDEO || '3.00'}

# Withdrawal Configuration
MIN_WITHDRAWAL_AMOUNT=${process.env.MIN_WITHDRAWAL_AMOUNT || '50'}
MAX_WITHDRAWAL_AMOUNT=${process.env.MAX_WITHDRAWAL_AMOUNT || '10000'}
WITHDRAWAL_WAITING_PERIOD_DAYS=${process.env.WITHDRAWAL_WAITING_PERIOD_DAYS || '30'}

# Referral Configuration
REFERRAL_BONUS_REFERRER=${process.env.REFERRAL_BONUS_REFERRER || '1.00'}
REFERRAL_BONUS_REFERRED=${process.env.REFERRAL_BONUS_REFERRED || '0.50'}

# Google OAuth Configuration
GOOGLE_CLIENT_ID=${process.env.GOOGLE_CLIENT_ID || 'your-google-client-id'}
GOOGLE_CLIENT_SECRET=${process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret'}
GOOGLE_REDIRECT_URL=${process.env.GOOGLE_REDIRECT_URL || currentConfig.callbackUrl}
SESSION_SECRET=${process.env.SESSION_SECRET || 'your-session-secret-key-change-this-in-production'}`;

console.log('📝 Generated .env content:');
console.log('=' .repeat(50));
console.log(envContent);
console.log('=' .repeat(50));

console.log('\n🔧 Google Cloud Console Configuration:');
console.log('\n1. Go to Google Cloud Console → APIs & Services → Credentials');
console.log('2. Edit your OAuth 2.0 Client ID');
console.log('3. In "Authorized redirect URIs", add:');
console.log(`   ${currentConfig.callbackUrl}`);

if (isDevelopment) {
  console.log('\n4. For local development, also add:');
  console.log('   http://localhost:5000/auth/google/callback');
}

console.log('\n5. In "Authorized JavaScript origins", add:');
console.log(`   ${currentConfig.FRONTEND_URL}`);
console.log(`   ${currentConfig.BACKEND_URL}`);

if (isDevelopment) {
  console.log('   http://localhost:3000');
  console.log('   http://localhost:5000');
}

console.log('\n🚀 Deployment Instructions:');
console.log('\nFor Render (Backend):');
console.log('1. Go to your Render dashboard');
console.log('2. Select your backend service');
console.log('3. Go to Environment → Environment Variables');
console.log('4. Add/update these variables:');
console.log(`   BACKEND_URL=${currentConfig.BACKEND_URL}`);
console.log(`   FRONTEND_URL=${currentConfig.FRONTEND_URL}`);
console.log('   NODE_ENV=production');
console.log('   GOOGLE_CLIENT_ID=your-google-client-id');
console.log('   GOOGLE_CLIENT_SECRET=your-google-client-secret');
console.log(`   GOOGLE_REDIRECT_URL=${currentConfig.callbackUrl}`);

console.log('\nFor Vercel (Frontend):');
console.log('1. Go to your Vercel dashboard');
console.log('2. Select your frontend project');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Add/update these variables:');
console.log(`   REACT_APP_API_URL=${currentConfig.BACKEND_URL}`);

console.log('\n✅ After making these changes:');
console.log('1. Restart your backend server');
console.log('2. Clear your browser cache');
console.log('3. Test the Google OAuth flow');

console.log('\n🔍 To test the configuration:');
console.log('1. Run: node debug-urls.js');
console.log('2. Check that the callback URL matches exactly');
console.log('3. Verify the URLs in Google Cloud Console match');
