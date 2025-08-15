import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Clock, DollarSign, Eye, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedButton from '../../components/UI/AnimatedButton';
import GlassCard from '../../components/UI/GlassCard';
import ProgressBar from '../../components/UI/ProgressBar';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { loadPropellerAdsScript, initializePropellerAds } from '../../utils/propellerads';

const AdPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchTime, setWatchTime] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchAdDetails();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id]);

  // Load PropellerAds script and initialize ads
  useEffect(() => {
    const loadPropellerAds = async () => {
      try {
        await loadPropellerAdsScript();
        initializePropellerAds();
      } catch (error) {
        console.error('Failed to load PropellerAds:', error);
      }
    };

    loadPropellerAds();
  }, []);

  const fetchAdDetails = async () => {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      const foundAd = data.ads.find(a => a.id === id);
      
      if (foundAd) {
        setAd(foundAd);
      } else {
        toast.error('Ad not found');
        navigate('/ads');
      }
    } catch (error) {
      console.error('Error fetching ad details:', error);
      toast.error('Failed to load ad details');
      navigate('/ads');
    } finally {
      setLoading(false);
    }
  };

  const startWatching = () => {
    setIsWatching(true);
    setWatchTime(0);
    
    timerRef.current = setInterval(() => {
      setWatchTime(prev => {
        const newTime = prev + 1;
        
        // Check if ad is completed
        if (newTime >= ad.duration) {
          completeAd();
          return newTime;
        }
        
        return newTime;
      });
    }, 1000);
  };

  const completeAd = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsWatching(false);
    setIsCompleted(true);
    
    try {
      const response = await fetch(`/api/ads/${id}/watch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          watchDuration: watchTime,
          completed: true
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRewardEarned(data.rewardEarned);
        toast.success(`Congratulations! You earned $${data.rewardEarned.toFixed(2)}`);
      } else {
        toast.error(data.error || 'Failed to record ad watch');
      }
    } catch (error) {
      console.error('Error recording ad watch:', error);
      toast.error('Failed to record ad watch');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!ad) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Watch Ad & Earn
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Complete this ad to earn ${ad.reward.toFixed(2)}
        </p>
      </GlassCard>

      {/* Ad Container */}
      <GlassCard className="bg-gradient-to-r from-white to-gray-50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ad #{ad.id.split('-').pop()}
          </h2>
          <p className="text-gray-600 text-lg">{ad.description}</p>
        </div>

        {/* PropellerAds Test Ad Container */}
        <GlassCard className="bg-gradient-to-r from-gray-50 to-blue-50 mb-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Play className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              PropellerAds Test Ad
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              This is a test ad container. In production, PropellerAds will appear here.
            </p>
            
            {/* PropellerAds Test Ad */}
            <div className="bg-white border rounded-xl p-6 mb-6 shadow-lg">
              <div className="text-sm text-gray-500 mb-3 font-medium">PropellerAds Test Ad:</div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <div id="propeller-ad-banner" 
                     className="propeller-ad"
                     data-zone-id="123456"
                     data-ad-type="banner"
                     style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}>
                </div>
              </div>
            </div>

            {!isWatching && !isCompleted && (
              <AnimatedButton
                onClick={startWatching}
                variant="primary"
                size="lg"
                className="mx-auto"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Watching Ad
              </AnimatedButton>
            )}

            {isWatching && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-blue-900">Watch Progress:</span>
                    <span className="text-sm text-blue-700 font-semibold">{formatTime(watchTime)} / {formatTime(ad.duration)}</span>
                  </div>
                  <ProgressBar 
                    progress={(watchTime / ad.duration) * 100} 
                    variant="primary" 
                    showLabel={false}
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Please watch the entire ad to earn the full reward
                  </p>
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="space-y-6">
                <div className="flex items-center justify-center text-green-600">
                  <CheckCircle className="w-10 h-10 mr-3" />
                  <span className="text-xl font-medium">Ad Completed!</span>
                </div>
                
                {rewardEarned > 0 && (
                  <GlassCard className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="text-center">
                      <p className="text-sm text-green-700 mb-2 font-medium">Reward Earned:</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${rewardEarned.toFixed(2)}
                      </p>
                    </div>
                  </GlassCard>
                )}
                
                <div className="flex space-x-4 justify-center">
                  <AnimatedButton
                    onClick={() => navigate('/ads')}
                    variant="primary"
                  >
                    Watch More Ads
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={() => navigate('/dashboard')}
                    variant="secondary"
                  >
                    Go to Dashboard
                  </AnimatedButton>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Ad Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="bg-gradient-to-r from-blue-50 to-cyan-50 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-sm text-blue-600 font-medium">Duration</p>
            <p className="text-xl font-bold text-blue-900">{ad.duration} seconds</p>
          </GlassCard>
          <GlassCard className="bg-gradient-to-r from-green-50 to-emerald-50 text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="text-sm text-green-600 font-medium">Reward</p>
            <p className="text-xl font-bold text-green-900">${ad.reward.toFixed(2)}</p>
          </GlassCard>
          <GlassCard className="bg-gradient-to-r from-purple-50 to-pink-50 text-center">
            <Eye className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <p className="text-sm text-purple-600 font-medium">Type</p>
            <p className="text-xl font-bold text-purple-900">{ad.type}</p>
          </GlassCard>
        </div>
      </GlassCard>

      {/* Instructions */}
      <GlassCard className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
          <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
          How to earn rewards:
        </h3>
        <ul className="space-y-3 text-blue-800">
          <li className="flex items-start group">
            <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
            <span className="group-hover:text-blue-900 transition-colors">Watch the entire ad to earn the full reward</span>
          </li>
          <li className="flex items-start group">
            <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
            <span className="group-hover:text-blue-900 transition-colors">Partial rewards are given for watching at least 15 seconds</span>
          </li>
          <li className="flex items-start group">
            <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
            <span className="group-hover:text-blue-900 transition-colors">You can only earn from each ad once per 24 hours</span>
          </li>
          <li className="flex items-start group">
            <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
            <span className="group-hover:text-blue-900 transition-colors">Rewards are automatically added to your balance</span>
          </li>
        </ul>
      </GlassCard>
    </div>
  );
};

export default AdPlayerPage; 