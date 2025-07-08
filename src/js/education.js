var EducationManager = {
    enabled: false,
    currentAlgorithm: '',
    
    algorithmInfo: {
        breadthFirst: {
            name: 'Breadth-First Search',
            description: 'Explores all nodes at the current depth before moving to the next depth level.',
            steps: [
                'Start with initial state in queue',
                'Remove first node from queue',
                'Check if goal state is reached',
                'Add all child nodes to end of queue',
                'Repeat until solution found'
            ],
            pros: ['Guarantees shortest path', 'Complete algorithm'],
            cons: ['High memory usage', 'Can be slow for deep solutions']
        },
        depthFirst: {
            name: 'Depth-First Search',
            description: 'Explores as far as possible along each branch before backtracking.',
            steps: [
                'Start with initial state on stack',
                'Remove top node from stack',
                'Check if goal state is reached',
                'Add all child nodes to top of stack',
                'Repeat until solution found'
            ],
            pros: ['Low memory usage', 'Fast for solutions near starting point'],
            cons: ['May not find optimal solution', 'Can get stuck in infinite loops']
        },
        uniformCost: {
            name: 'Uniform Cost Search',
            description: 'Explores nodes in order of their path cost from start.',
            steps: [
                'Start with initial state in priority queue',
                'Remove node with lowest cost',
                'Check if goal state is reached',
                'Add child nodes with updated costs',
                'Repeat until solution found'
            ],
            pros: ['Finds optimal solution', 'Considers path costs'],
            cons: ['Can be slow', 'Requires priority queue']
        },
        greedyBest: {
            name: 'Greedy Best-First Search',
            description: 'Uses heuristic function to guide search toward goal.',
            steps: [
                'Start with initial state',
                'Calculate heuristic for each node',
                'Choose node with best heuristic',
                'Expand chosen node',
                'Repeat until goal found'
            ],
            pros: ['Fast when heuristic is good', 'Memory efficient'],
            cons: ['May not find optimal solution', 'Depends on heuristic quality']
        },
        aStar: {
            name: 'A* Search',
            description: 'Combines path cost and heuristic for optimal pathfinding.',
            steps: [
                'Calculate f(n) = g(n) + h(n) for each node',
                'Choose node with lowest f(n)',
                'Expand chosen node',
                'Update costs for neighbors',
                'Repeat until goal found'
            ],
            pros: ['Optimal solution', 'Efficient with good heuristic'],
            cons: ['Requires good heuristic', 'More complex implementation']
        },
        iterativeDeepening: {
            name: 'Iterative Deepening',
            description: 'Combines benefits of breadth-first and depth-first search.',
            steps: [
                'Start with depth limit 0',
                'Perform depth-first search up to limit',
                'If no solution, increase depth limit',
                'Repeat until solution found',
                'Return optimal solution'
            ],
            pros: ['Optimal solution', 'Memory efficient'],
            cons: ['Repeats work', 'Can be slower than BFS']
        }
    },
    
    init: function() {
        this.createEducationPanel();
        this.bindEvents();
    },
    
    createEducationPanel: function() {
        var panel = document.createElement('div');
        panel.id = 'educationPanel';
        panel.className = 'education-panel';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <div class="education-header">
                <h3>Algorithm Guide</h3>
                <button id="closeEducation">×</button>
            </div>
            <div class="education-content">
                <div class="algorithm-info">
                    <h4 id="algorithmName"></h4>
                    <p id="algorithmDescription"></p>
                    
                    <div class="algorithm-steps">
                        <h5>Steps:</h5>
                        <ol id="algorithmSteps"></ol>
                    </div>
                    
                    <div class="algorithm-pros-cons">
                        <div class="pros">
                            <h5>Pros:</h5>
                            <ul id="algorithmPros"></ul>
                        </div>
                        <div class="cons">
                            <h5>Cons:</h5>
                            <ul id="algorithmCons"></ul>
                        </div>
                    </div>
                </div>
                
                <div class="current-step">
                    <h5>Current Step:</h5>
                    <p id="currentStepDescription">Ready to start...</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    },
    
    bindEvents: function() {
        var educationCheckbox = document.getElementById('educationMode');
        var closeButton = document.getElementById('closeEducation');
        
        if (educationCheckbox) {
            educationCheckbox.addEventListener('change', this.toggle.bind(this));
        }
        
        if (closeButton) {
            closeButton.addEventListener('click', this.hide.bind(this));
        }
    },
    
    toggle: function() {
        var checkbox = document.getElementById('educationMode');
        this.enabled = checkbox.checked;
        
        if (this.enabled) {
            this.show();
        } else {
            this.hide();
        }
        
        localStorage.setItem('educationMode', this.enabled);
    },
    
    show: function() {
        var panel = document.getElementById('educationPanel');
        if (panel) {
            panel.style.display = 'block';
            this.updateAlgorithmInfo();
        }
    },
    
    hide: function() {
        var panel = document.getElementById('educationPanel');
        if (panel) {
            panel.style.display = 'none';
        }
        
        var checkbox = document.getElementById('educationMode');
        if (checkbox) {
            checkbox.checked = false;
        }
        
        this.enabled = false;
        localStorage.setItem('educationMode', false);
    },
    
    updateAlgorithmInfo: function() {
        var searchType = document.getElementById('searchType');
        if (!searchType) return;
        
        this.currentAlgorithm = searchType.value;
        var info = this.algorithmInfo[this.currentAlgorithm];
        
        if (!info) return;
        
        document.getElementById('algorithmName').textContent = info.name;
        document.getElementById('algorithmDescription').textContent = info.description;
        
        var stepsList = document.getElementById('algorithmSteps');
        stepsList.innerHTML = '';
        info.steps.forEach(function(step) {
            var li = document.createElement('li');
            li.textContent = step;
            stepsList.appendChild(li);
        });
        
        var prosList = document.getElementById('algorithmPros');
        prosList.innerHTML = '';
        info.pros.forEach(function(pro) {
            var li = document.createElement('li');
            li.textContent = pro;
            prosList.appendChild(li);
        });
        
        var consList = document.getElementById('algorithmCons');
        consList.innerHTML = '';
        info.cons.forEach(function(con) {
            var li = document.createElement('li');
            li.textContent = con;
            consList.appendChild(li);
        });
    },
    
    updateCurrentStep: function(message) {
        if (!this.enabled) return;
        
        var stepDesc = document.getElementById('currentStepDescription');
        if (stepDesc) {
            stepDesc.textContent = message;
        }
    },
    
    onSearchStart: function() {
        this.updateCurrentStep('Starting search algorithm...');
    },
    
    onNodeExpanded: function(node, iteration) {
        this.updateCurrentStep(`Iteration ${iteration}: Exploring state ${node.state}`);
    },
    
    onSolutionFound: function(node) {
        this.updateCurrentStep(`Solution found! Final state: ${node.state}`);
    },
    
    onSearchFailed: function() {
        this.updateCurrentStep('Search failed - no solution found within limits.');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    EducationManager.init();
    
    // Load saved education mode setting
    var savedEducationMode = localStorage.getItem('educationMode') === 'true';
    var checkbox = document.getElementById('educationMode');
    if (checkbox) {
        checkbox.checked = savedEducationMode;
        EducationManager.enabled = savedEducationMode;
        if (savedEducationMode) {
            EducationManager.show();
        }
    }
    
    // Update algorithm info when search type changes
    var searchType = document.getElementById('searchType');
    if (searchType) {
        searchType.addEventListener('change', function() {
            if (EducationManager.enabled) {
                EducationManager.updateAlgorithmInfo();
            }
        });
    }
});