const express = require('express');
const router = express.Router();
const { getPlaces, getPlaceBySlug, createPlace } = require('../controllers/placeController');

router.route('/').get(getPlaces).post(createPlace);
router.get('/:slug', getPlaceBySlug);

module.exports = router;