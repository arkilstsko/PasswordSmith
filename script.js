// Kryptografisk tilfældighed
function randInt(max){ // 0..max-1
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % max;
}
function pick(arr){ return arr[randInt(arr.length)]; }

// Lille, neutral, indbygget ordpulje (ingen ekstern liste)
const WORDS = [
  "Blå","Fjord","Korn","Pixel","Havn","Granit","Signal","Trekant","Atlas","Delta",
  "Kaffe","Trappe","Vinkel","Model","Nøgle","Gran","Måne","Sti","Bølge","Nord",
  "Lyn","Skærm","Motor","Fyr","Svale","Tempo","Stjerne","Kode","Anker","Glas"
];
const SYMBOLS = ["!", "?", "#", "@", "%", "&"];

// UI refs
const out = document.getElementById("output");
const bar = document.getElementById("bar");
const lbl = document.getElementById("strengthText");
const btnGen = document.getElementById("generateBtn");
const btnCopy = document.getElementById("copyBtn");
const btnToggle = document.getElementById("toggleBtn");
document.getElementById("year").textContent = new Date().getFullYear();

// Generator: 3 ord + 2 cifre + symbol (nemt at huske, stærkt i længde)
function generate(){
  const words = [pick(WORDS), pick(WORDS), pick(WORDS)];
  let pass = words.join("-");
  const digits = String(10 + randInt(90)); // 10..99
  pass += digits + pick(SYMBOLS);
  setOutput(pass);
  updateMeter(pass);
}

function setOutput(v){
  out.value = v;
}

function copy(){
  if(!out.value) return;
  navigator.clipboard.writeText(out.value);
  const old = btnCopy.textContent;
  btnCopy.textContent = "Kopieret ✔";
  setTimeout(()=> btnCopy.textContent = old, 1200);
}

function toggle(){
  const isPwd = out.type === "password";
  out.type = isPwd ? "text" : "password";
  btnToggle.textContent = isPwd ? "Skjul" : "Vis";
}

// Enkel styrkeindikator: længde + variation → procent og label
function updateMeter(pw){
  let score = 0;
  if(pw.length >= 14) score++;
  if(/[A-Z]/.test(pw)) score++;
  if(/[0-9]/.test(pw)) score++;
  if(/[^A-Za-z0-9]/.test(pw)) score++;
  const widths = ["20%","45%","70%","100%"];
  bar.style.width = widths[score] || "20%";
  const labels = ["Meget svag","Svag","OK","Stærk","Meget stærk"];
  lbl.textContent = "Styrke: " + (labels[score] || labels[0]);
}

// Events
btnGen.addEventListener("click", generate);
btnCopy.addEventListener("click", copy);
btnToggle.addEventListener("click", toggle);
