var CustomStateManager = {
    modalElement: null,
    
    init: function() {
        this.createModal();
        this.bindEvents();
    },
    
    createModal: function() {
        var modal = document.createElement('div');
        modal.id = 'customStateModal';
        modal.className = 'custom-state-modal';
        modal.style.display = 'none';
        
        modal.innerHTML = `
            <div class="modal-overlay" id="modalOverlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎯 Custom Puzzle State</h3>
                    <button class="close-btn" id="closeCustomState">×</button>
                </div>
                
                <div class="modal-body">
                    <div class="input-methods">
                        <div class="method-tabs">
                            <button class="tab-btn active" data-method="visual">Visual Editor</button>
                            <button class="tab-btn" data-method="text">Text Input</button>
                            <button class="tab-btn" data-method="presets">Presets</button>
                        </div>
                        
                        <!-- Visual Editor -->
                        <div class="input-method active" id="visualMethod">
                            <p class="method-description">Click tiles to edit values or drag to rearrange</p>
                            <div class="visual-editor">
                                <div class="visual-board" id="visualBoard">
                                    <div class="visual-tile" data-index="0">0</div>
                                    <div class="visual-tile" data-index="1">1</div>
                                    <div class="visual-tile" data-index="2">2</div>
                                    <div class="visual-tile" data-index="3">3</div>
                                    <div class="visual-tile" data-index="4">4</div>
                                    <div class="visual-tile" data-index="5">5</div>
                                    <div class="visual-tile" data-index="6">6</div>
                                    <div class="visual-tile" data-index="7">7</div>
                                    <div class="visual-tile" data-index="8">8</div>
                                </div>
                                <div class="editor-controls">
                                    <button id="shuffleBoard">🔀 Shuffle</button>
                                    <button id="resetBoard">🔄 Reset</button>
                                    <button id="clearBoard">🗑️ Clear</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Text Input -->
                        <div class="input-method" id="textMethod">
                            <p class="method-description">Enter 9 digits (0-8), where 0 represents the empty space</p>
                            <div class="text-input-container">
                                <input type="text" id="textInput" placeholder="012345678" maxlength="9" 
                                       pattern="[0-8]{9}" class="text-input">
                                <div class="input-validation" id="textValidation"></div>
                            </div>
                            <div class="format-examples">
                                <h4>Examples:</h4>
                                <div class="example-items">
                                    <button class="example-btn" data-state="012345678">Initial State</button>
                                    <button class="example-btn" data-state="123456780">Goal State</button>
                                    <button class="example-btn" data-state="102345678">Easy</button>
                                    <button class="example-btn" data-state="120345678">Medium</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Presets -->
                        <div class="input-method" id="presetsMethod">
                            <p class="method-description">Choose from predefined puzzle configurations</p>
                            <div class="presets-grid">
                                <div class="preset-item" data-state="102345678" data-difficulty="easy">
                                    <div class="preset-board">
                                        <span>1</span><span class="empty"></span><span>2</span>
                                        <span>3</span><span>4</span><span>5</span>
                                        <span>6</span><span>7</span><span>8</span>
                                    </div>
                                    <div class="preset-info">
                                        <strong>Easy</strong>
                                        <small>2 moves to solve</small>
                                    </div>
                                </div>
                                
                                <div class="preset-item" data-state="120345678" data-difficulty="medium">
                                    <div class="preset-board">
                                        <span>1</span><span>2</span><span class="empty"></span>
                                        <span>3</span><span>4</span><span>5</span>
                                        <span>6</span><span>7</span><span>8</span>
                                    </div>
                                    <div class="preset-info">
                                        <strong>Medium</strong>
                                        <small>4 moves to solve</small>
                                    </div>
                                </div>
                                
                                <div class="preset-item" data-state="123405678" data-difficulty="medium">
                                    <div class="preset-board">
                                        <span>1</span><span>2</span><span>3</span>
                                        <span>4</span><span class="empty"></span><span>5</span>
                                        <span>6</span><span>7</span><span>8</span>
                                    </div>
                                    <div class="preset-info">
                                        <strong>Medium</strong>
                                        <small>6 moves to solve</small>
                                    </div>
                                </div>
                                
                                <div class="preset-item" data-state="123450678" data-difficulty="hard">
                                    <div class="preset-board">
                                        <span>1</span><span>2</span><span>3</span>
                                        <span>4</span><span>5</span><span class="empty"></span>
                                        <span>6</span><span>7</span><span>8</span>
                                    </div>
                                    <div class="preset-info">
                                        <strong>Hard</strong>
                                        <small>8 moves to solve</small>
                                    </div>
                                </div>
                                
                                <div class="preset-item" data-state="162345078" data-difficulty="hard">
                                    <div class="preset-board">
                                        <span>1</span><span>6</span><span>2</span>
                                        <span>3</span><span>4</span><span>5</span>
                                        <span class="empty"></span><span>7</span><span>8</span>
                                    </div>
                                    <div class="preset-info">
                                        <strong>Hard</strong>
                                        <small>12 moves to solve</small>
                                    </div>
                                </div>
                                
                                <div class="preset-item" data-state="281043765" data-difficulty="expert">
                                    <div class="preset-board">
                                        <span>2</span><span>8</span><span>1</span>
                                        <span class="empty"></span><span>4</span><span>3</span>
                                        <span>7</span><span>6</span><span>5</span>
                                    </div>
                                    <div class="preset-info">
                                        <strong>Expert</strong>
                                        <small>20+ moves to solve</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="state-validation">
                        <div class="validation-status" id="validationStatus">
                            <span class="status-icon">✓</span>
                            <span class="status-text">Valid puzzle state</span>
                        </div>
                        <div class="state-info" id="stateInfo">
                            <span>Current: <code id="currentStateDisplay">012345678</code></span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-secondary" id="cancelCustomState">Cancel</button>
                    <button class="btn-primary" id="applyCustomState">Apply State</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.modalElement = modal;
    },
    
    bindEvents: function() {
        var modal = this.modalElement;
        
        // Tab switching
        var tabBtns = modal.querySelectorAll('.tab-btn');
        tabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var method = this.dataset.method;
                CustomStateManager.switchMethod(method);
            });
        });
        
        // Close modal
        var closeBtn = modal.querySelector('#closeCustomState');
        var cancelBtn = modal.querySelector('#cancelCustomState');
        var overlay = modal.querySelector('#modalOverlay');
        
        [closeBtn, cancelBtn, overlay].forEach(function(element) {
            element.addEventListener('click', function() {
                CustomStateManager.hide();
            });
        });
        
        // Apply state
        var applyBtn = modal.querySelector('#applyCustomState');
        applyBtn.addEventListener('click', function() {
            CustomStateManager.applyState();
        });
        
        // Visual editor events
        this.bindVisualEditor();
        
        // Text input events
        this.bindTextInput();
        
        // Presets events
        this.bindPresets();
    },
    
    bindVisualEditor: function() {
        var modal = this.modalElement;
        var visualBoard = modal.querySelector('#visualBoard');
        var tiles = visualBoard.querySelectorAll('.visual-tile');
        
        // Tile click to edit
        tiles.forEach(function(tile) {
            tile.addEventListener('click', function() {
                CustomStateManager.editTile(this);
            });
        });
        
        // Control buttons
        modal.querySelector('#shuffleBoard').addEventListener('click', function() {
            CustomStateManager.shuffleVisualBoard();
        });
        
        modal.querySelector('#resetBoard').addEventListener('click', function() {
            CustomStateManager.resetVisualBoard();
        });
        
        modal.querySelector('#clearBoard').addEventListener('click', function() {
            CustomStateManager.clearVisualBoard();
        });
    },
    
    bindTextInput: function() {
        var modal = this.modalElement;
        var textInput = modal.querySelector('#textInput');
        var examples = modal.querySelectorAll('.example-btn');
        
        textInput.addEventListener('input', function() {
            CustomStateManager.validateTextInput();
            CustomStateManager.updateStateDisplay();
        });
        
        examples.forEach(function(btn) {
            btn.addEventListener('click', function() {
                textInput.value = this.dataset.state;
                CustomStateManager.validateTextInput();
                CustomStateManager.updateStateDisplay();
            });
        });
    },
    
    bindPresets: function() {
        var modal = this.modalElement;
        var presets = modal.querySelectorAll('.preset-item');
        
        presets.forEach(function(preset) {
            preset.addEventListener('click', function() {
                // Remove previous selection
                presets.forEach(function(p) { p.classList.remove('selected'); });
                // Select this preset
                this.classList.add('selected');
                
                var state = this.dataset.state;
                CustomStateManager.setCurrentState(state);
                CustomStateManager.updateStateDisplay();
            });
        });
    },
    
    switchMethod: function(method) {
        var modal = this.modalElement;
        
        // Update tabs
        modal.querySelectorAll('.tab-btn').forEach(function(btn) {
            btn.classList.remove('active');
        });
        modal.querySelector(`[data-method="${method}"]`).classList.add('active');
        
        // Update content
        modal.querySelectorAll('.input-method').forEach(function(content) {
            content.classList.remove('active');
        });
        modal.querySelector(`#${method}Method`).classList.add('active');
        
        // Update state display based on current method
        this.updateStateDisplay();
    },
    
    editTile: function(tileElement) {
        var currentValue = tileElement.textContent;
        var newValue = prompt('Enter tile value (0-8):', currentValue);
        
        if (newValue !== null && /^[0-8]$/.test(newValue)) {
            tileElement.textContent = newValue;
            if (newValue === '0') {
                tileElement.classList.add('empty');
            } else {
                tileElement.classList.remove('empty');
            }
            this.updateStateFromVisual();
        }
    },
    
    shuffleVisualBoard: function() {
        var modal = this.modalElement;
        var tiles = modal.querySelectorAll('.visual-tile');
        var values = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
        
        // Shuffle array
        for (var i = values.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = values[i];
            values[i] = values[j];
            values[j] = temp;
        }
        
        tiles.forEach(function(tile, index) {
            tile.textContent = values[index];
            if (values[index] === '0') {
                tile.classList.add('empty');
            } else {
                tile.classList.remove('empty');
            }
        });
        
        this.updateStateFromVisual();
    },
    
    resetVisualBoard: function() {
        var modal = this.modalElement;
        var tiles = modal.querySelectorAll('.visual-tile');
        
        tiles.forEach(function(tile, index) {
            tile.textContent = index.toString();
            if (index === 0) {
                tile.classList.add('empty');
            } else {
                tile.classList.remove('empty');
            }
        });
        
        this.updateStateFromVisual();
    },
    
    clearVisualBoard: function() {
        var modal = this.modalElement;
        var tiles = modal.querySelectorAll('.visual-tile');
        
        tiles.forEach(function(tile) {
            tile.textContent = '0';
            tile.classList.add('empty');
        });
        
        this.updateStateFromVisual();
    },
    
    updateStateFromVisual: function() {
        var modal = this.modalElement;
        var tiles = modal.querySelectorAll('.visual-tile');
        var state = '';
        
        tiles.forEach(function(tile) {
            state += tile.textContent;
        });
        
        this.currentState = state;
        this.validateCurrentState();
        this.updateStateDisplay();
    },
    
    validateTextInput: function() {
        var modal = this.modalElement;
        var textInput = modal.querySelector('#textInput');
        var validation = modal.querySelector('#textValidation');
        var value = textInput.value;
        
        var isValid = /^[0-8]{9}$/.test(value);
        var hasAllDigits = isValid && this.hasAllDigits(value);
        
        if (!isValid) {
            validation.innerHTML = '<span class="error">⚠️ Must be exactly 9 digits (0-8)</span>';
            textInput.classList.add('invalid');
        } else if (!hasAllDigits) {
            validation.innerHTML = '<span class="error">⚠️ Must contain each digit 0-8 exactly once</span>';
            textInput.classList.add('invalid');
        } else {
            validation.innerHTML = '<span class="success">✓ Valid puzzle state</span>';
            textInput.classList.remove('invalid');
            this.currentState = value;
        }
    },
    
    hasAllDigits: function(state) {
        var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
        return digits.every(function(digit) {
            return state.includes(digit) && state.indexOf(digit) === state.lastIndexOf(digit);
        });
    },
    
    validateCurrentState: function() {
        var modal = this.modalElement;
        var statusElement = modal.querySelector('#validationStatus');
        var isValid = this.currentState && /^[0-8]{9}$/.test(this.currentState) && this.hasAllDigits(this.currentState);
        
        if (isValid) {
            // Check if the state is solvable
            var testGame = new Game();
            var isSolvable = testGame.isValidState(this.currentState) && testGame.isSolvable(this.currentState);
            
            if (isSolvable) {
                statusElement.innerHTML = '<span class="status-icon success">✓</span><span class="status-text">Valid and solvable puzzle state</span>';
                statusElement.className = 'validation-status valid';
            } else {
                statusElement.innerHTML = '<span class="status-icon warning">⚠️</span><span class="status-text">Valid but unsolvable puzzle state</span>';
                statusElement.className = 'validation-status warning';
                isValid = false; // Treat unsolvable as invalid
            }
        } else {
            statusElement.innerHTML = '<span class="status-icon error">⚠️</span><span class="status-text">Invalid puzzle state</span>';
            statusElement.className = 'validation-status invalid';
        }
        
        return isValid;
    },
    
    updateStateDisplay: function() {
        var modal = this.modalElement;
        var display = modal.querySelector('#currentStateDisplay');
        if (this.currentState) {
            display.textContent = this.currentState;
        }
    },
    
    setCurrentState: function(state) {
        this.currentState = state;
        this.validateCurrentState();
        
        // Update visual board if on visual tab
        var modal = this.modalElement;
        var visualMethod = modal.querySelector('#visualMethod');
        if (visualMethod.classList.contains('active')) {
            this.updateVisualFromState(state);
        }
        
        // Update text input if on text tab
        var textMethod = modal.querySelector('#textMethod');
        if (textMethod.classList.contains('active')) {
            modal.querySelector('#textInput').value = state;
            this.validateTextInput();
        }
    },
    
    updateVisualFromState: function(state) {
        var modal = this.modalElement;
        var tiles = modal.querySelectorAll('.visual-tile');
        
        tiles.forEach(function(tile, index) {
            var value = state[index];
            tile.textContent = value;
            if (value === '0') {
                tile.classList.add('empty');
            } else {
                tile.classList.remove('empty');
            }
        });
    },
    
    show: function() {
        this.currentState = game.state || '012345678';
        this.modalElement.style.display = 'flex';
        this.setCurrentState(this.currentState);
        
        // Focus on appropriate input based on active method
        var activeMethod = this.modalElement.querySelector('.input-method.active');
        if (activeMethod.id === 'textMethod') {
            var textInput = activeMethod.querySelector('#textInput');
            setTimeout(function() { textInput.focus(); }, 100);
        }
    },
    
    hide: function() {
        this.modalElement.style.display = 'none';
    },
    
    applyState: function() {
        if (this.validateCurrentState()) {
            try {
                // Use the new validation method from Game class
                var testGame = new Game();
                if (testGame.isValidState(this.currentState) && testGame.isSolvable(this.currentState)) {
                    game.state = this.currentState;
                    Board.draw(game.state);
                    
                    // Clear search results
                    var searchResultDiv = document.getElementById('searchResult');
                    if (searchResultDiv) {
                        searchResultDiv.innerHTML = '';
                    }
                    
                    // Reset navigation
                    if (typeof NavigationManager !== 'undefined') {
                        NavigationManager.init([]);
                    }
                    
                    // Play sound
                    if (typeof SoundManager !== 'undefined') {
                        SoundManager.play('click');
                    }
                    
                    this.hide();
                } else {
                    alert('This puzzle state is not solvable. Please choose a different configuration.');
                }
            } catch (error) {
                console.error('Error validating state:', error.message);
                alert('Error validating puzzle state: ' + error.message);
            }
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    CustomStateManager.init();
});