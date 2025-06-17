// --- Audio Variables ---
const bgm = document.getElementById('bgm');
const voiceYash = document.getElementById('voice-yash');
const voiceShiro = document.getElementById('voice-shiro');
const voiceRebz = document.getElementById('voice-rebz');

const startGameButton = document.getElementById('startGameButton');
const bgmVolumeControl = document.getElementById('bgmVolume');
const toggleBGMButton = document.getElementById('toggleBGM');

// --- Audio Functions ---

// Function to play background music (handles autoplay policy)
function playBackgroundMusic() {
    // Only attempt to play if it's paused or not playing
    if (bgm.paused) {
        bgm.play().then(() => {
            // Playback was successful
            console.log("Background music successfully started.");
        }).catch(error => {
            // Autoplay was prevented or playback failed
            console.warn("Background music autoplay was prevented or playback failed:", error);
            // You might want to show a message to the user here, e.g., "Tap screen to enable music"
        });
    }
    // Optionally hide the start button once music starts
    if (startGameButton) {
        startGameButton.style.display = 'none';
        document.getElementById("quiz").style.display = 'block';
        document.getElementById("characters").style.display = 'block';
        document.getElementById("game").style.display = 'flex';
    }
}

// Function to pause/play background music
function toggleBackgroundMusic() {
    if (bgm.paused) {
        bgm.play();
        toggleBGMButton.textContent = 'Pause Music';
    } else {
        bgm.pause();
        toggleBGMButton.textContent = 'Play Music';
    }
}

// Function to set background music volume
function setBGMVolume(volume) {
    bgm.volume = volume;
}

// Functions to play specific voices/SFX
// Added logic to stop other voices before playing a new one
function playVoiceYash() {
    stopAllVoices(); // Stop any other playing voices
    voiceYash.currentTime = 0; // Rewind to start
    voiceYash.play().catch(error => console.error("Error playing Yash voice:", error));
}

function playVoiceShiro() {
    stopAllVoices();
    voiceShiro.currentTime = 0;
    voiceShiro.play().catch(error => console.error("Error playing Shiro voice:", error));
}

function playVoiceRebzSFX() { // Renamed for clarity as it's a general SFX/notification
    stopAllVoices();
    voiceRebz.currentTime = 0;
    voiceRebz.play().catch(error => console.error("Error playing Rebz SFX:", error));
}

function stopAllVoices() {
    voiceYash.pause(); voiceYash.currentTime = 0;
    voiceShiro.pause(); voiceShiro.currentTime = 0;
    // voiceRebz will be handled by playVoiceRebzSFX() if it's called
}


// --- Event Listeners for Controls ---

// Start Game button to trigger initial music playback and game display
// This will hide game elements initially and show them on click
document.addEventListener('DOMContentLoaded', () => {
    // Hide game elements initially until Start Game button is clicked
    document.getElementById("quiz").style.display = 'none';
    document.getElementById("characters").style.display = 'none';
    document.getElementById("game").style.display = 'none'; // Or 'none' depending on your layout

    if (startGameButton) {
        startGameButton.addEventListener('click', () => {
            playBackgroundMusic();
            loadLevel(); // Load the first level of the game after starting music
        });
    }

    // Volume control for BGM
    if (bgmVolumeControl) {
        bgmVolumeControl.addEventListener('input', (event) => {
            setBGMVolume(parseFloat(event.target.value));
        });
        // Set initial volume based on slider value (from index.html default)
        setBGMVolume(parseFloat(bgmVolumeControl.value));
    }

    // Toggle BGM button
    if (toggleBGMButton) {
        toggleBGMButton.addEventListener('click', toggleBackgroundMusic);
        // Initialize button text based on current state (initially 'Play Music' due to browser autoplay)
        toggleBGMButton.textContent = bgm.paused ? 'Play Music' : 'Pause Music';
    }
});


// ----------------------------------------------------
// YOUR ORIGINAL GAME JAVASCRIPT CODE GOES BELOW THIS LINE
// ----------------------------------------------------


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
        voice: "voice-rebz" // Note: This refers to the audio ID, not necessarily the function
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

    // 🔊 Play stage voice based on the 'voice' property
    if (voice === "voice-yash") {
        playVoiceYash();
    } else if (voice === "voice-shiro") {
        playVoiceShiro();
    }
    // No specific voice for 'voice-rebz' in stages array for narration.
    // The 'voice-rebz' audio element is intended as an SFX (playVoiceRebzSFX)
    // for unlocking Rebz, not for level narration.

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
            playVoiceRebzSFX(); // Call our new SFX function here
        }
    } else {
        alert("❌ Wrong answer! Try again.");
    }
}

// Changed from window.onload to be controlled by the "Start Game" button
// window.onload = loadLevel; // Remove or comment this line

// Global function for the "Next" button in HTML
function nextLevel() {
    // Your logic for the next button, if it's different from quiz progression
    // Currently, `checkAnswer` drives the levels, so this might not be used.
    // For now, let's assume `checkAnswer` handles progression.
    console.log("Next button clicked, but level progression is handled by quiz answers.");
}
