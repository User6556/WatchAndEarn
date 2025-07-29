const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if not using Google OAuth
    },
    minlength: 6
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  profilePicture: {
    type: String,
    default: ''
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  videosWatched: {
    type: Number,
    default: 0
  },
  adsWatched: {
    type: Number,
    default: 0
  },
  watchTime: {
    type: Number,
    default: 0 // in seconds
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCount: {
    type: Number,
    default: 0
  },
  referralEarnings: {
    type: Number,
    default: 0
  },
  country: {
    name: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: ''
    }
  },
  currency: {
    code: {
      type: String,
      default: 'USD'
    },
    symbol: {
      type: String,
      default: '$'
    },
    name: {
      type: String,
      default: 'US Dollar'
    }
  },
  withdrawalHistory: [{
    amount: Number,
    method: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    date: {
      type: Date,
      default: Date.now
    },
    processedDate: Date,
    notes: String
  }],
  accountCreatedAt: {
    type: Date,
    default: Date.now
  },
  watchHistory: [{
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    },
    adId: String, // For ad tracking
    watchedAt: {
      type: Date,
      default: Date.now
    },
    duration: Number,
    reward: Number
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate referral code before saving
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = this._id.toString().slice(-8).toUpperCase();
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to add balance
userSchema.methods.addBalance = function(amount) {
  this.balance += amount;
  this.totalEarned += amount;
  return this.save();
};

// Method to deduct balance
userSchema.methods.deductBalance = function(amount) {
  if (this.balance >= amount) {
    this.balance -= amount;
    return this.save();
  }
  throw new Error('Insufficient balance');
};

// Method to record video watch
userSchema.methods.recordVideoWatch = function(videoId, duration, reward) {
  this.videosWatched += 1;
  this.watchTime += duration;
  this.watchHistory.push({
    video: videoId,
    duration,
    reward
  });
  return this.save();
};

// Method to record ad watch
userSchema.methods.recordAdWatch = function(adId, duration, reward) {
  this.adsWatched += 1;
  this.watchTime += duration;
  this.watchHistory.push({
    adId,
    duration,
    reward
  });
  return this.save();
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema); 