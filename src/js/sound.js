var SoundManager = {
    enabled: true,
    
    init: function() {
        this.sounds = {
            move: this.createSound(440, 0.1, 'square'),
            solve: this.createSound(660, 0.3, 'sine'),
            click: this.createSound(220, 0.05, 'sine'),
            error: this.createSound(150, 0.2, 'sawtooth')
        };
    },
    
    createSound: function(frequency, duration, type) {
        return function() {
            if (!SoundManager.enabled) return;
            
            try {
                var audioContext = new (window.AudioContext || window.webkitAudioContext)();
                var oscillator = audioContext.createOscillator();
                var gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                // Ses desteği yoksa sessizce devam et
            }
        };
    },
    
    play: function(soundName) {
        if (this.sounds && this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    },
    
    toggle: function() {
        this.enabled = !this.enabled;
    }
};

// Sayfa yüklendiğinde sesleri başlat
document.addEventListener('DOMContentLoaded', function() {
    SoundManager.init();
});