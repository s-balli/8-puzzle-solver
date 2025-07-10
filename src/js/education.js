var EducationManager = {
    enabled: false,
    currentAlgorithm: '',
    tutorialMode: false,
    currentTutorial: null,
    currentTutorialStep: 0,
    whyExplanationsEnabled: false,
    
    // Algorithm info now uses translation keys
    algorithmInfo: {
        breadthFirst: { key: 'breadthFirst' },
        depthFirst: { key: 'depthFirst' },
        uniformCost: { key: 'uniformCost' },
        greedyBest: { key: 'greedyBest' },
        aStar: { key: 'aStar' },
        iterativeDeepening: { key: 'iterativeDeepening' }
    },
    
    // Heuristic info now uses translation keys
    heuristicInfo: {
        manhattan: { key: 'manhattan' },
        euclidean: { key: 'euclidean' },
        misplaced: { key: 'misplaced' },
        linearConflict: { key: 'linearConflict' },
        walkingDistance: { key: 'walkingDistance' },
        cornerTiles: { key: 'cornerTiles' },
        maxHeuristic: { key: 'maxHeuristic' }
    },
    
    tutorials: {
        'beginner-bfs': {
            name: 'Breadth-First Search Tutorial',
            algorithm: 'breadthFirst',
            heuristic: null,
            description: 'Learn BFS step-by-step with a simple puzzle',
            initialState: '281043765',
            steps: [
                {
                    type: 'intro',
                    title: 'Welcome to BFS Tutorial',
                    description: 'We\'ll solve this puzzle using Breadth-First Search. BFS explores all nodes at the current depth before moving deeper.',
                    highlight: null
                },
                {
                    type: 'setup',
                    title: 'Initial Setup',
                    description: 'We start with this puzzle state. BFS adds the initial state to a queue (FIFO - First In, First Out).',
                    highlight: 'frontier'
                },
                {
                    type: 'step',
                    title: 'First Expansion',
                    description: 'Remove the first node from queue and expand it. Add all its children to the end of the queue.',
                    highlight: 'expansion'
                },
                {
                    type: 'step',
                    title: 'Continue Search',
                    description: 'Keep removing nodes from front of queue and expanding them. This ensures we explore all depth-1 nodes before depth-2.',
                    highlight: 'frontier'
                }
            ]
        },
        'intermediate-astar': {
            name: 'A* Search Tutorial',
            algorithm: 'aStar',
            heuristic: 'manhattan',
            description: 'Master A* algorithm with Manhattan heuristic',
            initialState: '281043765',
            steps: [
                {
                    type: 'intro',
                    title: 'Welcome to A* Tutorial',
                    description: 'A* combines path cost g(n) and heuristic h(n) to find optimal solutions efficiently.',
                    highlight: null
                },
                {
                    type: 'setup',
                    title: 'Understanding f(n) = g(n) + h(n)',
                    description: 'A* uses f(n) = g(n) + h(n) where g(n) is cost from start and h(n) is estimated cost to goal.',
                    highlight: 'heuristic'
                },
                {
                    type: 'step',
                    title: 'Node Selection',
                    description: 'A* always selects the node with lowest f(n) value from the frontier.',
                    highlight: 'selection'
                }
            ]
        },
        'advanced-heuristics': {
            name: 'Heuristic Comparison Tutorial',
            algorithm: 'aStar',
            heuristic: 'linearConflict',
            description: 'Compare different heuristics and their effects',
            initialState: '123456078',
            steps: [
                {
                    type: 'intro',
                    title: 'Heuristic Comparison',
                    description: 'Let\'s see how different heuristics affect A* performance on the same puzzle.',
                    highlight: null
                },
                {
                    type: 'comparison',
                    title: 'Manhattan vs Linear Conflict',
                    description: 'Linear Conflict adds penalties for tiles that are in correct row/column but wrong order.',
                    highlight: 'heuristic'
                }
            ]
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
                <h3 data-i18n="education.title">📚 Algorithm & Heuristic Guide</h3>
                <button id="closeEducation">×</button>
            </div>
            <div class="education-content">
                <div class="guide-tabs">
                    <button class="guide-tab active" data-tab="algorithm" data-i18n="education.tabs.algorithm">🔍 Algorithm</button>
                    <button class="guide-tab" data-tab="heuristic" data-i18n="education.tabs.heuristic">🎯 Heuristic</button>
                    <button class="guide-tab" data-tab="tutorial" data-i18n="education.tabs.tutorial">📚 Tutorial</button>
                    <button class="guide-tab" data-tab="why" data-i18n="education.tabs.why">🤔 Why?</button>
                    <button class="guide-tab" data-tab="comparison" data-i18n="education.tabs.comparison">📊 Comparison</button>
                </div>
                
                <div class="tab-content active" id="algorithmTab">
                    <div class="algorithm-info">
                        <h4 id="algorithmName">Select an Algorithm</h4>
                        <p id="algorithmDescription">Choose a search algorithm to see detailed information.</p>
                        
                        <div class="algorithm-steps" id="algorithmStepsSection" style="display: none;">
                            <h5>📋 <span data-i18n="education.steps">Adımlar:</span></h5>
                            <ol id="algorithmSteps"></ol>
                        </div>
                        
                        <div class="algorithm-pros-cons" id="algorithmProsConsSection" style="display: none;">
                            <div class="pros">
                                <h5>✅ <span data-i18n="education.pros">Artıları:</span></h5>
                                <ul id="algorithmPros"></ul>
                            </div>
                            <div class="cons">
                                <h5>❌ <span data-i18n="education.cons">Eksileri:</span></h5>
                                <ul id="algorithmCons"></ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="heuristicTab">
                    <div class="heuristic-info">
                        <h4 id="heuristicName">Select a Heuristic</h4>
                        <p id="heuristicDescription">Choose a heuristic function to see detailed information.</p>
                        
                        <div class="heuristic-formula" id="heuristicFormulaSection" style="display: none;">
                            <h5>📐 <span data-i18n="education.formula">Formül:</span></h5>
                            <code id="heuristicFormula"></code>
                        </div>
                        
                        <div class="heuristic-example" id="heuristicExampleSection" style="display: none;">
                            <h5>💡 <span data-i18n="education.example">Örnek:</span></h5>
                            <p id="heuristicExample"></p>
                        </div>
                        
                        <div class="heuristic-pros-cons" id="heuristicProsConsSection" style="display: none;">
                            <div class="pros">
                                <h5>✅ <span data-i18n="education.pros">Artıları:</span></h5>
                                <ul id="heuristicPros"></ul>
                            </div>
                            <div class="cons">
                                <h5>❌ <span data-i18n="education.cons">Eksileri:</span></h5>
                                <ul id="heuristicCons"></ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="tutorialTab">
                    <div class="tutorial-info">
                        <h4 data-i18n="education.tutorialTitle">📚 Interactive Tutorials</h4>
                        <div class="tutorial-selection">
                            <h5 data-i18n="education.chooseTutorial">Choose a Tutorial:</h5>
                            <div class="tutorial-buttons">
                                <button class="tutorial-btn" data-tutorial="beginner-bfs" data-i18n="education.beginnerBFS">
                                    🟢 Beginner: Breadth-First Search
                                </button>
                                <button class="tutorial-btn" data-tutorial="intermediate-astar" data-i18n="education.intermediateAStar">
                                    🟡 Intermediate: A* Search
                                </button>
                                <button class="tutorial-btn" data-tutorial="advanced-heuristics" data-i18n="education.advancedHeuristics">
                                    🔴 Advanced: Heuristic Comparison
                                </button>
                            </div>
                        </div>
                        
                        <div class="tutorial-content" id="tutorialContent" style="display: none;">
                            <div class="tutorial-header">
                                <h5 id="tutorialTitle" data-i18n="education.tutorialLabel">Tutorial</h5>
                                <div class="tutorial-progress">
                                    <span id="tutorialProgressText">Step 1 of 4</span>
                                    <div class="progress-bar">
                                        <div class="progress-fill" id="tutorialProgressFill"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tutorial-step">
                                <h6 id="tutorialStepTitle">Step Title</h6>
                                <p id="tutorialStepDescription">Step description goes here...</p>
                            </div>
                            
                            <div class="tutorial-controls">
                                <button id="tutorialPrev" disabled data-i18n="education.previousStep">← Previous</button>
                                <button id="tutorialNext" data-i18n="education.nextStep">Next →</button>
                                <button id="tutorialExit" data-i18n="education.exitTutorial">Exit Tutorial</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="whyTab">
                    <div class="why-info">
                        <h4 data-i18n="education.whyTabTitle">🤔 Why This Node?</h4>
                        <div class="why-controls">
                            <label>
                                <input type="checkbox" id="whyExplanationsToggle"> <span id="enableRealTimeText" data-i18n="education.enableRealTimeExplanations">Enable real-time explanations</span>
                            </label>
                            <p id="whyDescription" data-i18n="education.realTimeDesc">Enable real-time explanations to see why specific nodes are chosen.</p>
                        </div>
                        
                        <div class="why-content" id="whyContent">
                            <div class="current-selection" id="currentSelection">
                                <h5 data-i18n="education.currentSelection">Current Node Selection:</h5>
                                <p id="whyExplanation" data-i18n="education.startSearchForExplanations">Start a search to see explanations...</p>
                            </div>
                            
                            <div class="frontier-analysis" id="frontierAnalysis" style="display: none;">
                                <h5 data-i18n="education.frontierAnalysis">Frontier Analysis:</h5>
                                <div class="frontier-stats">
                                    <div class="stat-item">
                                        <span class="stat-label" data-i18n="education.frontierSize">Frontier Size:</span>
                                        <span class="stat-value" id="frontierSizeWhy">0</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label" data-i18n="education.selectedNodeFValue">Selected Node f(n):</span>
                                        <span class="stat-value" id="selectedNodeValue">-</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label" data-i18n="education.selectionReason">Selection Reason:</span>
                                        <span class="stat-value" id="selectionReason">-</span>
                                    </div>
                                </div>
                                
                                <div class="frontier-comparison" id="frontierComparison">
                                    <h6 data-i18n="education.alternativeNodes">Alternative Nodes:</h6>
                                    <div class="alternatives-list" id="alternativesList">
                                        <!-- Populated dynamically -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="comparisonTab">
                    <div class="comparison-info">
                        <h4 data-i18n="education.comparisonTitle">📊 Algorithm vs Heuristic Comparison</h4>
                        <div class="comparison-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th data-i18n="education.aspect">Aspect</th>
                                        <th data-i18n="education.currentAlgorithm">Current Algorithm</th>
                                        <th data-i18n="education.currentHeuristic">Current Heuristic</th>
                                    </tr>
                                </thead>
                                <tbody id="comparisonTableBody">
                                    <tr>
                                        <td data-i18n="education.optimality">Optimality</td>
                                        <td id="algorithmOptimality">-</td>
                                        <td id="heuristicOptimality">-</td>
                                    </tr>
                                    <tr>
                                        <td data-i18n="education.complexity">Complexity</td>
                                        <td id="algorithmComplexity">-</td>
                                        <td id="heuristicComplexity">-</td>
                                    </tr>
                                    <tr>
                                        <td data-i18n="education.memoryUsage">Memory Usage</td>
                                        <td id="algorithmMemory">-</td>
                                        <td id="heuristicMemory">-</td>
                                    </tr>
                                    <tr>
                                        <td data-i18n="education.bestUseCase">Best Use Case</td>
                                        <td id="algorithmUseCase">-</td>
                                        <td id="heuristicUseCase">-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="recommendation" id="recommendation">
                            <h5 data-i18n="education.recommendation">💡 Recommendation:</h5>
                            <p id="recommendationText" data-i18n="education.selectAlgorithmForRecommendation">Select an algorithm and heuristic to see recommendations.</p>
                        </div>
                    </div>
                </div>
                
                <div class="current-step">
                    <h5>⚡ <span data-i18n="education.currentStep">Mevcut Adım:</span></h5>
                    <p id="currentStepDescription" data-i18n="education.ready">Başlamak için hazır...</p>
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
        
        // Tab switching - use setTimeout to ensure DOM is ready
        setTimeout(function() {
            var tabButtons = document.querySelectorAll('.guide-tab');
            tabButtons.forEach(function(button) {
                button.addEventListener('click', function() {
                    EducationManager.switchTab(this.dataset.tab);
                });
            });
        }, 100);
    },
    
    switchTab: function(tabName) {
        // Update tab buttons
        document.querySelectorAll('.guide-tab').forEach(function(btn) {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(function(content) {
            content.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
        
        // Update content based on tab
        if (tabName === 'heuristic') {
            this.updateHeuristicInfo();
        } else if (tabName === 'algorithm') {
            this.updateAlgorithmInfo();
        } else if (tabName === 'tutorial') {
            this.updateTutorialTab();
        } else if (tabName === 'why') {
            this.updateWhyTab();
        } else if (tabName === 'comparison') {
            this.updateComparisonInfo();
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
            
            // Update translations for dynamic panel content
            if (window.I18n && I18n.updatePageContent) {
                I18n.updatePageContent();
            }
            
            // Manual translation updates for specific elements
            this.updateManualTranslations();
            
            this.updateAlgorithmInfo();
            this.updateHeuristicInfo();
            this.updateComparisonInfo();
            
            // Re-bind tab events after showing
            setTimeout(function() {
                var tabButtons = document.querySelectorAll('.guide-tab');
                tabButtons.forEach(function(button) {
                    button.addEventListener('click', function() {
                        EducationManager.switchTab(this.dataset.tab);
                    });
                });
            }, 10);
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
        
        if (info && window.t) {
            var name = t('education.algorithms.' + this.currentAlgorithm + '.name');
            var description = t('education.algorithms.' + this.currentAlgorithm + '.description');
            
            document.getElementById('algorithmName').textContent = name;
            document.getElementById('algorithmDescription').textContent = description;
            
            // Show/hide sections based on content
            var stepsSection = document.getElementById('algorithmStepsSection');
            var prosConsSection = document.getElementById('algorithmProsConsSection');
            
            // Get steps from translations
            var steps = [];
            for (var i = 0; i < 10; i++) {
                var step = t('education.algorithms.' + this.currentAlgorithm + '.steps.' + i);
                if (step && step !== 'education.algorithms.' + this.currentAlgorithm + '.steps.' + i) {
                    steps.push(step);
                } else {
                    break;
                }
            }
            
            if (steps.length > 0) {
                var stepsList = document.getElementById('algorithmSteps');
                stepsList.innerHTML = '';
                steps.forEach(function(step) {
                    var li = document.createElement('li');
                    li.textContent = step;
                    stepsList.appendChild(li);
                });
                stepsSection.style.display = 'block';
            } else {
                stepsSection.style.display = 'none';
            }
            
            // Get pros and cons from translations
            var pros = [];
            var cons = [];
            
            for (var i = 0; i < 10; i++) {
                var pro = t('education.algorithms.' + this.currentAlgorithm + '.pros.' + i);
                if (pro && pro !== 'education.algorithms.' + this.currentAlgorithm + '.pros.' + i) {
                    pros.push(pro);
                } else {
                    break;
                }
            }
            
            for (var i = 0; i < 10; i++) {
                var con = t('education.algorithms.' + this.currentAlgorithm + '.cons.' + i);
                if (con && con !== 'education.algorithms.' + this.currentAlgorithm + '.cons.' + i) {
                    cons.push(con);
                } else {
                    break;
                }
            }
            
            if (pros.length > 0) {
                var prosList = document.getElementById('algorithmPros');
                prosList.innerHTML = '';
                pros.forEach(function(pro) {
                    var li = document.createElement('li');
                    li.textContent = pro;
                    prosList.appendChild(li);
                });
                
                var consList = document.getElementById('algorithmCons');
                consList.innerHTML = '';
                cons.forEach(function(con) {
                    var li = document.createElement('li');
                    li.textContent = con;
                    consList.appendChild(li);
                });
                
                prosConsSection.style.display = 'block';
            } else {
                prosConsSection.style.display = 'none';
            }
        }
    },
    
    updateHeuristicInfo: function() {
        var heuristicFunction = document.getElementById('heuristicFunction');
        if (!heuristicFunction) return;
        
        var heuristicType = heuristicFunction.value;
        var info = this.heuristicInfo[heuristicType];
        
        if (!info || !window.t) {
            document.getElementById('heuristicName').textContent = window.t ? t('education.selectHeuristic') : 'Select a Heuristic';
            document.getElementById('heuristicDescription').textContent = window.t ? t('education.chooseHeuristic') : 'Choose a heuristic function to see detailed information.';
            document.getElementById('heuristicFormulaSection').style.display = 'none';
            document.getElementById('heuristicExampleSection').style.display = 'none';
            document.getElementById('heuristicProsConsSection').style.display = 'none';
            return;
        }
        
        var name = t('education.heuristics.' + heuristicType + '.name');
        var description = t('education.heuristics.' + heuristicType + '.description');
        
        document.getElementById('heuristicName').textContent = name;
        document.getElementById('heuristicDescription').textContent = description;
        
        // Show/hide sections based on content
        var formulaSection = document.getElementById('heuristicFormulaSection');
        var exampleSection = document.getElementById('heuristicExampleSection');
        var prosConsSection = document.getElementById('heuristicProsConsSection');
        
        var formula = t('education.heuristics.' + heuristicType + '.formula');
        if (formula && formula !== 'education.heuristics.' + heuristicType + '.formula') {
            document.getElementById('heuristicFormula').textContent = formula;
            formulaSection.style.display = 'block';
        } else {
            formulaSection.style.display = 'none';
        }
        
        var example = t('education.heuristics.' + heuristicType + '.example');
        if (example && example !== 'education.heuristics.' + heuristicType + '.example') {
            document.getElementById('heuristicExample').textContent = example;
            exampleSection.style.display = 'block';
        } else {
            exampleSection.style.display = 'none';
        }
        
        // Get pros and cons from translations
        var pros = [];
        var cons = [];
        
        for (var i = 0; i < 10; i++) {
            var pro = t('education.heuristics.' + heuristicType + '.pros.' + i);
            if (pro && pro !== 'education.heuristics.' + heuristicType + '.pros.' + i) {
                pros.push(pro);
            } else {
                break;
            }
        }
        
        for (var i = 0; i < 10; i++) {
            var con = t('education.heuristics.' + heuristicType + '.cons.' + i);
            if (con && con !== 'education.heuristics.' + heuristicType + '.cons.' + i) {
                cons.push(con);
            } else {
                break;
            }
        }
        
        if (pros.length > 0) {
            var prosList = document.getElementById('heuristicPros');
            prosList.innerHTML = '';
            pros.forEach(function(pro) {
                var li = document.createElement('li');
                li.textContent = pro;
                prosList.appendChild(li);
            });
            
            var consList = document.getElementById('heuristicCons');
            consList.innerHTML = '';
            cons.forEach(function(con) {
                var li = document.createElement('li');
                li.textContent = con;
                consList.appendChild(li);
            });
            
            prosConsSection.style.display = 'block';
        } else {
            prosConsSection.style.display = 'none';
        }
    },
    
    updateComparisonInfo: function() {
        var searchType = document.getElementById('searchType');
        var heuristicFunction = document.getElementById('heuristicFunction');
        
        if (!searchType) return;
        
        var algorithmType = searchType.value;
        var heuristicType = heuristicFunction ? heuristicFunction.value : null;
        
        var algorithmInfo = this.algorithmInfo[algorithmType];
        var heuristicInfo = heuristicType ? this.heuristicInfo[heuristicType] : null;
        
        // Update comparison table
        this.updateComparisonTable(algorithmInfo, heuristicInfo);
        
        // Update recommendation
        this.updateRecommendation(algorithmType, heuristicType);
    },
    
    updateComparisonTable: function(algorithmInfo, heuristicInfo) {
        var algorithmData = this.getAlgorithmCharacteristics(algorithmInfo);
        var heuristicData = this.getHeuristicCharacteristics(heuristicInfo);
        
        document.getElementById('algorithmOptimality').textContent = algorithmData.optimality;
        document.getElementById('algorithmComplexity').textContent = algorithmData.complexity;
        document.getElementById('algorithmMemory').textContent = algorithmData.memory;
        document.getElementById('algorithmUseCase').textContent = algorithmData.useCase;
        
        document.getElementById('heuristicOptimality').textContent = heuristicData.optimality;
        document.getElementById('heuristicComplexity').textContent = heuristicData.complexity;
        document.getElementById('heuristicMemory').textContent = heuristicData.memory;
        document.getElementById('heuristicUseCase').textContent = heuristicData.useCase;
    },
    
    getAlgorithmCharacteristics: function(info) {
        if (!info) return {optimality: '-', complexity: '-', memory: '-', useCase: '-'};
        
        var characteristics = {
            breadthFirst: {
                optimality: 'Optimal',
                complexity: 'O(b^d)',
                memory: 'High',
                useCase: 'Shortest path guarantee'
            },
            depthFirst: {
                optimality: 'Not optimal',
                complexity: 'O(b^m)',
                memory: 'Low',
                useCase: 'Memory-constrained scenarios'
            },
            uniformCost: {
                optimality: 'Optimal',
                complexity: 'O(b^d)',
                memory: 'Medium',
                useCase: 'Variable step costs'
            },
            iterativeDeepening: {
                optimality: 'Optimal',
                complexity: 'O(b^d)',
                memory: 'Low',
                useCase: 'Balance between BFS and DFS'
            },
            greedyBest: {
                optimality: 'Not optimal',
                complexity: 'O(b^m)',
                memory: 'Medium',
                useCase: 'Fast solutions with good heuristics'
            },
            aStar: {
                optimality: 'Optimal*',
                complexity: 'O(b^d)',
                memory: 'High',
                useCase: 'Optimal solutions with heuristics'
            }
        };
        
        var key = Object.keys(characteristics).find(k => info.name.toLowerCase().includes(k.toLowerCase()));
        return characteristics[key] || {optimality: '-', complexity: '-', memory: '-', useCase: '-'};
    },
    
    getHeuristicCharacteristics: function(info) {
        if (!info) return {optimality: '-', complexity: '-', memory: '-', useCase: '-'};
        
        var characteristics = {
            manhattan: {
                optimality: 'Admissible',
                complexity: 'O(1)',
                memory: 'Minimal',
                useCase: 'General purpose baseline'
            },
            euclidean: {
                optimality: 'Admissible',
                complexity: 'O(1)',
                memory: 'Minimal',
                useCase: 'Geometric distance problems'
            },
            misplaced: {
                optimality: 'Admissible',
                complexity: 'O(1)',
                memory: 'Minimal',
                useCase: 'Quick rough estimates'
            },
            linearConflict: {
                optimality: 'Admissible',
                complexity: 'O(n²)',
                memory: 'Low',
                useCase: 'Better than Manhattan'
            },
            walkingDistance: {
                optimality: 'Admissible',
                complexity: 'O(n²)',
                memory: 'Medium',
                useCase: 'Most accurate estimation'
            },
            cornerTiles: {
                optimality: 'Admissible',
                complexity: 'O(1)',
                memory: 'Minimal',
                useCase: 'Structure-aware solving'
            },
            maxHeuristic: {
                optimality: 'Admissible',
                complexity: 'O(n²)',
                memory: 'Medium',
                useCase: 'Best estimation combination'
            }
        };
        
        var key = Object.keys(characteristics).find(k => info.name.toLowerCase().includes(k.toLowerCase()));
        return characteristics[key] || {optimality: '-', complexity: '-', memory: '-', useCase: '-'};
    },
    
    updateRecommendation: function(algorithmType, heuristicType) {
        var recommendations = {
            'breadthFirst': 'Good for finding shortest solutions but uses a lot of memory. No heuristic needed.',
            'depthFirst': 'Memory efficient but may not find optimal solution. No heuristic needed.',
            'uniformCost': 'Optimal when step costs vary. No heuristic needed.',
            'iterativeDeepening': 'Best balance of memory and optimality. No heuristic needed.',
            'greedyBest': {
                'manhattan': 'Good combination for fast solutions. May not be optimal.',
                'euclidean': 'Less effective for grid-based puzzles. Consider Manhattan instead.',
                'misplaced': 'Too rough for effective guidance. Consider stronger heuristics.',
                'linearConflict': 'Excellent choice for better guidance than Manhattan.',
                'walkingDistance': 'Very effective but computationally expensive.',
                'cornerTiles': 'Good for structure-aware solving.',
                'maxHeuristic': 'Best guidance but highest computational cost.'
            },
            'aStar': {
                'manhattan': 'Classic optimal combination. Reliable and efficient.',
                'euclidean': 'Admissible but less effective than Manhattan for grids.',
                'misplaced': 'Too weak for effective pruning. Consider stronger heuristics.',
                'linearConflict': 'Excellent optimal choice with better pruning.',
                'walkingDistance': 'Most accurate heuristic for optimal solutions.',
                'cornerTiles': 'Good for structure-aware optimal solving.',
                'maxHeuristic': 'Best heuristic for optimal solutions, highest accuracy.'
            }
        };
        
        var rec = recommendations[algorithmType];
        var text = '';
        
        if (typeof rec === 'string') {
            text = rec;
        } else if (rec && heuristicType && rec[heuristicType]) {
            text = rec[heuristicType];
        } else if (rec && heuristicType) {
            text = 'This heuristic works with the selected algorithm.';
        } else {
            text = 'Select an algorithm and heuristic to see recommendations.';
        }
        
        document.getElementById('recommendationText').textContent = text;
    },
    
    // Tutorial Management Functions
    updateTutorialTab: function() {
        var tutorialButtons = document.querySelectorAll('.tutorial-btn');
        tutorialButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                EducationManager.startTutorial(this.dataset.tutorial);
            });
        });
    },
    
    startTutorial: function(tutorialId) {
        var tutorial = this.tutorials[tutorialId];
        if (!tutorial) return;
        
        this.tutorialMode = true;
        this.currentTutorial = tutorial;
        this.currentTutorialStep = 0;
        
        // Set algorithm and heuristic
        document.getElementById('searchType').value = tutorial.algorithm;
        if (tutorial.heuristic) {
            document.getElementById('heuristicFunction').value = tutorial.heuristic;
        }
        
        // Set initial state
        if (tutorial.initialState) {
            if (typeof game !== 'undefined') {
                game = new Game(tutorial.initialState);
                Board.draw(game.state);
            }
        }
        
        // Show tutorial content
        document.getElementById('tutorialContent').style.display = 'block';
        document.querySelector('.tutorial-selection').style.display = 'none';
        
        this.updateTutorialStep();
        this.bindTutorialControls();
    },
    
    updateTutorialStep: function() {
        if (!this.currentTutorial) return;
        
        var step = this.currentTutorial.steps[this.currentTutorialStep];
        var totalSteps = this.currentTutorial.steps.length;
        
        document.getElementById('tutorialTitle').textContent = this.currentTutorial.name;
        document.getElementById('tutorialProgressText').textContent = `Step ${this.currentTutorialStep + 1} of ${totalSteps}`;
        document.getElementById('tutorialProgressFill').style.width = `${((this.currentTutorialStep + 1) / totalSteps) * 100}%`;
        
        document.getElementById('tutorialStepTitle').textContent = step.title;
        document.getElementById('tutorialStepDescription').textContent = step.description;
        
        // Update button states
        document.getElementById('tutorialPrev').disabled = this.currentTutorialStep === 0;
        document.getElementById('tutorialNext').disabled = this.currentTutorialStep === totalSteps - 1;
        
        // Handle step-specific actions
        this.handleTutorialStepAction(step);
    },
    
    handleTutorialStepAction: function(step) {
        switch(step.type) {
            case 'setup':
                // Highlight initial setup
                if (step.highlight === 'frontier') {
                    this.highlightFrontier();
                }
                break;
            case 'step':
                // Perform guided search step
                if (step.highlight === 'expansion') {
                    this.highlightExpansion();
                } else if (step.highlight === 'frontier') {
                    this.highlightFrontier();
                }
                break;
        }
    },
    
    highlightFrontier: function() {
        // Add visual highlighting to show frontier concept
        var board = document.getElementById('board');
        board.classList.add('tutorial-highlight-frontier');
        setTimeout(() => board.classList.remove('tutorial-highlight-frontier'), 2000);
    },
    
    highlightExpansion: function() {
        // Add visual highlighting to show expansion concept
        var board = document.getElementById('board');
        board.classList.add('tutorial-highlight-expansion');
        setTimeout(() => board.classList.remove('tutorial-highlight-expansion'), 2000);
    },
    
    bindTutorialControls: function() {
        var self = this;
        
        document.getElementById('tutorialNext').onclick = function() {
            if (self.currentTutorialStep < self.currentTutorial.steps.length - 1) {
                self.currentTutorialStep++;
                self.updateTutorialStep();
            }
        };
        
        document.getElementById('tutorialPrev').onclick = function() {
            if (self.currentTutorialStep > 0) {
                self.currentTutorialStep--;
                self.updateTutorialStep();
            }
        };
        
        document.getElementById('tutorialExit').onclick = function() {
            self.exitTutorial();
        };
    },
    
    exitTutorial: function() {
        this.tutorialMode = false;
        this.currentTutorial = null;
        this.currentTutorialStep = 0;
        
        document.getElementById('tutorialContent').style.display = 'none';
        document.querySelector('.tutorial-selection').style.display = 'block';
        
        // Remove any tutorial highlights
        var board = document.getElementById('board');
        board.className = board.className.replace(/tutorial-highlight-\w+/g, '');
    },
    
    // Why Explanations Functions
    updateWhyTab: function() {
        var toggle = document.getElementById('whyExplanationsToggle');
        if (toggle) {
            toggle.addEventListener('change', function() {
                EducationManager.whyExplanationsEnabled = this.checked;
                if (this.checked) {
                    EducationManager.enableWhyExplanations();
                } else {
                    EducationManager.disableWhyExplanations();
                }
            });
        }
    },
    
    enableWhyExplanations: function() {
        this.whyExplanationsEnabled = true;
        document.getElementById('frontierAnalysis').style.display = 'block';
        this.updateWhyExplanation('Real-time explanations enabled. Start a search to see why nodes are selected.');
    },
    
    disableWhyExplanations: function() {
        this.whyExplanationsEnabled = false;
        document.getElementById('frontierAnalysis').style.display = 'none';
        this.updateWhyExplanation('Enable real-time explanations to see why specific nodes are chosen.');
    },
    
    updateWhyExplanation: function(explanation) {
        document.getElementById('whyExplanation').textContent = explanation;
    },
    
    explainNodeSelection: function(selectedNode, frontierList, algorithmType, heuristicType) {
        if (!this.whyExplanationsEnabled) return;
        
        var explanation = this.generateNodeSelectionExplanation(selectedNode, frontierList, algorithmType, heuristicType);
        this.updateWhyExplanation(explanation);
        
        // Update frontier analysis
        this.updateFrontierAnalysis(selectedNode, frontierList, algorithmType, heuristicType);
    },
    
    generateNodeSelectionExplanation: function(selectedNode, frontierList, algorithmType, heuristicType) {
        if (!selectedNode) return 'No node selected';
        
        var heuristicValue = 'N/A';
        var fValue = 'N/A';
        
        try {
            if (selectedNode.game && typeof selectedNode.game.getHeuristicValue === 'function') {
                heuristicValue = selectedNode.game.getHeuristicValue(heuristicType);
                fValue = selectedNode.cost + heuristicValue;
            }
        } catch (e) {
            console.warn('Error calculating heuristic:', e);
        }
        
        var explanations = {
            'breadthFirst': `Selected first node from queue (FIFO). BFS explores all nodes at current depth before going deeper.`,
            'depthFirst': `Selected last node from stack (LIFO). DFS explores as far as possible along each branch before backtracking.`,
            'uniformCost': `Selected node with lowest path cost g(n)=${selectedNode.cost || 0} from ${frontierList.length} candidates.`,
            'greedyBest': `Selected node with best heuristic h(n)=${heuristicValue} using ${heuristicType} heuristic.`,
            'aStar': `Selected node with lowest f(n)=${fValue} (g=${selectedNode.cost || 0} + h=${heuristicValue}) using ${heuristicType} heuristic.`,
            'iterativeDeepening': `Selected node using depth-limited DFS. Current depth limit: ${selectedNode.depth || 'N/A'}.`
        };
        
        return explanations[algorithmType] || 'Node selected using current algorithm strategy.';
    },
    
    updateFrontierAnalysis: function(selectedNode, frontierList, algorithmType, heuristicType) {
        document.getElementById('frontierSizeWhy').textContent = frontierList.length;
        
        var selectedValue = this.getNodeValue(selectedNode, algorithmType, heuristicType);
        document.getElementById('selectedNodeValue').textContent = selectedValue;
        
        var reason = this.getSelectionReason(algorithmType);
        document.getElementById('selectionReason').textContent = reason;
        
        // Show alternatives
        this.updateAlternativeNodes(frontierList, algorithmType, heuristicType, selectedNode);
    },
    
    getNodeValue: function(node, algorithmType, heuristicType) {
        if (!node) return 'N/A';
        
        var cost = node.cost || 0;
        var heuristicValue = 'N/A';
        
        try {
            if (node.game && typeof node.game.getHeuristicValue === 'function') {
                heuristicValue = node.game.getHeuristicValue(heuristicType);
            }
        } catch (e) {
            console.warn('Error calculating heuristic for node value:', e);
        }
        
        switch(algorithmType) {
            case 'uniformCost':
                return `g(n)=${cost}`;
            case 'greedyBest':
                return `h(n)=${heuristicValue}`;
            case 'aStar':
                var h = (heuristicValue !== 'N/A') ? heuristicValue : 0;
                return `f(n)=${cost + h} (g=${cost}+h=${h})`;
            default:
                return 'N/A';
        }
    },
    
    getSelectionReason: function(algorithmType) {
        var reasons = {
            'breadthFirst': 'First in queue (FIFO)',
            'depthFirst': 'Last in stack (LIFO)',
            'uniformCost': 'Lowest path cost',
            'greedyBest': 'Best heuristic value',
            'aStar': 'Lowest f(n) = g(n) + h(n)',
            'iterativeDeepening': 'Depth-limited DFS'
        };
        return reasons[algorithmType] || 'Algorithm-specific';
    },
    
    updateAlternativeNodes: function(frontierList, algorithmType, heuristicType, selectedNode) {
        var alternativesList = document.getElementById('alternativesList');
        alternativesList.innerHTML = '';
        
        // Show top 3 alternatives
        var alternatives = frontierList.filter(node => node !== selectedNode).slice(0, 3);
        
        alternatives.forEach(function(node, index) {
            var div = document.createElement('div');
            div.className = 'alternative-node';
            
            var value = EducationManager.getNodeValue(node, algorithmType, heuristicType);
            div.innerHTML = `
                <span class="alt-index">#${index + 2}</span>
                <span class="alt-state">${node.state}</span>
                <span class="alt-value">${value}</span>
            `;
            
            alternativesList.appendChild(div);
        });
        
        if (alternatives.length === 0) {
            alternativesList.innerHTML = '<div class="no-alternatives">No alternatives in frontier</div>';
        }
    },
    
    updateCurrentStep: function(message) {
        if (!this.enabled) return;
        
        var stepDesc = document.getElementById('currentStepDescription');
        if (stepDesc) {
            stepDesc.textContent = message;
        }
    },
    
    onSearchStart: function() {
        var message = window.t ? t('education.startingSearch') : 'Starting search algorithm...';
        this.updateCurrentStep(message);
    },
    
    onNodeExpanded: function(node, iteration) {
        var message = window.t ? t('education.exploring', {iteration: iteration, state: node.state}) : `Iteration ${iteration}: Exploring state ${node.state}`;
        this.updateCurrentStep(message);
    },
    
    onNodeSelected: function(selectedNode, frontierList, algorithmType, heuristicType) {
        if (this.whyExplanationsEnabled) {
            this.explainNodeSelection(selectedNode, frontierList, algorithmType, heuristicType);
        }
    },
    
    onSolutionFound: function(node) {
        var message = window.t ? t('education.solutionFound', {state: node.state}) : `Solution found! Final state: ${node.state}`;
        this.updateCurrentStep(message);
    },
    
    onSearchFailed: function() {
        var message = window.t ? t('education.searchFailed') : 'Search failed - no solution found within limits.';
        this.updateCurrentStep(message);
    },
    
    updateManualTranslations: function() {
        if (!window.t) return;
        
        // Update checkbox label text that might not be auto-translated
        var enableRealTimeText = document.getElementById('enableRealTimeText');
        if (enableRealTimeText) {
            enableRealTimeText.textContent = t('education.enableRealTimeExplanations');
        }
        
        var whyDescription = document.getElementById('whyDescription');
        if (whyDescription) {
            whyDescription.textContent = t('education.realTimeDesc');
        }
        
        // Update explanation text based on checkbox state
        var whyExplanationsToggle = document.getElementById('whyExplanationsToggle');
        var whyExplanation = document.getElementById('whyExplanation');
        if (whyExplanation && whyExplanationsToggle) {
            if (whyExplanationsToggle.checked) {
                whyExplanation.textContent = t('education.realTimeEnabled');
            } else {
                whyExplanation.textContent = t('education.startSearchForExplanations');
            }
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    EducationManager.init();
    
    // Always default to unchecked on page refresh
    var checkbox = document.getElementById('educationMode');
    if (checkbox) {
        checkbox.checked = false;
        EducationManager.enabled = false;
        // Clear any saved state
        localStorage.removeItem('educationMode');
    }
    
    // Update algorithm info when search type changes
    var searchType = document.getElementById('searchType');
    if (searchType) {
        searchType.addEventListener('change', function() {
            if (EducationManager.enabled) {
                EducationManager.updateAlgorithmInfo();
                EducationManager.updateComparisonInfo();
            }
        });
    }
    
    // Update heuristic info when heuristic function changes
    var heuristicFunction = document.getElementById('heuristicFunction');
    if (heuristicFunction) {
        heuristicFunction.addEventListener('change', function() {
            if (EducationManager.enabled) {
                EducationManager.updateHeuristicInfo();
                EducationManager.updateComparisonInfo();
            }
        });
    }
});