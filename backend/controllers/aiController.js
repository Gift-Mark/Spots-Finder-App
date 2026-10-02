const Place = require('../models/Place');
const BehaviorLog = require('../models/BehaviorLog');
const { placeDetails } = require('../data/placeDetails');

const knownPlaces = Object.values(placeDetails);

function redactPrivateText(value) {
  return value
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email removed]')
    .replace(/\+?\d[\d\s().-]{7,}\d/g, '[phone removed]');
}

function findPlace(query) {
  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  let bestMatch = null;
  let bestScore = 0;

  for (const place of knownPlaces) {
    const titleTerms = place.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ')
      .filter((term) => term.length > 2 && !['and', 'the', 'for'].includes(term));
    const slug = String(place.slug || place.id).replace(/-/g, ' ');
    const score = titleTerms.filter((term) => normalizedQuery.includes(term)).length;
    if (normalizedQuery.includes(slug) || score > bestScore) {
      bestMatch = place;
      bestScore = normalizedQuery.includes(slug) ? titleTerms.length : score;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

function classifyIntent(query, place) {
  if (!place && !/jos pulse|website|site|page|place|spot|flight|ticket|booking|reservation|search|account|login|register|culture|heritage|dining|restaurant|event|golf|nightlife|lounge|support|help|hello|hi\b/i.test(query)) {
    return 'out_of_scope';
  }
  if (/\b(hello|hi|hey)\b/i.test(query.trim())) return 'greeting';
  if (/hour|open|close|time/i.test(query)) return 'opening_hours';
  if (/price|cost|fee|ticket|entry/i.test(query)) return 'pricing';
  if (/where|address|location|directions|located/i.test(query)) return 'location';
  if (/book|booking|reserve|reservation|payment/i.test(query)) return 'booking';
  if (/flight|airport|jos \(jos\)/i.test(query)) return 'flights';
  if (/login|register|account|password/i.test(query)) return 'account_support';
  if (/recommend|suggest|visit|see|things to do|what can i/i.test(query)) return 'recommendation';
  if (place) return 'place_details';
  return 'website_support';
}

function buildSupportReply(query, place, intent) {
  if (intent === 'out_of_scope') {
    return "I'm Jos Pulse support and can only help with this website, its Plateau destinations, listings, events, and booking tools.";
  }
  if (intent === 'greeting') {
    return "Hello! I can help with Jos Pulse places, opening hours, entry prices, events, flights, and using the website. What would you like to know?";
  }
  if (intent === 'flights') {
    return 'Open Flights in the site navigation, or use “Search Flights to Jos” on a place detail page. The flight page currently shows sample routes and does not complete airline bookings.';
  }
  if (intent === 'account_support') {
    return 'Use Register to create an account or Login to access an existing one. Do not send passwords or payment details in this chat.';
  }
  if (place) {
    if (intent === 'opening_hours') return `${place.title} hours: ${place.openingHours || place.status || 'Hours are not listed yet.'}`;
    if (intent === 'pricing') return `${place.title} entry: ${place.entryPrice || 'Price is not listed yet.'}`;
    if (intent === 'location') return `${place.title} is at ${place.address || 'an address not listed yet.'}`;
    if (intent === 'booking') return `Open the ${place.title} detail page to review entry options and available add-ons. ${place.pricing?.addons?.length ? `Options include ${place.pricing.addons.map((item) => item.name).join(', ')}.` : 'No add-ons are listed for this place.'}`;
    const description = Array.isArray(place.description) ? place.description[0] : place.description;
    return `${place.title}: ${description || place.overviewHeading || 'View its detail page for location and visitor information.'}`;
  }
  if (intent === 'booking') {
    return 'Place pages show entry prices and available add-ons. The Flights page lets you review sample routes; airline ticket purchase is not connected.';
  }
  if (intent === 'recommendation') {
    const matches = knownPlaces.filter((item) => {
      const searchable = [item.category, item.title, ...(item.tags || [])].join(' ').toLowerCase();
      return query.split(/\W+/).some((term) => term.length > 3 && searchable.includes(term));
    }).slice(0, 3);
    if (matches.length) return `These Jos Pulse places may fit: ${matches.map((item) => item.title).join(', ')}. Ask about any one for details.`;
    return `Browse Culture & Heritage, Dining, Events, Golf, Nightlife, and other sections from the site navigation. You can also search for a specific Plateau destination.`;
  }
  return 'I can help with place details, opening hours, prices, flights, events, and finding your way around Jos Pulse. Ask about a specific listing or page.';
}

// @desc    Process query and give AI-guided response
// @route   POST /api/ai/recommend
exports.getAIRecommendation = async (req, res) => {
  try {
    const { prompt } = req.body;
    const query = prompt ? prompt.toLowerCase() : '';

    let matchedCategory = null;
    if (query.includes('sport') || query.includes('hike') || query.includes('outdoor')) {
      matchedCategory = 'Sports';
    } else if (query.includes('festival') || query.includes('culture') || query.includes('landmark')) {
      matchedCategory = 'Culture';
    } else if (query.includes('drink') || query.includes('lounge') || query.includes('night')) {
      matchedCategory = 'Nightlife';
    }

    let recommendations = [];
    if (matchedCategory) {
      recommendations = await Place.find({ category: { $in: [matchedCategory] } }).limit(3);
    } else {
      recommendations = await Place.find({ isPromoted: true }).limit(3);
    }

    res.status(200).json({
      success: true,
      reply: `Here are some recommendations based on your interest:`,
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAISupportResponse = async (req, res) => {
  try {
    const prompt = typeof req.body.prompt === 'string' ? req.body.prompt.trim().slice(0, 500) : '';
    const sessionId = typeof req.body.sessionId === 'string' ? req.body.sessionId.trim().slice(0, 100) : '';
    const pagePath = typeof req.body.pagePath === 'string' ? req.body.pagePath.slice(0, 200) : '';

    if (!prompt || !sessionId) {
      return res.status(400).json({ success: false, message: 'A question and session ID are required.' });
    }

    const place = findPlace(prompt);
    const intent = classifyIntent(prompt, place);
    const reply = buildSupportReply(prompt, place, intent);

    await BehaviorLog.create({
      sessionId,
      eventType: 'AI_CHAT',
      payload: {
        question: redactPrivateText(prompt).slice(0, 280),
        pagePath,
        intent,
        placeId: place?.id || null,
        resolved: intent !== 'out_of_scope',
      },
    });

    return res.status(200).json({ success: true, reply, intent, placeId: place?.id || null });
  } catch (error) {
    console.error('AI support request failed:', error.message);
    return res.status(500).json({ success: false, message: 'Support is temporarily unavailable.' });
  }
};