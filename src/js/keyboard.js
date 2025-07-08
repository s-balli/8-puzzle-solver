var KeyboardManager = {
    init: function() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    },
    
    handleKeyDown: function(event) {
        // Prevent default only for keys we handle
        switch(event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
            case ' ':
            case 'Enter':
            case 'Escape':
            case 'r':
            case 'R':
            case 's':
            case 'S':
            case 't':
            case 'T':
                event.preventDefault();
                break;
        }
        
        // Handle keys
        switch(event.key) {
            case 'ArrowLeft':
                NavigationManager.prevStep();
                break;
            case 'ArrowRight':
                NavigationManager.nextStep();
                break;
            case 'ArrowUp':
                NavigationManager.reset();
                break;
            case 'ArrowDown':
                if (NavigationManager.solutionSteps.length > 0) {
                    NavigationManager.goToStep(NavigationManager.solutionSteps.length - 1);
                }
                break;
            case ' ':
                this.toggleSearch();
                break;
            case 'Enter':
                this.startSearch();
                break;
            case 'Escape':
                this.stopSearch();
                break;
            case 'r':
            case 'R':
                this.randomizeBoard();
                break;
            case 's':
            case 'S':
                this.stepSearch();
                break;
            case 't':
            case 'T':
                this.toggleTheme();
                break;
        }
    },
    
    handleKeyUp: function(event) {
        // Handle key releases if needed
    },
    
    toggleSearch: function() {
        var searchBtn = document.getElementById('search');
        var stopBtn = document.getElementById('searchStop');
        
        if (searchBtn && searchBtn.style.display !== 'none') {
            searchBtn.click();
        } else if (stopBtn && stopBtn.style.display !== 'none') {
            stopBtn.click();
        }
    },
    
    startSearch: function() {
        var searchBtn = document.getElementById('search');
        if (searchBtn && searchBtn.style.display !== 'none') {
            searchBtn.click();
        }
    },
    
    stopSearch: function() {
        var stopBtn = document.getElementById('searchStop');
        if (stopBtn && stopBtn.style.display !== 'none') {
            stopBtn.click();
        }
    },
    
    randomizeBoard: function() {
        var randomBtn = document.getElementById('randomize');
        if (randomBtn) {
            randomBtn.click();
        }
    },
    
    stepSearch: function() {
        var stepBtn = document.getElementById('searchStep');
        if (stepBtn) {
            stepBtn.click();
        }
    },
    
    toggleTheme: function() {
        var themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.click();
        }
    }
};

// Initialize keyboard manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    KeyboardManager.init();
});