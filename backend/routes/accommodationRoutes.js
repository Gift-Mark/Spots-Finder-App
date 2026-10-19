const express = require('express');
const router = express.Router();
const { 
  getAccommodations, 
  getFeaturedAccommodations, 
  getAccommodationZones 
} = require('../controllers/accommodationController');

router.get('/', getAccommodations);
router.get('/featured', getFeaturedAccommodations);
router.get('/zones', getAccommodationZones);

module.exports = router;