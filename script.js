class Timer {
    constructor() {
        this.initElements();
        this.timeLeft = 0;
        this.timerId = null;
        this.init();
    }

    initElements() {
        this.display = document.getElementById('display');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.presetSelect = document.getElementById('presetSelect');
        this.applyPreset = document.getElementById('applyPreset');
        this.alarm = document.getElementById('alarm');
    }

    init() {
        // Bind methods to preserve context
        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
        this.reset = this.reset.bind(this);
        this.handlePreset = this.handlePreset.bind(this);

        // Add event listeners
        this.startBtn.addEventListener('click', this.start);
        this.pauseBtn.addEventListener('click', this.pause);
        this.resetBtn.addEventListener('click', this.reset);
        this.applyPreset.addEventListener('click', this.handlePreset);
    }

    handlePreset() {
        const selectedTime = parseInt(this.presetSelect.value);
        if (selectedTime) {
            this.timeLeft = selectedTime;
            this.updateInputsFromPreset(selectedTime);
            this.updateDisplay();
        }
    }

    updateInputsFromPreset(timeInMs) {
        const totalSeconds = Math.floor(timeInMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        this.minutesInput.value = minutes;
        this.secondsInput.value = seconds;
    }

    start() {
        if (this.timerId) return;
        
        if (!this.timeLeft) {
            const minutes = parseInt(this.minutesInput.value) || 0;
            const seconds = parseInt(this.secondsInput.value) || 0;
            this.timeLeft = (minutes * 60 + seconds) * 1000;
        }
        
        if (this.timeLeft <= 0) return;
        
        this.startBtn.disabled = true;
        this.timerId = setInterval(() => {
            this.timeLeft = Math.max(0, this.timeLeft - 10);
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.finish();
            }
        }, 10);
    }

    pause() {
        clearInterval(this.timerId);
        this.timerId = null;
        this.startBtn.disabled = false;
    }

    reset() {
        this.pause();
        this.timeLeft = 0;
        this.minutesInput.value = '';
        this.secondsInput.value = '';
        this.updateDisplay();
    }

    finish() {
        this.pause();
        this.playAlarm();
        this.timeLeft = 0;
        this.updateDisplay();
    }

    playAlarm() {
        try {
            this.alarm.currentTime = 0;
            this.alarm.play().catch(err => console.error('Audio play failed:', err));
        } catch (err) {
            console.error('Audio error:', err);
        }
    }

    updateDisplay() {
        const totalSeconds = Math.floor(this.timeLeft / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = this.timeLeft % 1000;
        
        this.display.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.timer = new Timer();
});