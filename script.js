fetch("https://yume-backend-rabiya.onrender.com/api/characters")
  .then(res => res.json())
  .then(data => {
    const charBox = document.getElementById("characters");
    data.forEach(char => {
      const div = document.createElement("div");
      div.className = "char-card";

      div.innerHTML = `
        <div class="avatar-box">
          <img src="images/${char.name.toLowerCase()}.png" alt="${char.name}" class="avatar-img"/>
        </div>
        <strong>${char.name}</strong><br/>
        <span style="font-size: 0.9rem; color: #ccc;">${char.role}</span>
      `;

      if (char.unlockable) {
        div.style.display = "none";
        div.id = "rebz-card";
      }

      charBox.appendChild(div);
    });
  });

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

  if (level === 0) {
    const yashVoice = document.getElementById("voice-yash");
    yashVoice?.play();
  } else if (level === 1) {
    const shiroVoice = document.getElementById("voice-shiro");
    shiroVoice?.play();
  }
}

function nextLevel() {
  if (level < levels.length - 1) {
    level++;
    loadLevel();
  } else {
    document.getElementById("message").textContent = "✨ You unlocked Rebz (レブズ)!";
    const rebz = document.getElementById("rebz-card");
    if (rebz) {
      rebz.style.display = "block";
      rebz.style.border = "2px solid gold";
      rebz.style.boxShadow = "0 0 15px gold";
    }

    const rebzAudio = document.getElementById("voice-rebz");
    rebzAudio?.play();
  }
}

window.onload = loadLevel;
