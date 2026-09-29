const express = require('express');
const router = express.Router();
const axios = require('axios');
const BusinessProfile = require('../models/BusinessProfile');

// 1. Initialize Subscription Payment
router.post('/initialize-subscription', async (req, res) => {
  const { email, businessId, planType } = req.body; 

  // Set pricing (e.g., Basic = ₦50,000/yr, Premium = ₦120,000/yr)
  const amountInKobo = planType === 'PREMIUM_ANNUAL' ? 120000 * 100 : 50000 * 100;

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amountInKobo,
        metadata: {
          businessId,
          planType,
          custom_fields: [
            { display_name: "Business ID", variable_name: "business_id", value: businessId }
          ]
        },
        // Optional: Paystack Subscription Plan Code if using automated recurring billing
        // plan: "PLN_xxx..." 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json({
      status: true,
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error('Paystack Init Error:', error.response?.data || error.message);
    res.status(500).json({ status: false, message: 'Could not initialize payment' });
  }
});

module.exports = router;