// Stap 1: Express inladen
const express = require('express');
const app     = express();
const PORT    = 3000;

// Stap 2: Een route maken
// Wanneer iemand naar "/" gaat, stuur je "Hello World!" terug
app.get('/', (req, res) => {
    res.send('<h1>Hello World! 👋</h1><p>Mijn eerste server werkt!</p>');
});

// Stap 3: Server starten
app.listen(PORT, () => {
    console.log(`✅ Server draait op http://localhost:${PORT}`);
});