import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Check, ChevronDown } from 'lucide-react';
import GlassCard from '../UI/GlassCard';
import AnimatedButton from '../UI/AnimatedButton';
import api from '../../services/api';

const CountrySelector = ({ 
  onCountrySelect, 
  selectedCountry = null, 
  placeholder = "Select your country",
  className = "" 
}) => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
    
    // Fallback timeout in case API doesn't respond
    const timeoutId = setTimeout(() => {
      if (countries.length === 0) {
        loadFallbackCountries();
      }
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Initialize with fallback countries immediately for testing
  useEffect(() => {
    if (countries.length === 0) {
      loadFallbackCountries();
    }
  }, [countries.length]);

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      const initialCountries = countries.slice(0, 20);
      setFilteredCountries(initialCountries);
    } else {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.currency.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered.slice(0, 50));
    }
  }, [searchTerm, countries]);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/countries');
      
      if (response.data.success && response.data.countries) {
        setCountries(response.data.countries);
        setFilteredCountries(response.data.countries.slice(0, 20));
      } else {
        loadFallbackCountries();
      }
    } catch (error) {
      // Use fallback data on error
      loadFallbackCountries();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackCountries = () => {
    const fallbackCountries = [
      { name: 'United States', code: 'US', currency: { code: 'USD', symbol: '$', name: 'US Dollar' } },
      { name: 'India', code: 'IN', currency: { code: 'INR', symbol: '₹', name: 'Indian Rupee' } },
      { name: 'United Kingdom', code: 'GB', currency: { code: 'GBP', symbol: '£', name: 'British Pound' } },
      { name: 'Canada', code: 'CA', currency: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' } },
      { name: 'Australia', code: 'AU', currency: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' } },
      { name: 'Germany', code: 'DE', currency: { code: 'EUR', symbol: '€', name: 'Euro' } },
      { name: 'France', code: 'FR', currency: { code: 'EUR', symbol: '€', name: 'Euro' } },
      { name: 'Japan', code: 'JP', currency: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' } },
      { name: 'South Korea', code: 'KR', currency: { code: 'KRW', symbol: '₩', name: 'South Korean Won' } },
      { name: 'Brazil', code: 'BR', currency: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' } },
      { name: 'Mexico', code: 'MX', currency: { code: 'MXN', symbol: '$', name: 'Mexican Peso' } },
      { name: 'Singapore', code: 'SG', currency: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' } },
      { name: 'Netherlands', code: 'NL', currency: { code: 'EUR', symbol: '€', name: 'Euro' } },
      { name: 'Switzerland', code: 'CH', currency: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' } },
      { name: 'Sweden', code: 'SE', currency: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' } },
      { name: 'Norway', code: 'NO', currency: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' } },
      { name: 'Denmark', code: 'DK', currency: { code: 'DKK', symbol: 'kr', name: 'Danish Krone' } },
      { name: 'New Zealand', code: 'NZ', currency: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' } },
      { name: 'Philippines', code: 'PH', currency: { code: 'PHP', symbol: '₱', name: 'Philippine Peso' } },
      { name: 'Vietnam', code: 'VN', currency: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' } }
    ];
    setCountries(fallbackCountries);
    setFilteredCountries(fallbackCountries);
  };

  const handleCountrySelect = (country) => {
    console.log('Country selected:', country);
    onCountrySelect(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      // Always ensure we have countries when opening
      if (countries.length === 0) {
        loadFallbackCountries();
      }
    }
  };

  const testAPIConnection = async () => {
    try {
      const response = await api.get('/api/health');
      alert(`API Status: Connected - ${response.data.message}`);
    } catch (error) {
      alert('API Connection Failed: ' + error.message);
    }
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef} style={{ zIndex: isOpen ? 99999 : 'auto', position: 'relative' }}>
      <GlassCard className="bg-gradient-to-r from-white to-gray-50 w-full relative" style={{ zIndex: isOpen ? 99999 : 'auto' }}>
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <div className="flex items-center">
            <Globe className="w-5 h-5 text-blue-600 mr-3" />
            <div>
              {selectedCountry ? (
                <div>
                  <p className="font-medium text-gray-900 text-sm">{selectedCountry.name}</p>
                  <p className="text-xs text-gray-600">
                    {selectedCountry.currency.symbol} {selectedCountry.currency.name}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">{placeholder}</p>
              )}
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Debug buttons - hidden in production */}
        {process.env.NODE_ENV === 'development' && false && (
          <div className="absolute top-2 right-12 flex gap-1">
            <button
              onClick={testAPIConnection}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
              title="Test API Connection"
            >
              Test API
            </button>
            <button
              onClick={loadFallbackCountries}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
              title="Load Fallback Data"
            >
              Load Data
            </button>
            <button
              onClick={() => {
                loadFallbackCountries();
                setIsOpen(true);
              }}
              className="text-xs bg-green-500 text-white px-2 py-1 rounded"
              title="Load Data & Open"
            >
              Load & Open
            </button>
          </div>
        )}
      </GlassCard>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-[999999] mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-hidden min-w-full">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                autoFocus
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-sm">Loading countries...</p>
              </div>
            ) : countries.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="text-red-500 mb-3 text-2xl">⚠️</div>
                <p className="text-sm mb-3">Failed to load countries</p>
                <button 
                  onClick={loadFallbackCountries}
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Click here to load sample countries
                </button>
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="text-gray-400 mb-3 text-2xl">🔍</div>
                <p className="text-sm">No countries found for "{searchTerm}"</p>
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked for country:', country.name);
                    handleCountrySelect(country);
                  }}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedCountry?.code === country.code ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md mr-4 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {country.code}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm">{country.name}</p>
                      <p className="text-xs text-gray-500">
                        {country.currency.symbol} {country.currency.name}
                      </p>
                    </div>
                  </div>
                  {selectedCountry?.code === country.code && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector; 