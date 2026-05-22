const express = require('express');
const app = express();

// Static files (CSS, JS, afbeeldingen)
app.use(express.static('public'));


// EJS instellen als template-engine
app.set('view engine', 'ejs');


// Dashboard
app.get('/dashboard', (req, res) => {
  res.render('dashboard'); // laadt views/dashboard.ejs
});

// Toevoegen-pagina
app.get('/toevoegen', (req, res) => {
  res.render('toevoegen'); // laadt views/toevoegen.ejs
});

app.listen(3000, () => {
  console.log('Server draait op http://localhost:3000');
});

// Testdata — later vervangen door LocalStorage
const items = [
  { categorie: 'sport',   omschrijving: 'Hardlopen',  waarde: '30 min',  datum: '2025-04-16' },
  { categorie: 'voeding', omschrijving: 'Havermout',  waarde: '350 kcal', datum: '2025-04-16' },
  { categorie: 'slaap',   omschrijving: 'Geslapen',   waarde: '7,5 uur', datum: '2025-04-15' },
];

app.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    appNaam: 'Mijn Bibliotheek',
    items: items,                    // alle items doorgeven
    aantalItems: items.length        // ook berekend getal
  });
});