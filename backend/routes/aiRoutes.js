const express = require('express');
const router = express.Router();
const { getAIRecommendation, getAISupportResponse } = require('../controllers/aiController');

router.post('/recommend', getAIRecommendation);
router.post('/support', getAISupportResponse);

module.exports = router;