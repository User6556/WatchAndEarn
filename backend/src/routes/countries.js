const express = require('express');
const countries = require('../data/countries');

const router = express.Router();

// Get all countries with currencies
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      countries: countries
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch countries'
    });
  }
});

// Get countries by search term
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json({
        success: true,
        countries: countries.slice(0, 20) // Return first 20 countries if no search term
      });
    }

    const searchTerm = q.toLowerCase();
    const filteredCountries = countries.filter(country => 
      country.name.toLowerCase().includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm) ||
      country.currency.code.toLowerCase().includes(searchTerm) ||
      country.currency.name.toLowerCase().includes(searchTerm)
    );

    res.json({
      success: true,
      countries: filteredCountries.slice(0, 50) // Limit to 50 results
    });
  } catch (error) {
    console.error('Error searching countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search countries'
    });
  }
});

// Get country by code
router.get('/:code', (req, res) => {
  try {
    const { code } = req.params;
    const country = countries.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (!country) {
      return res.status(404).json({
        success: false,
        error: 'Country not found'
      });
    }

    res.json({
      success: true,
      country: country
    });
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch country'
    });
  }
});

module.exports = router; 