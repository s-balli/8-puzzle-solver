var WorkerManager = {
    worker: null,
    isWorkerSupported: false,
    currentSearchId: null,
    searchCallbacks: {},
    
    init: function() {
        // Check if Web Workers are supported
        this.isWorkerSupported = typeof Worker !== 'undefined';
        
        if (this.isWorkerSupported) {
            console.log('Web Workers supported - using background processing');
            this.createWorker();
            this.updateWorkerStatus('supported', 'Web Worker: Background processing enabled');
        } else {
            console.log('Web Workers not supported - falling back to main thread');
            this.updateWorkerStatus('not-supported', 'Web Worker: Not supported - using main thread');
        }
    },
    
    createWorker: function() {
        if (!this.isWorkerSupported) return;
        
        try {
            // Try to create worker from file first
            this.worker = new Worker('./js/search-worker.js');
            this.setupWorkerListeners();
        } catch (error) {
            console.error('Failed to create Web Worker from file:', error);
            
            // Fallback to inline worker for file:// protocol
            try {
                this.createInlineWorker();
            } catch (inlineError) {
                console.error('Failed to create inline Web Worker:', inlineError);
                this.isWorkerSupported = false;
                this.updateWorkerStatus('not-supported', 'Web Worker: File protocol limitation - using main thread');
            }
        }
    },
    
    createInlineWorker: function() {
        var workerCode = this.getWorkerCode();
        var blob = new Blob([workerCode], { type: 'application/javascript' });
        var workerUrl = URL.createObjectURL(blob);
        
        this.worker = new Worker(workerUrl);
        this.setupWorkerListeners();
        
        // Clean up the blob URL after worker is created
        URL.revokeObjectURL(workerUrl);
        
        console.log('Inline Web Worker created successfully');
    },
    
    setupWorkerListeners: function() {
        if (!this.worker) return;
        
        this.worker.onmessage = function(e) {
            var message = e.data;
            
            switch(message.type) {
                case 'result':
                    this.handleSearchResult(message.data);
                    break;
                case 'progress':
                    this.handleSearchProgress(message);
                    break;
                case 'error':
                    this.handleSearchError(message.error);
                    break;
            }
        }.bind(this);
        
        this.worker.onerror = function(error) {
            console.error('Worker error:', error);
            this.handleSearchError('Worker execution error');
        }.bind(this);
    },
    
    startSearch: function(options) {
        if (!this.isWorkerSupported || !this.worker) {
            // Fallback to main thread
            return this.fallbackSearch(options);
        }
        
        // Update status to show active search
        this.updateWorkerStatus('active', 'Web Worker: Running ' + options.type + ' algorithm...');
        
        // Generate unique search ID
        this.currentSearchId = 'search_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Store callback for this search
        this.searchCallbacks[this.currentSearchId] = {
            callback: options.callback,
            progressCallback: options.progressCallback,
            startTime: performance.now()
        };
        
        // Send search request to worker
        this.worker.postMessage({
            searchId: this.currentSearchId,
            algorithm: options.type,
            heuristicType: options.heuristicType,
            initialState: options.node.state,
            iterationLimit: options.iterationLimit,
            depthLimit: options.depthLimit
        });
        
        return this.currentSearchId;
    },
    
    handleSearchResult: function(result) {
        var searchId = this.currentSearchId;
        var callbacks = this.searchCallbacks[searchId];
        
        if (!callbacks) return;
        
        // Calculate total execution time
        var totalTime = performance.now() - callbacks.startTime;
        
        // Convert worker result to main thread format
        var mainThreadResult = {
            success: result.success,
            node: result.node ? this.convertWorkerNode(result.node) : null,
            path: result.path || [],
            expandedNodes: result.expandedNodes,
            maxFrontier: result.maxFrontier,
            executionTime: totalTime,
            algorithm: result.algorithm,
            heuristicType: result.heuristicType
        };
        
        // Update status back to ready
        this.updateWorkerStatus('supported', 'Web Worker: Background processing enabled');
        
        // Call the original callback
        if (callbacks.callback) {
            callbacks.callback(mainThreadResult);
        }
        
        // Clean up
        delete this.searchCallbacks[searchId];
        this.currentSearchId = null;
    },
    
    handleSearchProgress: function(progress) {
        var searchId = this.currentSearchId;
        var callbacks = this.searchCallbacks[searchId];
        
        if (!callbacks || !callbacks.progressCallback) return;
        
        // Update UI with progress
        callbacks.progressCallback({
            expandedNodes: progress.expandedNodes,
            frontierSize: progress.frontierSize,
            currentHeuristic: progress.currentHeuristic,
            currentCost: progress.currentCost,
            currentF: progress.currentF
        });
    },
    
    handleSearchError: function(error) {
        var searchId = this.currentSearchId;
        var callbacks = this.searchCallbacks[searchId];
        
        if (!callbacks) return;
        
        console.error('Search error:', error);
        
        // Call callback with error result
        if (callbacks.callback) {
            callbacks.callback({
                success: false,
                error: error,
                expandedNodes: 0,
                maxFrontier: 0
            });
        }
        
        // Clean up
        delete this.searchCallbacks[searchId];
        this.currentSearchId = null;
    },
    
    stopSearch: function() {
        if (this.currentSearchId && this.worker) {
            // Terminate current worker and create new one
            this.worker.terminate();
            this.createWorker();
            
            // Clean up callbacks
            delete this.searchCallbacks[this.currentSearchId];
            this.currentSearchId = null;
        }
    },
    
    convertWorkerNode: function(workerNode) {
        // Convert worker node back to main thread node format
        if (!workerNode) return null;
        
        // Create a simplified node object that matches main thread expectations
        var mainNode = {
            state: workerNode.state,
            cost: workerNode.cost,
            depth: workerNode.depth,
            game: new Game(workerNode.state),
            parent: workerNode.parent ? this.convertWorkerNode(workerNode.parent) : null
        };
        
        return mainNode;
    },
    
    fallbackSearch: function(options) {
        console.log('Using fallback search on main thread');
        
        // Use original search function as fallback
        if (typeof search === 'function') {
            search(options);
        } else {
            console.error('Fallback search function not available');
        }
    },
    
    isUsingWorker: function() {
        return this.isWorkerSupported && this.worker !== null;
    },
    
    updateWorkerStatus: function(status, message) {
        var indicator = document.getElementById('workerIndicator');
        var text = document.getElementById('workerText');
        
        if (indicator) {
            indicator.className = 'worker-indicator ' + status;
        }
        
        if (text) {
            text.textContent = message;
        }
    },
    
    getWorkerCode: function() {
        return `
        // Inline Web Worker for 8-Puzzle Search Algorithms
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
                return 1;
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
                
                // Simplified linear conflict calculation
                for (var row = 0; row < 3; row++) {
                    for (var col = 0; col < 3; col++) {
                        var pos = row * 3 + col;
                        var tile = parseInt(this.state[pos]);
                        if (tile !== 0 && Math.floor(tile / 3) === row) {
                            for (var col2 = col + 1; col2 < 3; col2++) {
                                var pos2 = row * 3 + col2;
                                var tile2 = parseInt(this.state[pos2]);
                                if (tile2 !== 0 && Math.floor(tile2 / 3) === row && tile > tile2) {
                                    conflicts++;
                                }
                            }
                        }
                    }
                }
                
                return manhattan + 2 * conflicts;
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

        // Simple search algorithms
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
            
            greedyBest: function(options) {
                var frontier = [options.initialNode];
                var visited = {};
                var expandedNodes = 0;
                var maxFrontier = 0;
                
                while (frontier.length > 0 && expandedNodes < options.iterationLimit) {
                    maxFrontier = Math.max(maxFrontier, frontier.length);
                    
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
                    case 'greedyBest':
                        result = SearchAlgorithms.greedyBest(searchOptions);
                        break;
                    case 'aStar':
                        result = SearchAlgorithms.aStar(searchOptions);
                        break;
                    default:
                        // Fallback to breadthFirst for unsupported algorithms
                        result = SearchAlgorithms.breadthFirst(searchOptions);
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
        `;
    },
    
    terminate: function() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this.searchCallbacks = {};
        this.currentSearchId = null;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    WorkerManager.init();
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    WorkerManager.terminate();
});