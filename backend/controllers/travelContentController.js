import TravelContent from '../models/TravelContent.js';

// GET /api/v1/travel-content/:slug — Retrieve Highland climate & advisory guides for Section 6
export const getTravelContentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const content = await TravelContent.findOne({ slug, isPublished: true });

    if (!content) {
      // Fallback response if no specific slug record is seeded yet
      return res.status(200).json({
        success: true,
        data: {
          title: "The Highland Difference: Why Jos Nights Feel Like Spring in Europe",
          description: "Pillowed under clear blue skies, familiar to comfortable average temperatures of 18°C–24°C, and pure mountain air, Jos is unmatched for refreshing getaways."
        }
      });
    }

    return res.status(200).json({ success: true, data: content });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching travel content', error: err.message });
  }
};