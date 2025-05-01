import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { shortenUrl, redirectUrl } from "./urlShortenerController";
import { preloadPopularUrls, logCacheContents } from "./cache";
dotenv.config();

const app = express();
import { db } from "./db/knex";

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" })); 

// POST /shorten - Shortens a URL
app.post("/shorten", shortenUrl);
preloadPopularUrls();
logCacheContents();
// GET /:slug - Redirects to the original URL
app.get("/:slug", redirectUrl);

// Root endpoint
app.get("/", async (_req, res) => {
  res.json({ hello: "world", "client-default-port": 3000 });
});

// Example endpoints
app.get("/examples", async (_req, res) => {
  const docs = await db("example_foreign_table").select("*");
  res.json({ docs });
});


app.post("/examples", async (req, res) => {
  const { authMethod, name } = req.body;
  const [doc] = await db("example_foreign_table")
    .insert({
      authMethod,
      name,
    })
    .returning("*");
  res.json({ doc });
});

// Fallback route for undefined routes
app.use((req, res) => {
  console.log(`Undefined route accessed: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
