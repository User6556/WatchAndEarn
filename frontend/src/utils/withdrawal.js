// Withdrawal utility functions

export const checkWithdrawalEligibility = (user) => {
  if (!user) return { eligible: false, reason: 'User not found' };

  const now = new Date();
  const accountCreatedAt = new Date(user.accountCreatedAt || user.createdAt);
  const daysSinceRegistration = Math.floor((now - accountCreatedAt) / (1000 * 60 * 60 * 24));
  
  const minWithdrawalAmount = 50; // $50 minimum
  const waitingPeriodDays = 30; // 30 days waiting period

  // Check minimum balance
  if (user.balance < minWithdrawalAmount) {
    return {
      eligible: false,
      reason: `Minimum withdrawal amount is $${minWithdrawalAmount}. Current balance: $${user.balance.toFixed(2)}`
    };
  }

  // Check waiting period
  if (daysSinceRegistration < waitingPeriodDays) {
    const remainingDays = waitingPeriodDays - daysSinceRegistration;
    return {
      eligible: false,
      reason: `New accounts must wait ${waitingPeriodDays} days before first withdrawal. ${remainingDays} days remaining.`
    };
  }

  return { eligible: true };
};

export const formatWithdrawalStatus = (status) => {
  switch (status) {
    case 'pending':
      return { text: 'Pending', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    case 'completed':
      return { text: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' };
    case 'failed':
      return { text: 'Failed', color: 'text-red-600', bgColor: 'bg-red-100' };
    default:
      return { text: 'Unknown', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  }
};

export const getWithdrawalMethods = () => [
  {
    id: 'paypal',
    name: 'PayPal',
    minAmount: 50,
    maxAmount: 1000,
    fee: 0,
    processingTime: '1-3 business days',
    description: 'Fast and secure payments to your PayPal account'
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    minAmount: 50,
    maxAmount: 5000,
    fee: 2,
    processingTime: '3-5 business days',
    description: 'Direct deposit to your bank account'
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    minAmount: 50,
    maxAmount: 10000,
    fee: 0,
    processingTime: '1-2 business days',
    description: 'Receive payments in Bitcoin, Ethereum, or other cryptocurrencies'
  }
]; 