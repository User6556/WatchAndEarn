const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    required: true, // in seconds
    min: 1
  },
  category: {
    type: String,
    required: true,
    enum: ['entertainment', 'education', 'news', 'sports', 'music', 'gaming', 'lifestyle', 'other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  reward: {
    type: Number,
    required: true,
    min: 0.01,
    max: 10.00 // Maximum $10 per video
  },
  minWatchTime: {
    type: Number,
    required: true,
    min: 1,
    max: 100 // percentage of video that must be watched
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  totalRewardsPaid: {
    type: Number,
    default: 0
  },
  averageWatchTime: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  watchHistory: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    watchedAt: {
      type: Date,
      default: Date.now
    },
    watchDuration: Number,
    rewardEarned: Number,
    completed: Boolean
  }],
  metadata: {
    fileSize: Number,
    resolution: String,
    format: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
videoSchema.index({ category: 1, isActive: 1 });
videoSchema.index({ isFeatured: 1, isActive: 1 });
videoSchema.index({ views: -1 });

// Method to increment views
videoSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to record watch
videoSchema.methods.recordWatch = function(userId, watchDuration, rewardEarned, completed) {
  this.watchHistory.push({
    user: userId,
    watchDuration,
    rewardEarned,
    completed
  });
  
  // Update average watch time
  const totalWatchTime = this.watchHistory.reduce((sum, watch) => sum + watch.watchDuration, 0);
  this.averageWatchTime = totalWatchTime / this.watchHistory.length;
  
  // Update completion rate
  const completedWatches = this.watchHistory.filter(watch => watch.completed).length;
  this.completionRate = (completedWatches / this.watchHistory.length) * 100;
  
  // Update total rewards paid
  this.totalRewardsPaid += rewardEarned;
  
  return this.save();
};

// Virtual for formatted duration
videoSchema.virtual('formattedDuration').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual for reward per minute
videoSchema.virtual('rewardPerMinute').get(function() {
  return (this.reward / (this.duration / 60)).toFixed(2);
});

// Ensure virtual fields are serialized
videoSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Video', videoSchema); 