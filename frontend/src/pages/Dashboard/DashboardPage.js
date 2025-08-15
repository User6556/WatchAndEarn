import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  DollarSign, 
  Play, 
  Users, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  BarChart3, 
  Target,
  Calendar,
  Activity,
  Zap,
  Award,
  Eye,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../../components/UI/AnimatedButton';
import GlassCard from '../../components/UI/GlassCard';
import { formatCurrency } from '../../utils/currency';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate some mock analytics for demonstration
  const currentBalance = user?.balance || 0;
  const totalEarned = user?.totalEarned || 0;
  const adsWatched = user?.adsWatched || 0;
  const referralCount = user?.referralCount || 0;
  
  // Mock data for charts and analytics
  const weeklyEarnings = [12.50, 18.75, 15.20, 22.40, 19.80, 25.60, 28.90];
  const monthlyStats = {
    totalEarnings: 142.15,
    adsWatched: 47,
    referrals: 3,
    avgPerAd: 3.02
  };

  const stats = [
    {
      name: 'Current Balance',
      value: formatCurrency(currentBalance, user?.currency),
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      name: 'Total Earned',
      value: formatCurrency(totalEarned, user?.currency),
      change: '+8.3%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Ads Watched',
      value: adsWatched,
      change: '+15.2%',
      changeType: 'positive',
      icon: Play,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      name: 'Referrals',
      value: referralCount,
      change: '+2.1%',
      changeType: 'positive',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const quickActions = [
    {
      name: 'Watch Ads',
      description: 'Start earning now',
      icon: Play,
      color: 'bg-blue-500',
      href: '/ads',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Withdraw',
      description: 'Cash out earnings',
      icon: DollarSign,
      color: 'bg-green-500',
      href: '/rewards',
      gradient: 'from-green-500 to-green-600'
    },
    {
      name: 'Invite Friends',
      description: 'Earn bonuses',
      icon: Users,
      color: 'bg-purple-500',
      href: '/profile',
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  const recentActivity = user?.watchHistory?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.firstName || user?.username}. Here's what's happening with your account.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <AnimatedButton
            onClick={() => navigate('/ads')}
            variant="primary"
            className="flex items-center"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Watching
          </AnimatedButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.name}
            className="professional-stats-card rounded-xl p-6 cursor-pointer group professional-fade-in-up"
            onClick={() => {
              if (stat.name === 'Current Balance' || stat.name === 'Total Earned') {
                navigate('/rewards');
              } else if (stat.name === 'Ads Watched') {
                navigate('/ads');
              } else if (stat.name === 'Referrals') {
                navigate('/profile');
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'positive' ? (
                  <ChevronUp className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
              <span>View details</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="professional-stats-card rounded-xl p-6 professional-fade-in-left">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <Zap className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  onClick={() => navigate(action.href)}
                  className="w-full flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${action.gradient} mr-4`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.name}
                    </p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="lg:col-span-2">
          <div className="professional-stats-card rounded-xl p-6 professional-fade-in-right">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Analytics Overview</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly Earnings Chart */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Weekly Earnings</h3>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-end justify-between h-20">
                  {weeklyEarnings.map((earning, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="bg-blue-500 rounded-t w-6 mb-2 transition-all duration-300 hover:bg-blue-600 professional-chart-bar"
                        style={{ height: `${(earning / 30) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-500">${earning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Monthly Earnings</p>
                      <p className="text-lg font-bold text-green-600">
                        ${monthlyStats.totalEarnings}
                      </p>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Play className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Ads This Month</p>
                      <p className="text-lg font-bold text-purple-600">
                        {monthlyStats.adsWatched}
                      </p>
                    </div>
                  </div>
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-orange-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">New Referrals</p>
                      <p className="text-lg font-bold text-orange-600">
                        {monthlyStats.referrals}
                      </p>
                    </div>
                  </div>
                  <Award className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="professional-stats-card rounded-xl p-6 professional-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button 
            onClick={() => navigate('/rewards')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors professional-activity-item">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <Play className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.adId ? `Ad ${activity.adId.split('-').pop()}` : 'Video Watched'}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(activity.watchedAt).toLocaleDateString()}
                      <Clock className="w-3 h-3 ml-3 mr-1" />
                      {new Date(activity.watchedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 font-semibold mr-2">
                    +{formatCurrency(activity.reward || 0, user?.currency)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-500 mb-4">Start watching ads to see your activity here</p>
              <AnimatedButton
                onClick={() => navigate('/ads')}
                variant="primary"
                size="sm"
              >
                Start Watching Ads
              </AnimatedButton>
            </div>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-6 h-6" />
            <span className="text-blue-100 text-sm">Goal Progress</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">75%</h3>
          <p className="text-blue-100">Monthly earnings target</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-6 h-6" />
            <span className="text-green-100 text-sm">Growth</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">+23%</h3>
          <p className="text-green-100">vs last month</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-6 h-6" />
            <span className="text-purple-100 text-sm">Rank</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">Top 15%</h3>
          <p className="text-purple-100">Among active users</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 