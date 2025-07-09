var SearchType = {
    BREADTH_FIRST: 'breadthFirst',
    UNIFORM_COST: 'uniformCost',
    DEPTH_FIRST: 'depthFirst',
    ITERATIVE_DEEPENING: 'iterativeDeepening',
    GREEDY_BEST: 'greedyBest',
    A_STAR: 'aStar'
};

function search(opt_options) {
    var options = _.assign({
        node: null,
        frontierList: [],
        expandedNodes: {},
        iteration: 0,
        iterationLimit: 1000,
        depthLimit: 0,
        timeLimit: 30000, // 30 seconds default
        expandCheckOptimization: false,
        callback: function() {},
        stepCallback: null,
        type: SearchType.BREADTH_FIRST,
        maxFrontierListLength: 0,
        maxExpandedNodesLength: 0,
        iterativeDeepeningIndex: 0,
        heuristicType: 'manhattan'
    }, opt_options || {});

    // Start performance measurement (skip during comparison tests)
    if (options.iteration === 0) {
        if (!options.isComparisonTest && typeof PerformanceManager !== 'undefined') {
            PerformanceManager.startMeasurement();
        }
        options.searchStartTime = performance.now();
    }

    // Skip board updates during comparison tests
    if (!options.isComparisonTest) {
        document.getElementById('board').classList.add('search-animation');
        Board.draw(options.node.state);
    }

    // Education mode updates (skip during comparison tests)
    if (!options.isComparisonTest && typeof EducationManager !== 'undefined') {
        if (options.iteration === 0) {
            EducationManager.onSearchStart();
        }
        EducationManager.onNodeExpanded(options.node, options.iteration);
    }

    if (options.node.game.isFinished()) {
        if (!options.isComparisonTest) {
            document.getElementById('board').classList.remove('search-animation');
        }
        if (!options.isComparisonTest && typeof EducationManager !== 'undefined') {
            EducationManager.onSolutionFound(options.node);
        }
        if (!options.isComparisonTest && typeof PerformanceManager !== 'undefined') {
            PerformanceManager.endMeasurement(true, options.node.depth);
        }
        return options.callback(null, options);
    }

    // Expand current node
    var expandedList = options.node.expand();
    options.expandedNodes[options.node.state] = options.node;
    options.maxExpandedNodesLength = Math.max(options.maxExpandedNodesLength, _.size(options.expandedNodes));

    // Filter just-expanded nodes
    var expandedUnexploredList = expandedList.filter(function(node) {
        // Check iterative deeping index
        if (options.type == SearchType.ITERATIVE_DEEPENING && node.depth > options.iterativeDeepeningIndex)
            return false;

        // Check depth
        if (options.depthLimit && node.depth > options.depthLimit)
            return false;

        // Check whether node is already expanded (with lower cost)
        var alreadyExpandedNode = options.expandedNodes[node.state];
        if (alreadyExpandedNode && alreadyExpandedNode.cost <= node.cost) return false;

        // Check whether there is a better alternative (lower-cost) in frontier list
        var alternativeNode = _.find(options.frontierList, {state: node.state});
        if (alternativeNode && alternativeNode.cost <= node.cost)
            return false;
        else if (alternativeNode && alternativeNode.cost > node.cost) {
            _.remove(options.frontierList, alternativeNode);
        }

        return true;
    });

    // Add filtered just-expanded nodes into frontier list
    options.frontierList = options.frontierList.concat(expandedUnexploredList);
    options.maxFrontierListLength = Math.max(options.maxFrontierListLength, options.frontierList.length);

    // Check whether desired state is in just-expanded list
    if (options.expandCheckOptimization) {
        var desiredNode = _.find(expandedUnexploredList, function(unexploredNode) {
            return unexploredNode.game.isFinished();
        });

        if (desiredNode) {
            return options.callback(null, _.assign({}, options, {node: desiredNode}));
        }
    }

    // Next call
    var nextNode = getNextNode(options);
    if (!nextNode) {
        if (!options.isComparisonTest && typeof EducationManager !== 'undefined') {
            EducationManager.onSearchFailed();
        }
        return options.callback(new Error('Frontier list is empty'), options);
    }
    
    // Explain node selection for education mode (skip during comparison tests)
    if (!options.isComparisonTest && typeof EducationManager !== 'undefined') {
        EducationManager.onNodeSelected(nextNode, options.frontierList, options.type, options.heuristicType);
    }

    // Iteration check
    options.iteration++;
    if (options.iterationLimit && options.iteration > options.iterationLimit) {
        if (!options.isComparisonTest && typeof EducationManager !== 'undefined') {
            EducationManager.onSearchFailed();
        }
        if (!options.isComparisonTest && typeof PerformanceManager !== 'undefined') {
            PerformanceManager.endMeasurement(false, 0);
        }
        return options.callback(new Error('Iteration limit reached'), options);
    }

    // Time limit check
    if (options.searchStartTime && options.timeLimit) {
        var elapsed = performance.now() - options.searchStartTime;
        if (elapsed > options.timeLimit) {
            if (!options.isComparisonTest && typeof EducationManager !== 'undefined') {
                EducationManager.onSearchFailed();
            }
            if (!options.isComparisonTest && typeof PerformanceManager !== 'undefined') {
                PerformanceManager.endMeasurement(false, 0);
            }
            return options.callback(new Error('Time limit reached'), options);
        }
    }

    if (window.searchStopped && !options.isComparisonTest) {
        window.searchStopped = false;
        if (typeof EducationManager !== 'undefined') {
            EducationManager.updateCurrentStep('Search stopped by user');
        }
        if (typeof PerformanceManager !== 'undefined') {
            PerformanceManager.endMeasurement(false, 0);
        }
        return options.callback(new Error('Search stopped'), options);
    }

    // Update performance metrics (skip during comparison tests)
    if (!options.isComparisonTest && typeof PerformanceManager !== 'undefined') {
        PerformanceManager.updateMetrics(options);
    }
    
    // Update real-time graphs (skip during comparison tests)
    if (!options.isComparisonTest && typeof GraphManager !== 'undefined') {
        var graphOptions = _.assign({}, options, {currentNode: nextNode});
        GraphManager.updateChart(graphOptions);
    }
    
    // Update progress indicator (skip during comparison tests)
    if (!options.isComparisonTest && typeof ProgressIndicator !== 'undefined') {
        ProgressIndicator.update(options.iteration, options.iterationLimit);
    }

    if (options.stepCallback) {
        options.stepCallback(_.assign(options, {node: nextNode}));
    } else {
        setTimeout(function() {
            search(_.assign(options, {node: nextNode}));
        }, 0);
    }
}


function getNextNode(options) {
    // Store frontier snapshot for education explanations
    var frontierSnapshot = options.frontierList.slice();
    
    var selectedNode;
    
    switch (options.type) {
        case SearchType.BREADTH_FIRST:
            selectedNode = options.frontierList.shift();
            break;
        case SearchType.DEPTH_FIRST:
            selectedNode = options.frontierList.pop();
            break;
        case SearchType.UNIFORM_COST:
            selectedNode = _.minBy(options.frontierList, function(node) {
                return node.cost;
            });
            _.remove(options.frontierList, selectedNode);
            break;
        case SearchType.ITERATIVE_DEEPENING:
            var nextNode = options.frontierList.pop();

            // Start from top
            if (!nextNode) {
                options.iterativeDeepeningIndex++;

                if (options.depthLimit && options.iterativeDeepeningIndex > options.depthLimit)
                    return;

                options.frontierList = [];
                options.expandedNodes = {};

                return new Node({state: game.state});
            }

            selectedNode = nextNode;
            break;
        case SearchType.GREEDY_BEST:
            selectedNode = _.minBy(options.frontierList, function(node) {
                return node.game.getHeuristicValue(options.heuristicType);
            });
            _.remove(options.frontierList, selectedNode);
            break;
        case SearchType.A_STAR:
            selectedNode = _.minBy(options.frontierList, function(node) {
                return node.game.getHeuristicValue(options.heuristicType) + node.cost;
            });
            _.remove(options.frontierList, selectedNode);
            break;
        default:
            throw new Error('Unsupported search type');
    }
    
    // Store frontier info for education explanations
    if (selectedNode && typeof EducationManager !== 'undefined') {
        selectedNode._frontierSnapshot = frontierSnapshot;
        selectedNode._algorithmType = options.type;
        selectedNode._heuristicType = options.heuristicType;
    }
    
    return selectedNode;
}
