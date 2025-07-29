import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, Play, Users, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../../components/UI/AnimatedButton';
import GlassCard from '../../components/UI/GlassCard';
import { formatCurrency } from '../../utils/currency';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      name: 'Current Balance',
      value: formatCurrency(user?.balance || 0, user?.currency),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Ads Watched',
      value: user?.adsWatched || 0,
      icon: Play,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Earned',
      value: formatCurrency(user?.totalEarned || 0, user?.currency),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Referrals',
      value: user?.referralCount || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <GlassCard className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome back, {user?.firstName || user?.username}!
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Ready to watch some ads and earn money?
        </p>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <GlassCard 
            key={stat.name} 
            className="bg-gradient-to-r from-white to-gray-50 cursor-pointer hover:scale-105 transition-transform group"
            onClick={() => {
              // Navigate based on stat type
              if (stat.name === 'Current Balance' || stat.name === 'Total Earned') {
                navigate('/rewards');
              } else if (stat.name === 'Ads Watched') {
                navigate('/ads');
              } else if (stat.name === 'Referrals') {
                navigate('/profile');
              }
            }}
            title={`Click to view ${stat.name.toLowerCase()}`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${stat.bgColor} shadow-lg`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quick Actions */}
      <GlassCard className="bg-gradient-to-r from-white to-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatedButton
            onClick={() => navigate('/ads')}
            variant="primary"
            className="flex items-center justify-center p-4"
          >
            <Play className="w-5 h-5 mr-2" />
            <span className="font-medium">Watch Ads</span>
          </AnimatedButton>
          <AnimatedButton
            onClick={() => navigate('/rewards')}
            variant="success"
            className="flex items-center justify-center p-4"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            <span className="font-medium">Withdraw Earnings</span>
          </AnimatedButton>
          <AnimatedButton
            onClick={() => navigate('/profile')}
            variant="outline"
            className="flex items-center justify-center p-4"
          >
            <Users className="w-5 h-5 mr-2" />
            <span className="font-medium">Invite Friends</span>
          </AnimatedButton>
        </div>
      </GlassCard>

      {/* Recent Activity */}
      <GlassCard className="bg-gradient-to-r from-white to-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></span>
          Recent Activity
        </h2>
        <div className="space-y-4">
          {user?.watchHistory?.slice(0, 3).map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Play className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {activity.adId ? `Ad ${activity.adId.split('-').pop()}` : 'Video Watched'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.watchedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
                             <div className="flex items-center">
                 <span className="text-green-600 font-semibold mr-2">
                   +{formatCurrency(activity.reward || 0, user?.currency)}
                 </span>
                 <ArrowRight className="w-4 h-4 text-gray-400" />
               </div>
            </div>
          ))}
          
          {(!user?.watchHistory || user.watchHistory.length === 0) && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No recent activity</p>
              <p className="text-sm text-gray-500">Start watching ads to see your activity here</p>
            </div>
          )}
        </div>
        
        {user?.watchHistory?.length > 3 && (
          <div className="mt-4 text-center">
            <AnimatedButton
              onClick={() => navigate('/rewards')}
              variant="outline"
              size="sm"
            >
              View All Activity
            </AnimatedButton>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default DashboardPage; 