var AccessibilityManager = {
    
    init: function() {
        this.setupTextSizeControl();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
    },
    
    setupTextSizeControl: function() {
        var textSizeSelect = document.getElementById('textSize');
        if (textSizeSelect) {
            textSizeSelect.addEventListener('change', function() {
                document.documentElement.setAttribute('data-text-size', textSizeSelect.value);
                
                // Store preference
                localStorage.setItem('8puzzle-text-size', textSizeSelect.value);
                
                // Announce change to screen readers
                this.announceToScreenReader('Text size changed to ' + textSizeSelect.value);
            }.bind(this));
            
            // Load saved preference
            var savedSize = localStorage.getItem('8puzzle-text-size');
            if (savedSize) {
                textSizeSelect.value = savedSize;
                document.documentElement.setAttribute('data-text-size', savedSize);
            }
        }
    },
    
    setupKeyboardNavigation: function() {
        document.addEventListener('keydown', function(event) {
            // Skip if user is typing in input fields
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
                return;
            }
            
            switch(event.key) {
                case 'Tab':
                    // Enhanced tab navigation
                    this.handleTabNavigation(event);
                    break;
                case 'Enter':
                    // Start search
                    if (event.target.id === 'search' || (!event.target.id && !event.shiftKey)) {
                        event.preventDefault();
                        var searchBtn = document.getElementById('search');
                        if (searchBtn && !searchBtn.disabled) {
                            searchBtn.click();
                        }
                    }
                    break;
                case 'Escape':
                    // Stop search or close panels
                    event.preventDefault();
                    var stopBtn = document.getElementById('searchStop');
                    if (stopBtn && stopBtn.style.display !== 'none') {
                        stopBtn.click();
                    }
                    this.closePanels();
                    break;
                case ' ':
                    // Space bar actions
                    if (event.target.classList.contains('board-item')) {
                        event.preventDefault();
                        // Handle tile interaction
                        this.handleTileInteraction(event.target);
                    }
                    break;
                case 'ArrowLeft':
                    // Previous step
                    event.preventDefault();
                    var prevBtn = document.getElementById('prevStep');
                    if (prevBtn && !prevBtn.disabled) {
                        prevBtn.click();
                    }
                    break;
                case 'ArrowRight':
                    // Next step
                    event.preventDefault();
                    var nextBtn = document.getElementById('nextStep');
                    if (nextBtn && !nextBtn.disabled) {
                        nextBtn.click();
                    }
                    break;
                case 'ArrowUp':
                    // Reset steps
                    event.preventDefault();
                    var resetBtn = document.getElementById('resetSteps');
                    if (resetBtn && !resetBtn.disabled) {
                        resetBtn.click();
                    }
                    break;
                case 'ArrowDown':
                    // Go to end (if solution exists)
                    event.preventDefault();
                    this.goToLastStep();
                    break;
                case 'r':
                case 'R':
                    // Randomize
                    event.preventDefault();
                    var randomBtn = document.getElementById('randomize');
                    if (randomBtn) {
                        randomBtn.click();
                    }
                    break;
                case 's':
                case 'S':
                    // Step search
                    event.preventDefault();
                    var stepBtn = document.getElementById('searchStep');
                    if (stepBtn) {
                        stepBtn.click();
                    }
                    break;
            }
        }.bind(this));
    },
    
    handleTabNavigation: function(event) {
        var focusableElements = this.getFocusableElements();
        var currentIndex = focusableElements.indexOf(event.target);
        
        if (event.shiftKey) {
            // Shift+Tab (backwards)
            if (currentIndex <= 0) {
                event.preventDefault();
                focusableElements[focusableElements.length - 1].focus();
            }
        } else {
            // Tab (forwards)
            if (currentIndex >= focusableElements.length - 1) {
                event.preventDefault();
                focusableElements[0].focus();
            }
        }
    },
    
    getFocusableElements: function() {
        var selector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"]):not([disabled])';
        return Array.from(document.querySelectorAll(selector))
            .filter(function(element) {
                return element.offsetParent !== null; // Only visible elements
            });
    },
    
    handleTileInteraction: function(tile) {
        // Announce tile information
        var tileNumber = tile.textContent;
        var position = this.getTilePosition(tile);
        this.announceToScreenReader('Tile ' + tileNumber + ' at position ' + position);
    },
    
    getTilePosition: function(tile) {
        var rect = tile.getBoundingClientRect();
        var boardRect = document.getElementById('board').getBoundingClientRect();
        var relativeX = rect.left - boardRect.left;
        var relativeY = rect.top - boardRect.top;
        
        var col = Math.floor(relativeX / (boardRect.width / 3)) + 1;
        var row = Math.floor(relativeY / (boardRect.height / 3)) + 1;
        
        return 'row ' + row + ', column ' + col;
    },
    
    goToLastStep: function() {
        var nextBtn = document.getElementById('nextStep');
        if (nextBtn && !nextBtn.disabled) {
            // Keep clicking next until disabled
            var clickNext = function() {
                if (!nextBtn.disabled) {
                    nextBtn.click();
                    setTimeout(clickNext, 100);
                }
            };
            clickNext();
        }
    },
    
    closePanels: function() {
        // Close any open panels
        var panels = ['performancePanel', 'graphPanel', 'educationPanel'];
        panels.forEach(function(panelId) {
            var panel = document.getElementById(panelId);
            if (panel && panel.style.display !== 'none') {
                panel.style.display = 'none';
            }
        });
    },
    
    setupScreenReaderSupport: function() {
        // Update toggle switches for screen readers
        var toggles = document.querySelectorAll('.toggle-switch input[type=\"checkbox\"]');
        toggles.forEach(function(toggle) {
            toggle.addEventListener('change', function() {
                var slider = toggle.nextElementSibling;
                if (slider) {
                    slider.setAttribute('aria-checked', toggle.checked);
                }
                
                // Announce state change
                var label = toggle.closest('label').querySelector('span').textContent;
                this.announceToScreenReader(label + (toggle.checked ? ' enabled' : ' disabled'));
            }.bind(this));
        }.bind(this));
        
        // Monitor search progress for screen reader announcements
        this.setupSearchProgressAnnouncements();
    },
    
    setupSearchProgressAnnouncements: function() {
        // Monitor search result changes
        var searchResult = document.getElementById('searchResult');
        if (searchResult) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.target.textContent.trim()) {
                        // Announce search results
                        var text = mutation.target.textContent.trim();
                        if (text.includes('Solution found') || text.includes('No solution') || text.includes('Search stopped')) {
                            this.announceToScreenReader(text);
                        }
                    }
                }.bind(this));
            }.bind(this));
            
            observer.observe(searchResult, { childList: true, subtree: true });
        }
    },
    
    setupFocusManagement: function() {
        // Manage focus for dynamic content
        var searchBtn = document.getElementById('search');
        var stopBtn = document.getElementById('searchStop');
        
        if (searchBtn && stopBtn) {
            searchBtn.addEventListener('click', function() {
                // When search starts, focus moves to stop button
                setTimeout(function() {
                    if (stopBtn.style.display !== 'none') {
                        stopBtn.focus();
                    }
                }, 100);
            });
            
            stopBtn.addEventListener('click', function() {
                // When search stops, focus returns to search button
                setTimeout(function() {
                    if (searchBtn.style.display !== 'none') {
                        searchBtn.focus();
                    }
                }, 100);
            });
        }
    },
    
    announceToScreenReader: function(message) {
        // Create or update live region for screen reader announcements
        var liveRegion = document.getElementById('sr-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'sr-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
        
        // Clear and set new message
        liveRegion.textContent = '';
        setTimeout(function() {
            liveRegion.textContent = message;
        }, 100);
    },
    
    // Announce board state changes
    announceBoardState: function(state) {
        var description = this.describeBoardState(state);
        this.announceToScreenReader('Board state: ' + description);
    },
    
    describeBoardState: function(state) {
        var tiles = state.split('');
        var description = '';
        
        for (var i = 0; i < 9; i++) {
            var row = Math.floor(i / 3) + 1;
            var col = (i % 3) + 1;
            var tile = tiles[i];
            
            if (tile === '0') {
                description += 'Empty space at row ' + row + ', column ' + col + '. ';
            } else if (i === 0) {
                description += 'Tile ' + tile + ' at row ' + row + ', column ' + col + '. ';
            }
        }
        
        return description;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    AccessibilityManager.init();
});