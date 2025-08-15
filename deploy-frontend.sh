#!/bin/bash

# Watch and Earn Frontend Deployment Script
# Run this script locally to build and deploy to S3

set -e

echo "🚀 Starting frontend deployment..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if .env file exists
if [ ! -f frontend/.env ]; then
    echo "⚠️  frontend/.env file not found. Creating from example..."
    cp frontend/env.example frontend/.env
    echo "📝 Please update frontend/.env with your production values:"
    echo "   # For production: Leave REACT_APP_API_URL empty to use relative paths"
    echo "   # For development: Set REACT_APP_API_URL=http://localhost:5000"
    echo "   Then run this script again."
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build:prod

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed. Check for errors above."
    exit 1
fi

echo "✅ Build completed successfully!"

# S3 bucket name (update this to your bucket name)
S3_BUCKET="watch-and-earn-frontend"
REGION="us-east-1"

# Check if S3 bucket exists, create if it doesn't
if ! aws s3 ls "s3://$S3_BUCKET" 2>&1 > /dev/null; then
    echo "📦 Creating S3 bucket: $S3_BUCKET"
    aws s3 mb "s3://$S3_BUCKET" --region $REGION
    
    # Configure bucket for static website hosting
    aws s3 website "s3://$S3_BUCKET" --index-document index.html --error-document index.html
    
    # Set bucket policy for public read access
    cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$S3_BUCKET/*"
        }
    ]
}
EOF
    aws s3api put-bucket-policy --bucket $S3_BUCKET --policy file://bucket-policy.json
    rm bucket-policy.json
fi

# Upload files to S3
echo "📤 Uploading files to S3..."
aws s3 sync build/ "s3://$S3_BUCKET" --delete --cache-control "max-age=31536000,public"

# Invalidate CloudFront cache (if distribution exists)
echo "🔄 Invalidating CloudFront cache..."
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='Watch and Earn Frontend Distribution'].Id" --output text)

if [ ! -z "$DISTRIBUTION_ID" ] && [ "$DISTRIBUTION_ID" != "None" ]; then
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
    echo "✅ CloudFront cache invalidation initiated"
else
    echo "⚠️  CloudFront distribution not found. Please create one manually or update the script."
fi

echo "✅ Frontend deployment completed successfully!"
echo "🌐 Your website should be available at: https://www.example.com"
echo "📦 S3 bucket: s3://$S3_BUCKET"
echo "📊 CloudFront distribution ID: $DISTRIBUTION_ID"
