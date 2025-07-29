const express = require('express');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get available ads (for tracking purposes)
router.get('/', optionalAuth, async (req, res) => {
  try {
    // Return basic ad information for tracking
    const ads = [
      {
        id: 'adsense-test-1',
        type: 'display',
        reward: 0.10,
        duration: 30, // seconds
        description: 'Watch this ad to earn rewards'
      },
      {
        id: 'adsense-test-2', 
        type: 'display',
        reward: 0.15,
        duration: 45,
        description: 'Complete this ad to earn rewards'
      }
    ];

    res.json({
      ads,
      message: 'AdSense ads are loaded dynamically'
    });
  } catch (error) {
    console.error('Fetch ads error:', error);
    res.status(500).json({
      error: 'Failed to fetch ads',
      message: error.message
    });
  }
});

// Record ad view and award reward
router.post('/:adId/watch', auth, async (req, res) => {
  try {
    const { adId } = req.params;
    const { watchDuration, completed } = req.body;

    // Validate ad exists (in real implementation, this would check against AdSense)
    const validAds = ['adsense-test-1', 'adsense-test-2'];
    if (!validAds.includes(adId)) {
      return res.status(404).json({
        error: 'Ad not found'
      });
    }

    // Check if user has already watched this ad recently (within 24 hours)
    const recentWatch = await User.findOne({
      _id: req.user._id,
      'watchHistory.adId': adId,
      'watchHistory.watchedAt': { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (recentWatch) {
      return res.status(400).json({
        error: 'You have already watched this ad recently. Please wait 24 hours before watching again.'
      });
    }

    // Calculate reward based on completion
    let rewardEarned = 0;
    const baseReward = adId === 'adsense-test-1' ? 0.10 : 0.15;
    
    if (completed && watchDuration >= 25) { // Minimum 25 seconds for full reward
      rewardEarned = baseReward;
    } else if (watchDuration >= 15) { // Partial reward for 15+ seconds
      rewardEarned = baseReward * 0.5;
    }

    // Update user balance and statistics
    if (rewardEarned > 0) {
      await req.user.addBalance(rewardEarned);
      await req.user.recordAdWatch(adId, watchDuration, rewardEarned);
    }

    res.json({
      message: 'Ad watch recorded successfully',
      rewardEarned,
      newBalance: req.user.balance,
      totalEarned: req.user.totalEarned
    });
  } catch (error) {
    console.error('Watch ad error:', error);
    res.status(500).json({
      error: 'Failed to record ad watch',
      message: error.message
    });
  }
});

// Get user's ad watch history
router.get('/history/watched', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.user._id);

    const watchHistory = user.watchHistory
      .filter(watch => watch.adId) // Only ad watches
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
      .slice((page - 1) * limit, page * limit);

    const total = user.watchHistory.filter(watch => watch.adId).length;

    res.json({
      watchHistory,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalWatched: total
    });
  } catch (error) {
    console.error('Fetch ad watch history error:', error);
    res.status(500).json({
      error: 'Failed to fetch ad watch history',
      message: error.message
    });
  }
});

module.exports = router; 