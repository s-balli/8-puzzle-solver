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

        element.style.top = (row * element.offsetHeight) + 'px';
        element.style.left = (column * element.offsetWidth) + 'px';
    });
}

Board.replayTimeout = null;
Board.replayAnimationTimeout = null;
Board.isPaused = false;
Board.pendingMoves = [];
Board.currentAnimationSpeed = 500;

Board.replay = function(moves) {
    Board.clearReplay();

    var initialState = moves.shift();
    Board.draw(initialState);
    window.network.selectNodes([initialState]);
    window.network.focus(initialState, { scale: 0.75 });
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
    
    var animate = function(moves) {
        if (Board.isPaused) return; // Stop if paused
        
        var move = moves.shift();
        if (!move) return Board.clearReplay();
        
        Board.draw(move);
        window.network.selectNodes([move]);
        window.network.focus(move, { scale: 0.75, animation: true });
        SoundManager.play('move');
        
        // Update pending moves
        Board.pendingMoves = moves.slice();
        
        Board.replayAnimationTimeout = setTimeout(animate.bind(null, moves), Board.currentAnimationSpeed);
    };

    Board.replayTimeout = setTimeout(function() {
        animate(moves);
    }, Board.currentAnimationSpeed);
};


Board.clearReplay = function() {
    clearTimeout(Board.replayTimeout);
    clearTimeout(Board.replayAnimationTimeout);
    boardDiv.classList.remove('animation');
    window.isReplaying = false;
    Board.isPaused = false;
    Board.pendingMoves = [];
    
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
        clearTimeout(Board.replayAnimationTimeout);
        if (pauseBtn) {
            pauseBtn.textContent = window.t ? t('solution.resume') : 'Resume';
        }
    } else {
        // Resume state
        if (pauseBtn) {
            pauseBtn.textContent = window.t ? t('solution.pause') : 'Pause';
        }
        
        // Continue animation with remaining moves
        if (Board.pendingMoves.length > 0) {
            var animate = function(moves) {
                if (Board.isPaused) return;
                
                var move = moves.shift();
                if (!move) return Board.clearReplay();
                
                Board.draw(move);
                window.network.selectNodes([move]);
                window.network.focus(move, { scale: 0.75, animation: true });
                SoundManager.play('move');
                
                Board.pendingMoves = moves.slice();
                
                Board.replayAnimationTimeout = setTimeout(animate.bind(null, moves), Board.currentAnimationSpeed);
            };
            
            Board.replayAnimationTimeout = setTimeout(animate.bind(null, Board.pendingMoves.slice()), Board.currentAnimationSpeed);
        }
    }
};


Board.setAnimationDuration = function(duration) {
    var board = document.getElementById('board');
    if (board) {
        board.style.setProperty('--animation-duration', duration + 'ms');
    }
};
