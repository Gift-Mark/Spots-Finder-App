import axios from "axios";
import * as cheerio from "cheerio";
import Event from "../models/Events.js";
import Place from "../models/Place.js";

/**
 * Scrapes a specific Scoutsity event URL and inserts it into MongoDB if not present.
 * @param {string} eventUrl - Full Scoutsity event URL
 * @param {string} fallbackPlaceId - Default Place ID if no matching venue is found
 */
export const scrapeAndSaveScoutsityEvent = async (eventUrl, fallbackPlaceId = null) => {
  try {
    // 1. Check if event is already imported (prevents duplicate imports)
    const existingEvent = await Event.findOne({ sourceUrl: eventUrl });
    if (existingEvent) {
      console.log(`[Scraper] Skipped (Already exists): ${eventUrl}`);
      return { success: false, reason: "duplicate", data: existingEvent };
    }

    // 2. Fetch HTML content from Scoutsity
    const { data: html } = await axios.get(eventUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);

    // 3. Extract Open Graph tags & page details
    const rawTitle =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text().trim() ||
      "Scoutsity Event";
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "Imported event from Scoutsity platform.";
    const image = $('meta[property="og:image"]').attr("content") || "";

    // Cleanup title
    const title = rawTitle.replace(/\s*\|.*$/, "").trim();

    // Generate unique slug
    const generatedSlug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    // 4. Resolve fallback placeId if not provided
    let targetPlaceId = fallbackPlaceId;
    if (!targetPlaceId) {
      const defaultPlace = await Place.findOne({ status: "active" });
      targetPlaceId = defaultPlace ? defaultPlace._id : null;
    }

    if (!targetPlaceId) {
      console.error("[Scraper] Failed: No active Place found to link event.");
      return { success: false, reason: "missing_place_id" };
    }

    // 5. Construct event object matching Events.js schema
    const newEvent = await Event.create({
      placeId: targetPlaceId,
      title,
      description,
      eventDate: new Date(Date.now() + 86400000 * 7), // Default to 7 days out if unparsed
      startTime: "18:00",
      endTime: "22:00",
      category: "Festival",
      image,
      ticketPrice: 0,
      availableTickets: 100,
      status: "upcoming",
      slug: generatedSlug,
      sourceUrl: eventUrl,
      ticketUrl: eventUrl, // Redirects visitors to purchase on Scoutsity
      organizer: "Scoutsity Organizer",
      currency: "NGN",
    });

    console.log(`[Scraper] Successfully synced event: "${title}"`);
    return { success: true, data: newEvent };
  } catch (error) {
    console.error(`[Scraper] Error scraping ${eventUrl}:`, error.message);
    return { success: false, reason: error.message };
  }
};