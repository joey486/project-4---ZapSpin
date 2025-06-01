const BASE_URL = "https://project-4-backend-production-0073.up.railway.app";
const ROWS = 3;
const COLS = 3;

let balance = 0;

document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  alert('Right-click is disabled on this site.');
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) ||
    (e.ctrlKey && e.key.toLowerCase() === 'u')) {
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
      }
    } else {
      devtools = false;
    }
  }, 1000);
})();

// ⬇️ Sync balance on load
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`${BASE_URL}/balance`, {
      credentials: "include"
    });
    const data = await res.json();
    balance = data.balance ?? 0;

    document.getElementById("balance").innerText = "Balance: $" + balance;
    if (balance > 0) {
      document.getElementById("balanceDisplay").classList.replace("hidden", "visible");
      document.getElementById("betSection").classList.replace("hidden", "visible");
      document.getElementById("depositSection").classList.add("hidden");
      document.getElementById("showDepositButton").classList.remove("hidden");
    }
  } catch (err) {
    console.error("Error fetching balance on load:", err);
  }
});

const deposit = async () => {
  const depositAmount = document.getElementById("depositAmount").value;
  const numberDepositAmount = parseFloat(depositAmount);

  if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
    alert("Invalid deposit amount. Please enter a positive number.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount: numberDepositAmount })
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    balance = data.balance;
    document.getElementById("balance").innerText = "Balance: $" + balance;

    document.getElementById("balanceDisplay").classList.replace("hidden", "visible");
    document.getElementById("betSection").classList.replace("hidden", "visible");
    document.getElementById("depositSection").classList.add("hidden");
    document.getElementById("showDepositButton").classList.remove("hidden");
  } catch (err) {
    alert("Failed to deposit. Please try again later.");
  }
};

const placeBet = () => {
  const lines = parseFloat(document.getElementById("numberOfLines").value);
  const bet = parseFloat(document.getElementById("betAmount").value);

  if (isNaN(lines) || lines <= 0 || lines > 3) {
    alert("Invalid number of lines.");
    return;
  }

  if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
    alert("Invalid bet amount.");
    return;
  }

  document.getElementById("spinSection").classList.replace("hidden", "visible");
};

const spin = async () => {
  const lines = parseFloat(document.getElementById("numberOfLines").value);
  const bet = parseFloat(document.getElementById("betAmount").value);

  try {
    const response = await fetch(`${BASE_URL}/spin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ lines, bet })
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    const rows = data.rows;
    balance = data.newBalance;

    document.getElementById("balance").innerText = "Balance: $" + balance;
    document.getElementById("winnings").innerText = "You won: $" + data.winnings;
    document.getElementById("rows").innerText = "";
    printRows(rows);

    document.getElementById("results").classList.replace("hidden", "visible");
    document.getElementById("spinSection").classList.replace("visible", "hidden");

    if (balance <= 0) {
      alert("You're out of money. Game over!");
    } else {
      document.getElementById("playAgainSection").classList.replace("hidden", "visible");
    }
  } catch (err) {
    alert("Failed to spin. Please try again.");
  }
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const printRows = (rows) => {
  const rowsDiv = document.getElementById("rows");
  rowsDiv.innerHTML = "";

  rows.forEach((row, rowIndex) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("slot-machine-row");

    row.forEach((symbol, colIndex) => {
      const symbolDiv = document.createElement("div");
      symbolDiv.innerText = symbol;
      symbolDiv.classList.add("slot-symbol");

      setTimeout(() => {
        symbolDiv.classList.add("animate");
      }, (rowIndex + colIndex) * 300);

      rowDiv.appendChild(symbolDiv);
    });

    rowsDiv.appendChild(rowDiv);
  });
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
    music.currentTime = 0;
    musicButton.innerText = "Play Music";
  }
};

const toggleDepositSection = () => {
  const depositSection = document.getElementById("depositSection");
  const showDepositButton = document.getElementById("showDepositButton");

  if (depositSection.classList.contains("hidden")) {
    depositSection.classList.remove("hidden");
    showDepositButton.classList.add("hidden");
  } else {
    depositSection.classList.add("hidden");
    showDepositButton.classList.remove("hidden");
  }
};
