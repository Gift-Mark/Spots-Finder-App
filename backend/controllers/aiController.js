import Place from "../models/Place.js";
import Event from "../models/Events.js";
import BehaviorLog from "../models/BehaviorLog.js";
import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';
import { fileURLToPath } from "url";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const getMistralClient = () => {
  const apiKey = process.env.MISTRAL_API_KEY;
  return apiKey ? new Mistral({ apiKey }) : null;
};

const WEBSITE_GUIDE = `You are Jos Pulse AI, the official website support assistant for Jos Pulse, a discovery and travel platform for Jos and Plateau State, Nigeria.

Answer questions about any part of the Jos Pulse website: discovering places, dining, nightlife, stays, attractions, culture, golf, events and tickets, maps, user accounts, saved places, bookings, vendor claims and dashboards, privacy, terms, and contacting support.

Website pages and actions:
- /explore: browse featured places and discover locations.
- /map: explore place markers and place previews on the map.
- /dining, /nightlife, /lounges, /stays, /attractions, /culture, /golf: explore those place categories.
- /events: browse upcoming and ongoing events. Event ticket requests start from an event card.
- /claim: submit a venue/vendor claim and proof documents for admin review.
- /vendor: vendor workspace for managing an approved business.
- /userDashboard: personal dashboard, profile settings, saved places, bookings, and community feed.
- /flights: flight search; /guides: local guides; /contact and /support: contact/support information.
- /privacy and /terms: privacy notice and terms of service.

Use the live place and event catalog supplied below for questions about specific listings, dates, locations, hours, prices, and availability. Never invent listing details, prices, policies, contact information, or booking availability. If the catalog lacks an answer, say so plainly and guide the user to the relevant page or /contact. Explain website steps clearly, ask a brief follow-up when the request is ambiguous, and answer unrelated general questions briefly while steering back to Jos Pulse support. Keep responses helpful and concise.`;

const loadLiveWebsiteCatalog = async () => {
  try {
    const [places, events] = await Promise.all([
      Place.find({ status: "active" })
        .select("name category location address summary openingHours entryPrice phone bookingUrl")
        .sort({ name: 1 })
        .limit(60)
        .lean(),
      Event.find({ status: { $in: ["upcoming", "ongoing"] } })
        .select("title category description eventDate startTime endTime ticketPrice currency status")
        .populate("placeId", "name address location")
        .sort({ eventDate: 1 })
        .limit(40)
        .lean(),
    ]);

    return JSON.stringify({
      catalogUpdatedAt: new Date().toISOString(),
      places: places.map((place) => ({
        name: place.name,
        category: place.category,
        location: place.location || place.address,
        summary: typeof place.summary === "string" ? place.summary.slice(0, 350) : "",
        openingHours: place.openingHours,
        price: place.entryPrice,
        phone: place.phone,
      })),
      events: events.map((event) => ({
        title: event.title,
        category: event.category,
        description: typeof event.description === "string" ? event.description.slice(0, 350) : "",
        date: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        venue: event.placeId?.name || event.placeId?.address || event.placeId?.location,
        ticketPrice: event.ticketPrice,
        currency: event.currency,
        status: event.status,
      })),
    });
  } catch (error) {
    console.error("Could not load live Jos Pulse catalog for support:", error.message);
    return "Live places and event details are currently unavailable. Do not guess them.";
  }
};

export const getAISupportResponse = async (req, res) => {
  try {
    const { message, messages } = req.body;

    let conversationHistory;
    if (Array.isArray(messages) && messages.length > 0) {
      conversationHistory = messages
        .filter((msg) =>
          msg &&
          (msg.sender === "user" || msg.sender === "ai" ||
            msg.role === "user" || msg.role === "assistant")
        )
        .map((msg) => ({
          role: msg.sender === "user" || msg.role === "user" ? "user" : "assistant",
          content: typeof msg.text === "string" ? msg.text : msg.content,
        }))
        .filter((msg) => typeof msg.content === "string" && msg.content.trim())
        .slice(-12)
        .map((msg) => ({
          ...msg,
          content: msg.content.slice(-3000),
        }));
    } else if (message) {
      conversationHistory = [{ role: 'user', content: message }];
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Either a message string or a messages array is required.' 
      });
    }

    if (!conversationHistory.length) {
      return res.status(400).json({
        success: false,
        error: "Please send a non-empty message.",
      });
    }

    const mistral = getMistralClient();
    if (!mistral) {
      console.error("AI support is unavailable: MISTRAL_API_KEY is not configured.");
      return res.status(503).json({
        success: false,
        error: "AI support is not configured on the server.",
      });
    }

    const catalogContext = await loadLiveWebsiteCatalog();
    const systemPrompt = {
      role: 'system',
      content: `${WEBSITE_GUIDE}\n\nLive Jos Pulse catalog (JSON):\n${catalogContext}`,
    };

    const fullPrompt = [systemPrompt, ...conversationHistory];

    const response = await mistral.chat.complete({
      model: 'mistral-small-latest',
      messages: fullPrompt,
      temperature: 0.7,
      maxTokens: 350,
    });

    const replyContent = response.choices?.[0]?.message?.content;
    const reply = Array.isArray(replyContent)
      ? replyContent
          .filter((part) => part.type === "text" && typeof part.text === "string")
          .map((part) => part.text)
          .join("")
      : replyContent;
    if (typeof reply !== "string" || !reply.trim()) {
      throw new Error("AI provider returned an empty response.");
    }

    return res.json({
      success: true,
      reply: reply.trim(),
    });
  } catch (error) {
    const providerStatus = Number(error.status || error.statusCode);
    console.error("Mistral AI request failed:", {
      message: error.message,
      status: providerStatus || undefined,
      code: error.code,
    });

    if (providerStatus === 429 || error.code === "1300") {
      return res.status(429).json({
        success: false,
        error: "Jos Pulse AI has temporarily reached its Mistral usage limit. Please try again later.",
      });
    }

    if (providerStatus === 401 || providerStatus === 403) {
      return res.status(503).json({
        success: false,
        error: "Jos Pulse AI is not currently authorized with its provider. Please contact support.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Jos Pulse AI could not complete the request. Please try again shortly.",
    });
  }
};

export const getAIRecommendation = async (req, res) => {
  // Recommendation logic...
};
