import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Globe, ArrowRight, CheckCircle } from 'lucide-react';
import CountrySelector from '../../components/CountrySelector/CountrySelector';
import GlassCard from '../../components/UI/GlassCard';
import AnimatedButton from '../../components/UI/AnimatedButton';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CountrySelectionPage = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handleCountrySelect = (country) => {
    console.log('CountrySelectionPage received country:', country);
    setSelectedCountry(country);
  };

  const handleContinue = async () => {
    if (!selectedCountry) {
      toast.error('Please select your country');
      return;
    }

    setLoading(true);
    try {
      console.log('Updating country with data:', {
        country: {
          name: selectedCountry.name,
          code: selectedCountry.code
        },
        currency: selectedCountry.currency
      });

      // Update user's country and currency using api service
      const response = await api.put('/api/auth/country', {
        country: {
          name: selectedCountry.name,
          code: selectedCountry.code
        },
        currency: selectedCountry.currency
      });

      console.log('API response:', response.data);

      if (response.data.user) {
        // Update local user state
        updateUser(response.data.user);
        toast.success(`Welcome! Your currency is set to ${selectedCountry.currency.symbol} ${selectedCountry.currency.name}`);
        navigate('/dashboard');
      } else {
        toast.error('Failed to update country - no user data returned');
      }
    } catch (error) {
      console.error('Error updating country:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to update country');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    toast.success('You can update your country later in your profile');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <GlassCard className="bg-gradient-to-r from-blue-50 to-indigo-50 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Globe className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Watch & Earn!
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Please select your country to display earnings in your local currency
          </p>
        </GlassCard>

        {/* Country Selection */}
        <div className="relative">
          <GlassCard className="bg-gradient-to-r from-white to-gray-50" style={{ overflow: 'visible' }}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></span>
              Select Your Country
            </h2>
            
            <CountrySelector
              onCountrySelect={handleCountrySelect}
              selectedCountry={selectedCountry}
              placeholder="Choose your country..."
              className="mb-6"
            />
            
            {/* Debug info */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Debug:</strong> Selected country: {selectedCountry ? `${selectedCountry.name} (${selectedCountry.currency.symbol})` : 'None'}
              </p>
                          <button 
              onClick={() => {
                const testCountry = { name: 'India', code: 'IN', currency: { code: 'INR', symbol: '₹', name: 'Indian Rupee' } };
                console.log('Manual test - setting country:', testCountry);
                handleCountrySelect(testCountry);
              }}
              className="mt-2 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
            >
              Test: Set India
            </button>
            <button 
              onClick={async () => {
                try {
                  console.log('Testing authentication...');
                  const response = await api.get('/api/auth/profile');
                  console.log('Profile response:', response.data);
                  alert('Authentication working! User: ' + response.data.user.email);
                } catch (error) {
                  console.error('Auth test error:', error);
                  alert('Authentication failed: ' + error.message);
                }
              }}
              className="mt-2 ml-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Test Auth
            </button>
            </div>

          {/* Preview */}
          {selectedCountry ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-green-900">Currency Preview</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium">Sample Earnings</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(1.50, selectedCountry.currency)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium">Sample Balance</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(25.00, selectedCountry.currency)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-600 font-medium">Sample Reward</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(0.50, selectedCountry.currency)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 text-center">
              <p className="text-gray-500">No country selected yet</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <AnimatedButton
              onClick={handleContinue}
              variant="primary"
              size="lg"
              disabled={!selectedCountry || loading}
              className="flex-1"
            >
              {loading ? 'Setting up...' : (
                <>
                  Continue with {selectedCountry?.currency?.symbol || '$'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </AnimatedButton>
            
            <AnimatedButton
              onClick={handleSkip}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Skip for now
            </AnimatedButton>
          </div>
        </GlassCard>
        </div>

        {/* Info Card */}
        <GlassCard className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
            Why set your country?
          </h3>
          <ul className="space-y-3 text-blue-800">
            <li className="flex items-start group">
              <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
              <span className="group-hover:text-blue-900 transition-colors">See earnings in your local currency</span>
            </li>
            <li className="flex items-start group">
              <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
              <span className="group-hover:text-blue-900 transition-colors">Better withdrawal options for your region</span>
            </li>
            <li className="flex items-start group">
              <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
              <span className="group-hover:text-blue-900 transition-colors">Personalized experience and support</span>
            </li>
            <li className="flex items-start group">
              <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
              <span className="group-hover:text-blue-900 transition-colors">You can change this anytime in your profile</span>
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
};

export default CountrySelectionPage; 