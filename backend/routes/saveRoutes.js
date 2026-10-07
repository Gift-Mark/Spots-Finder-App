const express = require('express');
const router = express.Router();
const { toggleSavePlace, getUserSaves } = require('../controllers/saveController');

// Define your endpoints
router.post('/toggle', toggleSavePlace);
router.get('/user/:userId', getUserSaves);

module.exports = router;
