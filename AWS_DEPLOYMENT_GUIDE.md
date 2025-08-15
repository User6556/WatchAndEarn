# AWS Deployment Guide for Watch and Earn

This guide will walk you through deploying your Watch and Earn application to AWS using the following architecture:

- **Backend**: Node.js + Express on EC2 (Ubuntu) with PM2 and Nginx reverse proxy
- **Frontend**: React static build hosted on S3 + CloudFront for CDN & HTTPS
- **Database**: MongoDB Atlas (not self-hosted on AWS)
- **Domains**: Route 53, api.example.com for backend, www.example.com for frontend

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **Domain names** registered (example.com, api.example.com)
3. **MongoDB Atlas** cluster set up
4. **Google OAuth** credentials configured
5. **AWS CLI** installed and configured locally

## Step 1: Environment Setup

### Backend Environment Variables

1. Copy the example environment file:
   ```bash
   cd backend
   cp env.example .env
   ```

2. Update `backend/.env` with your production values:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=production
   
   # Database Configuration (MongoDB Atlas)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/watch-and-earn?retryWrites=true&w=majority
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Frontend URL (for CORS) - Production
   FRONTEND_URL=https://www.example.com
   
   # Backend URL (for OAuth callbacks) - Production
   BACKEND_URL=https://api.example.com
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   SESSION_SECRET=your-session-secret-key-change-this-in-production
   ```

### Frontend Environment Variables

1. Copy the example environment file:
   ```bash
   cd frontend
   cp env.example .env
   ```

2. Update `frontend/.env` with your production values:
   ```env
   # API Configuration
   # For production: Leave empty to use relative paths (recommended)
   # For development: Set to your local backend URL
   REACT_APP_API_URL=http://localhost:5000
   
   # Environment
   NODE_ENV=production
   ```

## Step 2: AWS Infrastructure Setup

### 2.1 Create EC2 Instance for Backend

1. **Launch EC2 Instance**:
   - AMI: Ubuntu Server 22.04 LTS
   - Instance Type: t3.small (or larger for production)
   - Security Group: Create new with rules:
     - SSH (22): Your IP
     - HTTP (80): 0.0.0.0/0
     - HTTPS (443): 0.0.0.0/0
   - Key Pair: Create or use existing

2. **Configure Security Group**:
   ```bash
   # In AWS Console > EC2 > Security Groups
   # Add inbound rules:
   - Type: SSH, Port: 22, Source: Your IP
   - Type: HTTP, Port: 80, Source: 0.0.0.0/0
   - Type: HTTPS, Port: 443, Source: 0.0.0.0/0
   ```

### 2.2 Create S3 Bucket for Frontend

1. **Create S3 Bucket**:
   ```bash
   aws s3 mb s3://watch-and-earn-frontend --region us-east-1
   ```

2. **Configure for Static Website Hosting**:
   ```bash
   aws s3 website s3://watch-and-earn-frontend --index-document index.html --error-document index.html
   ```

3. **Set Bucket Policy** (for public read access):
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::watch-and-earn-frontend/*"
           }
       ]
   }
   ```

### 2.3 Create CloudFront Distribution

1. **Create Distribution**:
   - Origin Domain: `watch-and-earn-frontend.s3.amazonaws.com`
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Default Root Object: `index.html`
   - Error Pages: 404 → `/index.html` (for React Router)

2. **Configure Custom Domain** (optional):
   - Add `www.example.com` as alternate domain name
   - Upload SSL certificate for your domain

## Step 3: Backend Deployment

### 3.1 Deploy to EC2

1. **Connect to EC2 instance**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **Run the deployment script**:
   ```bash
   # Upload the deployment script to your EC2 instance
   scp -i your-key.pem deploy-backend.sh ubuntu@your-ec2-ip:~/
   
   # SSH into the instance and run
   chmod +x deploy-backend.sh
   ./deploy-backend.sh
   ```

3. **Manual deployment steps** (if script fails):
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install -y nginx
   
   # Create app directory
   sudo mkdir -p /var/www/watch-and-earn-backend
   sudo chown $USER:$USER /var/www/watch-and-earn-backend
   
   # Copy application files
   # (Upload your backend files to this directory)
   
   # Install dependencies
   cd /var/www/watch-and-earn-backend
   npm install --production
   
   # Start with PM2
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

### 3.2 Configure Nginx

1. **Copy Nginx configuration**:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/watch-and-earn-backend
   sudo ln -sf /etc/nginx/sites-available/watch-and-earn-backend /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   ```

2. **Test and restart Nginx**:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   sudo systemctl enable nginx
   ```

### 3.3 Setup SSL Certificate

1. **Install Certbot**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate**:
   ```bash
   sudo certbot --nginx -d api.example.com --non-interactive --agree-tos --email your-email@example.com
   ```

3. **Setup automatic renewal**:
   ```bash
   (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
   ```

## Step 4: Frontend Deployment

### 4.1 Build and Deploy

1. **Run the deployment script locally**:
   ```bash
   chmod +x deploy-frontend.sh
   ./deploy-frontend.sh
   ```

2. **Manual deployment steps** (if script fails):
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Build for production
   npm run build:prod
   
   # Upload to S3
   aws s3 sync build/ s3://watch-and-earn-frontend --delete --cache-control "max-age=31536000,public"
   
   # Invalidate CloudFront cache
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

## Step 5: Domain Configuration

### 5.1 Configure Route 53

1. **Create Hosted Zone** for your domain (if not exists)

2. **Create A Records**:
   - `api.example.com` → Your EC2 instance IP
   - `www.example.com` → CloudFront distribution domain

3. **Create CNAME Record**:
   - `example.com` → `www.example.com`

### 5.2 Update Google OAuth

1. **Update Authorized redirect URIs** in Google Cloud Console:
   - `https://api.example.com/auth/google/callback`

2. **Update Authorized JavaScript origins**:
   - `https://www.example.com`
   - `https://api.example.com`

## Step 6: Testing and Verification

### 6.1 Test Backend

1. **Health check**:
   ```bash
   curl https://api.example.com/api/health
   ```

2. **Test OAuth flow**:
   - Visit `https://api.example.com/auth/google`
   - Should redirect to Google and back to frontend

### 6.2 Test Frontend

1. **Visit your website**:
   - `https://www.example.com`
   - Should load React app

2. **Test API integration**:
   - Try logging in
   - Check if API calls work

### 6.3 Monitor Logs

1. **PM2 logs**:
   ```bash
   pm2 logs
   pm2 status
   ```

2. **Nginx logs**:
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

## Step 7: Security Hardening

### 7.1 Backend Security

1. **Update firewall**:
   ```bash
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   ```

2. **Regular updates**:
   ```bash
   # Add to crontab
   0 2 * * 0 sudo apt update && sudo apt upgrade -y
   ```

### 7.2 Environment Variables

1. **Ensure all secrets are in .env files**
2. **Never commit .env files to version control**
3. **Use strong, unique secrets for production**

## Troubleshooting

### Common Issues

1. **CORS errors**:
   - Check `FRONTEND_URL` in backend .env
   - Verify CORS configuration in `backend/src/index.js`

2. **SSL certificate issues**:
   - Ensure domain points to correct IP
   - Check Certbot logs: `sudo certbot certificates`

3. **PM2 not starting**:
   - Check logs: `pm2 logs`
   - Verify .env file exists and has correct values

4. **Nginx errors**:
   - Check configuration: `sudo nginx -t`
   - Check logs: `sudo tail -f /var/log/nginx/error.log`

### Useful Commands

```bash
# PM2 management
pm2 status
pm2 restart all
pm2 logs

# Nginx management
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx

# SSL certificate
sudo certbot certificates
sudo certbot renew --dry-run

# Application logs
tail -f /var/www/watch-and-earn-backend/logs/combined.log
```

## Maintenance

### Regular Tasks

1. **Weekly**:
   - Check PM2 status and logs
   - Monitor disk space
   - Review security updates

2. **Monthly**:
   - Update dependencies
   - Review and rotate secrets
   - Check SSL certificate expiration

3. **Quarterly**:
   - Review and update security configurations
   - Performance monitoring and optimization
   - Backup verification

## Cost Optimization

1. **EC2**: Use appropriate instance size, consider reserved instances
2. **S3**: Use lifecycle policies for old files
3. **CloudFront**: Monitor usage and adjust caching
4. **Route 53**: Use hosted zones efficiently

---

## Quick Deployment Checklist

- [ ] Environment variables configured
- [ ] EC2 instance launched and secured
- [ ] S3 bucket created and configured
- [ ] CloudFront distribution created
- [ ] Backend deployed and running
- [ ] Frontend built and uploaded
- [ ] SSL certificates obtained
- [ ] Domain DNS configured
- [ ] OAuth redirects updated
- [ ] All functionality tested
- [ ] Monitoring and logging configured
- [ ] Security measures implemented

Your Watch and Earn application should now be fully deployed and accessible at `https://www.example.com` with the API at `https://api.example.com`!
