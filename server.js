const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const CAPS = {
  characters: "https://api-01a-character-counter-v1.onrender.com/v1/character-count",
  words: "https://api-01a-word-counter-v1.onrender.com/v1/word-count",
  tokens: "https://api-01a-token-counter-v1.onrender.com/v1/token-count",
  lines: "https://api-01a-line-counter-v1.onrender.com/v1/line-count",
  paragraphs: "https://api-01a-paragraph-counter-v1.onrender.com/v1/paragraph-count",
  sentences: "https://api-01a-sentence-counter-v1.onrender.com/v1/sentence-count",
  punctuation: "https://api-01a-punctuation-counter-v1.onrender.com/v1/punctuation-count"
};

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/v1/text-metrics", async (req, res) => {
  const text = req.body.text;

  if (!text) {
    return res.status(400).json({ error: "text required" });
  }

  const results = {};

  for (const key of Object.keys(CAPS)) {
    try {
      const response = await fetch(CAPS[key], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      results[key] = Object.values(data).find(v => typeof v === "number");
    } catch {
      results[key] = null;
    }
  }

  res.json({
    text,
    metrics: results
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Composite CAP running");
});
