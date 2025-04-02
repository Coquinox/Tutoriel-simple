document.addEventListener("DOMContentLoaded", () => {
    const words = ["BANANE", "ELEPHANT", "ORDINATEUR", "PYTHON", "GUITARE"];
    let selectedWord, guessedWord, errors;

    const maxErrors = 6;
    const wordContainer = document.getElementById("word-container");
    const keyboardContainer = document.getElementById("keyboard");
    const errorCount = document.getElementById("error-count");
    const messageContainer = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");

    const canvas = document.getElementById("hangman-canvas");
    const ctx = canvas.getContext("2d");

    function initGame() {
        wordContainer.classList.remove("win-animation"); // Retirer animation de victoire

        // Réinitialiser les variables
        selectedWord = words[Math.floor(Math.random() * words.length)];
        guessedWord = Array(selectedWord.length).fill("_");
        errors = 0;

        // Réinitialiser l'affichage
        wordContainer.textContent = guessedWord.join(" ");
        errorCount.textContent = `Erreurs : ${errors}/${maxErrors}`;
        messageContainer.textContent = "";

        // Réactiver tous les boutons
        document.querySelectorAll("#keyboard button").forEach(button => {
            button.disabled = false;
        });

        // Effacer le pendu
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawHangman() {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";

        if (errors === 1) {
            ctx.beginPath();
            ctx.moveTo(20, 230);
            ctx.lineTo(180, 230);
            ctx.stroke();
        } else if (errors === 2) {
            ctx.beginPath();
            ctx.moveTo(50, 230);
            ctx.lineTo(50, 20);
            ctx.stroke();
        } else if (errors === 3) {
            ctx.beginPath();
            ctx.moveTo(50, 20);
            ctx.lineTo(120, 20);
            ctx.stroke();
        } else if (errors === 4) {
            ctx.beginPath();
            ctx.moveTo(120, 20);
            ctx.lineTo(120, 50);
            ctx.stroke();
        } else if (errors === 5) {
            ctx.beginPath();
            ctx.arc(120, 70, 20, 0, Math.PI * 2);
            ctx.stroke();
        } else if (errors === 6) {
            ctx.beginPath();
            ctx.moveTo(120, 90);
            ctx.lineTo(120, 150);
            ctx.stroke();
            ctx.moveTo(120, 110);
            ctx.lineTo(100, 130);
            ctx.stroke();
            ctx.moveTo(120, 110);
            ctx.lineTo(140, 130);
            ctx.stroke();
            ctx.moveTo(120, 150);
            ctx.lineTo(100, 180);
            ctx.stroke();
            ctx.moveTo(120, 150);
            ctx.lineTo(140, 180);
            ctx.stroke();
        }
    }

    function handleLetterClick(event) {
        const button = event.target;
        const letter = button.dataset.letter;
        button.disabled = true;

        if (selectedWord.includes(letter)) {
            for (let i = 0; i < selectedWord.length; i++) {
                if (selectedWord[i] === letter) {
                    guessedWord[i] = letter;
                }
            }
            wordContainer.textContent = guessedWord.join(" ");
        } else {
            errors++;
            errorCount.textContent = `Erreurs : ${errors}/${maxErrors}`;
            drawHangman();
        }

        checkGameStatus();
    }

    function checkGameStatus() {
        if (!guessedWord.includes("_")) {
            messageContainer.textContent = "🎉 Bravo ! Tu as gagné !";
            disableAllButtons();
            animateWin();
        } else if (errors >= maxErrors) {
            messageContainer.textContent = `😢 Perdu ! Le mot était : ${selectedWord}`;
            disableAllButtons();
            animateLoss();
        }
    }

    function disableAllButtons() {
        document.querySelectorAll("#keyboard button").forEach(button => {
            button.disabled = true;
        });
    }

    // Animation de victoire
    function animateWin() {
        wordContainer.classList.add("win-animation");
        let spans = wordContainer.textContent.split("").map(letter => {
            let span = document.createElement("span");
            span.textContent = letter;
            return span;
        });
        wordContainer.innerHTML = "";
        spans.forEach((span, i) => {
            span.style.animationDelay = `${i * 0.1}s`;
            wordContainer.appendChild(span);
        });
    }

    // Animation de secousse du pendu
    function animateLoss() {
        document.getElementById("hangman-container").classList.add("shake");
        setTimeout(() => {
            document.getElementById("hangman-container").classList.remove("shake");
        }, 900);
    }

    // Ajout du bouton Rejouer
    restartButton.addEventListener("click", initGame);

    // Création du clavier
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letter => {
        const button = document.createElement("button");
        button.textContent = letter;
        button.dataset.letter = letter;
        button.addEventListener("click", handleLetterClick);
        keyboardContainer.appendChild(button);
    });

    // Démarrer la première partie
    initGame();
});
