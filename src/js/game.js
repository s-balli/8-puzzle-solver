var Game = function(opt_state) {
    this.state = opt_state || '012345678';
};


Game.Actions = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};


Game.DesiredState = '123456780';


Game.prototype.getAvaliableActionsAndStates = function() {
    var result = {};

    var zeroIndex = this.state.indexOf('0');
    var row = Math.floor(zeroIndex / 3);
    var column = zeroIndex % 3;

    if (column > 0) result[Game.Actions.LEFT] = this.getNextState(Game.Actions.LEFT);
    if (column < 2) result[Game.Actions.RIGHT] = this.getNextState(Game.Actions.RIGHT);
    if (row > 0) result[Game.Actions.UP] = this.getNextState(Game.Actions.UP);
    if (row < 2) result[Game.Actions.DOWN] = this.getNextState(Game.Actions.DOWN);

    return result;
};


Game.prototype.getNextState = function(action) {
    var zeroIndex = this.state.indexOf('0');
    var newIndex;

    switch (action) {
        case Game.Actions.LEFT:
            newIndex = zeroIndex - 1
            break;
        case Game.Actions.RIGHT:
            newIndex = zeroIndex + 1
            break;
        case Game.Actions.UP:
            newIndex = zeroIndex - 3
            break;
        case Game.Actions.DOWN:
            newIndex = zeroIndex + 3
            break;
        default:
            throw new Error('Unexpected action');
    }

    var stateArr = this.state.split('');
    stateArr[zeroIndex] = stateArr[newIndex];
    stateArr[newIndex] = '0';
    return stateArr.join('');
};


Game.prototype.isFinished = function() {
    return this.state == Game.DesiredState;
};


Game.prototype.randomize = function() {
    var that = this;
    var states = {};
    // var iteration = parseInt(prompt('How many random moves from desired state?'));
    var iteration = 100;

    if (!iteration || isNaN(iteration))
        return alert('Invalid iteration count, please enter a number');

    this.state = Game.DesiredState;
    states[this.state] = true;

    var randomNextState = function() {
        var state = _.sample(that.getAvaliableActionsAndStates());

        if (states[state])
            return randomNextState();

        return state;
    }

    _.times(iteration, function() {
        that.state = randomNextState();
    });
};


Game.prototype.getManhattanDistance = function() {
    var distance = 0;

    var oneIndex = this.state.indexOf('1');
    var onePosition = Game.indexToRowColumn(oneIndex);
    distance += Math.abs(0 - onePosition.row) + Math.abs(0 - onePosition.column);

    var twoIndex = this.state.indexOf('2');
    var twoPosition = Game.indexToRowColumn(twoIndex);
    distance += Math.abs(0 - twoPosition.row) + Math.abs(1 - twoPosition.column);

    var threeIndex = this.state.indexOf('3');
    var threePosition = Game.indexToRowColumn(threeIndex);
    distance += Math.abs(0 - threePosition.row) + Math.abs(2 - threePosition.column);

    var fourIndex = this.state.indexOf('4');
    var fourPosition = Game.indexToRowColumn(fourIndex);
    distance += Math.abs(1 - fourPosition.row) + Math.abs(0 - fourPosition.column);

    var fiveIndex = this.state.indexOf('5');
    var fivePosition = Game.indexToRowColumn(fiveIndex);
    distance += Math.abs(1 - fivePosition.row) + Math.abs(1 - fivePosition.column);

    var sixIndex = this.state.indexOf('6');
    var sixPosition = Game.indexToRowColumn(sixIndex);
    distance += Math.abs(1 - sixPosition.row) + Math.abs(2 - sixPosition.column);

    var sevenIndex = this.state.indexOf('7');
    var sevenPosition = Game.indexToRowColumn(sevenIndex);
    distance += Math.abs(2 - sevenPosition.row) + Math.abs(0 - sevenPosition.column);

    var eightIndex = this.state.indexOf('8');
    var eightPosition = Game.indexToRowColumn(eightIndex);
    distance += Math.abs(2 - eightPosition.row) + Math.abs(1 - eightPosition.column);

    return distance;
};


Game.prototype.getEuclideanDistance = function() {
    var distance = 0;

    for (var i = 1; i <= 8; i++) {
        var index = this.state.indexOf(i.toString());
        var position = Game.indexToRowColumn(index);
        
        var goalRow = Math.floor((i - 1) / 3);
        var goalColumn = (i - 1) % 3;
        
        var dx = position.row - goalRow;
        var dy = position.column - goalColumn;
        distance += Math.sqrt(dx * dx + dy * dy);
    }

    return distance;
};

Game.prototype.getMisplacedTiles = function() {
    var misplacedCount = 0;

    for (var i = 1; i <= 8; i++) {
        var index = this.state.indexOf(i.toString());
        var expectedIndex = i - 1;
        
        if (index !== expectedIndex) {
            misplacedCount++;
        }
    }

    return misplacedCount;
};

Game.prototype.getLinearConflict = function() {
    var manhattan = this.getManhattanDistance();
    var conflicts = 0;
    
    // Check horizontal conflicts
    for (var row = 0; row < 3; row++) {
        var rowTiles = [];
        for (var col = 0; col < 3; col++) {
            var index = row * 3 + col;
            var tile = parseInt(this.state[index]);
            if (tile !== 0) {
                var goalRow = Math.floor((tile - 1) / 3);
                if (goalRow === row) {
                    rowTiles.push({tile: tile, currentCol: col, goalCol: (tile - 1) % 3});
                }
            }
        }
        
        // Count conflicts in this row
        for (var i = 0; i < rowTiles.length; i++) {
            for (var j = i + 1; j < rowTiles.length; j++) {
                var tile1 = rowTiles[i];
                var tile2 = rowTiles[j];
                if (tile1.currentCol < tile2.currentCol && tile1.goalCol > tile2.goalCol) {
                    conflicts += 2;
                }
            }
        }
    }
    
    // Check vertical conflicts
    for (var col = 0; col < 3; col++) {
        var colTiles = [];
        for (var row = 0; row < 3; row++) {
            var index = row * 3 + col;
            var tile = parseInt(this.state[index]);
            if (tile !== 0) {
                var goalCol = (tile - 1) % 3;
                if (goalCol === col) {
                    colTiles.push({tile: tile, currentRow: row, goalRow: Math.floor((tile - 1) / 3)});
                }
            }
        }
        
        // Count conflicts in this column
        for (var i = 0; i < colTiles.length; i++) {
            for (var j = i + 1; j < colTiles.length; j++) {
                var tile1 = colTiles[i];
                var tile2 = colTiles[j];
                if (tile1.currentRow < tile2.currentRow && tile1.goalRow > tile2.goalRow) {
                    conflicts += 2;
                }
            }
        }
    }
    
    return manhattan + conflicts;
};

Game.prototype.getWalkingDistance = function() {
    var manhattan = this.getManhattanDistance();
    var verticalConflicts = 0;
    var horizontalConflicts = 0;
    
    // Calculate vertical walking distance
    for (var col = 0; col < 3; col++) {
        var column = [];
        for (var row = 0; row < 3; row++) {
            var index = row * 3 + col;
            var tile = parseInt(this.state[index]);
            if (tile !== 0) {
                var goalCol = (tile - 1) % 3;
                if (goalCol === col) {
                    column.push({tile: tile, row: row, goalRow: Math.floor((tile - 1) / 3)});
                }
            }
        }
        
        // Sort by current row
        column.sort(function(a, b) { return a.row - b.row; });
        
        // Count inversions
        for (var i = 0; i < column.length; i++) {
            for (var j = i + 1; j < column.length; j++) {
                if (column[i].goalRow > column[j].goalRow) {
                    verticalConflicts++;
                }
            }
        }
    }
    
    // Calculate horizontal walking distance
    for (var row = 0; row < 3; row++) {
        var rowTiles = [];
        for (var col = 0; col < 3; col++) {
            var index = row * 3 + col;
            var tile = parseInt(this.state[index]);
            if (tile !== 0) {
                var goalRow = Math.floor((tile - 1) / 3);
                if (goalRow === row) {
                    rowTiles.push({tile: tile, col: col, goalCol: (tile - 1) % 3});
                }
            }
        }
        
        // Sort by current column
        rowTiles.sort(function(a, b) { return a.col - b.col; });
        
        // Count inversions
        for (var i = 0; i < rowTiles.length; i++) {
            for (var j = i + 1; j < rowTiles.length; j++) {
                if (rowTiles[i].goalCol > rowTiles[j].goalCol) {
                    horizontalConflicts++;
                }
            }
        }
    }
    
    return manhattan + 2 * (verticalConflicts + horizontalConflicts);
};


Game.prototype.getCornerTilesHeuristic = function() {
    var manhattan = this.getManhattanDistance();
    var penalty = 0;
    
    // Corner positions: 0, 2, 6, 8
    var corners = [0, 2, 6, 8];
    var cornerTiles = [1, 3, 7, 9]; // Expected tiles at corners (adjusted for 0-indexing)
    
    for (var i = 0; i < corners.length; i++) {
        var position = corners[i];
        var tile = parseInt(this.state[position]);
        
        if (tile !== 0) {
            var expectedTile = cornerTiles[i];
            if (tile !== expectedTile) {
                // If a non-corner tile is in corner position, add penalty
                var goalRow = Math.floor((tile - 1) / 3);
                var goalCol = (tile - 1) % 3;
                var currentRow = Math.floor(position / 3);
                var currentCol = position % 3;
                
                // Check if this tile belongs to corner
                var isCornerTile = (goalRow === 0 && goalCol === 0) || 
                                  (goalRow === 0 && goalCol === 2) || 
                                  (goalRow === 2 && goalCol === 0) || 
                                  (goalRow === 2 && goalCol === 2);
                
                if (!isCornerTile) {
                    penalty += 2;
                }
            }
        }
    }
    
    return manhattan + penalty;
};

Game.prototype.getMaxHeuristic = function() {
    var manhattan = this.getManhattanDistance();
    var linearConflict = this.getLinearConflict();
    var walkingDistance = this.getWalkingDistance();
    
    return Math.max(manhattan, linearConflict, walkingDistance);
};

Game.prototype.getHeuristicValue = function(heuristicType) {
    switch (heuristicType) {
        case 'manhattan':
            return this.getManhattanDistance();
        case 'euclidean':
            return this.getEuclideanDistance();
        case 'misplaced':
            return this.getMisplacedTiles();
        case 'linearConflict':
            return this.getLinearConflict();
        case 'walkingDistance':
            return this.getWalkingDistance();
        case 'cornerTiles':
            return this.getCornerTilesHeuristic();
        case 'maxHeuristic':
            return this.getMaxHeuristic();
        default:
            return this.getManhattanDistance();
    }
};

Game.indexToRowColumn = function(index) {
    return {
        row: Math.floor(index / 3),
        column: index % 3
    };
}
