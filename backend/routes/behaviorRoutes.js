const express = require('express');
const router = express.Router();
const { logEvent, getAnalytics } = require('../controllers/behaviourController');

router.post('/log', logEvent);
router.get('/analytics', getAnalytics);

module.exports = router;