const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUE = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

let balance = 0;


document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    alert('Right-click is disabled on this site.');
});

document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12') {
        e.preventDefault();
    }

    // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
    }

    // Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
    }

    // Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
    }

    // Ctrl+U (view source)
    if (e.ctrlKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
    }
});

(function () {
    const threshold = 160;
    let devtools = false;

    setInterval(() => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        if (widthThreshold || heightThreshold) {
            if (!devtools) {
                devtools = true;
                alert('DevTools are open. Please close them to continue.');
                // Optionally redirect or close tab
                // window.location.href = 'about:blank';
            }
        } else {
            devtools = false;
        }
    }, 1000);
})();

const deposit = () => {
    const depositAmount = document.getElementById("depositAmount").value;
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
        alert("Invalid deposit amount. Please enter a positive number.");
    } else {
        balance = numberDepositAmount;
        document.getElementById("balance").innerText = "Balance: $" + balance;

        // Show balance and bet sections
        document.getElementById("balanceDisplay").classList.replace("hidden", "visible");
        document.getElementById("betSection").classList.replace("hidden", "visible");

        // Hide deposit section
        document.getElementById("depositSection").classList.add("hidden");

        // Show the "Show Deposit Section" button
        document.getElementById("showDepositButton").classList.remove("hidden");
    }
};

const placeBet = () => {
    const lines = document.getElementById("numberOfLines").value;
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
        alert("Invalid number of lines, please try again.");
        return;
    }

    const bet = document.getElementById("betAmount").value;
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / numberOfLines) {
        alert("Invalid bet, please try again.");
        return;
    }

    balance -= numberBet * numberOfLines;
    document.getElementById("balance").innerText = "Balance: $" + balance;
    document.getElementById("spinSection").classList.replace("hidden", "visible");
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; COLS > i; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; ROWS > j; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    const rows = transpose(reels);
    document.getElementById("rows").innerText = "";
    printRows(rows);

    const numberOfLines = parseFloat(document.getElementById("numberOfLines").value);
    const bet = parseFloat(document.getElementById("betAmount").value);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    document.getElementById("balance").innerText = "Balance: $" + balance;
    document.getElementById("winnings").innerText = "You won: $" + winnings;

    document.getElementById("results").classList.replace("hidden", "visible");
    document.getElementById("spinSection").classList.replace("visible", "hidden");

    if (balance <= 0) {
        alert("You're out of money. Game over!");
    } else {
        document.getElementById("playAgainSection").classList.replace("hidden", "visible");
    }
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; ROWS > i; i++) {
        rows.push([]);
        for (let j = 0; COLS > j; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    const rowsDiv = document.getElementById("rows");
    rowsDiv.innerHTML = ""; // Clear previous rows

    rows.forEach((row, rowIndex) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("slot-machine-row");

        row.forEach((symbol, colIndex) => {
            const symbolDiv = document.createElement("div");
            symbolDiv.innerText = symbol;
            symbolDiv.classList.add("slot-symbol");

            // Delay to simulate staggered animation
            setTimeout(() => {
                symbolDiv.classList.add("animate"); // Trigger animation
            }, (rowIndex + colIndex) * 300); // Stagger by row and column

            rowDiv.appendChild(symbolDiv);
        });

        rowsDiv.appendChild(rowDiv);
    });
};



const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; lines > row; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUE[symbols[0]];
        }
    }

    return winnings;
};

const playAgain = () => {
    document.getElementById("results").classList.replace("visible", "hidden");
    document.getElementById("playAgainSection").classList.replace("visible", "hidden");
    document.getElementById("betSection").classList.replace("hidden", "visible");
};

const toggleMusic = () => {
    const music = document.getElementById("background-music");
    const musicButton = document.getElementById("music-button");

    if (music.paused) {
        music.play();
        musicButton.innerText = "Stop Music";
    } else {
        music.pause();
        music.currentTime = 0; // Reset to start
        musicButton.innerText = "Play Music";
    }
};

const toggleDepositSection = () => {
    const depositSection = document.getElementById("depositSection");
    const showDepositButton = document.getElementById("showDepositButton");

    if (depositSection.classList.contains("hidden")) {
        depositSection.classList.remove("hidden");
        showDepositButton.classList.add("hidden");
    }
    else {
        depositSection.classList.add("hidden");
        showDepositButton.classList.remove("hidden");
    }
};

