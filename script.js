function generate() {
  const input = document.getElementById("userInput").value.trim();
  const output = document.getElementById("output");
  const bar = document.getElementById("strengthBar");
  if (!input) {
    output.textContent = "";
    bar.style.background = "#333";
    return;
  }

  let result = input
    .replace(/a/gi, "@")
    .replace(/s/gi, "$")
    .replace(/e/gi, "3")
    .replace(/i/gi, "!")
    .replace(/o/gi, "0");

  result = result.charAt(0).toUpperCase() + result.slice(1);
  result += Math.floor(Math.random() * 100) + "!";

  output.textContent = result;

  // Basic strength meter
  let score = 0;
  if (result.length > 10) score++;
  if (/[A-Z]/.test(result)) score++;
  if (/[0-9]/.test(result)) score++;
  if (/[^A-Za-z0-9]/.test(result)) score++;

  const colors = ["#ff4d4d", "#ffa64d", "#a6ff4d", "#4dff88"];
  bar.style.background = colors[score - 1] || "#333";
}

function copyResult() {
  const text = document.getElementById("output").textContent;
  if (!text) return;
  navigator.clipboard.writeText(text);
  alert("Adgangskoden er kopieret til udklipsholderen!");
}
