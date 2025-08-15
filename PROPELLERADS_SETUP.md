# PropellerAds Integration Setup Guide

This guide will help you set up PropellerAds to replace Google AdSense in your Watch & Earn website.

## Prerequisites

1. A PropellerAds account (sign up at https://propellerads.com)
2. Your website must be live and accessible
3. Basic knowledge of web development

## Step 1: Create PropellerAds Account

1. Go to https://propellerads.com and sign up for an account
2. Complete the verification process
3. Add your website to your PropellerAds dashboard

## Step 2: Get Your Site ID

1. Log into your PropellerAds dashboard
2. Go to "Sites" section
3. Add your website if not already added
4. Copy your Site ID (it will look like a long string of characters)

## Step 3: Create Ad Zones

1. In your PropellerAds dashboard, go to "Zones"
2. Create the following zones:
   - **Banner Zone**: For banner ads (728x90, 468x60, etc.)
   - **Rectangle Zone**: For rectangle ads (300x250, 336x280, etc.)
   - **Video Zone**: For video ads
   - **Popunder Zone**: For popunder ads

3. For each zone, note down the Zone ID

## Step 4: Update Configuration

1. Open `frontend/src/utils/propellerads-config.js`
2. Replace the placeholder values with your actual credentials:

```javascript
export const PROPELLER_CONFIG = {
  // Replace with your actual PropellerAds Site ID
  SITE_ID: 'YOUR_ACTUAL_SITE_ID_HERE',
  
  // Replace with your actual Zone IDs
  ZONE_IDS: {
    BANNER: 'YOUR_ACTUAL_BANNER_ZONE_ID',
    RECTANGLE: 'YOUR_ACTUAL_RECTANGLE_ZONE_ID', 
    VIDEO: 'YOUR_ACTUAL_VIDEO_ZONE_ID',
    POPUNDER: 'YOUR_ACTUAL_POPUNDER_ZONE_ID'
  },
  // ... rest of config
};
```

## Step 5: Configure Ad Settings

In the same config file, adjust the following settings:

### Reward Settings
```javascript
REWARDS: {
  BANNER: { min: 0.01, max: 0.05 },
  RECTANGLE: { min: 0.02, max: 0.08 },
  VIDEO: { min: 0.05, max: 0.15 },
  POPUNDER: { min: 0.03, max: 0.10 }
}
```

### Timing Settings
```javascript
// Minimum time user must watch ad to earn reward (in seconds)
MIN_WATCH_TIME: 15,

// Full reward time (in seconds)
FULL_REWARD_TIME: 25,

// Cooldown period between watching the same ad (in hours)
COOLDOWN_HOURS: 24,

// Maximum ads per day per user
MAX_ADS_PER_DAY: 50
```

## Step 6: Geographic Targeting (Optional)

If you want to restrict ads to specific countries:

```javascript
GEO_TARGETING: {
  ENABLED: true,
  
  // Allowed countries (empty array means all countries)
  ALLOWED_COUNTRIES: ['US', 'CA', 'GB'], // Example: US, Canada, UK
  
  // Blocked countries
  BLOCKED_COUNTRIES: []
}
```

## Step 7: Mobile Configuration (Optional)

If you want different ads for mobile devices:

```javascript
MOBILE: {
  ENABLE_MOBILE_ADS: true,
  
  // Mobile ad zone IDs (if different from desktop)
  MOBILE_ZONE_IDS: {
    BANNER: 'YOUR_MOBILE_BANNER_ZONE_ID',
    RECTANGLE: 'YOUR_MOBILE_RECTANGLE_ZONE_ID',
    VIDEO: 'YOUR_MOBILE_VIDEO_ZONE_ID'
  }
}
```

## Step 8: Test Your Integration

1. Start your development server
2. Navigate to the ads page
3. Check the browser console for any errors
4. Verify that PropellerAds script is loading
5. Test ad display and functionality

## Step 9: Production Deployment

1. Update your production environment variables
2. Deploy your application
3. Test on live site
4. Monitor PropellerAds dashboard for impressions and clicks

## Troubleshooting

### Common Issues

1. **Ads not showing**: Check zone IDs and site ID
2. **Script not loading**: Verify PropellerAds script URL
3. **Console errors**: Check browser console for specific error messages
4. **No revenue**: Ensure ads are properly configured in PropellerAds dashboard

### Debug Mode

Enable debug mode by adding this to your browser console:
```javascript
localStorage.setItem('propellerads_debug', 'true');
```

### Support

- PropellerAds Support: https://propellerads.com/support
- Documentation: https://propellerads.com/docs

## Important Notes

1. **Compliance**: Ensure your website complies with PropellerAds policies
2. **Content**: Make sure your content is original and high-quality
3. **Traffic**: PropellerAds requires real traffic for approval
4. **Testing**: Use test mode during development
5. **Revenue**: Actual revenue depends on traffic quality and ad performance

## File Structure

```
frontend/src/utils/
├── propellerads.js          # Main PropellerAds integration
├── propellerads-config.js   # Configuration file
└── propellerads.css         # Styling for ads
```

## API Integration

The backend routes in `backend/src/routes/ads.js` have been updated to work with PropellerAds. The ad tracking and reward system remains the same, but ad IDs have been updated to reflect the new ad network.

## Security Considerations

1. Never expose your PropellerAds credentials in client-side code
2. Use environment variables for sensitive configuration
3. Implement proper rate limiting for ad views
4. Validate user sessions before awarding rewards

## Performance Optimization

1. Load PropellerAds script asynchronously
2. Implement lazy loading for ads
3. Use proper caching headers
4. Monitor page load times

## Monitoring and Analytics

1. Track ad impressions and clicks
2. Monitor user engagement
3. Analyze revenue patterns
4. Set up alerts for unusual activity

## Updates and Maintenance

1. Regularly update PropellerAds script
2. Monitor for policy changes
3. Update configuration as needed
4. Test new ad formats

---

For additional support or questions, refer to the PropellerAds documentation or contact their support team.
