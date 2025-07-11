// Game initialization will be moved to DOMContentLoaded
let game;

// DOM Cache for performance optimization
var DOMCache = {
    // Core elements
    board: document.getElementById('board'),
    controls: document.getElementById('controls'),
    
    // Input elements
    searchType: document.getElementById('searchType'),
    iterationLimit: document.getElementById('iterationLimit'),
    depthLimit: document.getElementById('depthLimit'),
    timeLimit: document.getElementById('timeLimit'),
    heuristicFunction: document.getElementById('heuristicFunction'),
    
    // Button elements
    randomize: document.getElementById('randomize'),
    customInput: document.getElementById('customInput'),
    search: document.getElementById('search'),
    searchStop: document.getElementById('searchStop'),
    searchStep: document.getElementById('searchStep'),
    replayButton: document.getElementById('replayButton'),
    pauseReplayButton: document.getElementById('pauseReplayButton'),
    
    // Checkbox elements
    expandedNodeCheck: document.getElementById('expandedNodeCheck'),
    visualizationCheck: document.getElementById('visualizationCheck'),
    soundEnabled: document.getElementById('soundEnabled'),
    educationMode: document.getElementById('educationMode'),
    performanceMode: document.getElementById('performanceMode'),
    realTimeGraphs: document.getElementById('realTimeGraphs'),
    
    // Theme selector
    themeSelector: document.getElementById('themeSelector'),
    
    // Performance panel elements
    performancePanel: document.getElementById('performancePanel'),
    currentMetrics: document.getElementById('currentMetrics'),
    timeElapsed: document.getElementById('timeElapsed'),
    nodesExpanded: document.getElementById('nodesExpanded'),
    frontierSize: document.getElementById('frontierSize'),
    
    // Graph panel elements
    graphPanel: document.getElementById('graphPanel'),
    realTimeChart: document.getElementById('realTimeChart'),
    frontierCount: document.getElementById('frontierCount'),
    expandedCount: document.getElementById('expandedCount'),
    iterationCount: document.getElementById('iterationCount'),
    elapsedTime: document.getElementById('elapsedTime'),
    currentDepth: document.getElementById('currentDepth'),
    currentCost: document.getElementById('currentCost'),
    currentPathLength: document.getElementById('currentPathLength'),
    searchStatus: document.getElementById('searchStatus'),
    
    // Progress indicator elements
    searchProgress: document.getElementById('searchProgress'),
    progressPercentage: document.getElementById('progressPercentage'),
    progressFill: document.getElementById('progressFill'),
    progressStats: document.getElementById('progressStats')
};

// Legacy variables for backward compatibility
var boardDiv = DOMCache.board;
var controlsDiv = DOMCache.controls;
var randomizeButton = DOMCache.randomize;
var customInputButton = DOMCache.customInput;
var searchTypeSelectbox = DOMCache.searchType;
var iterationLimitInput = DOMCache.iterationLimit;
var depthLimitInput = DOMCache.depthLimit;
var searchButton = DOMCache.search;
var searchStopButton = DOMCache.searchStop;
var searchStepButton = DOMCache.searchStep;
var expandedNodeCheckbox = DOMCache.expandedNodeCheck;
var visualizationCheckbox = DOMCache.visualizationCheck;
var themeSelector = DOMCache.themeSelector;
var soundEnabledCheckbox = DOMCache.soundEnabled;
var timeLimitInput = DOMCache.timeLimit;
var heuristicFunctionSelect = DOMCache.heuristicFunction;

var searchStepOptions = null;

// Progress Indicator Manager
var ProgressIndicator = {
    show: function(maxIterations) {
        if (DOMCache.searchProgress) {
            DOMCache.searchProgress.style.display = 'block';
            this.update(0, maxIterations);
        }
    },
    
    hide: function() {
        if (DOMCache.searchProgress) {
            DOMCache.searchProgress.style.display = 'none';
        }
    },
    
    update: function(currentIteration, maxIterations) {
        if (!DOMCache.searchProgress) return;
        
        var percentage = maxIterations > 0 ? Math.round((currentIteration / maxIterations) * 100) : 0;
        percentage = Math.min(percentage, 100);
        
        if (DOMCache.progressPercentage) {
            DOMCache.progressPercentage.textContent = percentage + '%';
        }
        
        if (DOMCache.progressFill) {
            DOMCache.progressFill.style.width = percentage + '%';
        }
        
        if (DOMCache.progressStats) {
            DOMCache.progressStats.textContent = 'Iteration ' + currentIteration + ' / ' + maxIterations;
        }
    },
    
    setTimeLimit: function(timeLimit) {
        if (DOMCache.progressStats) {
            DOMCache.progressStats.textContent = 'Time limit: ' + timeLimit + ' seconds';
        }
    }
};

// Desktop layout for all devices
if (typeof bodyScrollLock !== 'undefined') {
    bodyScrollLock.disableBodyScroll(controlsDiv);
}

if (randomizeButton) {
    randomizeButton.addEventListener('click', function() {
        Board.clearReplay();
        try {
            var success = game.randomize();
            if (success) {
                Board.draw(game.state);
                if (typeof NavigationManager !== 'undefined') {
                    NavigationManager.init([]);
                }
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.play('click');
                }
            } else {
                alert('Failed to randomize puzzle. Please try again.');
            }
        } catch (error) {
            console.error('Randomization error:', error.message);
            alert('Error during randomization: ' + error.message);
        }
    }, false);
}

if (customInputButton) {
    customInputButton.addEventListener('click', function() {
        Board.clearReplay();
        if (typeof CustomStateManager !== 'undefined') {
            CustomStateManager.show();
        }
        if (typeof SoundManager !== 'undefined') {
            SoundManager.play('click');
        }
    }, false);
}

if (searchButton) {
    searchButton.addEventListener('click', function() {
    Board.clearReplay();
    searchStepOptions = null;

    var initialNode = new Node({state: game.state});
    var iterationLimit = parseInt(iterationLimitInput.value, 10);
    var depthLimit = parseInt(depthLimitInput.value, 10);
    var timeLimit = timeLimitInput ? parseInt(timeLimitInput.value, 10) * 1000 : 30000;
    var heuristicType = heuristicFunctionSelect ? heuristicFunctionSelect.value : 'manhattan';

    if (isNaN(iterationLimit))
        return alert('Invalid iteration limit');

    if (isNaN(depthLimit))
        return alert('Invalid depth limit');

    if (isNaN(timeLimit) || timeLimit <= 0)
        timeLimit = 30000;

    // Check if puzzle is solvable before starting search
    if (!game.isSolvable()) {
        alert('This puzzle configuration is not solvable. Please randomize or enter a different state.');
        return;
    }

    searchButton.style.display = 'none';
    searchStopButton.style.display = 'block';
    
    // Hide replay button during search
    if (DOMCache.replayButton) {
        DOMCache.replayButton.style.display = 'none';
    }

    // Show progress indicator for searches with high iteration limits
    if (iterationLimit > 100) {
        ProgressIndicator.show(iterationLimit);
    }

    if (typeof SoundManager !== 'undefined') {
        SoundManager.play('click');
    }
    search({
        node: initialNode,
        iterationLimit: iterationLimit,
        depthLimit: depthLimit,
        timeLimit: timeLimit,
        heuristicType: heuristicType,
        expandCheckOptimization: expandedNodeCheckbox.checked,
        type: searchTypeSelectbox.value,
        callback: searchCallback
    });
}, false);
}

if (searchStepButton) {
    searchStepButton.addEventListener('click', function() {
    Board.clearReplay();

    if (searchStepOptions)
        return search(searchStepOptions);

    var initialNode = new Node({state: game.state});
    var iterationLimit = parseInt(iterationLimitInput.value, 10);
    var depthLimit = parseInt(depthLimitInput.value, 10);
    var heuristicType = heuristicFunctionSelect ? heuristicFunctionSelect.value : 'manhattan';

    if (isNaN(iterationLimit))
        return alert('Invalid iteration limit');

    if (isNaN(depthLimit))
        return alert('Invalid depth limit');

    // No time limit for step search - set to a very high value
    search({
        node: initialNode,
        iterationLimit: iterationLimit,
        depthLimit: depthLimit,
        timeLimit: Number.MAX_SAFE_INTEGER,
        heuristicType: heuristicType,
        expandCheckOptimization: expandedNodeCheckbox.checked,
        type: searchTypeSelectbox.value,
        stepCallback: stepCallback,
        callback: searchCallback
    });
}, false);
}

if (searchStopButton) {
    searchStopButton.addEventListener('click', function() {
    Board.clearReplay();
    searchButton.style.display = 'block';
    searchStopButton.style.display = 'none';

    // Hide progress indicator
    ProgressIndicator.hide();

    window.searchStopped = true;
    setTimeout(function() {
        window.searchStopped = false;
    }, 5);
    searchStepOptions = null;

    Board.draw(game.state);
}, false);
}

// Replay button event listener
if (DOMCache.replayButton) {
    DOMCache.replayButton.addEventListener('click', function() {
        if (typeof replayWinnerNode === 'function') {
            replayWinnerNode();
        }
        if (typeof SoundManager !== 'undefined') {
            SoundManager.play('click');
        }
    }, false);
}

// Pause replay button event listener
if (DOMCache.pauseReplayButton) {
    DOMCache.pauseReplayButton.addEventListener('click', function() {
        if (typeof Board !== 'undefined' && typeof Board.pauseReplay === 'function') {
            Board.pauseReplay();
        }
        if (typeof SoundManager !== 'undefined') {
            SoundManager.play('click');
        }
    }, false);
}

function searchCallback(err, options) {
    document.getElementById('board').classList.remove('search-animation');
    
    // Hide progress indicator
    ProgressIndicator.hide();
    
    var expandedNodesLength = _.size(options.expandedNodes);
    var solutionCost = err ? 0 : options.node.cost;
    var solutionPath = err ? [] : getSolutionPath(options.node);
    
    // Update final graph metrics
    if (typeof GraphManager !== 'undefined') {
        var finalGraphOptions = _.assign({}, options, {
            isSearchComplete: true,
            isError: !!err,
            solutionPath: solutionPath,
            errorType: err ? err.errorType : null
        });
        GraphManager.updateChart(finalGraphOptions);
    }
    

    window.winnerNode = err ? null : options.node

    searchButton.style.display = 'block';
    searchStopButton.style.display = 'none';
    
    // Show/hide replay button based on search result
    if (!err && DOMCache.replayButton) {
        DOMCache.replayButton.style.display = 'block';
    } else if (DOMCache.replayButton) {
        DOMCache.replayButton.style.display = 'none';
    }

    //game.state = options.node.state;
    Board.draw(options.node.state);
    
    // Initialize navigation with solution path
    if (!err && options.node) {
        if (typeof NavigationManager !== 'undefined') {
            NavigationManager.init(getSolutionPath(options.node));
        }
        if (typeof SoundManager !== 'undefined') {
            SoundManager.play('solve');
        }
    } else {
        if (typeof NavigationManager !== 'undefined') {
        NavigationManager.init([]);
    }
        if (typeof SoundManager !== 'undefined') {
            SoundManager.play('error');
        }
    }

    // Draw
    if (visualizationCheckbox.checked) {
        var visualizationData = Visualization.importData(
            options.expandedNodes,
            options.frontierList,
            err ? null : options.node
        );
        Visualization.draw(visualizationData);
    }
}

function stepCallback(options) {
    searchStepOptions = options;

    Board.draw(options.node.state);


    // Draw
    if (visualizationCheckbox.checked) {
        var visualizationData = Visualization.importData(
            options.expandedNodes,
            options.frontierList,
            options.node,
            '#ffb366'
        );
    }
    Visualization.draw(visualizationData);
}

function getSolutionPath(node) {
    var path = [];
    var current = node;
    while (current) {
        path.unshift(current.state);
        current = current.parent;
    }
    return path;
}

function replayWinnerNode() {
    if (!window.winnerNode)
        return alert('Winner node could not found');

    if (window.isReplaying)
        return Board.clearReplay();

    Board.draw(game.state);
    
    // Set animation duration before adding animation class
    var animationSpeed = 500; // Fixed animation speed
    Board.setAnimationDuration(animationSpeed);
    
    setTimeout(function() {
        boardDiv.classList.add('animation');
    }, 5);

    var moves = [];

    var traverse = function(node) {
        moves.unshift(node.state);
        if (node.parent) traverse(node.parent)
    }

    traverse(window.winnerNode);
    Board.replay(moves);
}

// Theme selector functionality
var themeSelector = document.getElementById('themeSelector');
if (themeSelector) {
    themeSelector.addEventListener('change', function() {
        var newTheme = this.value;
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (typeof SoundManager !== 'undefined') {
            SoundManager.play('click');
        }
    }, false);
}

// Sound toggle functionality
if (soundEnabledCheckbox) {
    soundEnabledCheckbox.addEventListener('change', function() {
        SoundManager.enabled = this.checked;
        localStorage.setItem('soundEnabled', this.checked);
    }, false);
}


// Panel toggle functionality
var educationModeCheckbox = document.getElementById('educationMode');
var performanceModeCheckbox = document.getElementById('performanceMode');
var realTimeGraphsCheckbox = document.getElementById('realTimeGraphs');

if (educationModeCheckbox) {
    educationModeCheckbox.addEventListener('change', function() {
        if (typeof EducationManager !== 'undefined') {
            EducationManager.enabled = this.checked;
            if (this.checked) {
                EducationManager.show();
            } else {
                EducationManager.hide();
            }
        }
    });
}

if (performanceModeCheckbox) {
    performanceModeCheckbox.addEventListener('change', function() {
        if (typeof PerformanceManager !== 'undefined') {
            // Show performance panels on all devices now
            if (this.checked) {
                PerformanceManager.show();
            } else {
                PerformanceManager.hide();
            }
        }
        localStorage.setItem('performanceMode', this.checked);
    });
}

if (realTimeGraphsCheckbox) {
    realTimeGraphsCheckbox.addEventListener('change', function() {
        if (typeof GraphManager !== 'undefined') {
            // Show graph panels on all devices now
            if (this.checked) {
                GraphManager.show();
            } else {
                GraphManager.hide();
            }
        }
        localStorage.setItem('realTimeGraphs', this.checked);
    });
}

// Desktop layout for all devices - remove mobile/tablet detection
function isMobile() {
    return false; // Always return false to maintain desktop layout
}

function isTablet() {
    return false; // Always return false to maintain desktop layout
}

function isMobileOrTablet() {
    return false; // Always return false to maintain desktop layout
}

// Load saved settings
document.addEventListener('DOMContentLoaded', function() {
    // Initialize performance optimizations
    Game.initManhattanTable();
    
    // Initialize the game
    game = new Game();
    Board.draw(game.state);
    
    var savedTheme = localStorage.getItem('theme') || 'light';
    var savedSoundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    
    // Default performance mode and graphs to true on all devices
    var defaultPerformanceMode = true;
    var defaultGraphsMode = true;
    
    var savedPerformanceMode = localStorage.getItem('performanceMode') !== null ? 
        localStorage.getItem('performanceMode') !== 'false' : defaultPerformanceMode;
    var savedGraphsMode = localStorage.getItem('realTimeGraphs') !== null ? 
        localStorage.getItem('realTimeGraphs') !== 'false' : defaultGraphsMode;
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeSelector) {
        themeSelector.value = savedTheme;
    }
    
    if (soundEnabledCheckbox) {
        soundEnabledCheckbox.checked = savedSoundEnabled;
    }
    if (typeof SoundManager !== 'undefined') {
        SoundManager.enabled = savedSoundEnabled;
    }
    
    // Set default enabled states
    if (performanceModeCheckbox) {
        performanceModeCheckbox.checked = savedPerformanceMode;
        if (savedPerformanceMode && !isMobileOrTablet() && typeof PerformanceManager !== 'undefined') {
            PerformanceManager.show();
        }
    }
    
    if (realTimeGraphsCheckbox) {
        realTimeGraphsCheckbox.checked = savedGraphsMode;
        if (savedGraphsMode && !isMobileOrTablet() && typeof GraphManager !== 'undefined') {
            GraphManager.show();
        }
    }
    
    // Initialize managers
    if (typeof PerformanceManager !== 'undefined') {
        PerformanceManager.init();
    }
    if (typeof GraphManager !== 'undefined') {
        GraphManager.init();
    }
    if (typeof EducationManager !== 'undefined') {
        EducationManager.init();
    }
    if (typeof ComparisonManager !== 'undefined') {
        ComparisonManager.init();
    }
    
    // Initialize draggable panels
    if (typeof DraggableManager !== 'undefined') {
        DraggableManager.init();
    }
    
    // Handle window resize - maintain desktop layout on all devices
    window.addEventListener('resize', function() {
        // Desktop layout maintained on all screen sizes
        // Users can zoom in/out as needed
        var performanceCheckbox = document.getElementById('performanceMode');
        var graphsCheckbox = document.getElementById('realTimeGraphs');
        
        // Always show panels if enabled, regardless of screen size
        if (performanceCheckbox && performanceCheckbox.checked) {
            if (typeof PerformanceManager !== 'undefined') {
                PerformanceManager.show();
            }
        }
        if (graphsCheckbox && graphsCheckbox.checked) {
            if (typeof GraphManager !== 'undefined') {
                GraphManager.show();
            }
        }
    });
});
