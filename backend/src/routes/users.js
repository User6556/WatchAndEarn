const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('referredBy', 'username firstName lastName');

    res.json({ user });
  } catch (error) {
    console.error('Fetch user profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch user profile',
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, profilePicture } = req.body;
    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (profilePicture) updates.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Calculate watch time in hours
    const watchTimeHours = user.watchTime / 3600;

    // Calculate average earnings per video
    const avgEarningsPerVideo = user.videosWatched > 0 
      ? user.totalEarned / user.videosWatched 
      : 0;

    // Calculate earnings per hour
    const earningsPerHour = watchTimeHours > 0 
      ? user.totalEarned / watchTimeHours 
      : 0;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentWatches = user.watchHistory.filter(
      watch => new Date(watch.watchedAt) >= sevenDaysAgo
    );

    const stats = {
      totalEarned: user.totalEarned,
      currentBalance: user.balance,
      videosWatched: user.videosWatched,
      watchTimeHours: Math.round(watchTimeHours * 100) / 100,
      avgEarningsPerVideo: Math.round(avgEarningsPerVideo * 100) / 100,
      earningsPerHour: Math.round(earningsPerHour * 100) / 100,
      referralCount: user.referralCount,
      referralEarnings: user.referralEarnings,
      recentActivity: {
        videosWatched: recentWatches.length,
        earnings: Math.round(recentWatches.reduce((sum, w) => sum + w.reward, 0) * 100) / 100
      }
    };

    res.json({ stats });
  } catch (error) {
    console.error('Fetch user stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch user statistics',
      message: error.message
    });
  }
});

// Get user's watch history
router.get('/watch-history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const user = await User.findById(req.user._id)
      .populate({
        path: 'watchHistory.video',
        select: 'title thumbnail duration reward category'
      });

    const watchHistory = user.watchHistory
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
      .slice((page - 1) * limit, page * limit);

    const total = user.watchHistory.length;

    res.json({
      watchHistory,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalWatched: total
    });
  } catch (error) {
    console.error('Fetch watch history error:', error);
    res.status(500).json({
      error: 'Failed to fetch watch history',
      message: error.message
    });
  }
});

// Get user's referral information
router.get('/referrals', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get referred users
    const referredUsers = await User.find({ referredBy: user._id })
      .select('username firstName lastName createdAt balance totalEarned isActive')
      .sort({ createdAt: -1 });

    const referralInfo = {
      referralCode: user.referralCode,
      totalReferrals: referredUsers.length,
      activeReferrals: referredUsers.filter(u => u.isActive).length,
      totalReferralEarnings: user.referralEarnings,
      referredUsers
    };

    res.json(referralInfo);
  } catch (error) {
    console.error('Fetch referral info error:', error);
    res.status(500).json({
      error: 'Failed to fetch referral information',
      message: error.message
    });
  }
});

// Deactivate account
router.post('/deactivate', auth, async (req, res) => {
  try {
    const { password } = req.body;

    // Verify password
    const isPasswordValid = await req.user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Incorrect password'
      });
    }

    // Check if user has pending withdrawals
    const pendingWithdrawals = req.user.withdrawalHistory.filter(
      w => w.status === 'pending'
    );

    if (pendingWithdrawals.length > 0) {
      return res.status(400).json({
        error: 'Cannot deactivate account with pending withdrawals'
      });
    }

    // Deactivate account
    req.user.isActive = false;
    await req.user.save();

    res.json({
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      error: 'Failed to deactivate account',
      message: error.message
    });
  }
});

// Delete account
router.delete('/delete', auth, async (req, res) => {
  try {
    const { password } = req.body;

    // Verify password
    const isPasswordValid = await req.user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Incorrect password'
      });
    }

    // Check if user has pending withdrawals
    const pendingWithdrawals = req.user.withdrawalHistory.filter(
      w => w.status === 'pending'
    );

    if (pendingWithdrawals.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete account with pending withdrawals'
      });
    }

    // Delete account
    await User.findByIdAndDelete(req.user._id);

    res.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Failed to delete account',
      message: error.message
    });
  }
});

// Get user's achievements/badges
router.get('/achievements', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const achievements = [];

    // Video watching achievements
    if (user.videosWatched >= 1) {
      achievements.push({
        id: 'first_video',
        name: 'First Video',
        description: 'Watched your first video',
        earned: true,
        date: user.watchHistory[0]?.watchedAt
      });
    }

    if (user.videosWatched >= 10) {
      achievements.push({
        id: 'video_enthusiast',
        name: 'Video Enthusiast',
        description: 'Watched 10 videos',
        earned: true,
        date: user.watchHistory[9]?.watchedAt
      });
    }

    if (user.videosWatched >= 50) {
      achievements.push({
        id: 'video_master',
        name: 'Video Master',
        description: 'Watched 50 videos',
        earned: true,
        date: user.watchHistory[49]?.watchedAt
      });
    }

    if (user.videosWatched >= 100) {
      achievements.push({
        id: 'video_expert',
        name: 'Video Expert',
        description: 'Watched 100 videos',
        earned: true,
        date: user.watchHistory[99]?.watchedAt
      });
    }

    // Earning achievements
    if (user.totalEarned >= 10) {
      achievements.push({
        id: 'first_earnings',
        name: 'First Earnings',
        description: 'Earned your first $10',
        earned: true
      });
    }

    if (user.totalEarned >= 50) {
      achievements.push({
        id: 'earnings_milestone',
        name: 'Earnings Milestone',
        description: 'Earned $50 total',
        earned: true
      });
    }

    if (user.totalEarned >= 100) {
      achievements.push({
        id: 'earnings_expert',
        name: 'Earnings Expert',
        description: 'Earned $100 total',
        earned: true
      });
    }

    // Referral achievements
    if (user.referralCount >= 1) {
      achievements.push({
        id: 'first_referral',
        name: 'First Referral',
        description: 'Referred your first friend',
        earned: true
      });
    }

    if (user.referralCount >= 5) {
      achievements.push({
        id: 'referral_network',
        name: 'Referral Network',
        description: 'Referred 5 friends',
        earned: true
      });
    }

    if (user.referralCount >= 10) {
      achievements.push({
        id: 'referral_master',
        name: 'Referral Master',
        description: 'Referred 10 friends',
        earned: true
      });
    }

    // Watch time achievements
    const watchTimeHours = user.watchTime / 3600;
    
    if (watchTimeHours >= 1) {
      achievements.push({
        id: 'hour_watcher',
        name: 'Hour Watcher',
        description: 'Watched 1 hour of content',
        earned: true
      });
    }

    if (watchTimeHours >= 10) {
      achievements.push({
        id: 'dedicated_watcher',
        name: 'Dedicated Watcher',
        description: 'Watched 10 hours of content',
        earned: true
      });
    }

    res.json({ achievements });
  } catch (error) {
    console.error('Fetch achievements error:', error);
    res.status(500).json({
      error: 'Failed to fetch achievements',
      message: error.message
    });
  }
});

module.exports = router; 