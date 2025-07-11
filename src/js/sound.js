var SoundManager = {
    enabled: true,
    audioContext: null,
    lastPlayTime: {},
    throttleDelay: 50, // Minimum delay between same sounds (ms)
    
    init: function() {
        // Initialize AudioContext once
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('AudioContext not supported');
            this.audioContext = null;
            return;
        }
        
        this.sounds = {
            move: this.createSound(440, 0.1, 'square'),
            solve: this.createSound(660, 0.3, 'sine'),
            click: this.createSound(220, 0.05, 'sine'),
            error: this.createSound(150, 0.2, 'sawtooth')
        };
    },
    
    createSound: function(frequency, duration, type) {
        var self = this;
        return function() {
            if (!SoundManager.enabled || !self.audioContext) return;
            
            try {
                // Check if AudioContext is in suspended state (user interaction required)
                if (self.audioContext.state === 'suspended') {
                    self.audioContext.resume().catch(function() {
                        // Silently handle resume errors
                    });
                }
                
                var oscillator = self.audioContext.createOscillator();
                var gainNode = self.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(self.audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(0.1, self.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, self.audioContext.currentTime + duration);
                
                oscillator.start(self.audioContext.currentTime);
                oscillator.stop(self.audioContext.currentTime + duration);
            } catch (e) {
                // Ses desteği yoksa sessizce devam et
                console.warn('Audio playback error:', e.message);
            }
        };
    },
    
    play: function(soundName) {
        if (!this.sounds || !this.sounds[soundName] || !this.enabled) return;
        
        // Throttle sounds to prevent audio context errors during rapid playback
        var currentTime = Date.now();
        if (this.lastPlayTime[soundName] && 
            currentTime - this.lastPlayTime[soundName] < this.throttleDelay) {
            return; // Skip if played too recently
        }
        
        this.lastPlayTime[soundName] = currentTime;
        this.sounds[soundName]();
    },
    
    toggle: function() {
        this.enabled = !this.enabled;
    },
    
    cleanup: function() {
        // Clean up audio context resources
        if (this.audioContext && this.audioContext.state !== 'closed') {
            try {
                this.audioContext.close();
                this.audioContext = null;
            } catch (e) {
                console.warn('Error closing audio context:', e.message);
            }
        }
    }
};

// Sayfa yüklendiğinde sesleri başlat
document.addEventListener('DOMContentLoaded', function() {
    SoundManager.init();
});

// Sayfa kapatılırken cleanup yap
window.addEventListener('beforeunload', function() {
    SoundManager.cleanup();
});