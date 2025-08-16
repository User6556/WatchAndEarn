const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adRoutes = require('./routes/ads');
const rewardRoutes = require('./routes/rewards');
const userRoutes = require('./routes/users');
const countryRoutes = require('./routes/countries');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for CloudFront/Nginx/Load Balancer
app.set("trust proxy", 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration for production
app.use(cors({
  origin: [
    "https://www.watchandget.shop",
    "https://watchandget.shop"
  ],
  credentials: true
}));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/watch-and-earn', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Helper function to get the correct callback URL
const getCallbackURL = () => {
  // First, check if GOOGLE_REDIRECT_URL is explicitly set
  if (process.env.GOOGLE_REDIRECT_URL) {
    console.log('🔗 Using GOOGLE_REDIRECT_URL:', process.env.GOOGLE_REDIRECT_URL);
    return process.env.GOOGLE_REDIRECT_URL;
  }
  
  // Fallback to the old logic for backward compatibility
  if (process.env.NODE_ENV === 'production') {
    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl) {
      const callbackUrl = `${backendUrl}/auth/google/callback`;
      console.log('🔗 Using production callback URL (fallback):', callbackUrl);
      return callbackUrl;
    }
    console.warn('⚠️ Neither GOOGLE_REDIRECT_URL nor BACKEND_URL set in production. Please set GOOGLE_REDIRECT_URL in your environment variables.');
    return 'https://api.example.com/auth/google/callback';
  }
  // Development
  const devUrl = 'http://localhost:5000/auth/google/callback';
  console.log('🔗 Using development callback URL (fallback):', devUrl);
  return devUrl;
};

// Configure Passport with Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: getCallbackURL()
}, async function(accessToken, refreshToken, profile, done) {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    user = new User({
      username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.random().toString(36).substr(2, 5),
      email: profile.emails[0].value,
      firstName: profile.name.givenName || profile.displayName.split(' ')[0],
      lastName: profile.name.familyName || profile.displayName.split(' ').slice(1).join(' ') || '',
      profilePicture: profile.photos[0]?.value,
      googleId: profile.id,
      isEmailVerified: true, // Google emails are verified
      lastLogin: new Date()
    });
    
    await user.save();
    return done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes - Order matters for Express 5.x
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/countries', countryRoutes);

// Google OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token for the authenticated user
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/google-success?token=${token}`);
  }
);

// Logout route
app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Watch and Earn API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  // Don't leak stack traces in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Something went wrong on our end. Please try again later.'
    });
  } else {
    res.status(500).json({ 
      error: 'Something went wrong!',
      message: err.message,
      stack: err.stack
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔗 Backend URL: ${process.env.BACKEND_URL || 'http://localhost:5000'}`);
});

module.exports = app; 