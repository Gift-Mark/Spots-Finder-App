import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Crawls the main Scoutsity listing page to discover all active event IDs/URLs automatically
 */
export const autoDiscoverAndScrapeEvents = async () => {
  const directoryUrl = "https://events.scoutsity.com";

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
        // Build full URL if relative path
        if (href.startsWith("/")) {
          href = `https://events.scoutsity.com${href}`;
        }
        discoveredUrls.add(href);
      }
    });

    console.log(`[Scraper] Discovered ${discoveredUrls.size} potential event links.`);

    // The single-event scraper is not currently part of this project, so discovery
    // remains available without preventing the API server from starting.
    return [...discoveredUrls];
  } catch (error) {
    console.error("[Scraper] Directory crawl failed:", error.message);
    return [];
  }
};

export const initEventCronJob = () => {
  console.log("[Scraper] Event scheduler disabled: single-event scraper is not configured.");
};
