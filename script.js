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
    console.log("Attempting to play background music. Audio readyState:", bgm.readyState);

    if (bgm.paused) {
        // Check if audio has enough data to play through
        if (bgm.readyState < 4) { // HTMLMediaElement.HAVE_ENOUGH_DATA (value is 4)
            console.log("Audio not fully ready, waiting for canplaythrough event...");
            // Add a one-time listener for when enough data is buffered
            bgm.addEventListener('canplaythrough', function handler() {
                bgm.removeEventListener('canplaythrough', handler); // Remove listener to prevent multiple calls
                bgm.play().then(() => {
                    console.log("Background music successfully started after canplaythrough.");
                }).catch(error => {
                    console.warn("Background music playback failed (after canplaythrough):", error);
                    alert("Music Error (Load/Play): " + error.message + ". (Check audio file path: audio/background_music.mp3)");
                });
            });
        } else {
            // Audio is already ready, try to play immediately
            bgm.play().then(() => {
                console.log("Background music successfully started immediately.");
            }).catch(error => {
                console.warn("Background music playback failed (immediate attempt):", error);
                alert("Music Error (Immediate Play): " + error.message + ". (Check audio file path: audio/background_music.mp3)");
            });
        }
    } else {
        console.log("Background music is already playing.");
    }
    
    // Optionally hide the start button once music starts
    if (startGameButton) {
        startGameButton.style.display = 'none';
        document.getElementById("quiz").style.display = 'block';
        document.getElementById("characters").style.display = 'block';
        document.getElementById("game").style.display = 'flex';
    }
}

// Function to pause/play background music (updated for robustness)
function toggleBackgroundMusic() {
    if (bgm.paused) {
        console.log("Attempting to play music via toggle. Audio readyState:", bgm.readyState);
        if (bgm.readyState < 4) {
            console.log("Audio not fully ready (toggle), waiting for canplaythrough...");
            bgm.addEventListener('canplaythrough', function handler() {
                bgm.removeEventListener('canplaythrough', handler);
                bgm.play().then(() => {
                    console.log("Music started via toggle after canplaythrough.");
                    toggleBGMButton.textContent = 'Pause Music';
                }).catch(error => {
                    console.warn("Manual toggle play failed (after canplaythrough):", error);
                    alert("Error playing music manually (Load/Play): " + error.message);
                });
            });
        } else {
            bgm.play().then(() => {
                console.log("Music started via toggle immediately.");
                toggleBGMButton.textContent = 'Pause Music';
            }).catch(error => {
                console.warn("Manual toggle play failed (immediate):", error);
                alert("Error playing music manually (Immediate Play): " + error.message);
            });
        }
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
            "Mithya - The illusion of Truth behind memories",
            "Wealth and fame",
            "Escape from the real world"
        ],
        answer: 1, // Corrected to match "Truth behind memories" if that's the desired answer
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
