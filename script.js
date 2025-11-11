// SecurePass – Stephen Skouboe edition
// --------------------------------------
// Professionel generator af stærke, huskbare adgangskoder
// Loader danske ord eksternt (uden at gemme noget)

// Kryp­to-sikker tilfældighed
function randInt(max) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % max;
}
function pick(arr) { return arr[randInt(arr.length)]; }

// Fallback-ordliste (bruges kun hvis API fejler)
let WORDS = [
  "Blå","Fjord","Korn","Pixel","Havn","Granit","Signal","Trekant","Atlas","Delta",
  "Kaffe","Trappe","Vinkel","Model","Nøgle","Gran","Måne","Sti","Bølge","Nord",
  "Lyn","Skærm","Motor","Fyr","Svale","Tempo","Stjerne","Kode","Anker","Glas"
];
const SYMBOLS = ["!", "?", "#", "@", "%", "&"];

// Prøv at hente 1000 tilfældige danske ord fra open-source API
async function loadWordlist() {
  try {
    const url =
      "https://cdn.jsdelivr.net/gh/hermitdave/FrequencyWords@master/content/2018/da/da_50k.txt";
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Kunne ikke hente ordliste");
    const txt = await res.text();
    const all = txt.split(/\r?\n/).map(w => w.trim()).filter(Boolean);
    const sample = [];
    for (let i = 0; i < 1000; i++) sample.push(all[randInt(all.length)]);
    WORDS = sample.map(
      w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    );
    console.log("Loaded external Danish wordlist:", WORDS.length, "words");
  } catch (e) {
    console.warn("Fallback til intern ordliste", e);
  }
}

// UI-referencer
const out = document.getElementById("output");
const bar = document.getElementById("bar");
const lbl = document.getElementById("strengthText");
const btnGen = document.getElementById("generateBtn");
const btnCopy = document.getElementById("copyBtn");
const btnToggle = document.getElementById("toggleBtn");
document.getElementById("year").textContent = new Date().getFullYear();

// Generér adgangskode: 3 ord + 2 cifre + symbol
function generate() {
  if (!WORDS || WORDS.length < 10) {
    console.warn("Wordlist not loaded yet – using fallback");
  }
  const words = [pick(WORDS), pick(WORDS), pick(WORDS)];
  let pass = words.join("-");
  const digits = String(10 + randInt(90)); // 10–99
  pass += digits + pick(SYMBOLS);
  setOutput(pass);
  updateMeter(pass);
}

function setOutput(v) {
  out.value = v;
}

// Kopiér-knap
function copy() {
  if (!out.value) return;
  navigator.clipboard.writeText(out.value);
  const old = btnCopy.textContent;
  btnCopy.textContent = "Kopieret ✔";
  setTimeout(() => (btnCopy.textContent = old), 1200);
}

// Skjul/vis adgangskode
function toggle() {
  const isPwd = out.type === "password";
  out.type = isPwd ? "text" : "password";
  btnToggle.textContent = isPwd ? "Skjul" : "Vis";
}

// Styrkebar (simpel, men effektiv)
function updateMeter(pw) {
  let score = 0;
  if (pw.length >= 14) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const widths = ["20%", "45%", "70%", "100%"];
  bar.style.width = widths[score] || "20%";
  const labels = ["Meget svag", "Svag", "OK", "Stærk", "Meget stærk"];
  lbl.textContent = "Styrke: " + (labels[score] || labels[0]);
}

// Init
window.addEventListener("DOMContentLoaded", async () => {
  await loadWordlist();        // prøv at hente eksterne ord
  btnGen.addEventListener("click", generate);
  btnCopy.addEventListener("click", copy);
  btnToggle.addEventListener("click", toggle);
});
