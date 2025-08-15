# Watch & Earn Platform

A complete video watching and earning platform where users can watch videos and earn money. Built with Node.js/Express backend and React frontend.

## 🚀 Features

### Core Features
- **Video Watching & Earning**: Watch videos and earn rewards based on watch time
- **User Authentication**: Secure registration, login, and profile management
- **Reward System**: Track earnings, request withdrawals, and view statistics
- **Referral Program**: Earn bonuses by referring friends
- **Achievement System**: Unlock badges and milestones
- **Real-time Tracking**: Monitor watch progress and earnings

### User Features
- **Dashboard**: Overview of earnings, statistics, and recent activity
- **Video Library**: Browse videos by category, search, and filter
- **Watch History**: Track all watched videos and earnings
- **Withdrawal System**: Multiple payment methods (PayPal, Bank Transfer, Crypto)
- **Profile Management**: Update profile, change password, view achievements
- **Referral Dashboard**: Track referrals and referral earnings

### Admin Features
- **Video Management**: Upload, approve, and manage video content
- **User Management**: Monitor user activity and manage accounts
- **Analytics**: Track platform performance and user engagement
- **Withdrawal Processing**: Process and approve withdrawal requests

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Email**: Nodemailer
- **Validation**: Built-in validation with error handling

### Frontend
- **Framework**: React 18
- **Routing**: React Router DOM
- **State Management**: React Query + Context API
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Framer Motion
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
watch-and-earn-website/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Video.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── videos.js
│   │   │   ├── rewards.js
│   │   │   └── users.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── index.js
│   ├── package.json
│   ├── env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/watch-and-earn
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/logout` - Logout

### Videos
- `GET /api/videos` - Get all videos (with pagination, filtering)
- `GET /api/videos/featured` - Get featured videos
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos/:id/watch` - Watch video and earn reward
- `GET /api/videos/history/watched` - Get user's watch history
- `GET /api/videos/categories/list` - Get video categories
- `GET /api/videos/trending/list` - Get trending videos

### Rewards
- `GET /api/rewards/stats` - Get reward statistics
- `GET /api/rewards/history` - Get earning history
- `POST /api/rewards/withdraw` - Request withdrawal
- `GET /api/rewards/withdrawals` - Get withdrawal history
- `GET /api/rewards/withdrawal-methods` - Get available withdrawal methods
- `GET /api/rewards/referrals` - Get referral statistics
- `GET /api/rewards/chart/daily` - Get daily earning chart data

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/watch-history` - Get watch history
- `GET /api/users/referrals` - Get referral information
- `POST /api/users/deactivate` - Deactivate account
- `DELETE /api/users/delete` - Delete account
- `GET /api/users/achievements` - Get user achievements

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/watch-and-earn

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12

# Video Configuration
MAX_VIDEO_DURATION=3600
MIN_VIDEO_DURATION=10
MAX_REWARD_PER_VIDEO=10
MIN_REWARD_PER_VIDEO=0.01

# Withdrawal Configuration
MIN_WITHDRAWAL_AMOUNT=5
MAX_WITHDRAWAL_AMOUNT=10000

# Referral Configuration
REFERRAL_BONUS_REFERRER=1.00
REFERRAL_BONUS_REFERRED=0.50
```

#### Frontend (.env)
```env
# For production: Leave empty to use relative paths (recommended)
# For development: Set to your local backend URL
REACT_APP_API_URL=http://localhost:5000
```

## 🎯 Key Features Explained

### Video Watching & Earning
- Users watch videos and earn rewards based on watch time
- Minimum watch time requirements prevent abuse
- Rewards are calculated proportionally to watch duration
- Bonus rewards for completing videos

### Referral System
- Users get unique referral codes
- Referrer earns $1 for each successful referral
- Referred user gets $0.50 signup bonus
- Track referral statistics and earnings

### Withdrawal System
- Multiple payment methods (PayPal, Bank Transfer, Crypto)
- Minimum withdrawal amount of $5
- Processing times vary by method
- Withdrawal history tracking

### Achievement System
- Milestone-based achievements
- Video watching milestones
- Earning milestones
- Referral milestones
- Watch time milestones

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent abuse with express-rate-limit
- **Input Validation**: Request validation and sanitization
- **CORS Protection**: Configured for frontend communication
- **Helmet**: Security headers
- **Request Sanitization**: Prevent XSS and injection attacks

## 📱 Responsive Design

The frontend is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Use environment variables for sensitive data
6. Set up monitoring and logging

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to your preferred hosting service (Vercel, Netlify, etc.)
3. Set environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

## 🎉 Acknowledgments

- React team for the amazing framework
- Express.js team for the backend framework
- MongoDB team for the database
- Tailwind CSS team for the styling framework
- All contributors and users of this platform

---

**Happy watching and earning! 🎬💰** 