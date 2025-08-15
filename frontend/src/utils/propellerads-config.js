// PropellerAds Configuration
// Replace these values with your actual PropellerAds credentials

export const PROPELLER_CONFIG = {
  // Your PropellerAds Site ID (get this from your PropellerAds dashboard)
  SITE_ID: 'YOUR_SITE_ID_HERE',
  
  // Zone IDs for different ad types (replace with your actual zone IDs)
  ZONE_IDS: {
    BANNER: 'YOUR_BANNER_ZONE_ID',
    RECTANGLE: 'YOUR_RECTANGLE_ZONE_ID', 
    VIDEO: 'YOUR_VIDEO_ZONE_ID',
    POPUNDER: 'YOUR_POPUNDER_ZONE_ID'
  },
  
  // Development/Testing settings
  DEVELOPMENT: {
    // Use test zone IDs for development
    TEST_ZONE_IDS: {
      BANNER: 'test-banner-zone',
      RECTANGLE: 'test-rectangle-zone',
      VIDEO: 'test-video-zone',
      POPUNDER: 'test-popunder-zone'
    },
    
    // Test site ID for development
    TEST_SITE_ID: 'test-site-id'
  },
  
  // Ad settings
  AD_SETTINGS: {
    // Minimum time user must watch ad to earn reward (in seconds)
    MIN_WATCH_TIME: 15,
    
    // Full reward time (in seconds)
    FULL_REWARD_TIME: 25,
    
    // Reward amounts for different ad types
    REWARDS: {
      BANNER: { min: 0.01, max: 0.05 },
      RECTANGLE: { min: 0.02, max: 0.08 },
      VIDEO: { min: 0.05, max: 0.15 },
      POPUNDER: { min: 0.03, max: 0.10 }
    },
    
    // Cooldown period between watching the same ad (in hours)
    COOLDOWN_HOURS: 24,
    
    // Maximum ads per day per user
    MAX_ADS_PER_DAY: 50
  },
  
  // Tracking settings
  TRACKING: {
    // Enable click tracking
    TRACK_CLICKS: true,
    
    // Enable view tracking
    TRACK_VIEWS: true,
    
    // Enable conversion tracking
    TRACK_CONVERSIONS: true
  },
  
  // Mobile settings
  MOBILE: {
    // Enable mobile-specific ads
    ENABLE_MOBILE_ADS: true,
    
    // Mobile ad zone IDs (if different from desktop)
    MOBILE_ZONE_IDS: {
      BANNER: 'YOUR_MOBILE_BANNER_ZONE_ID',
      RECTANGLE: 'YOUR_MOBILE_RECTANGLE_ZONE_ID',
      VIDEO: 'YOUR_MOBILE_VIDEO_ZONE_ID'
    }
  },
  
  // Geographic targeting
  GEO_TARGETING: {
    // Enable geographic targeting
    ENABLED: true,
    
    // Allowed countries (empty array means all countries)
    ALLOWED_COUNTRIES: [],
    
    // Blocked countries
    BLOCKED_COUNTRIES: []
  }
};

// Helper function to get zone ID based on environment and ad type
export const getZoneId = (adType, isMobile = false) => {
  const isDev = process.env.NODE_ENV === 'development' || 
                window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1';
  
  if (isDev) {
    return PROPELLER_CONFIG.DEVELOPMENT.TEST_ZONE_IDS[adType.toUpperCase()];
  }
  
  if (isMobile && PROPELLER_CONFIG.MOBILE.ENABLE_MOBILE_ADS) {
    return PROPELLER_CONFIG.MOBILE.MOBILE_ZONE_IDS[adType.toUpperCase()] || 
           PROPELLER_CONFIG.ZONE_IDS[adType.toUpperCase()];
  }
  
  return PROPELLER_CONFIG.ZONE_IDS[adType.toUpperCase()];
};

// Helper function to get site ID
export const getSiteId = () => {
  const isDev = process.env.NODE_ENV === 'development' || 
                window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1';
  
  return isDev ? PROPELLER_CONFIG.DEVELOPMENT.TEST_SITE_ID : PROPELLER_CONFIG.SITE_ID;
};

// Helper function to get reward for ad type
export const getRewardForAdType = (adType) => {
  return PROPELLER_CONFIG.AD_SETTINGS.REWARDS[adType.toUpperCase()] || 
         PROPELLER_CONFIG.AD_SETTINGS.REWARDS.BANNER;
};

// Helper function to check if user is in allowed country
export const isUserInAllowedCountry = (userCountry) => {
  if (!PROPELLER_CONFIG.GEO_TARGETING.ENABLED) {
    return true;
  }
  
  const { ALLOWED_COUNTRIES, BLOCKED_COUNTRIES } = PROPELLER_CONFIG.GEO_TARGETING;
  
  // Check if country is blocked
  if (BLOCKED_COUNTRIES.includes(userCountry)) {
    return false;
  }
  
  // If no allowed countries specified, allow all (except blocked)
  if (ALLOWED_COUNTRIES.length === 0) {
    return true;
  }
  
  // Check if country is in allowed list
  return ALLOWED_COUNTRIES.includes(userCountry);
};
