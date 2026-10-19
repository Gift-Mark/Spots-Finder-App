import FAQ from '../models/FAQ.js';

// GET /api/v1/faqs — Retrieve published FAQs for Section 7
export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isPublished: true }).sort({ sortOrder: 1 });
    return res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching FAQs', error: err.message });
  }
};