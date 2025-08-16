import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, TrendingUp, Users, Clock, X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { checkWithdrawalEligibility, getWithdrawalMethods } from '../../utils/withdrawal';
import toast from 'react-hot-toast';

const RewardsPage = () => {
  const { user, updateUser } = useAuth();
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [accountDetails, setAccountDetails] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const stats = [
    {
      name: 'Current Balance',
      value: formatCurrency(user?.balance || 0, user?.currency),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Total Earned',
      value: formatCurrency(user?.totalEarned || 0, user?.currency),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Referral Earnings',
      value: formatCurrency(user?.referralEarnings || 0, user?.currency),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const withdrawalMethods = getWithdrawalMethods();

  // Check withdrawal eligibility
  const eligibility = checkWithdrawalEligibility(user);

  // Fetch withdrawal history
  useEffect(() => {
    fetchWithdrawalHistory();
  }, []);

  const fetchWithdrawalHistory = async () => {
    try {
      const response = await fetch('/api/rewards/withdrawals');
      if (response.ok) {
        const data = await response.json();
        setWithdrawalHistory(data.withdrawals || []);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawal history:', error);
    }
  };

  const handleWithdrawalClick = (method) => {
    setSelectedMethod(method);
    setWithdrawalAmount('');
    setAccountDetails({});
    setShowWithdrawalModal(true);
  };

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMethod) return;

    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount < selectedMethod.minAmount) {
      toast.error(`Minimum withdrawal amount is $${selectedMethod.minAmount}`);
      return;
    }

    if (amount > selectedMethod.maxAmount) {
      toast.error(`Maximum withdrawal amount is $${selectedMethod.maxAmount}`);
      return;
    }

    if (amount > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    // Validate account details based on method
    if (selectedMethod.id === 'paypal' && !accountDetails.email) {
      toast.error('Please enter your PayPal email');
      return;
    }

    if (selectedMethod.id === 'bank_transfer' && (!accountDetails.accountNumber || !accountDetails.routingNumber)) {
      toast.error('Please enter your bank account details');
      return;
    }

    if (selectedMethod.id === 'crypto' && !accountDetails.walletAddress) {
      toast.error('Please enter your cryptocurrency wallet address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/rewards/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          method: selectedMethod.id,
          accountDetails
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Withdrawal request submitted successfully!');
        setShowWithdrawalModal(false);
        setWithdrawalAmount('');
        setAccountDetails({});
        
        // Update user balance
        if (updateUser) {
          updateUser({ balance: data.newBalance });
        }
        
        // Refresh withdrawal history
        fetchWithdrawalHistory();
      } else {
        toast.error(data.error || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAccountDetailsForm = () => {
    switch (selectedMethod?.id) {
      case 'paypal':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PayPal Email Address
            </label>
            <input
              type="email"
              value={accountDetails.email || ''}
              onChange={(e) => setAccountDetails({ ...accountDetails, email: e.target.value })}
              className="mobile-input"
              placeholder="your-email@example.com"
              required
            />
          </div>
        );
      
      case 'bank_transfer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={accountDetails.accountNumber || ''}
                onChange={(e) => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })}
                className="mobile-input"
                placeholder="1234567890"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Routing Number
              </label>
              <input
                type="text"
                value={accountDetails.routingNumber || ''}
                onChange={(e) => setAccountDetails({ ...accountDetails, routingNumber: e.target.value })}
                className="mobile-input"
                placeholder="123456789"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                value={accountDetails.bankName || ''}
                onChange={(e) => setAccountDetails({ ...accountDetails, bankName: e.target.value })}
                className="mobile-input"
                placeholder="Bank of America"
                required
              />
            </div>
          </div>
        );
      
      case 'crypto':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Address
            </label>
            <input
              type="text"
              value={accountDetails.walletAddress || ''}
              onChange={(e) => setAccountDetails({ ...accountDetails, walletAddress: e.target.value })}
              className="mobile-input"
              placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Please double-check your wallet address. Incorrect addresses may result in permanent loss of funds.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  const formatWithdrawalStatus = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Pending', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: Clock };
      case 'completed':
        return { text: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
      case 'failed':
        return { text: 'Failed', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle };
      default:
        return { text: 'Unknown', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Info };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Rewards & Earnings</h1>
        <p className="text-gray-600 mt-2">
          Track your earnings and withdraw your rewards
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Eligibility Notice */}
      {!eligibility.eligible && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Withdrawal Not Available</h3>
              <p className="text-sm text-red-700 mt-1">{eligibility.reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Withdraw Earnings</h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showHistory ? 'Hide History' : 'View History'}
          </button>
        </div>
        
        {/* Withdrawal History */}
        {showHistory && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">Withdrawal History</h3>
            {withdrawalHistory.length > 0 ? (
              <div className="space-y-3">
                {withdrawalHistory.slice(0, 5).map((withdrawal, index) => {
                  const status = formatWithdrawalStatus(withdrawal.status);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <status.icon className={`w-4 h-4 ${status.color} mr-2`} />
                        <div>
                          <p className="font-medium text-gray-900">
                            ${withdrawal.amount.toFixed(2)} via {withdrawal.method}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(withdrawal.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No withdrawal history yet</p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {withdrawalMethods.map((method) => (
            <div key={method.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <h3 className="font-medium text-gray-900 mb-2">{method.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Min: ${method.minAmount}</p>
                <p>Max: ${method.maxAmount}</p>
                <p>Fee: ${method.fee}</p>
                <p>Processing: {method.processingTime}</p>
              </div>
              <button 
                onClick={() => handleWithdrawalClick(method)}
                disabled={!eligibility.eligible}
                className={`w-full mt-4 py-2 rounded-lg transition-colors ${
                  eligibility.eligible 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Withdraw via {method.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Refer Friends & Earn</h2>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your Referral Code: <span className="font-mono bg-white px-2 py-1 rounded">{user?.referralCode || 'ABC123'}</span>
              </h3>
              <p className="text-gray-600 mb-4">
                Share your referral code with friends and earn $1.00 for each successful referral!
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Copy Referral Link
              </button>
            </div>
            <div className="text-center lg:text-right">
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(user?.referralEarnings || 0, user?.currency)}</p>
              <p className="text-sm text-gray-600">Total Referral Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawalModal && selectedMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Withdraw via {selectedMethod.name}
                </h2>
                <button
                  onClick={() => setShowWithdrawalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="mobile-input"
                    placeholder={`Min: $${selectedMethod.minAmount}, Max: $${selectedMethod.maxAmount}`}
                    min={selectedMethod.minAmount}
                    max={selectedMethod.maxAmount}
                    step="0.01"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available balance: {formatCurrency(user?.balance || 0, user?.currency)}
                  </p>
                </div>

                {getAccountDetailsForm()}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Processing Time: {selectedMethod.processingTime}</p>
                      {selectedMethod.fee > 0 && (
                        <p className="mt-1">Fee: ${selectedMethod.fee}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawalModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : 'Submit Withdrawal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPage; 