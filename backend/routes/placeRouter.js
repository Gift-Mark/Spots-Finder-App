const express = require('express');
const router = express.Router();
const { getPlaces, createPlace } = require('../controllers/placeController');

router.route('/').get(getPlaces).post(createPlace);

module.exports = router;