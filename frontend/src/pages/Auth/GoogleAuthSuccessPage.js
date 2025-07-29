import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const GoogleAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError('No authentication token received');
      setLoading(false);
      return;
    }

    // Store the token
    localStorage.setItem('token', token);
    
    // Update API headers
    const api = require('../../services/api').default;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Fetch user profile to get complete user data
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/api/auth/profile');
        const userData = response.data.user;
        
        // Update user context
        updateUser(userData);
        
        toast.success('Google login successful!');
        
        // Redirect based on whether user has country set
        if (userData.country && userData.country.name) {
          navigate('/dashboard');
        } else {
          navigate('/country-selection');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to fetch user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [searchParams, navigate, updateUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Completing Google Login...
          </h2>
          <p className="text-gray-600">
            Please wait while we set up your account.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Login Failed
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleAuthSuccessPage; 