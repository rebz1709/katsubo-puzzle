// ✅ Fetch character data and display on page
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

// ✅ Puzzle + Quiz Stages
const stages = [
  {
    tiles: ["🟦", "⬜", "✨"],
    question: "Which desire drives the story of Yume no Katsubō?",
    options: [
      "Power over others",
      "Truth behind memories",
      "Wealth and fame",
      "Escape from the real world"
    ],
    answer: 1,
    voice: "voice-yash"
  },
  {
    tiles: ["⬜", "✨", "🟦"],
    question: "What is the essence of true faith?",
    options: [
      "Seeing is believing",
      "Waiting for proof",
      "Believing even in silence",
      "Knowing the outcome first"
    ],
    answer: 2,
    voice: "voice-shiro"
  },
  {
    tiles: ["✨", "🟦", "⬜"],
    question: "What is the truest nature of death?",
    options: [
      "End of all stories",
      "Beginning of memory",
      "Punishment for weakness",
      "A failure to live"
    ],
    answer: 1,
    voice: "voice-rebz"
  }
];

let currentLevel = 0;

function loadLevel() {
  const game = document.getElementById("game");
  const quiz = document.getElementById("quiz");
  const message = document.getElementById("message");

  game.innerHTML = "";
  quiz.innerHTML = "";
  message.textContent = "";

  const { tiles, question, options, voice } = stages[currentLevel];

  // 🔊 Play stage voice
  const audio = document.getElementById(voice);
  if (audio) audio.play();

  // 🧩 Load puzzle tiles
  tiles.forEach(tile => {
    const div = document.createElement("div");
    div.textContent = tile;
    game.appendChild(div);
  });

  // 🧠 Load quiz question + options
  const q = document.createElement("p");
  q.textContent = `🧠 ${question}`;
  quiz.appendChild(q);

  options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "quiz-btn";
    btn.onclick = () => checkAnswer(index);
    quiz.appendChild(btn);
  });
}

function checkAnswer(selected) {
  if (selected === stages[currentLevel].answer) {
    if (currentLevel < stages.length - 1) {
      currentLevel++;
      loadLevel();
    } else {
      document.getElementById("message").textContent = "✨ You unlocked Rebz (レブズ)!";
      const rebz = document.getElementById("rebz-card");
      if (rebz) {
        rebz.style.display = "block";
        rebz.style.border = "2px solid gold";
        rebz.style.boxShadow = "0 0 15px gold";
      }
      document.getElementById("voice-rebz")?.play();
    }
  } else {
    alert("❌ Wrong answer! Try again.");
  }
}

window.onload = loadLevel;
