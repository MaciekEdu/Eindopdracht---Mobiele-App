/* laad alle opgeslagen entries */
function loadEntries() {
  return JSON.parse(localStorage.getItem("healthEntries")) || [];
}

/* sla entries op */
function saveEntries(entries) {
  localStorage.setItem("healthEntries", JSON.stringify(entries));
}

/* voeg nieuwe entry toe */
function addEntry(entry) {
  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);
}

/* verwijder entry */
function deleteEntry(id) {
  const entries = loadEntries().filter(e => e.id !== id);
  saveEntries(entries);
}

/* haal max kcal op (standaard 2000) */
function getMaxCalories() {
  return Number(localStorage.getItem("maxCalories")) || 2000;
}

/* sla max kcal op */
function setMaxCalories(value) {
  localStorage.setItem("maxCalories", value);
}

/* filter entries op vandaag */
function filterByDay(date) {
  return loadEntries().filter(e => e.date === date);
}

const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-btn");

const form = document.getElementById("entry-form");
const entriesList = document.getElementById("entries-list");
const totalTodayEl = document.getElementById("total-today");

const maxCaloriesInput = document.getElementById("max-calories");
const saveMaxBtn = document.getElementById("save-max");

/* wissel tussen pagina's */
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.dataset.view;

    views.forEach(v => v.classList.add("hidden"));
    document.getElementById(view).classList.remove("hidden");

    if (view === "dashboard") updateDashboard();
    if (view === "overview") renderOverview(loadEntries());
  });
});

form.addEventListener("submit", e => {
  e.preventDefault();

  /* maak nieuw item */
  const entry = {
    id: crypto.randomUUID(),
    date: document.getElementById("date").value,
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    calories: Number(document.getElementById("calories").value)
  };

  addEntry(entry);
  form.reset();
  updateDashboard();
});

function updateDashboard() {

  /* pak datum van vandaag */
  const today = new Date().toISOString().slice(0, 10);

  /* haal entries van vandaag */
  const entries = filterByDay(today);

  /* tel kcal op */
  const total = entries.reduce((sum, e) => sum + e.calories, 0);

  /* toon totaal */
  totalTodayEl.textContent = total;

  /* update grafiek */
  updateChart(total);
}
let chart;

function updateChart(total) {

  /* haal max kcal */
  const max = getMaxCalories();

  /* bereken wat nog over is */
  const remaining = max - total;

  /* pak canvas */
  const ctx = document.getElementById("calorieChart");

  /* verwijder oude grafiek */
  if (chart) {
    chart.destroy();
  }

  /* maak kleine taartgrafiek */
  chart = new Chart(ctx, {
    type: "pie",

    data: {
      labels: ["Gegeten", "Over"],
      datasets: [{
        data: [
          total,
          remaining > 0 ? remaining : 0
        ],
        backgroundColor: ["green", "lightgray"]
      }]
    },

    options: {
      responsive: false,           /* zorgt dat hij klein blijft */
      maintainAspectRatio: false   /* voorkomt fullscreen */
    }
  });
}
function renderOverview(entries) {
  entriesList.innerHTML = "";

  entries.forEach(e => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${e.date} - ${e.category} - ${e.calories} kcal
      <button>Reset</button>
    `;

    /* delete knop */
    li.querySelector("button").addEventListener("click", () => {
      deleteEntry(e.id);
      renderOverview(loadEntries());
      updateDashboard();
    });

    entriesList.appendChild(li);
  });
}

if (maxCaloriesInput && saveMaxBtn) {

  /* zet huidige waarde in input */
  maxCaloriesInput.value = getMaxCalories();

  /* sla nieuwe waarde op */
  saveMaxBtn.addEventListener("click", () => {
    setMaxCalories(maxCaloriesInput.value);
    updateDashboard();
  });
}

/* start app */
updateDashboard();
renderOverview(loadEntries());


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

const translations = {
  nl: {
    title: "Calorieënteller",
    navDashboard: "Dashboard",
    navAdd: "Toevoegen",
    navOverview: "Overzicht",
    dashTitle: "Overzicht vandaag",
    dashTotal: "Totaal kcal vandaag:",
    addTitle: "Nieuwe invoer",
    labelDate: "Datum",
    labelCategory: "Categorie",
    labelDescription: "Omschrijving",
    labelCalories: "Kcal",
    btnSave: "Opslaan",
    overviewTitle: "Overzicht",
    labelPeriod: "Periode",
    optDay: "Dag",
    optWeek: "Week",
    optMonth: "Maand",
    labelFilterDate: "Datum",
    btnFilter: "Filter"
  },
  en: {
    title: "Calorie Tracker",
    navDashboard: "Dashboard",
    navAdd: "Add",
    navOverview: "Overview",
    dashTitle: "Today overview",
    dashTotal: "Total kcal today:",
    addTitle: "New entry",
    labelDate: "Date",
    labelCategory: "Category",
    labelDescription: "Description",
    labelCalories: "Kcal",
    btnSave: "Save",
    overviewTitle: "Overview",
    labelPeriod: "Period",
    optDay: "Day",
    optWeek: "Week",
    optMonth: "Month",
    labelFilterDate: "Date",
    btnFilter: "Filter"
  }
};

function setLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    el.textContent = translations[lang][el.dataset.key];
  });
}

document.getElementById("lang-nl").addEventListener("click", () => setLanguage("nl"));
document.getElementById("lang-en").addEventListener("click", () => setLanguage("en"));


 
