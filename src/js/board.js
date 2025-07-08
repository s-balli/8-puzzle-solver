var Board = {};


Board.elements = {};

// Initialize board elements dynamically
for (var i = 1; i <= 15; i++) {
    var element = document.getElementById('board-item-' + i);
    if (element) {
        Board.elements[i.toString()] = element;
        // Also add hex values for 15-puzzle
        if (i > 9) {
            Board.elements[i.toString(16).toUpperCase()] = element;
        }
    }
}


Board.draw = function(state) {
    var boardSize = PuzzleManager.getBoardSize();
    var tileSize = PuzzleManager.getTileSize();
    
    state.split('').forEach(function(item, index) {
        if (item == '0') return;

        var element = Board.elements[item];
        if (!element) return;
        
        var row = Math.floor(index / boardSize);
        var column = index % boardSize;

        element.style.top = (row * tileSize) + 'px';
        element.style.left = (column * tileSize) + 'px';
    });
    
    // Update 3D visualization if enabled
    if (typeof ThreeDManager !== 'undefined' && ThreeDManager.enabled) {
        ThreeDManager.update3DPositions();
    }
}

Board.replayTimeout = null;
Board.replayAnimationTimeout = null;

Board.replay = function(moves) {
    Board.clearReplay();

    var initialState = moves.shift();
    Board.draw(initialState);
    window.network.selectNodes([initialState]);
    window.network.focus(initialState, { scale: 0.75 });
    window.isReplaying = true;
    var btn = document.getElementById('replayButton'); btn && (btn.textContent = 'Stop replaying');

    var animationSpeed = Board.getAnimationSpeed();
    
    var animate = function(moves) {
        var move = moves.shift();
        if (!move) return Board.clearReplay();
        Board.draw(move);
        window.network.selectNodes([move]);
        window.network.focus(move, { scale: 0.75, animation: true });
        SoundManager.play('move');
        Board.replayAnimationTimeout = setTimeout(animate.bind(null, moves), animationSpeed);
    };

    Board.replayTimeout = setTimeout(function() {
        animate(moves);
    }, animationSpeed);
};


Board.clearReplay = function() {
    clearTimeout(Board.replayTimeout);
    clearTimeout(Board.replayAnimationTimeout);
    boardDiv.classList.remove('animation');
    window.isReplaying = false;
    var btn = document.getElementById('replayButton'); btn && (btn.textContent = 'Replay solution');
};

Board.getAnimationSpeed = function() {
    var speedSelect = document.getElementById('animationSpeed');
    if (!speedSelect) return 1000;
    
    switch (speedSelect.value) {
        case 'slow': return 1000;
        case 'fast': return 200;
        case 'normal':
        default: return 500;
    }
};
