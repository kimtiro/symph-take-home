import { db } from "./db/knex";
import { LRUCache } from "lru-cache";

// Configure the LRU cache
export const urlCache = new LRUCache<string, string>({
    max: 100, // Maximum number of items in the cache
    ttl: 1000 * 60 * 60 * 24, // Time-to-live in milliseconds (1 hour)
  });
  
// Preload popular URLs into the cache
export const preloadPopularUrls = async () => {
try {
    const popularUrls = await db("shortened_urls").orderBy("access_count", "desc").limit(100);
    for (const url of popularUrls) {
    urlCache.set(url.short_slug, url.original_url);
    }
    console.log("Preloaded popular URLs into cache");
} catch (error) {
    console.error("Error preloading popular URLs:", error);
}
};

export const logCacheContents = () => {
    console.log("Current cache contents:");
    console.log(urlCache.dump());
  };