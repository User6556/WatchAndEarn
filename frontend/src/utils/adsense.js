// Google AdSense Integration Utility
import React from 'react';

// AdSense Client ID (replace with your actual client ID after approval)
const ADSENSE_CLIENT_ID = 'ca-pub-3940256099942544'; // Test client ID - replace with yours

// Ad unit configurations
export const AD_UNITS = {
  BANNER: {
    id: 'banner-ad',
    client: ADSENSE_CLIENT_ID,
    slot: '1234567890', // Replace with your actual ad slot
    format: 'auto',
    responsive: true,
    style: { display: 'block' }
  },
  RECTANGLE: {
    id: 'rectangle-ad',
    client: ADSENSE_CLIENT_ID,
    slot: '1234567891', // Replace with your actual ad slot
    format: 'rectangle',
    responsive: true,
    style: { display: 'block' }
  },
  VIDEO: {
    id: 'video-ad',
    client: ADSENSE_CLIENT_ID,
    slot: '1234567892', // Replace with your actual ad slot
    format: 'video',
    responsive: true,
    style: { display: 'block' }
  }
};

// Load AdSense script
export const loadAdSenseScript = () => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.adsbygoogle) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('AdSense script loaded successfully');
      resolve();
    };
    
    script.onerror = () => {
      console.error('Failed to load AdSense script');
      reject(new Error('Failed to load AdSense script'));
    };

    // Add script to head
    document.head.appendChild(script);
  });
};

// Initialize AdSense
export const initializeAdSense = () => {
  if (window.adsbygoogle) {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      console.log('AdSense initialized successfully');
    } catch (error) {
      console.error('Error initializing AdSense:', error);
    }
  }
};

// Create ad element
export const createAdElement = (adUnit) => {
  const adElement = document.createElement('ins');
  adElement.className = 'adsbygoogle';
  adElement.id = adUnit.id;
  adElement.setAttribute('data-ad-client', adUnit.client);
  adElement.setAttribute('data-ad-slot', adUnit.slot);
  adElement.setAttribute('data-ad-format', adUnit.format);
  adElement.setAttribute('data-full-width-responsive', adUnit.responsive);
  
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
  
  // Initialize the ad
  initializeAdSense();
};

// React component for AdSense ads
export const AdSenseAd = ({ adUnit, className = '', style = {} }) => {
  const adRef = React.useRef(null);

  React.useEffect(() => {
    if (adRef.current && window.adsbygoogle) {
      try {
        // Create ad element
        const adElement = createAdElement(adUnit);
        adRef.current.innerHTML = '';
        adRef.current.appendChild(adElement);
        
        // Initialize ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Error rendering AdSense ad:', error);
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

// Check if AdSense is ready
export const isAdSenseReady = () => {
  return typeof window !== 'undefined' && window.adsbygoogle;
};

// Get ad revenue estimation (for display purposes)
export const getAdRevenueEstimation = (adType = 'banner') => {
  const revenueRanges = {
    banner: { min: 0.01, max: 0.05 },
    rectangle: { min: 0.02, max: 0.08 },
    video: { min: 0.05, max: 0.15 }
  };
  
  const range = revenueRanges[adType] || revenueRanges.banner;
  return {
    min: range.min,
    max: range.max,
    average: (range.min + range.max) / 2
  };
};

// AdSense policy compliance check
export const checkAdSenseCompliance = () => {
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
  if (isDevelopmentMode()) {
    return {
      ...AD_UNITS,
      // Use test client ID for development
      BANNER: { ...AD_UNITS.BANNER, client: 'ca-pub-3940256099942544' },
      RECTANGLE: { ...AD_UNITS.RECTANGLE, client: 'ca-pub-3940256099942544' },
      VIDEO: { ...AD_UNITS.VIDEO, client: 'ca-pub-3940256099942544' }
    };
  }
  
  return AD_UNITS;
}; 