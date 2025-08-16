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
      <div className="mobile-loading">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="mobile-main-content space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="mobile-text-xl lg:text-3xl font-bold text-gray-900 mb-2">
          Watch Ads & Earn
        </h1>
        <p className="mobile-text-base lg:text-lg text-gray-600">
          Watch PropellerAds to earn money. Each ad takes 30-45 seconds to complete and pays $3-$4.
        </p>
      </div>

      {/* Available Ads */}
      <div className="mobile-card">
        <h2 className="mobile-text-lg lg:text-xl font-semibold text-gray-900 mb-4 text-center">
          Available Ads
        </h2>
        
        <div className="mobile-grid lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="mobile-card">
              <div className="text-center mb-3 lg:mb-4">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
                  <Play className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
                </div>
                <h3 className="mobile-text-lg lg:text-xl font-semibold text-gray-900">
                  Ad #{ad.id.split('-').pop()}
                </h3>
              </div>
              
              <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {ad.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center bg-blue-50 px-2 lg:px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-blue-600" />
                    <span className="text-blue-700 font-medium text-xs lg:text-sm">{ad.duration}s</span>
                  </div>
                  <div className="flex items-center bg-green-50 px-2 lg:px-3 py-1 rounded-full">
                    <DollarSign className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-green-600" />
                    <span className="text-green-700 font-medium text-xs lg:text-sm">${ad.reward.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleWatchAd(ad.id)}
                className="mobile-btn"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch & Earn ${ad.reward.toFixed(2)}
              </button>
            </div>
          ))}
        </div>

        {ads.length === 0 && (
          <div className="text-center py-8 lg:py-12">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg">
              <Eye className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 mobile-text-base lg:text-lg">No ads available at the moment. Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsPage; 