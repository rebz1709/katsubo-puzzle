// ✅ Fetch character data and display on page
fetch("https://yume-backend-rabiya.onrender.com/api/characters")
  .then(res => res.json())
  .then(data => {
    const charBox = document.getElementById("characters");
    data.forEach(char => {
      const div = document.createElement("div");
      div.className = "char-card";
      div.innerHTML = `<strong>${char.name}</strong> — ${char.role}`;
      charBox.appendChild(div);
    });
  });

// ✅ Puzzle Game Logic
const levels = [
  ["🟦", "⬜", "✨"],
  ["⬜", "✨", "🟦"],
  ["✨", "🟦", "⬜"]
];
let level = 0;

function loadLevel() {
  const game = document.getElementById("game");
  const message = document.getElementById("message");
  message.textContent = "";
  game.innerHTML = "";
  levels[level].forEach(tile => {
    const div = document.createElement("div");
    div.textContent = tile;
    game.appendChild(div);
  });
}

function nextLevel() {
  if (level < levels.length - 1) {
    level++;
    loadLevel();
  } else {
    document.getElementById("message").textContent = "✨ You unlocked Rebz (レブズ)!";
  }
}

window.onload = loadLevel;