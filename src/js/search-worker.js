// Web Worker for 8-Puzzle Search Algorithms
// This worker runs search algorithms in background to prevent UI blocking

// Import required modules (simplified versions for worker)
importScripts('https://unpkg.com/lodash@4.17.21/lodash.min.js');

// Game class for worker
class WorkerGame {
    constructor(state) {
        this.state = state || '012345678';
        this.goalState = '012345678';
        this.size = 3;
    }

    isGoalState() {
        return this.state === this.goalState;
    }

    getEmptyTilePosition() {
        return this.state.indexOf('0');
    }

    getAvailableActions() {
        var emptyPos = this.getEmptyTilePosition();
        var actions = [];
        var row = Math.floor(emptyPos / this.size);
        var col = emptyPos % this.size;

        if (row > 0) actions.push('UP');
        if (row < this.size - 1) actions.push('DOWN');
        if (col > 0) actions.push('LEFT');
        if (col < this.size - 1) actions.push('RIGHT');

        return actions;
    }

    move(action) {
        var emptyPos = this.getEmptyTilePosition();
        var newPos;
        
        switch(action) {
            case 'UP':
                newPos = emptyPos - this.size;
                break;
            case 'DOWN':
                newPos = emptyPos + this.size;
                break;
            case 'LEFT':
                newPos = emptyPos - 1;
                break;
            case 'RIGHT':
                newPos = emptyPos + 1;
                break;
            default:
                return false;
        }

        if (newPos < 0 || newPos >= 9) return false;

        var stateArray = this.state.split('');
        stateArray[emptyPos] = stateArray[newPos];
        stateArray[newPos] = '0';
        this.state = stateArray.join('');
        
        return true;
    }

    getAvailableActionsAndStates() {
        var actions = this.getAvailableActions();
        var result = {};
        
        actions.forEach(function(action) {
            var gameCopy = new WorkerGame(this.state);
            if (gameCopy.move(action)) {
                result[action] = gameCopy.state;
            }
        }.bind(this));
        
        return result;
    }

    getActionCost(action) {
        return 1; // All actions have cost 1
    }

    getHeuristicValue(type) {
        switch(type) {
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
                return this.getCornerTiles();
            case 'maxHeuristic':
                return this.getMaxHeuristic();
            default:
                return this.getManhattanDistance();
        }
    }

    getManhattanDistance() {
        var distance = 0;
        for (var i = 0; i < 9; i++) {
            var tile = parseInt(this.state[i]);
            if (tile !== 0) {
                var currentRow = Math.floor(i / 3);
                var currentCol = i % 3;
                var targetRow = Math.floor(tile / 3);
                var targetCol = tile % 3;
                distance += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
            }
        }
        return distance;
    }

    getEuclideanDistance() {
        var distance = 0;
        for (var i = 0; i < 9; i++) {
            var tile = parseInt(this.state[i]);
            if (tile !== 0) {
                var currentRow = Math.floor(i / 3);
                var currentCol = i % 3;
                var targetRow = Math.floor(tile / 3);
                var targetCol = tile % 3;
                distance += Math.sqrt(Math.pow(currentRow - targetRow, 2) + Math.pow(currentCol - targetCol, 2));
            }
        }
        return distance;
    }

    getMisplacedTiles() {
        var misplaced = 0;
        for (var i = 0; i < 9; i++) {
            if (this.state[i] !== '0' && this.state[i] !== this.goalState[i]) {
                misplaced++;
            }
        }
        return misplaced;
    }

    getLinearConflict() {
        var manhattan = this.getManhattanDistance();
        var conflicts = 0;
        
        // Check row conflicts
        for (var row = 0; row < 3; row++) {
            var rowTiles = [];
            for (var col = 0; col < 3; col++) {
                var pos = row * 3 + col;
                var tile = parseInt(this.state[pos]);
                if (tile !== 0 && Math.floor(tile / 3) === row) {
                    rowTiles.push({tile: tile, pos: col});
                }
            }
            
            for (var i = 0; i < rowTiles.length; i++) {
                for (var j = i + 1; j < rowTiles.length; j++) {
                    if (rowTiles[i].tile > rowTiles[j].tile && rowTiles[i].pos < rowTiles[j].pos) {
                        conflicts++;
                    }
                }
            }
        }
        
        // Check column conflicts
        for (var col = 0; col < 3; col++) {
            var colTiles = [];
            for (var row = 0; row < 3; row++) {
                var pos = row * 3 + col;
                var tile = parseInt(this.state[pos]);
                if (tile !== 0 && tile % 3 === col) {
                    colTiles.push({tile: tile, pos: row});
                }
            }
            
            for (var i = 0; i < colTiles.length; i++) {
                for (var j = i + 1; j < colTiles.length; j++) {
                    if (colTiles[i].tile > colTiles[j].tile && colTiles[i].pos < colTiles[j].pos) {
                        conflicts++;
                    }
                }
            }
        }
        
        return manhattan + 2 * conflicts;
    }

    getWalkingDistance() {
        return this.getLinearConflict(); // Simplified implementation
    }

    getCornerTiles() {
        var manhattan = this.getManhattanDistance();
        var penalty = 0;
        
        // Check corner positions
        var corners = [0, 2, 6, 8];
        corners.forEach(function(pos) {
            var tile = parseInt(this.state[pos]);
            if (tile !== 0 && tile !== pos) {
                penalty += 2; // Extra penalty for misplaced corner tiles
            }
        }.bind(this));
        
        return manhattan + penalty;
    }

    getMaxHeuristic() {
        var manhattan = this.getManhattanDistance();
        var linearConflict = this.getLinearConflict();
        var walkingDistance = this.getWalkingDistance();
        
        return Math.max(manhattan, linearConflict, walkingDistance);
    }
}

// Node class for worker
class WorkerNode {
    constructor(data) {
        data = data || {};
        this.state = data.state || '012345678';
        this.parent = data.parent || null;
        this.cost = data.cost || 0;
        this.depth = data.depth || 0;
        this.game = new WorkerGame(this.state);
        this.heuristic = 0;
    }

    expand() {
        var result = [];
        var availableActionsAndStates = this.game.getAvailableActionsAndStates();
        
        Object.keys(availableActionsAndStates).forEach(function(action) {
            var state = availableActionsAndStates[action];
            var childData = {
                state: state,
                parent: this,
                depth: this.depth + 1,
                cost: this.cost + this.game.getActionCost(action)
            };
            result.push(new WorkerNode(childData));
        }.bind(this));
        
        return result;
    }

    getPath() {
        var path = [];
        var current = this;
        while (current) {
            path.unshift(current.state);
            current = current.parent;
        }
        return path;
    }
}

// Search algorithms
var SearchAlgorithms = {
    
    breadthFirst: function(options) {
        var queue = [options.initialNode];
        var visited = {};
        var expandedNodes = 0;
        var maxFrontier = 0;
        
        while (queue.length > 0 && expandedNodes < options.iterationLimit) {
            maxFrontier = Math.max(maxFrontier, queue.length);
            
            var node = queue.shift();
            
            if (visited[node.state]) continue;
            visited[node.state] = true;
            expandedNodes++;
            
            if (node.game.isGoalState()) {
                return {
                    success: true,
                    node: node,
                    path: node.getPath(),
                    expandedNodes: expandedNodes,
                    maxFrontier: maxFrontier
                };
            }
            
            var children = node.expand();
            queue.push.apply(queue, children);
            
            // Send progress update
            if (expandedNodes % 100 === 0) {
                self.postMessage({
                    type: 'progress',
                    expandedNodes: expandedNodes,
                    frontierSize: queue.length
                });
            }
        }
        
        return {
            success: false,
            expandedNodes: expandedNodes,
            maxFrontier: maxFrontier
        };
    },
    
    depthFirst: function(options) {
        var stack = [options.initialNode];
        var visited = {};
        var expandedNodes = 0;
        var maxFrontier = 0;
        
        while (stack.length > 0 && expandedNodes < options.iterationLimit) {
            maxFrontier = Math.max(maxFrontier, stack.length);
            
            var node = stack.pop();
            
            if (visited[node.state]) continue;
            visited[node.state] = true;
            expandedNodes++;
            
            if (node.game.isGoalState()) {
                return {
                    success: true,
                    node: node,
                    path: node.getPath(),
                    expandedNodes: expandedNodes,
                    maxFrontier: maxFrontier
                };
            }
            
            if (node.depth < options.depthLimit || options.depthLimit === 0) {
                var children = node.expand();
                stack.push.apply(stack, children.reverse());
            }
            
            // Send progress update
            if (expandedNodes % 100 === 0) {
                self.postMessage({
                    type: 'progress',
                    expandedNodes: expandedNodes,
                    frontierSize: stack.length
                });
            }
        }
        
        return {
            success: false,
            expandedNodes: expandedNodes,
            maxFrontier: maxFrontier
        };
    },
    
    greedyBest: function(options) {
        var frontier = [options.initialNode];
        var visited = {};
        var expandedNodes = 0;
        var maxFrontier = 0;
        
        while (frontier.length > 0 && expandedNodes < options.iterationLimit) {
            maxFrontier = Math.max(maxFrontier, frontier.length);
            
            // Sort by heuristic value
            frontier.sort(function(a, b) {
                return a.game.getHeuristicValue(options.heuristicType) - 
                       b.game.getHeuristicValue(options.heuristicType);
            });
            
            var node = frontier.shift();
            
            if (visited[node.state]) continue;
            visited[node.state] = true;
            expandedNodes++;
            
            if (node.game.isGoalState()) {
                return {
                    success: true,
                    node: node,
                    path: node.getPath(),
                    expandedNodes: expandedNodes,
                    maxFrontier: maxFrontier
                };
            }
            
            var children = node.expand();
            frontier.push.apply(frontier, children);
            
            // Send progress update
            if (expandedNodes % 50 === 0) {
                self.postMessage({
                    type: 'progress',
                    expandedNodes: expandedNodes,
                    frontierSize: frontier.length,
                    currentHeuristic: node.game.getHeuristicValue(options.heuristicType)
                });
            }
        }
        
        return {
            success: false,
            expandedNodes: expandedNodes,
            maxFrontier: maxFrontier
        };
    },
    
    aStar: function(options) {
        var frontier = [options.initialNode];
        var visited = {};
        var expandedNodes = 0;
        var maxFrontier = 0;
        
        while (frontier.length > 0 && expandedNodes < options.iterationLimit) {
            maxFrontier = Math.max(maxFrontier, frontier.length);
            
            // Sort by f(n) = g(n) + h(n)
            frontier.sort(function(a, b) {
                var fA = a.cost + a.game.getHeuristicValue(options.heuristicType);
                var fB = b.cost + b.game.getHeuristicValue(options.heuristicType);
                return fA - fB;
            });
            
            var node = frontier.shift();
            
            if (visited[node.state]) continue;
            visited[node.state] = true;
            expandedNodes++;
            
            if (node.game.isGoalState()) {
                return {
                    success: true,
                    node: node,
                    path: node.getPath(),
                    expandedNodes: expandedNodes,
                    maxFrontier: maxFrontier
                };
            }
            
            var children = node.expand();
            frontier.push.apply(frontier, children);
            
            // Send progress update
            if (expandedNodes % 50 === 0) {
                var heuristic = node.game.getHeuristicValue(options.heuristicType);
                self.postMessage({
                    type: 'progress',
                    expandedNodes: expandedNodes,
                    frontierSize: frontier.length,
                    currentHeuristic: heuristic,
                    currentCost: node.cost,
                    currentF: node.cost + heuristic
                });
            }
        }
        
        return {
            success: false,
            expandedNodes: expandedNodes,
            maxFrontier: maxFrontier
        };
    },
    
    uniformCost: function(options) {
        var frontier = [options.initialNode];
        var visited = {};
        var expandedNodes = 0;
        var maxFrontier = 0;
        
        while (frontier.length > 0 && expandedNodes < options.iterationLimit) {
            maxFrontier = Math.max(maxFrontier, frontier.length);
            
            // Sort by cost
            frontier.sort(function(a, b) {
                return a.cost - b.cost;
            });
            
            var node = frontier.shift();
            
            if (visited[node.state]) continue;
            visited[node.state] = true;
            expandedNodes++;
            
            if (node.game.isGoalState()) {
                return {
                    success: true,
                    node: node,
                    path: node.getPath(),
                    expandedNodes: expandedNodes,
                    maxFrontier: maxFrontier
                };
            }
            
            var children = node.expand();
            frontier.push.apply(frontier, children);
            
            // Send progress update
            if (expandedNodes % 100 === 0) {
                self.postMessage({
                    type: 'progress',
                    expandedNodes: expandedNodes,
                    frontierSize: frontier.length,
                    currentCost: node.cost
                });
            }
        }
        
        return {
            success: false,
            expandedNodes: expandedNodes,
            maxFrontier: maxFrontier
        };
    },
    
    iterativeDeepening: function(options) {
        var maxDepth = options.depthLimit || 50;
        var totalExpandedNodes = 0;
        var maxFrontier = 0;
        
        for (var depth = 0; depth <= maxDepth; depth++) {
            var result = this.depthLimitedSearch(options.initialNode, depth, options);
            totalExpandedNodes += result.expandedNodes;
            maxFrontier = Math.max(maxFrontier, result.maxFrontier);
            
            if (result.success) {
                return {
                    success: true,
                    node: result.node,
                    path: result.path,
                    expandedNodes: totalExpandedNodes,
                    maxFrontier: maxFrontier
                };
            }
            
            if (totalExpandedNodes >= options.iterationLimit) {
                break;
            }
        }
        
        return {
            success: false,
            expandedNodes: totalExpandedNodes,
            maxFrontier: maxFrontier
        };
    },
    
    depthLimitedSearch: function(node, depthLimit, options) {
        var stack = [{node: node, depth: 0}];
        var expandedNodes = 0;
        var maxFrontier = 0;
        
        while (stack.length > 0 && expandedNodes < options.iterationLimit) {
            maxFrontier = Math.max(maxFrontier, stack.length);
            
            var item = stack.pop();
            var currentNode = item.node;
            var currentDepth = item.depth;
            
            expandedNodes++;
            
            if (currentNode.game.isGoalState()) {
                return {
                    success: true,
                    node: currentNode,
                    path: currentNode.getPath(),
                    expandedNodes: expandedNodes,
                    maxFrontier: maxFrontier
                };
            }
            
            if (currentDepth < depthLimit) {
                var children = currentNode.expand();
                children.forEach(function(child) {
                    stack.push({node: child, depth: currentDepth + 1});
                });
            }
        }
        
        return {
            success: false,
            expandedNodes: expandedNodes,
            maxFrontier: maxFrontier
        };
    }
};

// Worker message handler
self.onmessage = function(e) {
    var data = e.data;
    
    try {
        var initialNode = new WorkerNode({state: data.initialState});
        var startTime = Date.now();
        
        var searchOptions = {
            initialNode: initialNode,
            heuristicType: data.heuristicType,
            iterationLimit: data.iterationLimit || 10000,
            depthLimit: data.depthLimit || 50
        };
        
        var result;
        
        switch(data.algorithm) {
            case 'breadthFirst':
                result = SearchAlgorithms.breadthFirst(searchOptions);
                break;
            case 'depthFirst':
                result = SearchAlgorithms.depthFirst(searchOptions);
                break;
            case 'uniformCost':
                result = SearchAlgorithms.uniformCost(searchOptions);
                break;
            case 'iterativeDeepening':
                result = SearchAlgorithms.iterativeDeepening(searchOptions);
                break;
            case 'greedyBest':
                result = SearchAlgorithms.greedyBest(searchOptions);
                break;
            case 'aStar':
                result = SearchAlgorithms.aStar(searchOptions);
                break;
            default:
                throw new Error('Unknown algorithm: ' + data.algorithm);
        }
        
        var endTime = Date.now();
        result.executionTime = endTime - startTime;
        result.algorithm = data.algorithm;
        result.heuristicType = data.heuristicType;
        
        self.postMessage({
            type: 'result',
            data: result
        });
        
    } catch (error) {
        self.postMessage({
            type: 'error',
            error: error.message
        });
    }
};

// Handle worker termination
self.onmessage = function(e) {
    if (e.data.type === 'terminate') {
        self.close();
    }
};