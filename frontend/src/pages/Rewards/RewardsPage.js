import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, TrendingUp, Users, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

const RewardsPage = () => {
  const { user } = useAuth();

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

  const withdrawalMethods = [
    {
      id: 'paypal',
      name: 'PayPal',
      minAmount: 50,
      maxAmount: 1000,
      fee: 0,
      processingTime: '1-3 business days'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      minAmount: 50,
      maxAmount: 5000,
      fee: 2,
      processingTime: '3-5 business days'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      minAmount: 50,
      maxAmount: 10000,
      fee: 0,
      processingTime: '1-2 business days'
    }
  ];

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

      {/* Withdrawal Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <Clock className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Withdrawal Waiting Period</h3>
            <p className="text-sm text-yellow-700 mt-1">
              New accounts must wait 30 days from registration before making their first withdrawal. 
              This helps us ensure account security and prevent fraud.
            </p>
          </div>
        </div>
      </div>

      {/* Withdrawal Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Withdraw Earnings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {withdrawalMethods.map((method) => (
            <div key={method.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <h3 className="font-medium text-gray-900 mb-2">{method.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Min: ${method.minAmount}</p>
                <p>Max: ${method.maxAmount}</p>
                <p>Fee: ${method.fee}</p>
                <p>Processing: {method.processingTime}</p>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
          <div className="flex items-center justify-between">
            <div>
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
            <div className="text-right">
                              <p className="text-2xl font-bold text-purple-600">{formatCurrency(user?.referralEarnings || 0, user?.currency)}</p>
              <p className="text-sm text-gray-600">Total Referral Earnings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage; 