let model = null;
let webcam = null;

let modelLoaded = false;
let playing = false;

let playerScore = 0;
let botScore = 0;

let currentPlayerChoice = null;


const modelURLInput =
    document.getElementById("modelURL");

const loadModelBtn =
    document.getElementById("loadModelBtn");

const modelStatus =
    document.getElementById("modelStatus");

const startBtn =
    document.getElementById("startBtn");

const webcamContainer =
    document.getElementById("webcam-container");

const playerChoice =
    document.getElementById("playerChoice");

const playerPrediction =
    document.getElementById("playerPrediction");

const botChoice =
    document.getElementById("botChoice");

const result =
    document.getElementById("result");

const gameMessage =
    document.getElementById("gameMessage");

const playerScoreText =
    document.getElementById("playerScore");

const botScoreText =
    document.getElementById("botScore");

const resetBtn =
    document.getElementById("resetBtn");


// =====================================
// LOAD TEACHABLE MACHINE MODEL
// =====================================

loadModelBtn.addEventListener(
    "click",
    async () => {

        let url =
            modelURLInput.value.trim();


        if (!url) {

            modelStatus.textContent =
                "● ERROR: MODEL URL EMPTY";

            return;
        }


        if (!url.endsWith("/")) {

            url += "/";

        }


        const modelURL =
            url + "model.json";

        const metadataURL =
            url + "metadata.json";


        try {

            loadModelBtn.disabled = true;

            modelStatus.textContent =
                "● CONNECTING TO NEURAL MODEL...";


            model =
                await tmImage.load(
                    modelURL,
                    metadataURL
                );


            modelLoaded = true;


            modelStatus.textContent =
                "● NEURAL MODEL ONLINE";


            startBtn.disabled = false;


            await setupWebcam();


            gameMessage.textContent =
                "SYSTEM READY — START BATTLE";


        } catch (error) {

            console.error(error);


            modelStatus.textContent =
                "● CONNECTION FAILED";


            gameMessage.textContent =
                "CHECK YOUR MODEL URL";


            loadModelBtn.disabled = false;

        }

    }
);


// =====================================
// WEBCAM
// =====================================

async function setupWebcam() {

    if (webcam) {
        return;
    }


    webcam =
        new tmImage.Webcam(
            400,
            300,
            true
        );


    await webcam.setup();

    await webcam.play();


    webcamContainer.innerHTML = "";

    webcamContainer.appendChild(
        webcam.canvas
    );


    window.requestAnimationFrame(
        webcamLoop
    );

}


async function webcamLoop() {

    if (webcam) {

        webcam.update();


        if (playing) {

            await predict();

        }

    }


    window.requestAnimationFrame(
        webcamLoop
    );

}


// =====================================
// AI PREDICTION
// =====================================

async function predict() {

    if (!model) {
        return;
    }


    const predictions =
        await model.predict(
            webcam.canvas
        );


    let bestClass = null;

    let bestProbability = 0;


    for (const prediction of predictions) {

        if (
            prediction.probability >
            bestProbability
        ) {

            bestProbability =
                prediction.probability;

            bestClass =
                prediction.className;

        }

    }


    if (
        bestClass &&
        bestProbability >= 0.70
    ) {

        const choice =
            normalizeChoice(
                bestClass
            );


        if (choice) {

            currentPlayerChoice =
                choice;


            updatePlayerDisplay(
                choice,
                bestProbability
            );

        }

    }

}


// =====================================
// DETECT CLASS NAME
// =====================================

function normalizeChoice(name) {

    const value =
        name.toLowerCase();


    if (
        value.includes("rock") ||
        value.includes("batu")
    ) {

        return "rock";

    }


    if (
        value.includes("paper") ||
        value.includes("kertas")
    ) {

        return "paper";

    }


    if (
        value.includes("scissor") ||
        value.includes("gunting")
    ) {

        return "scissors";

    }


    return null;

}


// =====================================
// PLAYER DISPLAY
// =====================================

function updatePlayerDisplay(
    choice,
    probability
) {

    const icons = {

        rock: "✊",

        paper: "🖐️",

        scissors: "✌️"

    };


    playerChoice.textContent =
        icons[choice];


    playerPrediction.textContent =
        choice.toUpperCase() +
        " // " +
        Math.round(
            probability * 100
        ) +
        "%";

}


// =====================================
// START ROUND
// =====================================

startBtn.addEventListener(
    "click",
    async () => {

        if (!modelLoaded || playing) {
            return;
        }


        playing = true;

        currentPlayerChoice = null;


        startBtn.disabled = true;


        playerChoice.textContent = "?";

        playerPrediction.textContent =
            "SCANNING...";


        botChoice.textContent = "?";

        result.textContent =
            "FIGHT";


        gameMessage.textContent =
            "MAKE YOUR MOVE!";


        await wait(1500);


        playing = false;


        if (!currentPlayerChoice) {

            gameMessage.textContent =
                "NO GESTURE DETECTED";

            result.textContent =
                "RETRY";

            startBtn.disabled = false;

            return;

        }


        battle();


        startBtn.disabled = false;

    }
);


// =====================================
// BATTLE
// =====================================

function battle() {

    const choices = [
        "rock",
        "paper",
        "scissors"
    ];


    const botMove =
        choices[
            Math.floor(
                Math.random() *
                choices.length
            )
        ];


    const icons = {

        rock: "✊",

        paper: "🖐️",

        scissors: "✌️"

    };


    botChoice.textContent =
        icons[botMove];


    const winner =
        getWinner(
            currentPlayerChoice,
            botMove
        );


    showResult(
        winner
    );

}


// =====================================
// WINNER
// =====================================

function getWinner(
    player,
    bot
) {

    if (player === bot) {

        return "draw";

    }


    if (

        (player === "rock" &&
            bot === "scissors") ||

        (player === "paper" &&
            bot === "rock") ||

        (player === "scissors" &&
            bot === "paper")

    ) {

        return "player";

    }


    return "bot";

}


// =====================================
// RESULT
// =====================================

function showResult(winner) {

    if (winner === "player") {

        playerScore++;

        playerScoreText.textContent =
            playerScore;

        result.textContent =
            "YOU WIN";

        gameMessage.textContent =
            "🔥 ROBOT DESTROYED!";

    }


    else if (winner === "bot") {

        botScore++;

        botScoreText.textContent =
            botScore;

        result.textContent =
            "BOT WINS";

        gameMessage.textContent =
            "🤖 MACHINE WINS!";

    }


    else {

        result.textContent =
            "DRAW";

        gameMessage.textContent =
            "⚡ SAME MOVE!";

    }


    document
        .querySelector(".battle-arena")
        .classList.add("shake");


    setTimeout(() => {

        document
            .querySelector(".battle-arena")
            .classList.remove("shake");

    }, 400);

}


// =====================================
// RESET
// =====================================

resetBtn.addEventListener(
    "click",
    () => {

        playerScore = 0;

        botScore = 0;


        playerScoreText.textContent = "0";

        botScoreText.textContent = "0";


        playerChoice.textContent = "?";

        botChoice.textContent = "?";


        playerPrediction.textContent =
            "WAITING...";


        result.textContent =
            "READY";


        gameMessage.textContent =
            modelLoaded
                ? "SYSTEM READY — START BATTLE"
                : "CONNECT YOUR NEURAL MODEL";

    }
);


// =====================================
// WAIT
// =====================================

function wait(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}