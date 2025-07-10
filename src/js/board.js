var Board = {};


Board.elements = {
    '1': document.getElementById('board-item-1'),
    '2': document.getElementById('board-item-2'),
    '3': document.getElementById('board-item-3'),
    '4': document.getElementById('board-item-4'),
    '5': document.getElementById('board-item-5'),
    '6': document.getElementById('board-item-6'),
    '7': document.getElementById('board-item-7'),
    '8': document.getElementById('board-item-8')
};


Board.draw = function(state) {
    state.split('').forEach(function(item, index) {
        if (item == '0') return;

        var element = Board.elements[item];
        var row = Math.floor(index / 3);
        var column = index % 3;

        // Use transform for hardware acceleration instead of top/left
        var translateX = column * element.offsetWidth;
        var translateY = row * element.offsetHeight;
        element.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px)';
    });
};

// Optimized draw function for smooth animations
Board.drawAnimated = function(state, options, callback) {
    // Handle function overloading: drawAnimated(state, callback)
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }
    options = options || {};
    
    var elementsToUpdate = [];
    
    state.split('').forEach(function(item, index) {
        if (item == '0') return;

        var element = Board.elements[item];
        var row = Math.floor(index / 3);
        var column = index % 3;
        var translateX = column * element.offsetWidth;
        var translateY = row * element.offsetHeight;
        
        elementsToUpdate.push({
            element: element,
            targetX: translateX,
            targetY: translateY
        });
    });
    
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(function() {
        elementsToUpdate.forEach(function(update) {
            update.element.style.transform = 'translate(' + update.targetX + 'px, ' + update.targetY + 'px)';
        });
        
        // Add highlighting if requested
        if (options.highlight && window.isReplaying) {
            Board.highlightCurrentNode(state);
        }
        
        if (callback) callback();
    });
};

Board.replayTimeout = null;
Board.replayAnimationTimeout = null;
Board.replayAnimationFrame = null;
Board.isPaused = false;
Board.pendingMoves = [];
Board.currentAnimationSpeed = 500;
Board.lastFrameTime = 0;
Board.isAnimating = false;
Board.previousState = null;
Board.currentHighlightedTreeNode = null;

Board.replay = function(moves) {
    Board.clearReplay();

    var initialState = moves.shift();
    Board.draw(initialState);
    Board.previousState = initialState; // Initialize previous state for highlighting
    Board.updateTreeNodeColor(initialState, null, true); // Highlight initial tree node
    window.isReplaying = true;
    Board.isPaused = false;
    Board.pendingMoves = moves.slice(); // Store remaining moves
    
    var btn = document.getElementById('replayButton'); 
    btn && (btn.textContent = window.t ? t('solution.stopReplay') : 'Stop replaying');
    
    var pauseBtn = document.getElementById('pauseReplayButton');
    if (pauseBtn) {
        pauseBtn.style.display = 'block';
        pauseBtn.textContent = window.t ? t('solution.pause') : 'Pause';
    }

    Board.currentAnimationSpeed = 500; // Fixed animation speed
    
    // Set CSS animation duration
    Board.setAnimationDuration(Board.currentAnimationSpeed);
    
    var animate = function(timestamp) {
        if (Board.isPaused) return;
        
        // Initialize timestamp on first frame
        if (!Board.lastFrameTime) {
            Board.lastFrameTime = timestamp;
        }
        
        // Check if enough time has passed for next move
        if (timestamp - Board.lastFrameTime >= Board.currentAnimationSpeed) {
            var move = Board.pendingMoves.shift();
            if (!move) return Board.clearReplay();
            
            Board.draw(move); // Draw the board
            Board.updateTreeNodeColor(move, null, true); // Highlight tree node in yellow
            SoundManager.play('move');
            
            Board.lastFrameTime = timestamp;
        }
        
        // Continue animation if there are more moves
        if (Board.pendingMoves.length > 0) {
            Board.replayAnimationFrame = requestAnimationFrame(animate);
        } else {
            Board.clearReplay();
        }
    };

    // Initialize with a slight delay, then start requestAnimationFrame loop
    Board.replayTimeout = setTimeout(function() {
        Board.lastFrameTime = 0;
        Board.isAnimating = true;
        Board.replayAnimationFrame = requestAnimationFrame(animate);
    }, 100); // Small initial delay
};


Board.clearReplay = function() {
    clearTimeout(Board.replayTimeout);
    clearTimeout(Board.replayAnimationTimeout);
    if (Board.replayAnimationFrame) {
        cancelAnimationFrame(Board.replayAnimationFrame);
        Board.replayAnimationFrame = null;
    }
    var boardDiv = document.getElementById('board');
    if (boardDiv) boardDiv.classList.remove('animation');
    window.isReplaying = false;
    Board.isPaused = false;
    Board.pendingMoves = [];
    Board.isAnimating = false;
    Board.lastFrameTime = 0;
    
    // Clear all node highlights
    Board.clearAllHighlights();
    Board.clearTreeHighlight();
    
    var btn = document.getElementById('replayButton'); 
    btn && (btn.textContent = window.t ? t('solution.replay') : 'Replay solution');
    
    var pauseBtn = document.getElementById('pauseReplayButton');
    if (pauseBtn) {
        pauseBtn.style.display = 'none';
    }
};

Board.pauseReplay = function() {
    if (!window.isReplaying) return;
    
    Board.isPaused = !Board.isPaused;
    var pauseBtn = document.getElementById('pauseReplayButton');
    
    if (Board.isPaused) {
        // Paused state
        if (Board.replayAnimationFrame) {
            cancelAnimationFrame(Board.replayAnimationFrame);
            Board.replayAnimationFrame = null;
        }
        Board.isAnimating = false;
        if (pauseBtn) {
            pauseBtn.textContent = window.t ? t('solution.resume') : 'Resume';
        }
    } else {
        // Resume state
        if (pauseBtn) {
            pauseBtn.textContent = window.t ? t('solution.pause') : 'Pause';
        }
        
        // Continue animation with remaining moves using requestAnimationFrame
        if (Board.pendingMoves.length > 0) {
            Board.lastFrameTime = 0; // Reset timing
            Board.isAnimating = true;
            
            var animate = function(timestamp) {
                if (Board.isPaused) return;
                
                if (!Board.lastFrameTime) {
                    Board.lastFrameTime = timestamp;
                }
                
                if (timestamp - Board.lastFrameTime >= Board.currentAnimationSpeed) {
                    var move = Board.pendingMoves.shift();
                    if (!move) return Board.clearReplay();
                    
                    Board.draw(move); // Draw the board
                    Board.updateTreeNodeColor(move, null, true); // Highlight tree node in yellow
                    SoundManager.play('move');
                    
                    Board.lastFrameTime = timestamp;
                }
                
                if (Board.pendingMoves.length > 0) {
                    Board.replayAnimationFrame = requestAnimationFrame(animate);
                } else {
                    Board.clearReplay();
                }
            };
            
            Board.replayAnimationFrame = requestAnimationFrame(animate);
        }
    }
};


Board.setAnimationDuration = function(duration) {
    var board = document.getElementById('board');
    if (board) {
        board.style.setProperty('--animation-duration', duration + 'ms');
    }
};

Board.clearAllHighlights = function() {
    Board.previousState = null;
};

// Tree node highlighting functions for replay
Board.highlightTreeNode = function(nodeState) {
    if (!window.network) return;
    
    try {
        // Clear previous tree node highlights
        Board.clearTreeHighlight();
        
        // Update the node color to yellow in the network
        var updates = {
            id: nodeState,
            color: {
                background: '#FFD700',
                border: '#FFA500',
                highlight: {
                    background: '#FFED4E',
                    border: '#FF8C00'
                }
            },
            borderWidth: 3,
            font: {
                color: '#000',
                size: 14,
                face: 'bold'
            }
        };
        
        window.network.updateCluster(nodeState, updates);
        
        // Select and focus the node
        window.network.selectNodes([nodeState]);
        window.network.focus(nodeState, { scale: 0.75, animation: true });
        
        // Store current highlighted node
        Board.currentHighlightedTreeNode = nodeState;
        
    } catch (error) {
        console.warn('Could not highlight tree node:', error);
        // Fallback to just selection
        window.network.selectNodes([nodeState]);
        window.network.focus(nodeState, { scale: 0.75, animation: true });
    }
};

Board.clearTreeHighlight = function() {
    if (!window.network || !Board.currentHighlightedTreeNode) return;
    
    try {
        // Reset the previously highlighted node to default color
        var resetUpdate = {
            id: Board.currentHighlightedTreeNode,
            color: {
                background: '#ffffff',
                border: '#848484'
            },
            borderWidth: 1,
            font: {
                color: '#333',
                size: 12,
                face: 'normal'
            }
        };
        
        window.network.updateCluster(Board.currentHighlightedTreeNode, resetUpdate);
        Board.currentHighlightedTreeNode = null;
        
    } catch (error) {
        console.warn('Could not clear tree highlight:', error);
        Board.currentHighlightedTreeNode = null;
    }
};

// Alternative method using vis.js data update
Board.updateTreeNodeColor = function(nodeState, color, isHighlighted) {
    if (!window.network) return;
    
    var nodeColor = isHighlighted ? {
        background: '#FFD700',
        border: '#FFA500',
        highlight: {
            background: '#FFED4E',
            border: '#FF8C00'
        }
    } : {
        background: color || '#ffffff',
        border: '#848484'
    };
    
    var nodeUpdate = {
        id: nodeState,
        color: nodeColor,
        borderWidth: isHighlighted ? 3 : 1,
        font: isHighlighted ? {
            color: '#000',
            size: 14,
            face: 'bold'
        } : {
            color: '#333',
            size: 12,
            face: 'normal'
        }
    };
    
    try {
        // Get current nodes data
        var nodes = window.network.body.data.nodes;
        nodes.update(nodeUpdate);
        
        if (isHighlighted) {
            window.network.selectNodes([nodeState]);
            window.network.focus(nodeState, { scale: 0.75, animation: true });
            Board.currentHighlightedTreeNode = nodeState;
        }
        
    } catch (error) {
        console.warn('Could not update tree node color:', error);
    }
};
