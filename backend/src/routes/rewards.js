const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's reward statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Calculate daily earnings (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentWatches = user.watchHistory.filter(
      watch => new Date(watch.watchedAt) >= sevenDaysAgo
    );
    const dailyEarnings = recentWatches.reduce((sum, watch) => sum + watch.reward, 0);

    // Calculate monthly earnings (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyWatches = user.watchHistory.filter(
      watch => new Date(watch.watchedAt) >= thirtyDaysAgo
    );
    const monthlyEarnings = monthlyWatches.reduce((sum, watch) => sum + watch.reward, 0);

    // Calculate average daily earnings
    const averageDailyEarnings = dailyEarnings / 7;

    // Get withdrawal history
    const pendingWithdrawals = user.withdrawalHistory.filter(
      withdrawal => withdrawal.status === 'pending'
    );
    const totalPending = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);

    res.json({
      stats: {
        currentBalance: user.balance,
        totalEarned: user.totalEarned,
        totalVideosWatched: user.videosWatched,
        totalWatchTime: user.watchTime,
        dailyEarnings: Math.round(dailyEarnings * 100) / 100,
        monthlyEarnings: Math.round(monthlyEarnings * 100) / 100,
        averageDailyEarnings: Math.round(averageDailyEarnings * 100) / 100,
        referralEarnings: user.referralEarnings,
        referralCount: user.referralCount,
        totalPendingWithdrawals: Math.round(totalPending * 100) / 100
      }
    });
  } catch (error) {
    console.error('Fetch reward stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch reward statistics',
      message: error.message
    });
  }
});

// Get user's earning history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type = 'all' } = req.query;
    const user = await User.findById(req.user._id);

    let history = [];

    if (type === 'all' || type === 'video') {
      // Add video earnings
      const videoEarnings = user.watchHistory.map(watch => ({
        type: 'video',
        amount: watch.reward,
        date: watch.watchedAt,
        description: `Earned from watching video`,
        videoId: watch.video
      }));
      history = history.concat(videoEarnings);
    }

    if (type === 'all' || type === 'referral') {
      // Add referral earnings (if any)
      if (user.referralEarnings > 0) {
        history.push({
          type: 'referral',
          amount: user.referralEarnings,
          date: user.createdAt,
          description: `Referral bonus from ${user.referralCount} referrals`
        });
      }
    }

    if (type === 'all' || type === 'withdrawal') {
      // Add withdrawal history
      const withdrawals = user.withdrawalHistory.map(withdrawal => ({
        type: 'withdrawal',
        amount: -withdrawal.amount, // Negative for withdrawals
        date: withdrawal.date,
        description: `Withdrawal via ${withdrawal.method}`,
        status: withdrawal.status
      }));
      history = history.concat(withdrawals);
    }

    // Sort by date (newest first)
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const total = history.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedHistory = history.slice(startIndex, endIndex);

    res.json({
      history: paginatedHistory,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalItems: total
    });
  } catch (error) {
    console.error('Fetch earning history error:', error);
    res.status(500).json({
      error: 'Failed to fetch earning history',
      message: error.message
    });
  }
});

// Request withdrawal
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, method, accountDetails } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid withdrawal amount'
      });
    }

    if (amount < 5) {
      return res.status(400).json({
        error: 'Minimum withdrawal amount is $5'
      });
    }

    if (amount > req.user.balance) {
      return res.status(400).json({
        error: 'Insufficient balance'
      });
    }

    // Validate method
    const validMethods = ['paypal', 'bank_transfer', 'crypto'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({
        error: 'Invalid withdrawal method'
      });
    }

    // Check for pending withdrawals
    const pendingWithdrawals = req.user.withdrawalHistory.filter(
      w => w.status === 'pending'
    );
    const totalPending = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);

    if (totalPending > 0) {
      return res.status(400).json({
        error: 'You have pending withdrawals. Please wait for them to be processed.'
      });
    }

    // Create withdrawal request
    const withdrawal = {
      amount: parseFloat(amount),
      method,
      status: 'pending',
      date: new Date(),
      accountDetails: accountDetails || {}
    };

    req.user.withdrawalHistory.push(withdrawal);
    await req.user.deductBalance(amount);
    await req.user.save();

    res.json({
      message: 'Withdrawal request submitted successfully',
      withdrawal,
      newBalance: req.user.balance
    });
  } catch (error) {
    console.error('Withdrawal request error:', error);
    res.status(500).json({
      error: 'Failed to submit withdrawal request',
      message: error.message
    });
  }
});

// Get withdrawal history
router.get('/withdrawals', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const user = await User.findById(req.user._id);

    let withdrawals = user.withdrawalHistory;

    // Filter by status if provided
    if (status) {
      withdrawals = withdrawals.filter(w => w.status === status);
    }

    // Sort by date (newest first)
    withdrawals.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const total = withdrawals.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedWithdrawals = withdrawals.slice(startIndex, endIndex);

    res.json({
      withdrawals: paginatedWithdrawals,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalWithdrawals: total
    });
  } catch (error) {
    console.error('Fetch withdrawal history error:', error);
    res.status(500).json({
      error: 'Failed to fetch withdrawal history',
      message: error.message
    });
  }
});

// Get available withdrawal methods
router.get('/withdrawal-methods', auth, async (req, res) => {
  try {
    const methods = [
      {
        id: 'paypal',
        name: 'PayPal',
        minAmount: 5,
        maxAmount: 1000,
        fee: 0,
        processingTime: '1-3 business days',
        description: 'Withdraw to your PayPal account'
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        minAmount: 10,
        maxAmount: 5000,
        fee: 2,
        processingTime: '3-5 business days',
        description: 'Direct deposit to your bank account'
      },
      {
        id: 'crypto',
        name: 'Cryptocurrency',
        minAmount: 20,
        maxAmount: 10000,
        fee: 0,
        processingTime: '1-2 business days',
        description: 'Withdraw in Bitcoin, Ethereum, or USDT'
      }
    ];

    res.json({ methods });
  } catch (error) {
    console.error('Fetch withdrawal methods error:', error);
    res.status(500).json({
      error: 'Failed to fetch withdrawal methods',
      message: error.message
    });
  }
});

// Get referral statistics
router.get('/referrals', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get referred users
    const referredUsers = await User.find({ referredBy: user._id })
      .select('username firstName lastName createdAt balance totalEarned')
      .sort({ createdAt: -1 });

    // Calculate referral statistics
    const totalReferrals = referredUsers.length;
    const activeReferrals = referredUsers.filter(u => u.isActive).length;
    const totalEarningsFromReferrals = referredUsers.reduce((sum, u) => sum + u.totalEarned, 0);

    res.json({
      referralCode: user.referralCode,
      totalReferrals,
      activeReferrals,
      referralEarnings: user.referralEarnings,
      totalEarningsFromReferrals,
      referredUsers
    });
  } catch (error) {
    console.error('Fetch referral stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch referral statistics',
      message: error.message
    });
  }
});

// Get daily earning chart data
router.get('/chart/daily', auth, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const user = await User.findById(req.user._id);

    const chartData = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const dayWatches = user.watchHistory.filter(watch => {
        const watchDate = new Date(watch.watchedAt);
        return watchDate >= startOfDay && watchDate <= endOfDay;
      });

      const dailyEarnings = dayWatches.reduce((sum, watch) => sum + watch.reward, 0);

      chartData.push({
        date: date.toISOString().split('T')[0],
        earnings: Math.round(dailyEarnings * 100) / 100,
        videosWatched: dayWatches.length
      });
    }

    res.json({ chartData });
  } catch (error) {
    console.error('Fetch daily chart error:', error);
    res.status(500).json({
      error: 'Failed to fetch daily chart data',
      message: error.message
    });
  }
});

module.exports = router; 