#!/usr/bin/env node

// Debug script to help identify correct URLs for OAuth configuration
require('dotenv').config();

console.log('🔍 Debugging OAuth URLs...\n');

console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('BACKEND_URL:', process.env.BACKEND_URL);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Not set');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Not set');

console.log('\n📋 OAuth Configuration:');

// Helper function to get the correct callback URL (same as in index.js)
const getCallbackURL = () => {
  if (process.env.NODE_ENV === 'production') {
    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl) {
      return `${backendUrl}/auth/google/callback`;
    }
    return 'https://watchandearn-e53r.onrender.com/auth/google/callback';
  }
  return 'http://localhost:5000/auth/google/callback';
};

const callbackUrl = getCallbackURL();
console.log('Callback URL:', callbackUrl);

console.log('\n🔧 To fix OAuth issues:');
console.log('1. Go to Google Cloud Console → APIs & Services → Credentials');
console.log('2. Edit your OAuth 2.0 Client ID');
console.log('3. Add this URL to "Authorized redirect URIs":');
console.log(`   ${callbackUrl}`);
console.log('\n4. Set BACKEND_URL in your Render environment variables to:');
console.log('   https://watchandearn-e53r.onrender.com');

console.log('\n📝 Environment Variables to set in Render:');
console.log('BACKEND_URL=https://watchandearn-e53r.onrender.com');
console.log('FRONTEND_URL=https://your-actual-vercel-app-name.vercel.app'); 