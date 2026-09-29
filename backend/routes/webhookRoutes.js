const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const BusinessProfile = require('../models/BusinessProfile');

router.post('/paystack', express.json(), async (req, res) => {
  // 1. Verify Webhook Signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).send('Invalid webhook signature');
  }

  // 2. Acknowledge receipt immediately to Paystack (prevents timeout)
  res.sendStatus(200);

  const event = req.body;

  // 3. Handle successful charge event
  if (event.event === 'charge.success') {
    const { metadata, amount } = event.data;
    const businessId = metadata?.businessId;
    const planType = metadata?.planType || 'BASIC_ANNUAL';

    if (businessId) {
      // Calculate annual expiration date (+1 year from now)
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      // Update business account in MongoDB
      await BusinessProfile.findByIdAndUpdate(businessId, {
        'subscription.status': 'ACTIVE',
        'subscription.plan': planType,
        'subscription.amountPaid': amount / 100, // Convert back from kobo
        'subscription.expiresAt': expiresAt,
      });

      console.log(`Successfully activated subscription for Business: ${businessId}`);
    }
  }
});

module.exports = router;