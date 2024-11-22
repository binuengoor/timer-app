document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.querySelector(".timer-display");
    const activateButton = document.getElementById("activate");
    const resetButton = document.querySelector(".reset-btn");
    const presets = document.querySelectorAll(".preset");
    const inputs = {
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds"),
    };

    let timer = null;
    let countdownTime = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
    let initialTime = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

    // Format time as two or three digits
    const formatTime = (time, digits = 2) => String(time).padStart(digits, "0");

    // Display the time on the screen
    const displayTime = () => {
        timerDisplay.innerHTML = `
            ${formatTime(countdownTime.hours)}:
            ${formatTime(countdownTime.minutes)}:
            ${formatTime(countdownTime.seconds)}.
            <span class="milliseconds">${formatTime(countdownTime.milliseconds, 3)}</span>`;
    };
    

    // Start the countdown timer
    const startCountdown = () => {
        if (timer) clearInterval(timer); // Clear existing timer if any

        timer = setInterval(() => {
            if (countdownTime.milliseconds > 0) {
                countdownTime.milliseconds -= 10;
            } else if (countdownTime.seconds > 0) {
                countdownTime.milliseconds = 990;
                countdownTime.seconds -= 1;
            } else if (countdownTime.minutes > 0) {
                countdownTime.milliseconds = 990;
                countdownTime.seconds = 59;
                countdownTime.minutes -= 1;
            } else if (countdownTime.hours > 0) {
                countdownTime.milliseconds = 990;
                countdownTime.seconds = 59;
                countdownTime.minutes = 59;
                countdownTime.hours -= 1;
            } else {
                clearInterval(timer);
                playAlarm();
                resetToInitial();
            }
            displayTime();
        }, 10);
    };

    // Play Tibetan bell sound
    const playAlarm = () => {
        const audio = new Audio("assets/tibetan-bell.mp3");
        audio.play();
    };

    // Reset timer to initial values
    const resetToInitial = () => {
        countdownTime = { ...initialTime };
        displayTime();
    };

    // Activate button event listener
    activateButton.addEventListener("click", () => {
        initialTime = {
            hours: Number(inputs.hours.value || 0),
            minutes: Number(inputs.minutes.value || 0),
            seconds: Number(inputs.seconds.value || 0),
            milliseconds: 0,
        };
        countdownTime = { ...initialTime };
        displayTime();
    });

    // Start timer on clicking anywhere in the body
    document.body.addEventListener("click", (e) => {
        if (
            e.target.id !== "activate" &&
            e.target.className !== "preset" &&
            e.target.className !== "reset-btn" &&
            !(e.target.tagName === "INPUT")
        ) {
            startCountdown();
        }
    });

    // Reset button event listener
    resetButton.addEventListener("click", () => {
        clearInterval(timer);
        initialTime = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
        countdownTime = { ...initialTime };
        displayTime();
        inputs.hours.value = "";
        inputs.minutes.value = "";
        inputs.seconds.value = "";
    });

    // Preset buttons event listeners
    presets.forEach((preset) => {
        preset.addEventListener("click", (e) => {
            const { hours, minutes, seconds } = e.target.dataset;
            initialTime = {
                hours: Number(hours),
                minutes: Number(minutes),
                seconds: Number(seconds),
                milliseconds: 0,
            };
            countdownTime = { ...initialTime };
            displayTime();
        });
    });

    // Initialize with default time
    displayTime();
});
