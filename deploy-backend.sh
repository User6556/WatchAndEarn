#!/bin/bash

# Watch and Earn Backend Deployment Script
# Run this script on your EC2 instance

set -e

echo "🚀 Starting backend deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm if not already installed
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    sudo npm install -g pm2
fi

# Install Nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "📥 Installing Nginx..."
    sudo apt install -y nginx
fi

# Create application directory
APP_DIR="/var/www/watch-and-earn-backend"
echo "📁 Creating application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Copy application files (assuming you're running this from the project root)
echo "📋 Copying application files..."
cp -r backend/* $APP_DIR/

# Navigate to application directory
cd $APP_DIR

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create logs directory
mkdir -p logs

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create it with your production environment variables."
    echo "📝 Copy env.example to .env and update the values:"
    echo "   cp env.example .env"
    echo "   nano .env"
    exit 1
fi

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Copy Nginx configuration
echo "🔧 Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/watch-and-earn-backend
sudo ln -sf /etc/nginx/sites-available/watch-and-earn-backend /etc/nginx/sites-enabled/

# Remove default Nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Setup SSL with Let's Encrypt (if domain is configured)
if command -v certbot &> /dev/null; then
    echo "🔒 Setting up SSL certificate..."
    sudo certbot --nginx -d api.example.com --non-interactive --agree-tos --email your-email@example.com
else
    echo "📥 Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d api.example.com --non-interactive --agree-tos --email your-email@example.com
fi

# Setup automatic SSL renewal
echo "🔄 Setting up automatic SSL renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

echo "✅ Backend deployment completed successfully!"
echo "🌐 Your API should be available at: https://api.example.com"
echo "📊 PM2 status: pm2 status"
echo "📋 PM2 logs: pm2 logs"
echo "🔧 Nginx status: sudo systemctl status nginx"
