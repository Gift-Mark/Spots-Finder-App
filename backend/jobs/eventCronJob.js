import axios from "axios";
import * as cheerio from "cheerio";
import Event from "../models/Events.js";
import Place from "../models/Place.js"; // Adjust path if your Place model is elsewhere

/**
 * Scrapes an individual ScoutCity event page and saves it to MongoDB
 */
const scrapeAndSaveSingleEvent = async (eventUrl) => {
  try {
    const { data: html } = await axios.get(eventUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);

    // Extract fields based on typical event page structures
    const title = $("h1").first().text().trim() || "ScoutCity Community Event";
    const description = $("meta[property='og:description']").attr("content") || $("p").first().text().trim() || "";
    const image = $("meta[property='og:image']").attr("content") || "";
    const location = $("address").text().trim() || "Jos, Plateau State";
    
    // Generate unique slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Math.random().toString(36).substring(2, 7);

    // Find or create a default Plateau place reference for scraped events
    let defaultPlace = await Place.findOne({ name: "Jos Township" });
    if (!defaultPlace) {
      defaultPlace = await Place.create({
        name: "Jos Township",
        slug: "jos-township",
        category: "Event Center & Arena",
        location: "Jos, Plateau",
        address: "Jos, Plateau State",
        summary: "Default hub for community events."
      });
    }

    // Upsert into MongoDB so we don't duplicate
    await Event.findOneAndUpdate(
      { scoutCityUrl: eventUrl },
      {
        placeId: defaultPlace._id,
        title,
        description,
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week out if unparsed
        startTime: "10:00 AM",
        endTime: "06:00 PM",
        category: "Music & Festivals",
        image,
        ticketPrice: 0,
        availableTickets: 500,
        slug,
        organizer: "ScoutCity Community",
        scoutCityUrl: eventUrl,
        status: "upcoming"
      },
      { upsert: true, new: true }
    );

    console.log(`[Scraper] Successfully synced event: ${title}`);
  } catch (err) {
    console.error(`[Scraper] Failed to scrape event details for ${eventUrl}:`, err.message);
  }
};

/**
 * Crawls the main Scoutsity listing page and processes all discovered events
 */
const runScoutCitySync = async () => {
  const directoryUrl = "https://events.scoutsity.com";

  try {
    console.log(`[Scraper] Fetching main directory: ${directoryUrl}`);
    const { data: html } = await axios.get(directoryUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);
    const discoveredUrls = new Set();

    $('a[href*="/event/"]').each((_, element) => {
      let href = $(element).attr("href");
      if (href) {
        if (href.startsWith("/")) {
          href = `https://events.scoutsity.com${href}`;
        }
        discoveredUrls.add(href);
      }
    });

    console.log(`[Scraper] Discovered ${discoveredUrls.size} ScoutCity event links. Syncing to DB...`);

    for (const url of discoveredUrls) {
      await scrapeAndSaveSingleEvent(url);
    }

    console.log("[Scraper] ScoutCity synchronization complete!");
  } catch (error) {
    console.error("[Scraper] Directory crawl failed:", error.message);
  }
};
  // Optional: Re-run every 6 hours automatically
  setInterval(runScoutCitySync, 6 * 60 * 60 * 1000);

/**
 * Crawls the main Scoutsity listing page to discover all active event URLs automatically
 */
export const autoDiscoverAndScrapeEvents = async () => {
  const directoryUrl = "https://events.scoutsity.com"; // 👈 Now actively used below

  try {
    console.log(`[Scraper] Fetching main directory: ${directoryUrl}`);
    const { data: html } = await axios.get(directoryUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html);
    const discoveredUrls = new Set();

    // Find all anchor tags pointing to /event/
    $('a[href*="/event/"]').each((_, element) => {
      let href = $(element).attr("href");
      if (href) {
        if (href.startsWith("/")) {
          href = `https://events.scoutsity.com${href}`;
        }
        discoveredUrls.add(href);
      }
    });

    console.log(`[Scraper] Discovered ${discoveredUrls.size} potential event links.`);

    // Optional: Loop through and save discovered URLs to DB
    for (const eventUrl of discoveredUrls) {
      await Event.findOneAndUpdate(
        { scoutCityUrl: eventUrl },
        {
          title: "ScoutCity Community Event",
          description: "Synced automatically from ScoutCity directory.",
          eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          startTime: "10:00 AM",
          endTime: "06:00 PM",
          category: "Music & Festivals",
          ticketPrice: 0,
          availableTickets: 100,
          slug: "scoutcity-event-" + Math.random().toString(36).substring(2, 7),
          scoutCityUrl: eventUrl,
          status: "upcoming"
        },
        { upsert: true, new: true }
      );
    }

    return [...discoveredUrls];
  } catch (error) {
    console.error("[Scraper] Directory crawl failed:", error.message);
    return [];
  }
};

export const initEventCronJob = () => {
  console.log("[Scraper] Event scheduler initialized. Running initial ScoutCity crawl...");
  autoDiscoverAndScrapeEvents();
};