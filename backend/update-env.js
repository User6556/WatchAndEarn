#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Updating .env file with missing environment variables...\n');

const envPath = path.join(__dirname, '.env');

// Read existing .env file
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found existing .env file');
} catch (error) {
  console.log('⚠️ No existing .env file found, creating new one');
}

// Check if BACKEND_URL and FRONTEND_URL are already set
const hasBackendUrl = envContent.includes('BACKEND_URL=');
const hasFrontendUrl = envContent.includes('FRONTEND_URL=');

console.log(`BACKEND_URL already set: ${hasBackendUrl ? '✅' : '❌'}`);
console.log(`FRONTEND_URL already set: ${hasFrontendUrl ? '✅' : '❌'}\n`);

// Add missing variables
let updatedContent = envContent;

if (!hasBackendUrl) {
  console.log('➕ Adding BACKEND_URL...');
  updatedContent += '\n# Backend URL (for OAuth callbacks)\nBACKEND_URL=http://localhost:5000\n';
}

if (!hasFrontendUrl) {
  console.log('➕ Adding FRONTEND_URL...');
  updatedContent += '\n# Frontend URL (for CORS and OAuth redirects)\nFRONTEND_URL=http://localhost:3000\n';
}

// Write updated content
try {
  fs.writeFileSync(envPath, updatedContent);
  console.log('\n✅ .env file updated successfully!');
  
  if (!hasBackendUrl || !hasFrontendUrl) {
    console.log('\n📝 Added the following variables:');
    if (!hasBackendUrl) console.log('   BACKEND_URL=http://localhost:5000');
    if (!hasFrontendUrl) console.log('   FRONTEND_URL=http://localhost:3000');
    
    console.log('\n🔧 Next steps:');
    console.log('1. For production, update these values in your Render dashboard:');
    console.log('   BACKEND_URL=https://watchandearn-e53r.onrender.com');
    console.log('   FRONTEND_URL=https://watch-and-earn-q5dc.vercel.app');
    console.log('\n2. Update Google Cloud Console with the correct redirect URIs');
    console.log('\n3. Restart your backend server');
  } else {
    console.log('\n✅ All required environment variables are already set!');
  }
  
} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
  console.log('\n📝 Please manually add these lines to your .env file:');
  console.log('BACKEND_URL=http://localhost:5000');
  console.log('FRONTEND_URL=http://localhost:3000');
}
