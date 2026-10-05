const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

router.post('/', async (req, res) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!name) return res.status(400).json({ success: false, message: 'Name required' });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'A valid email is required' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (!existing.name) {
        existing.name = name;
        await existing.save();
        return res.status(200).json({ success: true, message: 'Your subscriber name has been updated.' });
      }
      return res.status(409).json({ success: false, message: 'Already subscribed' });
    }

    await Subscriber.create({ name, email });
    res.status(201).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;