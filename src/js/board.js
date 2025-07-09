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

Board.replay = function(moves) {
    Board.clearReplay();

    var initialState = moves.shift();
    Board.draw(initialState);
    window.network.selectNodes([initialState]);
    window.network.focus(initialState, { scale: 0.75 });
    window.isReplaying = true;
    var btn = document.getElementById('replayButton'); btn && (btn.textContent = 'Stop replaying');

    var animationSpeed = Board.getAnimationSpeed();
    
    // Set CSS animation duration
    Board.setAnimationDuration(animationSpeed);
    
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
    if (!speedSelect) return 800;
    
    switch (speedSelect.value) {
        case 'slow': return 1500;
        case 'fast': return 150;
        case 'normal':
        default: return 500;
    }
};

Board.setAnimationDuration = function(duration) {
    var board = document.getElementById('board');
    if (board) {
        board.style.setProperty('--animation-duration', duration + 'ms');
    }
};
