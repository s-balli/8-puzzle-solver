var Game = function(opt_state) {
    this.state = opt_state || '012345678';
    
    // Validate initial state
    if (!this.isValidState(this.state)) {
        console.warn('Invalid initial state provided:', this.state);
        this.state = '012345678'; // Reset to default
    }
    
    // Heuristic cache for performance optimization
    this.heuristicCache = new Map();
};


Game.Actions = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};


Game.DesiredState = '123456780';

// Static cache for heuristic values across all Game instances
Game.heuristicCache = new Map();

// Pre-calculated target positions for performance optimization
Game.targetPositions = [
    null,        // 0 (empty space, no target)
    [0, 0],      // 1 -> (0,0)
    [0, 1],      // 2 -> (0,1)
    [0, 2],      // 3 -> (0,2)
    [1, 0],      // 4 -> (1,0)
    [1, 1],      // 5 -> (1,1)
    [1, 2],      // 6 -> (1,2)
    [2, 0],      // 7 -> (2,0)
    [2, 1]       // 8 -> (2,1)
];


Game.prototype.getAvailableActionsAndStates = function() {
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
            newIndex = zeroIndex - 1;
            break;
        case Game.Actions.RIGHT:
            newIndex = zeroIndex + 1;
            break;
        case Game.Actions.UP:
            newIndex = zeroIndex - 3;
            break;
        case Game.Actions.DOWN:
            newIndex = zeroIndex + 3;
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


Game.prototype.getActionCost = function(action) {
    // For now, all actions have uniform cost of 1
    // This can be extended to support different costs per action
    return 1;
};


Game.prototype.isValidState = function(state) {
    if (!state || typeof state !== 'string') {
        return false;
    }
    
    // Check length
    if (state.length !== 9) {
        return false;
    }
    
    // Check if all characters are digits 0-8
    if (!/^[0-8]{9}$/.test(state)) {
        return false;
    }
    
    // Check if each digit 0-8 appears exactly once
    var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
    return digits.every(function(digit) {
        return state.includes(digit) && state.indexOf(digit) === state.lastIndexOf(digit);
    });
};


Game.prototype.isSolvable = function(state) {
    state = state || this.state;
    
    if (!this.isValidState(state)) {
        return false;
    }
    
    // Calculate inversion count
    var inversionCount = 0;
    var stateArray = state.split('').filter(function(tile) {
        return tile !== '0'; // Remove empty space
    });
    
    for (var i = 0; i < stateArray.length - 1; i++) {
        for (var j = i + 1; j < stateArray.length; j++) {
            if (parseInt(stateArray[i]) > parseInt(stateArray[j])) {
                inversionCount++;
            }
        }
    }
    
    // For 8-puzzle, solvable if inversion count is even
    return inversionCount % 2 === 0;
};


Game.prototype.validateAndSetState = function(newState) {
    if (!this.isValidState(newState)) {
        throw new Error('Invalid state format: ' + newState);
    }
    
    if (!this.isSolvable(newState)) {
        throw new Error('Unsolvable puzzle state: ' + newState);
    }
    
    this.state = newState;
    return true;
};


Game.prototype.randomize = function(iterations) {
    var that = this;
    var states = {};
    iterations = iterations || 100;

    if (!iterations || isNaN(iterations) || iterations <= 0) {
        console.error('Invalid iteration count:', iterations);
        return false;
    }

    try {
        this.state = Game.DesiredState;
        states[this.state] = true;

        var randomNextState = function() {
            var actions = that.getAvailableActionsAndStates();
            if (Object.keys(actions).length === 0) {
                throw new Error('No available actions');
            }
            
            var state = _.sample(actions);

            if (states[state])
                return randomNextState();

            return state;
        };

        _.times(iterations, function() {
            try {
                var newState = randomNextState();
                states[newState] = true;
                that.state = newState;
            } catch (error) {
                console.warn('Error during randomization:', error.message);
            }
        });
        
        return true;
    } catch (error) {
        console.error('Randomization failed:', error.message);
        this.state = Game.DesiredState; // Reset to safe state
        return false;
    }
};


Game.prototype.getManhattanDistance = function() {
    var distance = 0;

    // Calculate Manhattan distance for each tile
    for (var i = 0; i < 9; i++) {
        var tile = this.state[i];
        if (tile !== '0') {
            var tileNum = parseInt(tile);
            var currentRow = Math.floor(i / 3);
            var currentCol = i % 3;
            var targetRow = Game.targetPositions[tileNum][0];
            var targetCol = Game.targetPositions[tileNum][1];
            
            distance += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
        }
    }

    return distance;
};


Game.prototype.getEuclideanDistance = function() {
    var distance = 0;

    // Calculate Euclidean distance for each tile
    for (var i = 0; i < 9; i++) {
        var tile = this.state[i];
        if (tile !== '0') {
            var tileNum = parseInt(tile);
            var currentRow = Math.floor(i / 3);
            var currentCol = i % 3;
            var targetRow = Game.targetPositions[tileNum][0];
            var targetCol = Game.targetPositions[tileNum][1];
            
            var dx = currentRow - targetRow;
            var dy = currentCol - targetCol;
            distance += Math.sqrt(dx * dx + dy * dy);
        }
    }

    return distance;
};

Game.prototype.getMisplacedTiles = function() {
    var misplacedCount = 0;
    
    // Compare each position with expected tile
    for (var i = 0; i < 8; i++) { // Only check positions 0-7, skip empty space
        var currentTile = this.state[i];
        var expectedTile = (i + 1).toString();
        
        if (currentTile !== expectedTile && currentTile !== '0') {
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
    // Create cache key from state and heuristic type
    var cacheKey = this.state + '_' + heuristicType;
    
    // Check cache first
    if (Game.heuristicCache.has(cacheKey)) {
        return Game.heuristicCache.get(cacheKey);
    }
    
    var result;
    switch (heuristicType) {
        case 'manhattan':
            result = this.getManhattanDistance();
            break;
        case 'euclidean':
            result = this.getEuclideanDistance();
            break;
        case 'misplaced':
            result = this.getMisplacedTiles();
            break;
        case 'linearConflict':
            result = this.getLinearConflict();
            break;
        case 'walkingDistance':
            result = this.getWalkingDistance();
            break;
        case 'cornerTiles':
            result = this.getCornerTilesHeuristic();
            break;
        case 'maxHeuristic':
            result = this.getMaxHeuristic();
            break;
        default:
            result = this.getManhattanDistance();
            break;
    }
    
    // Cache the result
    Game.heuristicCache.set(cacheKey, result);
    
    // Limit cache size to prevent memory issues
    if (Game.heuristicCache.size > 10000) {
        var firstKey = Game.heuristicCache.keys().next().value;
        Game.heuristicCache.delete(firstKey);
    }
    
    return result;
};

Game.indexToRowColumn = function(index) {
    return {
        row: Math.floor(index / 3),
        column: index % 3
    };
};

// Cache management methods
Game.clearHeuristicCache = function() {
    Game.heuristicCache.clear();
};

Game.getCacheSize = function() {
    return Game.heuristicCache.size;
};

Game.getCacheStats = function() {
    return {
        size: Game.heuristicCache.size,
        maxSize: 10000
    };
};
