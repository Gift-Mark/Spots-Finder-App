import Place from "../models/Place.js";
import Event from "../models/Events.js";
import BehaviorLog from "../models/BehaviorLog.js";

// ---------------------------------------------------------------------------
// Jos Pulse website AI support engine
//
// Blends three layers so it can answer essentially any question about the
// website:
//   1. Live MongoDB data — places (hours, prices, locations, ratings) and
//      upcoming events, matched with fuzzy name/token scoring.
//   2. A curated knowledge base covering every page and feature of the site
//      (Explore, Stays, Culture, Golf, Flights, Dining, Events, Nightlife,
//      Lounges, Attractions, Guides, Claim Venue, accounts, dashboards,
//      reviews, saves, check-ins, newsletter, privacy, terms, contact...).
//   3. Optional OpenAI generation: when a valid OPENAI_API_KEY (sk-...) is
//      configured, the model answers using the knowledge base + live data as
//      context, with automatic fallback to the local engine on any failure.
// ---------------------------------------------------------------------------

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_ENABLED = OPENAI_API_KEY.startsWith("sk-");
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const OPENAI_TIMEOUT_MS = 15000;

// --- small utilities -------------------------------------------------------

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenize(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2);
}

function redactPrivateText(value) {
  return String(value)
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email removed]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[phone removed]");
}

// Words too generic to identify a place by name (question words plus common
// category words that appear inside many venue names).
const GENERIC_WORDS = [
  "the", "and", "for", "with", "near", "from", "about", "what", "where",
  "when", "how", "much", "does", "its", "are", "was", "tell", "please",
  "open", "close", "price", "cost", "entry", "ticket", "book", "best",
  "good", "nice", "place", "spot", "venue", "location", "address", "hours",
  "time", "rating", "review", "jos", "plateau", "resort", "resorts", "hotel",
  "hotels", "park", "parks", "club", "clubs", "cafe", "cafes", "restaurant",
  "restaurants", "bar", "bars", "garden", "gardens", "eat", "eats", "food",
  "drink", "drinks", "stay", "stays", "nightlife", "dining", "swimming", "pool",
];

// --- curated website knowledge base ---------------------------------------
// Each entry: { id, keywords, answer }. Phrase keywords score higher than
// single-word keywords; words shorter than 5 chars require an exact match.

const WEBSITE_KNOWLEDGE = [
  {
    id: "site_overview",
    keywords: ["jos pulse", "this website", "this site", "about the site", "about jos pulse", "what is this", "overview", "platform"],
    answer:
      "Jos Pulse is your guide to Plateau State, Nigeria. It helps you discover the best places to eat, stay, party, relax and explore — plus events, culture, golf and flights in and around Jos. Start on the Explore page, or just ask me about any place, price, event or website feature.",
  },
  {
    id: "explore_page",
    keywords: ["explore", "discover", "home page", "homepage", "landing"],
    answer:
      "The Explore page is the heart of Jos Pulse: a hero search bar, category pills (Golf, Festivals, Restaurants, Nightlife, Cultural Landmarks), Top Tourist Spots, promoted events and a Heritage Spotlight. Open it any time from the top navigation.",
  },
  {
    id: "search_how",
    keywords: ["how do i search", "search bar", "find places", "search for", "look for", "searching"],
    answer:
      "Use the search bar in the hero section of the Explore page to find places by name or keyword, or tap the category pills to filter. You can also ask me right here — for example: \"Tell me about Rayfield Resort\" or \"Recommend a restaurant\".",
  },
  {
    id: "stays_page",
    keywords: ["stays", "stay", "hotel", "hotels", "accommodation", "sleep", "lodge", "resort", "room"],
    answer:
      "The Stays page curates hotels, resorts and guest accommodation across Jos and Plateau. Open Stays from the top navigation, or ask me to recommend a place to stay and I'll pull live options with prices.",
  },
  {
    id: "culture_page",
    keywords: ["culture", "heritage", "landmark", "museum", "history", "historical", "monument", "tradition"],
    answer:
      "Culture & Heritage gathers Plateau landmarks, museums and heritage sites — including the Heritage Spotlight section on the Explore page. Ask me about any specific site for its details.",
  },
  {
    id: "golf_page",
    keywords: ["golf", "tee time", "course", "fairway", "driving range"],
    answer:
      "The Golf section covers Jos golfing experiences. You can book a Tee Time directly from the Golf spotlight on the Explore page — pick your date, slot and players and submit the booking.",
  },
  {
    id: "flights_page",
    keywords: ["flight", "flights", "fly", "airport", "airline", "airplane", "plane ticket"],
    answer:
      "The Flights page shows sample routes to Jos (for example Abuja → Jos) so you can plan your trip. Note: it currently displays sample routes — airline ticket purchase is not yet completed on the site.",
  },
  {
    id: "dining_page",
    keywords: ["dining", "restaurant", "food", "eat", "meal", "lunch", "dinner", "breakfast", "cafe", "coffee", "cuisine", "menu"],
    answer:
      "The Restaurants section (Dining) browses dining spots across Jos — restaurants, cafes, grills and late-night eats. Open Restaurants from the top navigation, or ask me to recommend somewhere to eat and I'll suggest live listings.",
  },
  {
    id: "nightlife_page",
    keywords: ["nightlife", "club", "clubs", "party", "dance", "bar", "bars", "drinks", "live music", "dj"],
    answer:
      "The Nightlife section covers clubs, bars and live music around Jos. There's also a dedicated Lounges section for laid-back evenings. Ask me to recommend nightlife and I'll pull current listings.",
  },
  {
    id: "lounges_page",
    keywords: ["lounge", "lounges", "lounge bar", "chill", "relax"],
    answer:
      "The Lounges page curates relaxed lounge bars across Jos — ideal for quiet drinks and conversation. Open it from the site navigation or ask me about a specific lounge.",
  },
  {
    id: "attractions_page",
    keywords: ["attraction", "attractions", "tourist", "tourist spots", "sightseeing", "visit site", "landmarks to visit"],
    answer:
      "The Attractions section and the Top Tourist Spots strip on Explore highlight must-see destinations around Plateau — falls, rock formations, parks and viewpoints. Ask me about any attraction for details.",
  },
  {
    id: "guides_page",
    keywords: ["guide", "guides", "travel guide", "city guide", "itinerary", "tips"],
    answer:
      "The Guides section offers curated write-ups and local tips for experiencing Jos and Plateau State — from day trips to food crawls. Open Guides from the site navigation.",
  },
  {
    id: "place_detail",
    keywords: ["place page", "detail page", "spot details", "place details", "listing page", "what is on a place"],
    answer:
      "Every place on Jos Pulse has a detail page with its description, photos, map location, opening hours, entry prices and add-ons, reviews, and options to save it or check in. Tap any place card to open it — or ask me about a place by name.",
  },
  {
    id: "reviews",
    keywords: ["review", "reviews", "rating", "rate", "star", "stars", "leave a review", "write a review", "feedback"],
    answer:
      "On any place detail page, scroll to the reviews section and tap Write a review to rate it 1–5 stars and share your experience. You need an account (it's free to register) — guests can read reviews without one.",
  },
  {
    id: "saves",
    keywords: ["save", "saved", "favorite", "favourite", "bookmark", "heart", "wishlist"],
    answer:
      "Tap the save (heart) icon on any place card or detail page to add it to your favourites. Log in first — then find all your saved spots in your User Dashboard under Saved.",
  },
  {
    id: "checkins",
    keywords: ["check in", "check-in", "checkin", "check-ins", "visited", "points", "rewards", "xp"],
    answer:
      "Checking in at a place records your visit from its detail page — great for building your explorer history. Log in to check in; your visits and rewards activity appear in your User Dashboard.",
  },
  {
    id: "newsletter",
    keywords: ["newsletter", "subscribe", "subscription", "email updates", "mailing list"],
    answer:
      "Scroll to the footer and enter your email in the newsletter form to get updates on local vibes, events and highland escapes. Note: subscribing requires being signed in — guests are asked to log in first.",
  },
  {
    id: "claim_venue",
    keywords: ["claim", "claim venue", "claim a venue", "business owner", "my business", "own a venue", "verify business", "ownership"],
    answer:
      "If you own or manage a venue listed on Jos Pulse, open Claim a Venue (/claim) from the site and submit your claim with proof of ownership. The team reviews and verifies it, then you get Vendor Dashboard access to manage your listing.",
  },
  {
    id: "register",
    keywords: ["register", "sign up", "create account", "create an account", "new account", "join"],
    answer:
      "Tap Register in the header, fill in your name, email and password, and you'll be signed in straight away. Registration is free and unlocks saving spots, reviews, check-ins, the newsletter and your dashboard. You can also keep browsing as a guest without an account.",
  },
  {
    id: "login",
    keywords: ["login", "log in", "sign in", "signin", "password", "account", "cant log in", "cant sign in", "trouble logging"],
    answer:
      "Tap Login in the header and sign in with your email and password. If a feature redirected you to the login page, you'll be taken straight back to it after signing in. Never share your password in this chat.",
  },
  {
    id: "guest_mode",
    keywords: ["guest", "guest mode", "without account", "without logging in", "browse without", "no account", "as a visitor"],
    answer:
      "Yes — Jos Pulse loads in guest mode first, so you can browse everything (Explore, Stays, Dining, Events, Nightlife, Culture and more) without an account. Registering unlocks extras: saving spots, reviews, check-ins, the newsletter and dashboards. On the Login page you can also choose \"Continue as Guest\".",
  },
  {
    id: "logout",
    keywords: ["log out", "logout", "sign out", "exit account"],
    answer:
      "Click Logout in the header to sign out. You'll keep browsing as a guest — your saved spots and reviews will be waiting when you log back in.",
  },
  {
    id: "user_dashboard",
    keywords: ["user dashboard", "my account", "my profile", "my dashboard", "my saved", "my bookings", "my checkins"],
    answer:
      "The User Dashboard (/userDashboard) is your personal hub: profile, saved spots, bookings, check-ins and reviews. Sign in from the header to open it — guests are asked to log in first.",
  },
  {
    id: "vendor_dashboard",
    keywords: ["vendor", "vendor dashboard", "business dashboard", "merchant", "list my business", "manage listing", "campaign", "campaigns", "promotions", "analytics"],
    answer:
      "The Vendor Dashboard (/vendor) is for businesses: manage your hotspot listings, run campaigns and promotions, track bookings and view analytics. Log in with a business/vendor account — or claim your venue first from the Claim page.",
  },
  {
    id: "superadmin",
    keywords: ["superadmin", "super admin", "admin dashboard", "administrator", "admin account", "moderation", "flagged content", "promoted venues"],
    answer:
      "The Super Admin dashboard (/SuperAdmin) is restricted to admin accounts — platform overview, promoted venue listings and flagged content moderation. Admins are provisioned by the site operators (there's a seed script in the backend). After logging in with an admin account you're taken there automatically.",
  },
  {
    id: "payments",
    keywords: ["payment", "payments", "paystack", "pay online", "card", "pay", "pricing plans", "subscription plans", "how much does the site cost"],
    answer:
      "Browsing Jos Pulse is completely free, and each place's entry price is shown on its detail page. Where online payments are enabled they run through Paystack. Some payment features are still being rolled out — ask me about a specific place to see its entry price.",
  },
  {
    id: "booking",
    keywords: ["booking", "book a place", "reservation", "reserve", "add-ons", "addons", "buy ticket", "book ticket"],
    answer:
      "Open a place's detail page to see its entry price and available add-ons, then use its booking options. For golf you can book a Tee Time from the Explore page, and the Flights page currently shows sample routes. Ask me about a specific place and I'll share what it offers.",
  },
  {
    id: "privacy",
    keywords: ["privacy", "privacy policy", "my data", "data protection", "personal information"],
    answer:
      "The Privacy Policy page (/privacy) explains what data Jos Pulse collects and how it's used — including chat questions like these, which are stored with contact details removed to improve support.",
  },
  {
    id: "terms",
    keywords: ["terms", "terms of use", "terms of service", "rules", "conditions"],
    answer:
      "The Terms page (/terms) covers the rules for using Jos Pulse — accounts, listings, reviews and content guidelines.",
  },
  {
    id: "contact",
    keywords: ["contact", "support", "reach", "email the team", "customer care", "help line", "report a problem", "report issue"],
    answer:
      "Open the Contact page (/contact, also linked as Support) to reach the Jos Pulse team with feedback, issues or partnership requests. Or keep chatting with me here — I cover everything about the website.",
  },
  {
    id: "map",
    keywords: ["map", "maps", "where is it located", "directions", "get to", "how to get there", "latitude", "coordinates"],
    answer:
      "Every place detail page shows its location on a map with its address. Ask me \"Where is <place name>?\" for any listed spot and I'll give you its address.",
  },
  {
    id: "weather",
    keywords: ["weather", "climate", "temperature", "rain", "cold", "hot", "when to visit"],
    answer:
      "Jos sits on the Plateau highlands, so it stays pleasantly cool — roughly 18–25°C for most of the year, cooler in the harmattan months. Pack a light jacket for evenings.",
  },
  {
    id: "promoted",
    keywords: ["promoted", "promotion", "advertise", "advertising", "featured", "sponsor", "spotlight"],
    answer:
      "Promoted venues and events are highlighted across the site (Explore sections and listings). Businesses can request promotion and run campaigns from the Vendor Dashboard.",
  },
  {
    id: "ai_chat",
    keywords: ["ai", "chatbot", "bot", "assistant", "who are you", "are you human", "are you a robot", "this chat"],
    answer:
      "I'm Jos Pulse AI — the website's built-in assistant. I can answer questions about any page, place, price, hour, event or feature on Jos Pulse. Chat questions are saved with contact details removed to improve support; never share passwords or payment details here.",
  },
];

// --- conversational patterns ----------------------------------------------

const GREETING_RE = /^(hi|hey|hello|yo|sup|greetings|good\s*(morning|afternoon|evening|day))\b/i;
const THANKS_RE = /\b(thanks|thank you|thx|much appreciated|appreciate it)\b/i;
const BYE_RE = /^(bye|goodbye|good\s*night|see\s*(you|ya)|later|cheers)\b/i;
const HOW_ARE_YOU_RE = /\bhow\s+(are|r)\s+(you|u)\b|\bhow'?s\s+it\s+going\b/i;
const CAPABILITY_RE = /\bwhat\s+can\s+you\s+(do|answer|help\s+with)\b|\bhow\s+can\s+you\s+help\b|\bwhat\s+do\s+you\s+(do|know)\b/i;

const EVENTS_RE = /\b(events?|what'?s\s+on|whats\s+on|happening|festivals?|concerts?|shows?|gigs?|exhibitions?|meetups?|this\s+weekend)\b/i;
const RECOMMEND_RE = /\b(recommends?|suggest|suggestions?|recommendations?|things\s+to\s+do|what\s+to\s+(do|see|eat|visit|drink)|where\s+(should|can)\s+(i|we|you)|where\s+to\s+(eat|stay|go|visit|party)|places\s+to\s+(visit|see|eat|stay|go)|best|top|popular|famous|nice\s+(places|spots))\b/i;

const CAPABILITY_MENU =
  "I can help with anything on Jos Pulse: places to eat, stay, party and explore; opening hours and entry prices; upcoming events; golf tee times; flights; using your account or dashboards; saving spots, reviews and check-ins; claiming a venue; privacy, terms and contact. Try asking things like \"What's on this weekend?\", \"Where can I eat in Jos?\" or \"What are Rayfield Resort's hours?\"";

// --- dynamic data lookups ---------------------------------------------------

function placeDisplayName(place) {
  return String(place.title || place.name || "").trim();
}

function formatEventDate(date) {
  try {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "date to be confirmed";
  }
}

function formatMoney(amount, currency = "NGN") {
  if (amount === null || amount === undefined || Number(amount) === 0) return "Free";
  const symbol = String(currency || "NGN").toUpperCase() === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${Number(amount).toLocaleString("en-US")}`;
}

/**
 * Fuzzy-match the visitor's question against the live Place collection.
 * Strong match: the place's full name appears in the query, or every
 * distinctive name token is present.
 */
async function findBestPlaceMatch(prompt) {
  try {
    const query = prompt.toLowerCase();
    const words = tokenize(query).filter((w) => !GENERIC_WORDS.includes(w));
    if (!words.length) return null;

    const places = await Place.find({ status: { $ne: "inactive" } })
      .select(
        "name title slug category subcategory tags summary description overviewHeading address location openingHours openingTime closingTime displayStatus entryPrice entryFee pricing rating reviewsCount phone bookingUrl"
      )
      .limit(500);

    let best = null;
    let bestScore = 0;

    for (const place of places) {
      const displayName = placeDisplayName(place).toLowerCase();
      if (displayName.length < 3) continue;

      // Direct name-in-query match (strongest signal).
      if (query.includes(displayName)) {
        const score = tokenize(displayName).length * 3 + 3;
        if (score > bestScore) {
          best = place;
          bestScore = score;
        }
        continue;
      }

      const nameTokens = tokenize(displayName).filter((t) => !GENERIC_WORDS.includes(t));
      if (!nameTokens.length) continue;

      const matchedTokens = nameTokens.filter((t) => words.includes(t));
      if (!matchedTokens.length) continue;

      const tagHits = (place.tags || []).filter((tag) =>
        words.some((w) => String(tag).toLowerCase().includes(w))
      ).length;

      // Two or more matched name tokens strongly reference this place (the
      // visitor doesn't have to type the entire name). A single long,
      // distinctive token (e.g. "rayfield") is enough for short names.
      let score = 0;
      if (matchedTokens.length >= 2) {
        score = matchedTokens.length * 3 + tagHits;
      } else if (matchedTokens[0].length >= 6) {
        score = 5 + tagHits;
      }

      if (score > bestScore) {
        best = place;
        bestScore = score;
      }
    }

    return bestScore >= 5 ? best : null;
  } catch (error) {
    console.error("Place match lookup failed:", error.message);
    return null;
  }
}

async function getUpcomingEventsSnapshot(limit = 5) {
  try {
    const now = new Date();
    let events = await Event.find({
      status: { $in: ["upcoming", "ongoing"] },
      eventDate: { $gte: now },
    })
      .sort({ eventDate: 1 })
      .limit(limit)
      .select("title eventDate startTime endTime category ticketPrice currency status slug");

    // Fall back to the newest listed events if none are dated in the future.
    if (!events.length) {
      events = await Event.find({ status: { $in: ["upcoming", "ongoing"] } })
        .sort({ eventDate: -1 })
        .limit(limit)
        .select("title eventDate startTime endTime category ticketPrice currency status slug");
    }
    return events;
  } catch (error) {
    console.error("Events snapshot failed:", error.message);
    return [];
  }
}

const RECOMMENDATION_CATEGORIES = [
  { categories: ["golf"], keywords: ["golf", "tee", "course", "sport"] },
  { categories: ["nightlife"], keywords: ["nightlife", "club", "party", "dance", "drink", "night", "bar"] },
  { categories: ["restaurant", "cafe"], keywords: ["restaurant", "food", "eat", "dining", "dine", "lunch", "dinner", "breakfast", "cafe", "coffee"] },
  { categories: ["culture", "landmark"], keywords: ["culture", "heritage", "landmark", "museum", "history", "historical", "monument"] },
  { categories: ["nature"], keywords: ["nature", "outdoor", "hike", "hiking", "adventure", "wildlife", "park", "fall", "falls", "lake", "garden"] },
  { categories: ["hotel", "resort"], keywords: ["hotel", "stay", "stays", "accommodation", "sleep", "lodge", "resort", "room"] },
  { categories: ["festival"], keywords: ["festival", "carnival", "concert", "parade"] },
];

async function getRecommendations(prompt, limit = 4) {
  try {
    const query = String(prompt || "").toLowerCase();
    const match = RECOMMENDATION_CATEGORIES.find((entry) =>
      entry.keywords.some((keyword) =>
        new RegExp(`\\b${escapeRegex(keyword)}`, "i").test(query)
      )
    );

    if (match) {
      const places = await Place.find({ category: { $in: match.categories }, status: { $ne: "inactive" } })
        .sort({ rating: -1, reviewsCount: -1 })
        .limit(limit)
        .select("name title slug category entryPrice entryFee rating openingHours summary");
      if (places.length) return places;
    }

    // General "what should I visit" — surface the highest rated listings.
    return await Place.find({ status: { $ne: "inactive" } })
      .sort({ rating: -1, reviewsCount: -1 })
      .limit(limit)
      .select("name title slug category entryPrice entryFee rating openingHours summary");
  } catch (error) {
    console.error("Recommendation lookup failed:", error.message);
    return [];
  }
}

function describePlace(place) {
  const name = placeDisplayName(place);
  const bits = [];
  if (place.category) bits.push(String(place.category));
  if (place.entryPrice) bits.push(String(place.entryPrice));
  else if (place.entryFee) bits.push(formatMoney(place.entryFee));
  if (place.rating) bits.push(`★ ${place.rating}`);
  return `${name} (${bits.join(", ")})`;
}

// --- answer composers -------------------------------------------------------

function buildPlaceAnswer(place, query) {
  const name = placeDisplayName(place);
  const summary = Array.isArray(place.description)
    ? place.description[0]
    : place.description || place.summary || "";

  if (/hour|open|close|when/i.test(query)) {
    const hours =
      place.openingHours ||
      [place.openingTime, place.closingTime].filter(Boolean).join("–") ||
      place.displayStatus;
    return `${name} hours: ${hours || "hours are not listed yet — check its detail page."}`;
  }
  if (/price|cost|fee|ticket|entry|how much|pay/i.test(query)) {
    const price =
      place.entryPrice ||
      (place.entryFee ? formatMoney(place.entryFee) : null) ||
      (place.pricing && place.pricing.adultRate ? formatMoney(place.pricing.adultRate) : null);
    return `${name} entry: ${price || "price is not listed yet"}. Open its detail page for add-ons and booking options.`;
  }
  if (/where|address|location|located|direction|find|get to|map/i.test(query)) {
    return `${name} is at ${place.address || place.location || "an address not listed yet"}. Its detail page shows the exact map location.`;
  }
  if (/book|reserve|reservation|ticket/i.test(query)) {
    const addons =
      place.pricing && Array.isArray(place.pricing.addons) && place.pricing.addons.length
        ? ` Options include ${place.pricing.addons.map((a) => a.name).join(", ")}.`
        : "";
    return `Open the ${name} detail page to review entry options and book${addons ? ":" + addons : " — add-ons will be listed there if available."}`;
  }
  if (/rating|review|star|good|worth/i.test(query)) {
    const rating = place.rating ? `${place.rating}/5` : "not yet rated";
    const reviews = place.reviewsCount ? ` from ${place.reviewsCount} review${place.reviewsCount === 1 ? "" : "s"}` : "";
    return `${name} is rated ${rating}${reviews}. Open its detail page to read reviews or add your own.`;
  }
  if (/phone|contact|call|whatsapp/i.test(query)) {
    return place.phone
      ? `You can reach ${name} on ${place.phone}.`
      : `A contact number isn't listed for ${name} — its detail page shows any booking links instead.`;
  }

  const facts = [];
  if (place.address || place.location) facts.push(`Located at ${place.address || place.location}`);
  if (place.entryPrice) facts.push(`entry ${place.entryPrice}`);
  else if (place.entryFee) facts.push(`entry ${formatMoney(place.entryFee)}`);
  if (place.openingHours) facts.push(place.openingHours);
  if (place.rating) facts.push(`rated ★ ${place.rating}`);

  return [
    `${name}${place.category ? ` — ${place.category}` : ""}:`,
    summary || place.overviewHeading || "open its detail page for the full write-up.",
    facts.length ? `${facts.join(" · ")}.` : "",
    "Ask me about its hours, prices, location or booking for more.",
  ]
    .filter(Boolean)
    .join(" ");
}

function buildEventsAnswer(events) {
  if (!events.length) {
    return "There are no upcoming events in the system right now — keep an eye on the Events page, which is updated automatically as events are added.";
  }
  const lines = events.map((event) => {
    const price = formatMoney(event.ticketPrice, event.currency);
    return `• ${event.title} — ${formatEventDate(event.eventDate)}, ${event.startTime || "TBA"}${price ? `, ${price}` : ""}`;
  });
  return `Here's what's coming up on Jos Pulse:\n${lines.join("\n")}\nOpen the Events page for details and tickets.`;
}

function buildRecommendationAnswer(places) {
  if (!places.length) {
    return "I couldn't pull live listings just now — browse Culture & Heritage, Dining, Events, Golf, Nightlife and Stays from the site navigation, or ask me about a specific place.";
  }
  return `Here are some Jos Pulse picks:\n${places.map((p) => `• ${describePlace(p)}`).join("\n")}\nAsk me about any of them for hours, prices and location.`;
}

function scoreKnowledgeEntry(query, entry) {
  let score = 0;
  for (const keyword of entry.keywords) {
    if (keyword.includes(" ")) {
      if (query.includes(keyword)) score += 3;
    } else if (keyword.length >= 4) {
      // Prefix match catches simple plurals (restaurant -> restaurants).
      if (new RegExp(`\\b${escapeRegex(keyword)}`, "i").test(query)) score += 2;
    } else if (new RegExp(`\\b${escapeRegex(keyword)}\\b`, "i").test(query)) {
      score += 2;
    }
  }
  return score;
}

/**
 * Local answer engine — always available, no external service required.
 * Returns { reply, intent, placeId }.
 */
async function buildLocalAnswer(prompt) {
  const query = String(prompt).toLowerCase().trim();

  // 1. Short conversational messages.
  if (query.length <= 42) {
    if (GREETING_RE.test(query)) {
      return { reply: "Hello! I'm Jos Pulse AI. Ask me about any place, price, opening hours, events, or how anything on the website works.", intent: "greeting" };
    }
    if (HOW_ARE_YOU_RE.test(query)) {
      return { reply: "I'm great, thanks — ready to help you explore Jos! Ask me about places, events, prices, or any website feature.", intent: "smalltalk" };
    }
    if (THANKS_RE.test(query)) {
      return { reply: "You're welcome! Anything else about Jos Pulse — places, events, prices or website features — just ask.", intent: "smalltalk" };
    }
    if (BYE_RE.test(query)) {
      return { reply: "Enjoy Jos! I'm here whenever you need help with places, events or anything on the website.", intent: "smalltalk" };
    }
    if (CAPABILITY_RE.test(query)) {
      return { reply: CAPABILITY_MENU, intent: "capability" };
    }
  }

  // 2. Live place match — answer with the place's real data.
  const place = await findBestPlaceMatch(prompt);
  if (place) {
    return {
      reply: buildPlaceAnswer(place, query),
      intent: "place_details",
      placeId: (place._id && place._id.toString()) || place.id || null,
    };
  }

  // 3. Upcoming events.
  if (EVENTS_RE.test(query)) {
    const events = await getUpcomingEventsSnapshot();
    return { reply: buildEventsAnswer(events), intent: "events" };
  }

  // 4. Recommendations from live listings.
  if (RECOMMEND_RE.test(query)) {
    const places = await getRecommendations(query);
    return { reply: buildRecommendationAnswer(places), intent: "recommendation" };
  }

  // 5. Curated knowledge base.
  let bestEntry = null;
  let bestScore = 0;
  for (const entry of WEBSITE_KNOWLEDGE) {
    const score = scoreKnowledgeEntry(query, entry);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }
  if (bestEntry && bestScore >= 2) {
    return { reply: bestEntry.answer, intent: bestEntry.id };
  }

  // 6. Friendly fallback — offer what the assistant covers.
  return { reply: CAPABILITY_MENU, intent: "fallback" };
}

// --- optional OpenAI layer ---------------------------------------------------

function buildKnowledgeDigest() {
  return WEBSITE_KNOWLEDGE.map((entry) => `- ${entry.id}: ${entry.answer}`).join("\n");
}

async function buildLiveDataDigest() {
  try {
    const [places, events] = await Promise.all([
      Place.find({ status: { $ne: "inactive" } })
        .sort({ rating: -1 })
        .limit(25)
        .select("name title category entryPrice openingHours address rating"),
      getUpcomingEventsSnapshot(5),
    ]);

    const placeLines = places
      .map((p) => `• ${placeDisplayName(p)} (${p.category}${p.entryPrice ? `, ${p.entryPrice}` : ""}${p.openingHours ? `, ${p.openingHours}` : ""})`)
      .join("\n");
    const eventLines = events
      .map((e) => `• ${e.title} — ${formatEventDate(e.eventDate)} ${e.startTime || ""}, ${formatMoney(e.ticketPrice, e.currency)}`)
      .join("\n");

    return `LIVE PLACES (top listings):\n${placeLines || "(none)"}\n\nLIVE UPCOMING EVENTS:\n${eventLines || "(none)"}`;
  } catch {
    return "LIVE DATA: temporarily unavailable.";
  }
}

/**
 * Ask OpenAI to phrase the answer using the knowledge base + live data as
 * context. Returns the generated text, or null on any failure (caller falls
 * back to the local engine reply).
 */
async function tryOpenAIAnswer(prompt, localReply) {
  if (!OPENAI_ENABLED) return null;
  try {
    const [knowledgeDigest, liveDigest] = await Promise.all([
      Promise.resolve(buildKnowledgeDigest()),
      buildLiveDataDigest(),
    ]);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.4,
        max_tokens: 320,
        messages: [
          {
            role: "system",
            content:
              "You are Jos Pulse AI, the official assistant of the Jos Pulse website — a travel discovery platform for Jos and Plateau State, Nigeria. Answer the visitor's question about the website concisely (2-5 sentences), using only the WEBSITE KNOWLEDGE and LIVE DATA provided. If the data doesn't cover it, point to the relevant page on the website. Politely redirect questions unrelated to the website or destination. Never invent places, prices or events.\n\n" +
              `WEBSITE KNOWLEDGE:\n${knowledgeDigest}\n\n${liveDigest}`,
          },
          { role: "user", content: String(prompt).slice(0, 500) },
        ],
      }),
      signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    return reply || null;
  } catch (error) {
    console.error("OpenAI support call failed:", error.message);
    return null;
  }
}

// --- exported route handlers -------------------------------------------------

/**
 * @desc    Process a support query and answer using live data + knowledge
 * @route   POST /api/ai/support
 * @access  Public (guest & logged-in users)
 */
export const getAISupportResponse = async (req, res) => {
  try {
    const prompt = typeof req.body.prompt === "string" ? req.body.prompt.trim().slice(0, 500) : "";
    const sessionId = typeof req.body.sessionId === "string" ? req.body.sessionId.trim().slice(0, 100) : "";
    const pagePath = typeof req.body.pagePath === "string" ? req.body.pagePath.slice(0, 200) : "";

    if (!prompt || !sessionId) {
      return res.status(400).json({ success: false, message: "A question and session ID are required." });
    }

    const local = await buildLocalAnswer(prompt);
    const aiReply = await tryOpenAIAnswer(prompt, local.reply);
    const reply = aiReply || local.reply;
    const source = aiReply ? "openai" : "knowledge";

    // Behavioral analytics — never block the reply on logging failures.
    try {
      await BehaviorLog.create({
        sessionId,
        eventType: "AI_CHAT",
        payload: {
          question: redactPrivateText(prompt).slice(0, 280),
          pagePath,
          intent: local.intent,
          placeId: local.placeId || null,
          source,
          resolved: local.intent !== "fallback",
        },
      });
    } catch (logError) {
      console.error("BehaviorLog write failed:", logError.message);
    }

    return res.status(200).json({
      success: true,
      reply,
      intent: local.intent,
      source,
      placeId: local.placeId || null,
    });
  } catch (error) {
    console.error("AI support request failed:", error.message);
    return res.status(500).json({ success: false, message: "Support is temporarily unavailable." });
  }
};

/**
 * @desc    Get place recommendations for a free-text prompt
 * @route   POST /api/ai/recommend
 * @access  Public
 */
export const getAIRecommendation = async (req, res) => {
  try {
    const prompt = typeof req.body.prompt === "string" ? req.body.prompt : "";
    const recommendations = await getRecommendations(prompt, 5);

    res.status(200).json({
      success: true,
      reply: recommendations.length
        ? "Here are some recommendations based on your interest:"
        : "No matching listings right now — browse the Explore page categories or ask me about a specific place.",
      recommendations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
