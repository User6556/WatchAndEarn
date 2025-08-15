import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, DollarSign, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedButton from '../../components/UI/AnimatedButton';
import GlassCard from '../../components/UI/GlassCard';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { loadPropellerAdsScript, initializePropellerAds } from '../../utils/propellerads';

const AdsPage = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

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

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      setAds(data.ads || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast.error('Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchAd = (adId) => {
    navigate(`/ads/${adId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Watch Ads & Earn
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Watch PropellerAds to earn money. Each ad takes 30-45 seconds to complete and pays $3-$4.
        </p>
      </GlassCard>

      {/* Available Ads */}
      <GlassCard className="bg-gradient-to-r from-white to-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></span>
          Available Ads
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <GlassCard key={ad.id} className="bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-indigo-50">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Play className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ad #{ad.id.split('-').pop()}
                </h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {ad.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="text-blue-700 font-medium">{ad.duration}s</span>
                  </div>
                  <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    <span className="text-green-700 font-medium">${ad.reward.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <AnimatedButton
                onClick={() => handleWatchAd(ad.id)}
                variant="primary"
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch & Earn ${ad.reward.toFixed(2)}
              </AnimatedButton>
            </GlassCard>
          ))}
        </div>

        {ads.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Eye className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">No ads available at the moment. Please check back later!</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AdsPage; 