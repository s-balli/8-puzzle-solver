//var game = new Game('203156478');
var game = new Game();
Board.draw(game.state);

var boardDiv = document.getElementById('board');
var controlsDiv = document.getElementById('controls');
var randomizeButton = document.getElementById('randomize');
var customInputButton = document.getElementById('customInput');
var searchTypeSelectbox = document.getElementById('searchType');
var iterationLimitInput = document.getElementById('iterationLimit');
var depthLimitInput = document.getElementById('depthLimit');
var searchButton = document.getElementById('search');
var searchStopButton = document.getElementById('searchStop');
var searchStepButton = document.getElementById('searchStep');
var expandedNodeCheckbox = document.getElementById('expandedNodeCheck');
var searchResultDiv = document.getElementById('searchResult');
var visualizationCheckbox = document.getElementById('visualizationCheck');
var themeToggleButton = document.getElementById('themeToggle');
var soundEnabledCheckbox = document.getElementById('soundEnabled');
var prevStepButton = document.getElementById('prevStep');
var nextStepButton = document.getElementById('nextStep');
var resetStepsButton = document.getElementById('resetSteps');

var searchStepOptions = null;
var timeLimitInput = document.getElementById('timeLimit');
var heuristicFunctionSelect = document.getElementById('heuristicFunction');

// Disable body scroll for mobile
bodyScrollLock.disableBodyScroll(controlsDiv);

randomizeButton.addEventListener('click', function() {
    Board.clearReplay();
    game.randomize();
    Board.draw(game.state);
    searchResultDiv.innerHTML = '';
    NavigationManager.init([]);
    SoundManager.play('click');
}, false);

customInputButton.addEventListener('click', function() {
    Board.clearReplay();
    game.state = prompt('Enter game state, from top-left to right-bottom, 10 characters, e.g. "012345678"');
    Board.draw(game.state);
    searchResultDiv.innerHTML = '';
    NavigationManager.init([]);
    SoundManager.play('click');
}, false);

searchButton.addEventListener('click', function() {
    Board.clearReplay();
    searchStepOptions = null;

    var initialNode = new Node({state: game.state});
    var iterationLimit = parseInt(iterationLimitInput.value, 10);
    var depthLimit = parseInt(depthLimitInput.value, 10);
    var timeLimit = parseInt(timeLimitInput.value, 10) * 1000; // Convert to milliseconds
    var heuristicType = heuristicFunctionSelect.value;

    if (isNaN(iterationLimit))
        return alert('Invalid iteration limit');

    if (isNaN(depthLimit))
        return alert('Invalid depth limit');

    if (isNaN(timeLimit))
        return alert('Invalid time limit');

    searchResultDiv.innerHTML = '';
    searchButton.style.display = 'none';
    searchStopButton.style.display = 'block';

    SoundManager.play('click');
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

searchStepButton.addEventListener('click', function() {
    Board.clearReplay();

    if (searchStepOptions)
        return search(searchStepOptions);

    var initialNode = new Node({state: game.state});
    var iterationLimit = parseInt(iterationLimitInput.value, 10);
    var depthLimit = parseInt(depthLimitInput.value, 10);
    var timeLimit = parseInt(timeLimitInput.value, 10) * 1000; // Convert to milliseconds
    var heuristicType = heuristicFunctionSelect.value;

    if (isNaN(iterationLimit))
        return alert('Invalid iteration limit');

    if (isNaN(depthLimit))
        return alert('Invalid depth limit');

    if (isNaN(timeLimit))
        return alert('Invalid time limit');

    search({
        node: initialNode,
        iterationLimit: iterationLimit,
        depthLimit: depthLimit,
        timeLimit: timeLimit,
        heuristicType: heuristicType,
        expandCheckOptimization: expandedNodeCheckbox.checked,
        type: searchTypeSelectbox.value,
        stepCallback: stepCallback,
        callback: searchCallback
    });
}, false);

searchStopButton.addEventListener('click', function() {
    Board.clearReplay();
    searchResultDiv.innerHTML = '';
    searchButton.style.display = 'block';
    searchStopButton.style.display = 'none';

    window.searchStopped = true;
    setTimeout(function() {
        window.searchStopped = false;
    }, 5);
    searchStepOptions = null;

    Board.draw(game.state);
}, false);

function searchCallback(err, options) {
    document.getElementById('board').classList.remove('search-animation');
    
    var expandedNodesLength = _.size(options.expandedNodes);
    var solutionCost = err ? 0 : options.node.cost;
    var solutionPath = err ? [] : getSolutionPath(options.node);
    
    searchResultDiv.innerHTML = (err ? err : '<span class="solution-info">Solved! Depth: ' + options.node.depth + '</span>') + ' <br/>' +
        ('Iteration: ' + options.iteration) + '<br/>' +
        (!err ? '<span class="cost-info">Solution Cost: ' + solutionCost + '</span><br/>' : '') +
        (!err ? '<span class="cost-info">Solution Path Length: ' + solutionPath.length + '</span><br/>' : '') +
        '<br/>' +
        ('Expanded nodes: ' + expandedNodesLength + ' / ' + options.maxExpandedNodesLength) + '<br/>' +
        ('Frontier nodes: ' + options.frontierList.length + ' / ' + options.maxFrontierListLength) +
        (err ? '' : '<br/><br/><button id="replayButton" onclick="replayWinnerNode()">Replay solution</button>');

    window.winnerNode = err ? null : options.node

    searchButton.style.display = 'block';
    searchStopButton.style.display = 'none';

    //game.state = options.node.state;
    Board.draw(options.node.state);
    
    // Initialize navigation with solution path
    if (!err && options.node) {
        NavigationManager.init(getSolutionPath(options.node));
        SoundManager.play('solve');
    } else {
        NavigationManager.init([]);
        SoundManager.play('error');
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

    var expandedNodesLength = _.size(options.expandedNodes);
    searchResultDiv.innerHTML = 'Stepped <br/>' +
        ('Iteration: ' + options.iteration) + '<br/><br/>' +
        ('Expanded nodes: ' + expandedNodesLength + ' / ' + options.maxExpandedNodesLength) + '<br/>' +
        ('Frontier nodes: ' + options.frontierList.length + ' / ' + options.maxFrontierListLength);

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

// Theme toggle functionality
themeToggleButton.addEventListener('click', function() {
    var currentTheme = document.documentElement.getAttribute('data-theme');
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggleButton.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    
    localStorage.setItem('theme', newTheme);
    SoundManager.play('click');
}, false);

// Sound toggle functionality
soundEnabledCheckbox.addEventListener('change', function() {
    SoundManager.enabled = this.checked;
    localStorage.setItem('soundEnabled', this.checked);
}, false);

// Navigation button functionality
prevStepButton.addEventListener('click', function() {
    NavigationManager.prevStep();
}, false);

nextStepButton.addEventListener('click', function() {
    NavigationManager.nextStep();
}, false);

resetStepsButton.addEventListener('click', function() {
    NavigationManager.reset();
}, false);

// Load saved settings
document.addEventListener('DOMContentLoaded', function() {
    var savedTheme = localStorage.getItem('theme') || 'light';
    var savedSoundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggleButton.textContent = savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    
    soundEnabledCheckbox.checked = savedSoundEnabled;
    SoundManager.enabled = savedSoundEnabled;
});
