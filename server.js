const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Public map beschikbaar maken
app.use(express.static(path.join(__dirname, "public")));

// Express 5 wildcard fix — werkt 100%
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
