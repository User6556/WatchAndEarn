# Watch and Earn - Backend API

A Node.js/Express backend for a video watching and earning platform where users can watch videos and earn money.

## Features

- **User Authentication**: Registration, login, password reset
- **Video Management**: Browse, watch, and earn from videos
- **Reward System**: Track earnings, withdrawals, and referral bonuses
- **User Profiles**: Statistics, watch history, achievements
- **Security**: JWT authentication, rate limiting, input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Email**: Nodemailer (for password reset)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
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

## API Endpoints

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

## Database Models

### User Model
- Basic info (username, email, password, name)
- Balance and earnings tracking
- Watch history and statistics
- Referral system
- Withdrawal history

### Video Model
- Video metadata (title, description, URL, thumbnail)
- Duration and category
- Reward amount and requirements
- View statistics and watch history
- Approval status

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevent abuse with express-rate-limit
- **Input Validation**: Request validation and sanitization
- **CORS Protection**: Configured for frontend communication
- **Helmet**: Security headers

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | localhost:27017/watch-and-earn |
| `JWT_SECRET` | JWT signing secret | your-secret-key |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## Development

### Running in Development Mode
```bash
npm run dev
```

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `watch-and-earn`
3. Update `MONGODB_URI` in your `.env` file

### Testing the API
You can test the API using tools like:
- Postman
- Insomnia
- curl commands

### Example API Calls

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Use environment variables for sensitive data
6. Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 