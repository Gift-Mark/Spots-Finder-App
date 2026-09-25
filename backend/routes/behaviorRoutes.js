const express = require('express');
const router = express.Router();
const { logEvent, getAnalytics } = require('../controllers/behaviorController');

router.post('/log', logEvent);
router.get('/analytics', getAnalytics);

module.exports = router;