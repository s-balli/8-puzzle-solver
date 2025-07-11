class Game {
    static Actions = {
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right'
    };

    static DesiredState = '123456780';

    // Static cache for heuristic values across all Game instances
    static heuristicCache = new Map();

    // Pre-calculated target positions for performance optimization
    static targetPositions = [
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

    // Pre-calculated Manhattan distance lookup table
    static manhattanDistanceTable = {};
    
    // Initialize Manhattan distance lookup table
    static initManhattanTable() {
        for (let tile = 1; tile <= 8; tile++) {
            Game.manhattanDistanceTable[tile] = {};
            for (let pos = 0; pos < 9; pos++) {
                const currentRow = Math.floor(pos / 3);
                const currentCol = pos % 3;
                const targetRow = Game.targetPositions[tile][0];
                const targetCol = Game.targetPositions[tile][1];
                Game.manhattanDistanceTable[tile][pos] = 
                    Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
            }
        }
    }

    constructor(opt_state) {
        this.state = opt_state || '012345678';
        
        // Validate initial state
        if (!this.isValidState(this.state)) {
            console.warn('Invalid initial state provided:', this.state);
            this.state = '012345678'; // Reset to default
        }
        
        // Heuristic cache for performance optimization
        this.heuristicCache = new Map();
    }


    getAvailableActionsAndStates() {
        const result = {};

        const zeroIndex = this.state.indexOf('0');
        const row = Math.floor(zeroIndex / 3);
        const column = zeroIndex % 3;

        if (column > 0) result[Game.Actions.LEFT] = this.getNextState(Game.Actions.LEFT);
        if (column < 2) result[Game.Actions.RIGHT] = this.getNextState(Game.Actions.RIGHT);
        if (row > 0) result[Game.Actions.UP] = this.getNextState(Game.Actions.UP);
        if (row < 2) result[Game.Actions.DOWN] = this.getNextState(Game.Actions.DOWN);

        return result;
    }


    getNextState(action) {
        const zeroIndex = this.state.indexOf('0');
        let newIndex;

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

        const stateArr = this.state.split('');
        stateArr[zeroIndex] = stateArr[newIndex];
        stateArr[newIndex] = '0';
        return stateArr.join('');
    }


    isFinished() {
        return this.state == Game.DesiredState;
    }


    getActionCost(action) {
        // For now, all actions have uniform cost of 1
        // This can be extended to support different costs per action
        return 1;
    }


    isValidState(state) {
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
        const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
        return digits.every(digit => {
            return state.includes(digit) && state.indexOf(digit) === state.lastIndexOf(digit);
        });
    }


    isSolvable(state) {
        state = state || this.state;
        
        if (!this.isValidState(state)) {
            return false;
        }
        
        // Calculate inversion count
        let inversionCount = 0;
        const stateArray = state.split('').filter(tile => tile !== '0'); // Remove empty space
        
        for (let i = 0; i < stateArray.length - 1; i++) {
            for (let j = i + 1; j < stateArray.length; j++) {
                if (parseInt(stateArray[i]) > parseInt(stateArray[j])) {
                    inversionCount++;
                }
            }
        }
        
        // For 8-puzzle, solvable if inversion count is even
        return inversionCount % 2 === 0;
    }


    validateAndSetState(newState) {
        if (!this.isValidState(newState)) {
            throw new Error('Invalid state format: ' + newState);
        }
        
        if (!this.isSolvable(newState)) {
            throw new Error('Unsolvable puzzle state: ' + newState);
        }
        
        this.state = newState;
        return true;
    }


    randomize(iterations) {
        const states = {};
        iterations = iterations || 100;

        if (!iterations || isNaN(iterations) || iterations <= 0) {
            console.error('Invalid iteration count:', iterations);
            return false;
        }

        try {
            this.state = Game.DesiredState;
            states[this.state] = true;

            const randomNextState = () => {
                const actions = this.getAvailableActionsAndStates();
                if (Object.keys(actions).length === 0) {
                    throw new Error('No available actions');
                }
                
                const state = _.sample(actions);

                if (states[state])
                    return randomNextState();

                return state;
            };

            _.times(iterations, () => {
                try {
                    const newState = randomNextState();
                    states[newState] = true;
                    this.state = newState;
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
    }


    getManhattanDistance() {
        let distance = 0;

        // Use pre-calculated lookup table for faster calculation
        for (let i = 0; i < 9; i++) {
            const tile = this.state[i];
            if (tile !== '0') {
                const tileNum = parseInt(tile);
                distance += Game.manhattanDistanceTable[tileNum][i];
            }
        }

        return distance;
    }


    getEuclideanDistance() {
        let distance = 0;

        // Calculate Euclidean distance for each tile
        for (let i = 0; i < 9; i++) {
            const tile = this.state[i];
            if (tile !== '0') {
                const tileNum = parseInt(tile);
                const currentRow = Math.floor(i / 3);
                const currentCol = i % 3;
                const targetRow = Game.targetPositions[tileNum][0];
                const targetCol = Game.targetPositions[tileNum][1];
                
                const dx = currentRow - targetRow;
                const dy = currentCol - targetCol;
                distance += Math.sqrt(dx * dx + dy * dy);
            }
        }

        return distance;
    }

    getMisplacedTiles() {
        let misplacedCount = 0;
        
        // Compare each position with expected tile
        for (let i = 0; i < 8; i++) { // Only check positions 0-7, skip empty space
            const currentTile = this.state[i];
            const expectedTile = (i + 1).toString();
            
            if (currentTile !== expectedTile && currentTile !== '0') {
                misplacedCount++;
            }
        }

        return misplacedCount;
    }

    getLinearConflict() {
        const manhattan = this.getManhattanDistance();
        let conflicts = 0;
    
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
    }

    getWalkingDistance() {
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
    }

    getCornerTilesHeuristic() {
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
    }

    getMaxHeuristic() {
    var manhattan = this.getManhattanDistance();
    var linearConflict = this.getLinearConflict();
    var walkingDistance = this.getWalkingDistance();
    
        return Math.max(manhattan, linearConflict, walkingDistance);
    }

    getHeuristicValue(heuristicType) {
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
    
    // Limit cache size to prevent memory issues using LRU strategy
    if (Game.heuristicCache.size > 10000) {
        // Remove oldest 1000 entries when cache is full
        var keysToDelete = [];
        var iterator = Game.heuristicCache.keys();
        for (var i = 0; i < 1000; i++) {
            var key = iterator.next().value;
            if (key) keysToDelete.push(key);
        }
        keysToDelete.forEach(function(key) {
            Game.heuristicCache.delete(key);
        });
    }
    
        return result;
    }

    static indexToRowColumn(index) {
        return {
            row: Math.floor(index / 3),
            column: index % 3
        };
    }
}
