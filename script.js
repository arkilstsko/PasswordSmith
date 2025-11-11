function generate() {
  const input = document.getElementById("userInput").value.trim();
  const output = document.getElementById("output");
  const bar = document.getElementById("strengthBar");

  if (!input) {
    output.textContent = "";
    bar.style.width = "0%";
    return;
  }

  // Enkel transformation
  let result = input
    .replace(/a/gi, "@")
    .replace(/s/gi, "$")
    .replace(/e/gi, "3")
    .replace(/i/gi, "!")
    .replace(/o/gi, "0");

  result = result.charAt(0).toUpperCase() + result.slice(1);
  result += Math.floor(Math.random() * 90 + 10) + "#";

  output.textContent = result;

  // Bedøm styrke
  let score = 0;
  if (result.length > 10) score++;
  if (/[A-Z]/.test(result)) score++;
  if (/[0-9]/.test(result)) score++;
  if (/[^A-Za-z0-9]/.test(result)) score++;

  const widths = ["25%", "50%", "75%", "100%"];
  const colors = ["#ff4d4d", "#ffb84d", "#88ff4d", "#00e676"];
  bar.style.width = widths[score - 1] || "25%";
  bar.style.background = colors[score - 1] || "#ff4d4d";
}

function copyResult() {
  const text = document.getElementById("output").textContent;
  if (!text) return;
  navigator.clipboard.writeText(text);
  const btn = document.getElementById("copyBtn");
  btn.textContent = "Kopieret ✔";
  setTimeout(() => (btn.textContent = "Kopiér adgangskode"), 1500);
}
