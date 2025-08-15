// PropellerAds Integration Utility
import React from 'react';
import { getZoneId, getSiteId, getRewardForAdType, isUserInAllowedCountry } from './propellerads-config';

// Ad unit configurations
export const AD_UNITS = {
  BANNER: {
    id: 'propeller-banner-ad',
    zoneId: getZoneId('banner'),
    type: 'banner',
    responsive: true,
    style: { display: 'block', textAlign: 'center' }
  },
  RECTANGLE: {
    id: 'propeller-rectangle-ad',
    zoneId: getZoneId('rectangle'),
    type: 'rectangle',
    responsive: true,
    style: { display: 'block', textAlign: 'center' }
  },
  VIDEO: {
    id: 'propeller-video-ad',
    zoneId: getZoneId('video'),
    type: 'video',
    responsive: true,
    style: { display: 'block', textAlign: 'center' }
  },
  POPUNDER: {
    id: 'propeller-popunder-ad',
    zoneId: getZoneId('popunder'),
    type: 'popunder',
    responsive: false,
    style: { display: 'none' }
  }
};

// Load PropellerAds script
export const loadPropellerAdsScript = () => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.propellerads) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://cdn.propellerads.com/propeller.min.js';
    
    script.onload = () => {
      console.log('PropellerAds script loaded successfully');
      resolve();
    };
    
    script.onerror = () => {
      console.error('Failed to load PropellerAds script');
      reject(new Error('Failed to load PropellerAds script'));
    };

    // Add script to head
    document.head.appendChild(script);
  });
};

// Initialize PropellerAds
export const initializePropellerAds = () => {
  if (window.propellerads) {
    try {
      // Initialize PropellerAds with your site ID
      window.propellerads.init({
        siteId: getSiteId(),
        zones: [getZoneId('banner'), getZoneId('rectangle'), getZoneId('video'), getZoneId('popunder')]
      });
      console.log('PropellerAds initialized successfully');
    } catch (error) {
      console.error('Error initializing PropellerAds:', error);
    }
  }
};

// Create ad element
export const createAdElement = (adUnit) => {
  const adElement = document.createElement('div');
  adElement.id = adUnit.id;
  adElement.className = 'propeller-ad';
  adElement.setAttribute('data-zone-id', adUnit.zoneId);
  adElement.setAttribute('data-ad-type', adUnit.type);
  
  // Apply styles
  Object.assign(adElement.style, adUnit.style);
  
  return adElement;
};

// Render ad in container
export const renderAd = (containerId, adUnit) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id '${containerId}' not found`);
    return;
  }

  // Clear container
  container.innerHTML = '';
  
  // Create and append ad element
  const adElement = createAdElement(adUnit);
  container.appendChild(adElement);
  
  // Initialize the ad if PropellerAds is ready
  if (window.propellerads) {
    window.propellerads.render(adElement);
  }
};

// React component for PropellerAds ads
export const PropellerAd = ({ adUnit, className = '', style = {} }) => {
  const adRef = React.useRef(null);

  React.useEffect(() => {
    if (adRef.current && window.propellerads) {
      try {
        // Create ad element
        const adElement = createAdElement(adUnit);
        adRef.current.innerHTML = '';
        adRef.current.appendChild(adElement);
        
        // Render ad
        window.propellerads.render(adElement);
      } catch (error) {
        console.error('Error rendering PropellerAd:', error);
      }
    }
  }, [adUnit]);

  return (
    <div 
      ref={adRef}
      className={className}
      style={style}
    />
  );
};

// Check if PropellerAds is ready
export const isPropellerAdsReady = () => {
  return typeof window !== 'undefined' && window.propellerads;
};

// Get ad revenue estimation (for display purposes)
export const getAdRevenueEstimation = (adType = 'banner') => {
  return getRewardForAdType(adType);
};

// PropellerAds policy compliance check
export const checkPropellerAdsCompliance = () => {
  const checks = {
    hasPrivacyPolicy: true, // Set to true if you have privacy policy
    hasTermsOfService: true, // Set to true if you have terms of service
    hasContactInfo: true, // Set to true if you have contact information
    hasOriginalContent: true, // Set to true if you have original content
    hasSSL: window.location.protocol === 'https:', // Check if HTTPS
    hasNoCopyrightViolations: true, // Set to true if no copyright issues
    hasNoProhibitedContent: true // Set to true if no prohibited content
  };
  
  const failedChecks = Object.entries(checks)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  return {
    compliant: failedChecks.length === 0,
    failedChecks,
    allChecks: checks
  };
};

// Development/Testing mode detection
export const isDevelopmentMode = () => {
  return process.env.NODE_ENV === 'development' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

// Get appropriate ad configuration based on environment
export const getAdConfig = () => {
  return AD_UNITS;
};

// Track ad click for reward system
export const trackAdClick = (adUnit, userId) => {
  if (window.propellerads) {
    try {
      // Track the click event
      window.propellerads.track('click', {
        zoneId: adUnit.zoneId,
        userId: userId,
        timestamp: Date.now()
      });
      
      console.log('Ad click tracked successfully');
    } catch (error) {
      console.error('Error tracking ad click:', error);
    }
  }
};

// Track ad view for reward system
export const trackAdView = (adUnit, userId) => {
  if (window.propellerads) {
    try {
      // Track the view event
      window.propellerads.track('view', {
        zoneId: adUnit.zoneId,
        userId: userId,
        timestamp: Date.now()
      });
      
      console.log('Ad view tracked successfully');
    } catch (error) {
      console.error('Error tracking ad view:', error);
    }
  }
};
