var KeyboardManager = {
    init: function() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    },
    
    handleKeyDown: function(event) {
        // Skip keyboard shortcuts if user is typing in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
            return;
        }
        
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
            case 'c':
            case 'C':
            case 'p':
            case 'P':
            case 'v':
            case 'V':
            case 'e':
            case 'E':
            case 't':
            case 'T':
            case 'h':
            case 'H':
            case '?':
                event.preventDefault();
                break;
        }
        
        // Handle keys
        switch(event.key) {
            case 'ArrowLeft':
                if (typeof NavigationManager !== 'undefined') {
                    NavigationManager.prevStep();
                }
                break;
            case 'ArrowRight':
                if (typeof NavigationManager !== 'undefined') {
                    NavigationManager.nextStep();
                }
                break;
            case 'ArrowUp':
                if (typeof NavigationManager !== 'undefined') {
                    NavigationManager.reset();
                }
                break;
            case 'ArrowDown':
                if (typeof NavigationManager !== 'undefined' && NavigationManager.solutionSteps.length > 0) {
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
            case 'c':
            case 'C':
                this.openCustomInput();
                break;
            case 'p':
            case 'P':
                this.togglePerformanceMode();
                break;
            case 'v':
            case 'V':
                this.toggleVisualization();
                break;
            case 'e':
            case 'E':
                this.toggleEducationMode();
                break;
            case 't':
            case 'T':
                this.toggleTheme();
                break;
            case 'h':
            case 'H':
            case '?':
                this.showHelpDialog();
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
    
    openCustomInput: function() {
        var customBtn = document.getElementById('customInput');
        if (customBtn) {
            customBtn.click();
        }
    },
    
    togglePerformanceMode: function() {
        var performanceCheckbox = document.getElementById('performanceMode');
        if (performanceCheckbox) {
            performanceCheckbox.checked = !performanceCheckbox.checked;
            performanceCheckbox.dispatchEvent(new Event('change'));
        }
    },
    
    toggleVisualization: function() {
        var realTimeGraphsCheckbox = document.getElementById('realTimeGraphs');
        if (realTimeGraphsCheckbox) {
            realTimeGraphsCheckbox.checked = !realTimeGraphsCheckbox.checked;
            realTimeGraphsCheckbox.dispatchEvent(new Event('change'));
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }
        }
    },
    
    toggleEducationMode: function() {
        var educationCheckbox = document.getElementById('educationMode');
        if (educationCheckbox) {
            educationCheckbox.checked = !educationCheckbox.checked;
            educationCheckbox.dispatchEvent(new Event('change'));
        }
    },
    
    toggleTheme: function() {
        var themeSelector = document.getElementById('themeSelector');
        if (themeSelector) {
            var currentTheme = themeSelector.value;
            var themes = ['light', 'dark', 'high-contrast'];
            var currentIndex = themes.indexOf(currentTheme);
            var nextIndex = (currentIndex + 1) % themes.length;
            themeSelector.value = themes[nextIndex];
            themeSelector.dispatchEvent(new Event('change'));
        }
    },
    
    showHelpDialog: function() {
        var helpDialog = document.getElementById('helpDialog');
        if (helpDialog) {
            helpDialog.style.display = 'block';
        } else {
            this.createHelpDialog();
        }
    },
    
    createHelpDialog: function() {
        var dialog = document.createElement('div');
        dialog.id = 'helpDialog';
        dialog.className = 'help-dialog';
        dialog.innerHTML = `
            <div class="help-content">
                <div class="help-header">
                    <h3>⌨️ Keyboard Shortcuts</h3>
                    <button class="close-help" onclick="this.parentElement.parentElement.parentElement.style.display='none'">×</button>
                </div>
                <div class="help-body">
                    <div class="shortcut-section">
                        <h4>🎮 Game Controls</h4>
                        <div class="shortcut-item">
                            <kbd>Space</kbd>
                            <span>Toggle search (Start/Stop)</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Enter</kbd>
                            <span>Start search</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Escape</kbd>
                            <span>Stop search</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>R</kbd>
                            <span>Randomize puzzle</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>S</kbd>
                            <span>Step search</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>C</kbd>
                            <span>Custom input</span>
                        </div>
                    </div>
                    <div class="shortcut-section">
                        <h4>🧭 Navigation</h4>
                        <div class="shortcut-item">
                            <kbd>←</kbd>
                            <span>Previous step</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>→</kbd>
                            <span>Next step</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>↑</kbd>
                            <span>Reset to first step</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>↓</kbd>
                            <span>Go to last step</span>
                        </div>
                    </div>
                    <div class="shortcut-section">
                        <h4>⚙️ Settings</h4>
                        <div class="shortcut-item">
                            <kbd>P</kbd>
                            <span>Toggle performance mode</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>V</kbd>
                            <span>Toggle visualization</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>E</kbd>
                            <span>Toggle education mode</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>T</kbd>
                            <span>Cycle theme</span>
                        </div>
                    </div>
                    <div class="shortcut-section">
                        <h4>❓ Help</h4>
                        <div class="shortcut-item">
                            <kbd>H</kbd> or <kbd>?</kbd>
                            <span>Show this help dialog</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        dialog.style.display = 'block';
    }
};

// Initialize keyboard manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    KeyboardManager.init();
});