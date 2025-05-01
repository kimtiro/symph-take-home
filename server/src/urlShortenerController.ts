import { Request, Response } from "express";
import { db } from "./db/knex";
import { nanoid } from "nanoid";
import { urlCache } from "./cache";

// Shorten URL
export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
  const { original_url, custom_slug, expiration_date } = req.body;

  // Regex to validate URL format
  const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?.*)?(#.*)?$/;

  if (!original_url || !urlRegex.test(original_url)) {
    res.status(400).json({ error: "Invalid URL format. Please enter a valid URL." });
    return;
  }

  let short_slug = custom_slug || nanoid(8);

  try {
    // Ensure the slug is unique
    if (custom_slug) {
      const existingSlug = await db("shortened_urls").where({ short_slug: custom_slug }).first();
      if (existingSlug) {
        res.status(409).json({ error: "Custom slug already exists. Please choose another one." });
        return;
      }
    } else {
      while (await db("shortened_urls").where({ short_slug }).first()) {
        short_slug = nanoid(8); // Generate a new slug if it already exists
      }
    }

    // Insert the new shortened URL
    const [shortenedUrl] = await db("shortened_urls")
      .insert({
        original_url,
        short_slug,
        expiration_date,
      })
      .returning("*");

    res.status(201).json({
      short_url: `${process.env.BASE_URL}/${shortenedUrl.short_slug}`,
      ...shortenedUrl,
    });
  } catch (error: unknown) {
    console.error("Error while shortening URL:", error);

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to shorten URL" });
    }
  }
};

// Redirect URL
export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  try {
    // Check if the slug exists in the cache
    if (urlCache.has(slug)) {
      console.log("Cache hit for slug:", slug);
      res.redirect(urlCache.get(slug) as string);
      return;
    }

    // Query the database for the slug
    const shortenedUrl = await db("shortened_urls").where({ short_slug: slug }).first();

    if (!shortenedUrl) {
      // Redirect to the frontend error page for "URL not found"
      res.redirect(`http://localhost:3000/symph-take-home/error?message=This URL does not exist.`);
      return;
    }

    // Check if the URL has expired
    if (shortenedUrl.expiration_date && new Date() > new Date(shortenedUrl.expiration_date)) {
      // Redirect to the frontend error page for "URL expired"
      res.redirect(`http://localhost:3000/symph-take-home/error?message=This URL has expired.`);
      return;
    }

    // Increment access_count in the database
    await db("shortened_urls").where({ short_slug: slug }).increment("access_count", 1);

    // Update the cache with the original URL
    urlCache.set(slug, shortenedUrl.original_url);

    // Redirect to the original URL
    res.redirect(shortenedUrl.original_url);
  } catch (error: unknown) {
    console.error("Error while redirecting:", error);

    if (error instanceof Error) {
      res.redirect(`http://localhost:3000/symph-take-home/error?message=${encodeURIComponent(error.message)}`);
    } else {
      res.redirect(`http://localhost:3000/symph-take-home/error?message=An unexpected error occurred.`);
    }
  }
};