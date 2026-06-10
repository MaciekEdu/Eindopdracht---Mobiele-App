/* ===========================
   LOCALSTORAGE FUNCTIES
   =========================== */

function loadEntries() {
  return JSON.parse(localStorage.getItem("healthEntries")) || [];
}

function saveEntries(entries) {
  localStorage.setItem("healthEntries", JSON.stringify(entries));
}

function addEntry(entry) {
  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);
}

function deleteEntry(id) {
  const entries = loadEntries().filter(e => e.id !== id);
  saveEntries(entries);
}


/* ===========================
   FILTER FUNCTIES
   =========================== */

function filterByDay(date) {
  return loadEntries().filter(e => e.date === date);
}

function filterByWeek(date) {
  if (!date) return loadEntries();

  const d = new Date(date);
  const day = d.getDay(); // 0 = zondag
  const weekStart = new Date(d);
  weekStart.setDate(d.getDate() - day);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return loadEntries().filter(e => {
    const ed = new Date(e.date);
    return ed >= weekStart && ed <= weekEnd;
  });
}

function filterByMonth(date) {
  if (!date) return loadEntries();
  const [year, month] = date.split("-");
  return loadEntries().filter(e => e.date.startsWith(`${year}-${month}`));
}


/* ===========================
   UI ELEMENTEN
   =========================== */

const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-btn");
const form = document.getElementById("entry-form");
const entriesList = document.getElementById("entries-list");
const totalTodayEl = document.getElementById("total-today");
const periodSelect = document.getElementById("period");
const filterDateInput = document.getElementById("filter-date");
const applyFilterBtn = document.getElementById("apply-filter");


/* ===========================
   VIEW SWITCHING
   =========================== */

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.dataset.view;

    views.forEach(v => v.classList.add("hidden"));
    document.getElementById(view).classList.remove("hidden");

    if (view === "dashboard") updateDashboard();
    if (view === "overview") renderOverview(loadEntries());
  });
});


/* ===========================
   FORM SUBMIT (CREATE)
   =========================== */

form.addEventListener("submit", e => {
  e.preventDefault();

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

  alert("Invoer opgeslagen!");
});


/* ===========================
   DASHBOARD (TOTAAL VANDAAG)
   =========================== */

function updateDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const todayEntries = filterByDay(today);
  const total = todayEntries.reduce((sum, e) => sum + e.calories, 0);
  totalTodayEl.textContent = total;
}


/* ===========================
   OVERZICHT RENDEREN
   =========================== */

function renderOverview(entries) {
  entriesList.innerHTML = "";

  entries.forEach(e => {
    const li = document.createElement("li");

    const header = document.createElement("div");
    header.className = "entry-header";
    header.innerHTML = `
      <span>${e.date} - ${e.category}</span>
      <span>${e.calories} kcal</span>
    `;

    const desc = document.createElement("div");
    desc.textContent = e.description;

    const actions = document.createElement("div");
    actions.className = "entry-actions";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Reset";
    delBtn.addEventListener("click", () => {
      if (confirm("Weet je zeker dat je dit item wilt verwijderen?")) {
        deleteEntry(e.id);
        renderOverview(loadEntries());
        updateDashboard();
      }
    });

    actions.appendChild(delBtn);

    li.appendChild(header);
    li.appendChild(desc);
    li.appendChild(actions);

    entriesList.appendChild(li);
  });
}


/* ===========================
   FILTER KNOP
   =========================== */

applyFilterBtn.addEventListener("click", () => {
  const period = periodSelect.value;
  const date = filterDateInput.value;

  let result = [];

  if (period === "day") result = filterByDay(date);
  if (period === "week") result = filterByWeek(date);
  if (period === "month") result = filterByMonth(date);

  renderOverview(result);
});


/* ===========================
   TAALSWITCH
   =========================== */

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


/* ===========================
   INIT
   =========================== */

setLanguage("nl");
updateDashboard();
renderOverview(loadEntries());
