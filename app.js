// ==========================================
// HAND CLASH
// ROCK PAPER SCISSORS
// TEACHABLE MACHINE + TENSORFLOW.JS
// ==========================================

let model = null;
let webcam = null;
let isPlaying = false;

// ==========================================
// ELEMENTS - SESUAI HTML LO
// ==========================================

const modelUrl = document.getElementById("modelUrl");
const loadModelBtn = document.getElementById("loadModelBtn");
const startGameBtn = document.getElementById("startGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");

const modelStatus = document.getElementById("modelStatus");

const webcamContainer =
    document.getElementById("webcamContainer");

const playerMove =
    document.getElementById("playerMove");

const cpuMove =
    document.getElementById("cpuMove");

const cpuEmoji =
    document.getElementById("cpuEmoji");

const cpuDisplay =
    document.getElementById("cpuDisplay");

const confidenceText =
    document.getElementById("confidenceText");

const confidenceBar =
    document.getElementById("confidenceBar");

const roundText =
    document.getElementById("roundText");

const resultBanner =
    document.getElementById("resultBanner");

const resultKicker =
    document.getElementById("resultKicker");

const resultText =
    document.getElementById("resultText");

const wins =
    document.getElementById("wins");

const draws =
    document.getElementById("draws");

const losses =
    document.getElementById("losses");

const streakText =
    document.getElementById("streakText");

const toastElement =
    document.getElementById("toast");

// ==========================================
// SCORE
// ==========================================

let playerScore =
    Number(localStorage.getItem("rps_player")) || 0;

let cpuScore =
    Number(localStorage.getItem("rps_cpu")) || 0;

let drawScore =
    Number(localStorage.getItem("rps_draw")) || 0;

let streak =
    Number(localStorage.getItem("rps_streak")) || 0;

// ==========================================
// ICON
// ==========================================

const icons = {
    batu: "✊",
    gunting: "✌️",
    kertas: "✋"
};

// ==========================================
// NORMALIZE LABEL
// ==========================================

function normalizeLabel(label) {

    return label
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "")
        .replace(/[^a-z]/g, "");
}


// ==========================================
// DETECT MOVE FROM TM CLASS
// ==========================================

function convertMove(label) {

    const text =
        normalizeLabel(label);

    if (
        text.includes("batu") ||
        text.includes("rock")
    ) {
        return "batu";
    }

    if (
        text.includes("gunting") ||
        text.includes("scissor")
    ) {
        return "gunting";
    }

    if (
        text.includes("kertas") ||
        text.includes("paper")
    ) {
        return "kertas";
    }

    return null;
}


// ==========================================
// STATUS
// ==========================================

function setStatus(text) {

    modelStatus.textContent =
        `MODEL: ${text}`;
}


// ==========================================
// TOAST
// ==========================================

function toast(message) {

    if (!toastElement) return;

    toastElement.textContent =
        message;

    toastElement.classList.add("show");

    setTimeout(() => {

        toastElement.classList.remove("show");

    }, 2500);
}


// ==========================================
// RESULT
// ==========================================

function showResult(
    kicker,
    message,
    type = ""
) {

    resultKicker.textContent =
        kicker;

    resultText.textContent =
        message;

    resultBanner.className =
        "result-banner";

    if (type) {
        resultBanner.classList.add(type);
    }
}


// ==========================================
// SCORE UPDATE
// ==========================================

function updateScore() {

    wins.textContent =
        playerScore;

    draws.textContent =
        drawScore;

    losses.textContent =
        cpuScore;

    if (streak > 0) {

        streakText.textContent =
            `STREAK // ${streak}`;

    } else {

        streakText.textContent =
            "STREAK // —";
    }

    localStorage.setItem(
        "rps_player",
        playerScore
    );

    localStorage.setItem(
        "rps_cpu",
        cpuScore
    );

    localStorage.setItem(
        "rps_draw",
        drawScore
    );

    localStorage.setItem(
        "rps_streak",
        streak
    );
}


// ==========================================
// RESET SCORE
// ==========================================

function resetScore() {

    playerScore = 0;
    cpuScore = 0;
    drawScore = 0;
    streak = 0;

    updateScore();

    roundText.textContent =
        "READY";

    playerMove.textContent =
        "—";

    cpuMove.textContent =
        "—";

    cpuEmoji.textContent =
        "WAITING...";

    confidenceText.textContent =
        "0%";

    confidenceBar.style.width =
        "0%";

    showResult(
        "SYSTEM",
        "SCORE RESET"
    );

    toast("SCORE RESET!");

}


// ==========================================
// CPU CHOICE
// ==========================================

function getCpuChoice() {

    const choices = [
        "batu",
        "gunting",
        "kertas"
    ];

    return choices[
        Math.floor(
            Math.random() *
            choices.length
        )
    ];
}


// ==========================================
// DETERMINE WINNER
// ==========================================

function determineWinner(
    player,
    cpu
) {

    if (player === cpu) {
        return "draw";
    }

    if (
        player === "batu" &&
        cpu === "gunting"
    ) {
        return "player";
    }

    if (
        player === "gunting" &&
        cpu === "kertas"
    ) {
        return "player";
    }

    if (
        player === "kertas" &&
        cpu === "batu"
    ) {
        return "player";
    }

    return "cpu";
}


// ==========================================
// MODEL URL PARSER
// ==========================================

function getModelUrls(url) {

    let cleanUrl =
        url.trim();

    cleanUrl =
        cleanUrl.replace(
            /\/+$/,
            ""
        );

    // model.json langsung
    if (
        cleanUrl
            .toLowerCase()
            .endsWith("/model.json")
    ) {

        return {

            modelURL:
                cleanUrl,

            metadataURL:
                cleanUrl.replace(
                    /\/model\.json$/i,
                    "/metadata.json"
                )
        };
    }

    // folder model
    return {

        modelURL:
            `${cleanUrl}/model.json`,

        metadataURL:
            `${cleanUrl}/metadata.json`
    };
}


// ==========================================
// LOAD MODEL
// ==========================================

async function loadModel() {

    const url =
        modelUrl.value.trim();

    if (!url) {

        toast(
            "Masukkan URL model dulu!"
        );

        return;
    }

    try {

        loadModelBtn.disabled = true;

        startGameBtn.disabled = true;

        setStatus(
            "LOADING..."
        );

        showResult(
            "SYSTEM",
            "CONNECTING TO AI..."
        );

        console.log(
            "USER MODEL URL:",
            url
        );

        const {
            modelURL,
            metadataURL
        } =
            getModelUrls(url);

        console.log(
            "MODEL:",
            modelURL
        );

        console.log(
            "METADATA:",
            metadataURL
        );

        // ==================================
        // LOAD TEACHABLE MACHINE
        // ==================================

        model =
            await tmImage.load(
                modelURL,
                metadataURL
            );

        console.log(
            "MODEL BERHASIL DIMUAT"
        );

        console.log(
            "JUMLAH CLASS:",
            model.getTotalClasses()
        );

        // ==================================
        // SETUP CAMERA
        // ==================================

        await setupCamera();

        setStatus(
            "ONLINE"
        );

        startGameBtn.disabled =
            false;

        showResult(
            "SYSTEM",
            "AI ONLINE // READY TO FIGHT!"
        );

        toast(
            "AI berhasil terhubung!"
        );

    } catch (error) {

        console.error(
            "MODEL ERROR:",
            error
        );

        model = null;

        setStatus(
            "ERROR"
        );

        startGameBtn.disabled =
            true;

        showResult(
            "MODEL ERROR",
            error.message ||
            "Gagal memuat model.",
            "lose"
        );

        toast(
            "Model gagal dimuat."
        );

    } finally {

        loadModelBtn.disabled =
            false;
    }
}


// ==========================================
// CAMERA SETUP
// ==========================================

async function setupCamera() {

    if (webcam) {

        webcam.stop();

        webcam = null;
    }

    webcam =
        new tmImage.Webcam(
            224,
            224,
            true
        );

    await webcam.setup({
        facingMode: "user"
    });

    await webcam.play();

    webcamContainer.innerHTML =
        "";

    webcamContainer.appendChild(
        webcam.canvas
    );

    webcam.canvas.style.width =
        "100%";

    webcam.canvas.style.height =
        "100%";

    webcam.canvas.style.objectFit =
        "cover";

    window.requestAnimationFrame(
        cameraLoop
    );
}


// ==========================================
// CAMERA LOOP
// ==========================================

function cameraLoop() {

    if (webcam) {

        webcam.update();
    }

    window.requestAnimationFrame(
        cameraLoop
    );
}


// ==========================================
// COUNTDOWN
// ==========================================

async function countdown() {

    const numbers = [
        "3",
        "2",
        "1",
        "GO!"
    ];

    for (
        const number
        of numbers
    ) {

        roundText.textContent =
            number;

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    number === "GO!"
                        ? 700
                        : 850
                )
        );
    }
}


// ==========================================
// AI PREDICTION
// ==========================================

async function detectPlayerMove() {

    const startTime =
        performance.now();

    const detectionDuration =
        2500;

    let bestMove = null;

    let bestProbability = 0;

    while (
        performance.now()
        - startTime
        <
        detectionDuration
    ) {

        const predictions =
            await model.predict(
                webcam.canvas
            );

        let highestMove =
            null;

        let highestProbability =
            0;

        for (
            const prediction
            of predictions
        ) {

            const move =
                convertMove(
                    prediction.className
                );

            if (
                move &&
                prediction.probability
                >
                highestProbability
            ) {

                highestMove =
                    move;

                highestProbability =
                    prediction.probability;
            }
        }

        if (
            highestProbability
            >
            bestProbability
        ) {

            bestMove =
                highestMove;

            bestProbability =
                highestProbability;
        }

        confidenceText.textContent =
            `${Math.round(
                highestProbability * 100
            )}%`;

        confidenceBar.style.width =
            `${Math.round(
                highestProbability * 100
            )}%`;

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    80
                )
        );
    }

    return {
        move: bestMove,
        probability:
            bestProbability
    };
}


// ==========================================
// START ROUND
// ==========================================

async function startRound() {

    if (!model) {

        toast(
            "Load AI terlebih dahulu!"
        );

        return;
    }

    if (!webcam) {

        toast(
            "Kamera belum siap!"
        );

        return;
    }

    if (isPlaying) {
        return;
    }

    isPlaying = true;

    startGameBtn.disabled =
        true;

    roundText.textContent =
        "READY";

    playerMove.textContent =
        "—";

    cpuMove.textContent =
        "—";

    cpuEmoji.textContent =
        "THINKING...";

    confidenceText.textContent =
        "0%";

    confidenceBar.style.width =
        "0%";

    showResult(
        "ROUND",
        "GET READY!"
    );

    await countdown();

    // ==================================
    // CPU PICK
    // ==================================

    const cpuChoice =
        getCpuChoice();

    cpuMove.textContent =
        cpuChoice.toUpperCase();

    cpuEmoji.textContent =
        icons[cpuChoice];

    // ==================================
    // PLAYER PICK
    // ==================================

    showResult(
        "AI",
        "SHOW YOUR MOVE!"
    );

    const result =
        await detectPlayerMove();

    const playerChoice =
        result.move;

    // ==================================
    // UNKNOWN
    // ==================================

    if (!playerChoice) {

        playerMove.textContent =
            "UNKNOWN";

        showResult(
            "AI",
            "HAND NOT DETECTED",
            "draw"
        );

        roundText.textContent =
            "RETRY";

        isPlaying = false;

        startGameBtn.disabled =
            false;

        return;
    }

    // ==================================
    // PLAYER DISPLAY
    // ==================================

    playerMove.textContent =
        playerChoice.toUpperCase();

    // ==================================
    // WINNER
    // ==================================

    const winner =
        determineWinner(
            playerChoice,
            cpuChoice
        );

    if (
        winner === "player"
    ) {

        playerScore++;

        streak++;

        showResult(
            "VICTORY",
            "YOU WIN!",
            "win"
        );

        toast(
            "🔥 NICE! YOU WIN!"
        );

    } else if (
        winner === "cpu"
    ) {

        cpuScore++;

        streak = 0;

        showResult(
            "DEFEAT",
            "CPU WINS!",
            "lose"
        );

        toast(
            "💀 CPU GOT YOU!"
        );

    } else {

        drawScore++;

        showResult(
            "ROUND",
            "DRAW!",
            "draw"
        );

        toast(
            "⚡ SAME MOVE!"
        );
    }

    roundText.textContent =
        "END";

    updateScore();

    await new Promise(
        resolve =>
            setTimeout(
                resolve,
                900
            )
    );

    startGameBtn.disabled =
        false;

    isPlaying = false;
}


// ==========================================
// EVENTS
// ==========================================

loadModelBtn.addEventListener(
    "click",
    loadModel
);

startGameBtn.addEventListener(
    "click",
    startRound
);

resetScoreBtn.addEventListener(
    "click",
    resetScore
);

modelUrl.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            loadModel();
        }
    }
);


// ==========================================
// INITIALIZE
// ==========================================

updateScore();

setStatus(
    "OFFLINE"
);

console.log(
    "HAND CLASH READY"
);