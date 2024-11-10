let time = 1500;
let timerInterval;

function updateTimerDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  document.getElementById("timer").textContent = `${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

document.getElementById("startTimer").addEventListener("click", () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (time > 0) {
      time--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon128.png",
        title: "Time's up!",
        message: "Take a short break.",
      });
    }
  }, 1000);
});

document.getElementById("resetTimer").addEventListener("click", () => {
  clearInterval(timerInterval);
  time = 1500;
  updateTimerDisplay();
});

updateTimerDisplay();
