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
            getName: function() {
                var isTurkish = I18n && I18n.currentLocale === 'tr';
                return isTurkish ? 'Genişlik-İlk Arama Öğreticisi' : 'Breadth-First Search Tutorial';
            },
            getDescription: function() {
                var isTurkish = I18n && I18n.currentLocale === 'tr';
                return isTurkish ? 'Basit bir puzzle ile BFS\'i adım adım öğrenin' : 'Learn BFS step-by-step with a simple puzzle';
            },
            algorithm: 'breadthFirst',
            heuristic: null,
            initialState: '123450678', // Basit seviye - sadece 5 ve 0'ın yeri değişik, 2 adım
            getSteps: function() {
                var isTurkish = I18n && I18n.currentLocale === 'tr';
                return [
                    {
                        type: 'intro',
                        title: isTurkish ? 'BFS Öğreticisine Hoş Geldiniz' : 'Welcome to BFS Tutorial',
                        description: isTurkish ? 
                            'Bu puzzle\'ı Genişlik-İlk Arama kullanarak çözeceğiz. BFS 2 adımda optimal çözümü bulacak.' :
                            'We\'ll solve this puzzle using Breadth-First Search. BFS will find the optimal solution in 2 steps.',
                        highlight: null
                    },
                    {
                        type: 'setup',
                        title: isTurkish ? 'İlk Kurulum' : 'Initial Setup',
                        description: isTurkish ?
                            'Bu basit puzzle durumu ile başlıyoruz. 5 numaralı karo ve boş alan yer değiştirmiş. BFS kuyruğa ekler ve sistematik olarak çözer.' :
                            'We start with this simple puzzle state. Tile 5 and empty space have swapped positions. BFS adds to queue and solves systematically.',
                        highlight: 'frontier'
                    },
                    {
                        type: 'step',
                        title: isTurkish ? 'İlk Genişletme' : 'First Expansion',
                        description: isTurkish ?
                            'Kuyruktan ilk düğümü çıkar ve genişlet. Tüm olası hamleler kuyruğa eklenir.' :
                            'Remove the first node from queue and expand it. All possible moves are added to the queue.',
                        highlight: 'expansion'
                    },
                    {
                        type: 'step',
                        title: isTurkish ? 'Aramaya Devam Et' : 'Continue Search',
                        description: isTurkish ?
                            'BFS derinlik seviyelerine göre arama yapar. 2 adımda optimal çözümü bulacak.' :
                            'BFS searches by depth levels. It will find the optimal solution in 2 steps.',
                        highlight: 'frontier'
                    }
                ];
            }
        },
        'intermediate-astar': {
            getName: function() {
                var isTurkish = I18n && I18n.currentLocale === 'tr';
                return isTurkish ? 'A* Arama Öğreticisi' : 'A* Search Tutorial';
            },
            getDescription: function() {
                var isTurkish = I18n && I18n.currentLocale === 'tr';
                return isTurkish ? 'Manhattan sezgiseli ile A* algoritmasında ustalaşın' : 'Master A* algorithm with Manhattan heuristic';
            },
            algorithm: 'aStar',
            heuristic: 'manhattan',
            initialState: '123046758', // Orta seviye - karışık durum, 6-8 adım arası
            getSteps: function() {
                var isTurkish = I18n && I18n.currentLocale === 'tr';
                return [
                    {
                        type: 'intro',
                        title: isTurkish ? 'A* Öğreticisine Hoş Geldiniz' : 'Welcome to A* Tutorial',
                        description: isTurkish ?
                            'Bu orta seviye puzzle\'da birkaç karo karışık durumda. A* Manhattan sezgiseli ile verimli çözüm bulacak.' :
                            'In this medium-level puzzle, several tiles are mixed up. A* will find an efficient solution with Manhattan heuristic.',
                        highlight: null
                    },
                    {
                        type: 'setup',
                        title: isTurkish ? 'f(n) = g(n) + h(n) Anlayışı' : 'Understanding f(n) = g(n) + h(n)',
                        description: isTurkish ?
                            'Bu karışık durumda Manhattan mesafesi karolarla hedefe olan mesafeyi hesaplar. A* en iyi f(n) değerini seçer.' :
                            'In this mixed state, Manhattan distance calculates tiles\' distances to goal. A* selects the best f(n) value.',
                        highlight: 'heuristic'
                    },
                    {
                        type: 'step',
                        title: isTurkish ? 'Düğüm Seçimi' : 'Node Selection',
                        description: isTurkish ?
                            'A* her zaman sınırdan en düşük f(n) değerine sahip düğümü seçer.' :
                            'A* always selects the node with lowest f(n) value from the frontier.',
                        highlight: 'selection'
                    }
                ];
            }
        },
        'advanced-heuristics': {
            getName: function() {
                var isTurkish = I18n && I18n.currentLocale === 'tr';
                return isTurkish ? 'Sezgisel Karşılaştırma Öğreticisi' : 'Heuristic Comparison Tutorial';
            },
            getDescription: function() {
                var isTurkish = I18n && I18n.currentLocale === 'tr';
                return isTurkish ? 'Farklı sezgiselleri ve etkilerini karşılaştırın' : 'Compare different heuristics and their effects';
            },
            algorithm: 'aStar',
            heuristic: 'linearConflict',
            initialState: '134862705', // İleri seviye - çözülebilir karışık durum
            generateRandomState: function() {
                // İleri seviye için rasgele çözülebilir durum oluştur
                var advancedStates = [
                    '134862705', // Orijinal
                    '876543210', // Çok karışık
                    '456789123', // Döngüsel
                    '724816350', // Çelişkili
                    '351628047', // Uzun çözüm
                    '612543078', // Orta karışık
                    '852741630', // Diagonal
                    '341758620', // Çok adımlı
                    '630741852', // Komplex
                    '741852630'  // Zor
                ];
                
                // Rastgele bir durum seç
                var randomIndex = Math.floor(Math.random() * advancedStates.length);
                return advancedStates[randomIndex];
            },
            getSteps: function() {
                var isTurkish = I18n && I18n.currentLocale === 'tr';
                return [
                    {
                        type: 'intro',
                        title: isTurkish ? 'Sezgisel Karşılaştırma' : 'Heuristic Comparison',
                        description: isTurkish ?
                            'Bu ileri seviye puzzle\'da karolar oldukça karışık. Farklı sezgisellerin performansını karşılaştıracağız.' :
                            'In this advanced puzzle, tiles are quite mixed up. We\'ll compare the performance of different heuristics.',
                        highlight: null
                    },
                    {
                        type: 'comparison',
                        title: isTurkish ? 'Manhattan vs Doğrusal Çelişki' : 'Manhattan vs Linear Conflict',
                        description: isTurkish ?
                            'Bu karmaşık durumda birçok karo yanlış yerde. Linear Conflict doğru satır/sütundaki çelişkileri tespit edecek.' :
                            'In this complex state, many tiles are misplaced. Linear Conflict will detect conflicts in correct rows/columns.',
                        highlight: 'heuristic'
                    }
                ];
            }
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
                            <p id="iterateStepInstruction" data-i18n="education.iterateStepInstruction">Bu adımı kullanmak için Adım adım ilerlet butonunu kullanın.</p>
                        </div>
                        
                        <div class="why-content" id="whyContent">
                            <div class="current-selection" id="currentSelection">
                                <h5 data-i18n="education.currentSelection">Current Node Selection:</h5>
                                <p id="whyExplanation"></p>
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
        
        // Update comparison table
        this.updateComparisonTable(algorithmType, heuristicType);
        
        // Update recommendation
        this.updateRecommendation(algorithmType, heuristicType);
    },
    
    updateComparisonTable: function(algorithmType, heuristicType) {
        var algorithmData = this.getAlgorithmCharacteristics(algorithmType);
        var heuristicData = this.getHeuristicCharacteristics(heuristicType);
        
        // Update table headers with current algorithm and heuristic names
        var algorithmHeader = document.querySelector('th[data-i18n="education.currentAlgorithm"]');
        var heuristicHeader = document.querySelector('th[data-i18n="education.currentHeuristic"]');
        
        if (algorithmHeader && algorithmType) {
            var algorithmName = t('education.algorithms.' + algorithmType + '.name') || this.getAlgorithmDisplayName(algorithmType);
            algorithmHeader.textContent = algorithmName;
        }
        
        if (heuristicHeader) {
            if (heuristicType) {
                var heuristicName = t('education.heuristics.' + heuristicType + '.name') || this.getHeuristicDisplayName(heuristicType);
                heuristicHeader.textContent = heuristicName;
            } else {
                var isTurkish = I18n && I18n.currentLocale === 'tr';
                heuristicHeader.textContent = t('education.noHeuristic') || (isTurkish ? 'Sezgisel Yok' : 'No Heuristic');
            }
        }
        
        document.getElementById('algorithmOptimality').textContent = algorithmData.optimality;
        document.getElementById('algorithmComplexity').textContent = algorithmData.complexity;
        document.getElementById('algorithmMemory').textContent = algorithmData.memory;
        document.getElementById('algorithmUseCase').textContent = algorithmData.useCase;
        
        document.getElementById('heuristicOptimality').textContent = heuristicData.optimality;
        document.getElementById('heuristicComplexity').textContent = heuristicData.complexity;
        document.getElementById('heuristicMemory').textContent = heuristicData.memory;
        document.getElementById('heuristicUseCase').textContent = heuristicData.useCase;
    },
    
    getAlgorithmCharacteristics: function(algorithmType) {
        if (!algorithmType) return {optimality: '-', complexity: '-', memory: '-', useCase: '-'};
        
        var isTurkish = I18n && I18n.currentLocale === 'tr';
        
        var characteristics = {
            breadthFirst: {
                optimality: isTurkish ? 'Optimal' : 'Optimal',
                complexity: 'O(b^d)',
                memory: isTurkish ? 'Yüksek' : 'High',
                useCase: isTurkish ? 'En kısa yol garantisi' : 'Shortest path guarantee'
            },
            depthFirst: {
                optimality: isTurkish ? 'Optimal değil' : 'Not optimal',
                complexity: 'O(b^m)',
                memory: isTurkish ? 'Düşük' : 'Low',
                useCase: isTurkish ? 'Bellek kısıtlı senaryolar' : 'Memory-constrained scenarios'
            },
            uniformCost: {
                optimality: isTurkish ? 'Optimal' : 'Optimal',
                complexity: 'O(b^d)',
                memory: isTurkish ? 'Orta' : 'Medium',
                useCase: isTurkish ? 'Değişken adım maliyetleri' : 'Variable step costs'
            },
            iterativeDeepening: {
                optimality: isTurkish ? 'Optimal' : 'Optimal',
                complexity: 'O(b^d)',
                memory: isTurkish ? 'Düşük' : 'Low',
                useCase: isTurkish ? 'BFS ve DFS arası denge' : 'Balance between BFS and DFS'
            },
            greedyBest: {
                optimality: isTurkish ? 'Optimal değil' : 'Not optimal',
                complexity: 'O(b^m)',
                memory: isTurkish ? 'Orta' : 'Medium',
                useCase: isTurkish ? 'İyi sezgisellerle hızlı çözümler' : 'Fast solutions with good heuristics'
            },
            aStar: {
                optimality: isTurkish ? 'Optimal*' : 'Optimal*',
                complexity: 'O(b^d)',
                memory: isTurkish ? 'Yüksek' : 'High',
                useCase: isTurkish ? 'Sezgisellerle optimal çözümler' : 'Optimal solutions with heuristics'
            }
        };
        
        return characteristics[algorithmType] || {optimality: '-', complexity: '-', memory: '-', useCase: '-'};
    },
    
    getHeuristicCharacteristics: function(heuristicType) {
        if (!heuristicType) return {optimality: '-', complexity: '-', memory: '-', useCase: '-'};
        
        var isTurkish = I18n && I18n.currentLocale === 'tr';
        
        var characteristics = {
            manhattan: {
                optimality: isTurkish ? 'Kabul edilebilir' : 'Admissible',
                complexity: 'O(1)',
                memory: isTurkish ? 'Minimal' : 'Minimal',
                useCase: isTurkish ? 'Genel amaçlı temel' : 'General purpose baseline'
            },
            euclidean: {
                optimality: isTurkish ? 'Kabul edilebilir' : 'Admissible',
                complexity: 'O(1)',
                memory: isTurkish ? 'Minimal' : 'Minimal',
                useCase: isTurkish ? 'Geometrik mesafe problemleri' : 'Geometric distance problems'
            },
            misplaced: {
                optimality: isTurkish ? 'Kabul edilebilir' : 'Admissible',
                complexity: 'O(1)',
                memory: isTurkish ? 'Minimal' : 'Minimal',
                useCase: isTurkish ? 'Hızlı kaba tahminler' : 'Quick rough estimates'
            },
            linearConflict: {
                optimality: isTurkish ? 'Kabul edilebilir' : 'Admissible',
                complexity: 'O(n²)',
                memory: isTurkish ? 'Düşük' : 'Low',
                useCase: isTurkish ? 'Manhattan\'dan daha iyi' : 'Better than Manhattan'
            },
            walkingDistance: {
                optimality: isTurkish ? 'Kabul edilebilir' : 'Admissible',
                complexity: 'O(n²)',
                memory: isTurkish ? 'Orta' : 'Medium',
                useCase: isTurkish ? 'En doğru tahmin' : 'Most accurate estimation'
            },
            cornerTiles: {
                optimality: isTurkish ? 'Kabul edilebilir' : 'Admissible',
                complexity: 'O(1)',
                memory: isTurkish ? 'Minimal' : 'Minimal',
                useCase: isTurkish ? 'Yapı-farkında çözüm' : 'Structure-aware solving'
            },
            maxHeuristic: {
                optimality: isTurkish ? 'Kabul edilebilir' : 'Admissible',
                complexity: 'O(n²)',
                memory: isTurkish ? 'Orta' : 'Medium',
                useCase: isTurkish ? 'En iyi tahmin kombinasyonu' : 'Best estimation combination'
            }
        };
        
        return characteristics[heuristicType] || {optimality: '-', complexity: '-', memory: '-', useCase: '-'};
    },
    
    getAlgorithmDisplayName: function(algorithmType) {
        var isTurkish = I18n && I18n.currentLocale === 'tr';
        
        var displayNames = {
            breadthFirst: isTurkish ? 'Önce Genişlik Araması' : 'Breadth-First Search',
            depthFirst: isTurkish ? 'Önce Derinlik Araması' : 'Depth-First Search',
            uniformCost: isTurkish ? 'Sabit Maliyet Araması' : 'Uniform Cost Search',
            iterativeDeepening: isTurkish ? 'Yinelemeli Derinleştirme' : 'Iterative Deepening',
            greedyBest: isTurkish ? 'Açgözlü En İyi İlk' : 'Greedy Best-First',
            aStar: isTurkish ? 'A* Araması' : 'A* Search'
        };
        return displayNames[algorithmType] || algorithmType;
    },
    
    getHeuristicDisplayName: function(heuristicType) {
        var isTurkish = I18n && I18n.currentLocale === 'tr';
        
        var displayNames = {
            manhattan: isTurkish ? 'Manhattan Mesafesi' : 'Manhattan Distance',
            euclidean: isTurkish ? 'Öklid Mesafesi' : 'Euclidean Distance',
            misplaced: isTurkish ? 'Yanlış Yerleştirilen Karolar' : 'Misplaced Tiles',
            linearConflict: isTurkish ? 'Doğrusal Çelişki' : 'Linear Conflict',
            walkingDistance: isTurkish ? 'Yürüme Mesafesi' : 'Walking Distance',
            cornerTiles: isTurkish ? 'Köşe Karoları' : 'Corner Tiles',
            maxHeuristic: isTurkish ? 'Maksimum Sezgisel' : 'Max Heuristic'
        };
        return displayNames[heuristicType] || heuristicType;
    },
    
    updateRecommendation: function(algorithmType, heuristicType) {
        var isTurkish = I18n && I18n.currentLocale === 'tr';
        
        var recommendations = {
            'breadthFirst': isTurkish ? 
                'En kısa çözümleri bulmak için iyi ancak çok bellek kullanır. Sezgisel gerekli değil.' :
                'Good for finding shortest solutions but uses a lot of memory. No heuristic needed.',
            'depthFirst': isTurkish ?
                'Bellek verimli ancak optimal çözüm bulamayabilir. Sezgisel gerekli değil.' :
                'Memory efficient but may not find optimal solution. No heuristic needed.',
            'uniformCost': isTurkish ?
                'Adım maliyetleri değiştiğinde optimal. Sezgisel gerekli değil.' :
                'Optimal when step costs vary. No heuristic needed.',
            'iterativeDeepening': isTurkish ?
                'Bellek ve optimallik arasında en iyi denge. Sezgisel gerekli değil.' :
                'Best balance of memory and optimality. No heuristic needed.',
            'greedyBest': {
                'manhattan': isTurkish ?
                    'Hızlı çözümler için iyi kombinasyon. Optimal olmayabilir.' :
                    'Good combination for fast solutions. May not be optimal.',
                'euclidean': isTurkish ?
                    'Grid tabanlı puzzle\'lar için daha az etkili. Manhattan\'ı tercih edin.' :
                    'Less effective for grid-based puzzles. Consider Manhattan instead.',
                'misplaced': isTurkish ?
                    'Etkili rehberlik için çok kaba. Daha güçlü sezgiseller düşünün.' :
                    'Too rough for effective guidance. Consider stronger heuristics.',
                'linearConflict': isTurkish ?
                    'Manhattan\'dan daha iyi rehberlik için mükemmel seçim.' :
                    'Excellent choice for better guidance than Manhattan.',
                'walkingDistance': isTurkish ?
                    'Çok etkili ancak hesaplama açısından pahalı.' :
                    'Very effective but computationally expensive.',
                'cornerTiles': isTurkish ?
                    'Yapı-farkında çözüm için iyi.' :
                    'Good for structure-aware solving.',
                'maxHeuristic': isTurkish ?
                    'En iyi rehberlik ancak en yüksek hesaplama maliyeti.' :
                    'Best guidance but highest computational cost.'
            },
            'aStar': {
                'manhattan': isTurkish ?
                    'Klasik optimal kombinasyon. Güvenilir ve verimli.' :
                    'Classic optimal combination. Reliable and efficient.',
                'euclidean': isTurkish ?
                    'Kabul edilebilir ancak grid\'ler için Manhattan\'dan daha az etkili.' :
                    'Admissible but less effective than Manhattan for grids.',
                'misplaced': isTurkish ?
                    'Etkili budama için çok zayıf. Daha güçlü sezgiseller düşünün.' :
                    'Too weak for effective pruning. Consider stronger heuristics.',
                'linearConflict': isTurkish ?
                    'Daha iyi budama ile mükemmel optimal seçim.' :
                    'Excellent optimal choice with better pruning.',
                'walkingDistance': isTurkish ?
                    'Optimal çözümler için en doğru sezgisel.' :
                    'Most accurate heuristic for optimal solutions.',
                'cornerTiles': isTurkish ?
                    'Yapı-farkında optimal çözüm için iyi.' :
                    'Good for structure-aware optimal solving.',
                'maxHeuristic': isTurkish ?
                    'Optimal çözümler için en iyi sezgisel, en yüksek doğruluk.' :
                    'Best heuristic for optimal solutions, highest accuracy.'
            }
        };
        
        var rec = recommendations[algorithmType];
        var text = '';
        
        if (typeof rec === 'string') {
            text = rec;
        } else if (rec && heuristicType && rec[heuristicType]) {
            text = rec[heuristicType];
        } else if (rec && heuristicType) {
            text = isTurkish ?
                'Bu sezgisel seçilen algoritma ile çalışır.' :
                'This heuristic works with the selected algorithm.';
        } else {
            text = isTurkish ?
                'Öneriler görmek için bir algoritma ve sezgisel seçin.' :
                'Select an algorithm and heuristic to see recommendations.';
        }
        
        document.getElementById('recommendationText').textContent = text;
    },
    
    // Tutorial Management Functions
    updateTutorialTab: function() {
        var tutorialButtons = document.querySelectorAll('.tutorial-btn');
        tutorialButtons.forEach(function(btn) {
            // Update button text based on tutorial
            var tutorialId = btn.dataset.tutorial;
            var tutorial = EducationManager.tutorials[tutorialId];
            if (tutorial) {
                // Update both name and description
                var nameElement = btn.querySelector('h5');
                var descElement = btn.querySelector('p');
                
                if (nameElement && tutorial.getName) {
                    nameElement.textContent = tutorial.getName();
                }
                if (descElement && tutorial.getDescription) {
                    descElement.textContent = tutorial.getDescription();
                }
            }
            
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
        
        // Set initial state - automatically randomize for advanced tutorial
        var initialState = tutorial.initialState;
        if (tutorialId === 'advanced-heuristics' && tutorial.generateRandomState) {
            initialState = tutorial.generateRandomState();
        }
        
        if (initialState) {
            if (typeof game !== 'undefined') {
                game = new Game(initialState);
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
        
        var steps = this.currentTutorial.getSteps ? this.currentTutorial.getSteps() : this.currentTutorial.steps;
        var step = steps[this.currentTutorialStep];
        var totalSteps = steps.length;
        var isTurkish = I18n && I18n.currentLocale === 'tr';
        
        var tutorialName = this.currentTutorial.getName ? this.currentTutorial.getName() : this.currentTutorial.name;
        document.getElementById('tutorialTitle').textContent = tutorialName;
        
        var stepText = isTurkish ? `Adım ${this.currentTutorialStep + 1} / ${totalSteps}` : `Step ${this.currentTutorialStep + 1} of ${totalSteps}`;
        document.getElementById('tutorialProgressText').textContent = stepText;
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
            var steps = self.currentTutorial.getSteps ? self.currentTutorial.getSteps() : self.currentTutorial.steps;
            if (self.currentTutorialStep < steps.length - 1) {
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
            // Set initial state based on toggle
            if (toggle.checked) {
                this.enableWhyExplanations();
            } else {
                this.disableWhyExplanations();
            }
            
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
        var isTurkish = I18n && I18n.currentLocale === 'tr';
        var message = isTurkish ? 
            'Gerçek zamanlı açıklamalar etkinleştirildi. Düğümlerin neden seçildiğini görmek için bir arama başlatın.' :
            'Real-time explanations enabled. Start a search to see why nodes are selected.';
        this.updateWhyExplanation(message);
    },
    
    disableWhyExplanations: function() {
        this.whyExplanationsEnabled = false;
        document.getElementById('frontierAnalysis').style.display = 'none';
        this.updateWhyExplanation('');
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
        var isTurkish = I18n && I18n.currentLocale === 'tr';
        
        if (!selectedNode) {
            return isTurkish ? 'Hiçbir düğüm seçilmedi' : 'No node selected';
        }
        
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
        
        var heuristicDisplayName = this.getHeuristicDisplayName(heuristicType);
        
        var explanations = {
            'breadthFirst': isTurkish ?
                `Kuyruktan ilk düğüm seçildi (FIFO). BFS daha derine gitmeden önce mevcut derinlikteki tüm düğümleri keşfeder.` :
                `Selected first node from queue (FIFO). BFS explores all nodes at current depth before going deeper.`,
            'depthFirst': isTurkish ?
                `Yığından son düğüm seçildi (LIFO). DFS geri dönmeden önce her dal boyunca mümkün olduğunca derinlere kadar keşfeder.` :
                `Selected last node from stack (LIFO). DFS explores as far as possible along each branch before backtracking.`,
            'uniformCost': isTurkish ?
                `${frontierList.length} adaydan en düşük yol maliyetli g(n)=${selectedNode.cost || 0} düğüm seçildi.` :
                `Selected node with lowest path cost g(n)=${selectedNode.cost || 0} from ${frontierList.length} candidates.`,
            'greedyBest': isTurkish ?
                `${heuristicDisplayName} sezgiseli kullanarak en iyi sezgisel h(n)=${heuristicValue} değerli düğüm seçildi.` :
                `Selected node with best heuristic h(n)=${heuristicValue} using ${heuristicDisplayName} heuristic.`,
            'aStar': isTurkish ?
                `${heuristicDisplayName} sezgiseli kullanarak en düşük f(n)=${fValue} (g=${selectedNode.cost || 0} + h=${heuristicValue}) değerli düğüm seçildi.` :
                `Selected node with lowest f(n)=${fValue} (g=${selectedNode.cost || 0} + h=${heuristicValue}) using ${heuristicDisplayName} heuristic.`,
            'iterativeDeepening': isTurkish ?
                `Derinlik sınırlı DFS kullanarak düğüm seçildi. Mevcut derinlik sınırı: ${selectedNode.depth || 'N/A'}.` :
                `Selected node using depth-limited DFS. Current depth limit: ${selectedNode.depth || 'N/A'}.`
        };
        
        return explanations[algorithmType] || (isTurkish ? 
            'Mevcut algoritma stratejisi kullanarak düğüm seçildi.' : 
            'Node selected using current algorithm strategy.');
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
        var isTurkish = I18n && I18n.currentLocale === 'tr';
        
        var reasons = {
            'breadthFirst': isTurkish ? 'Kuyrukta ilk (FIFO)' : 'First in queue (FIFO)',
            'depthFirst': isTurkish ? 'Yığında son (LIFO)' : 'Last in stack (LIFO)',
            'uniformCost': isTurkish ? 'En düşük yol maliyeti' : 'Lowest path cost',
            'greedyBest': isTurkish ? 'En iyi sezgisel değer' : 'Best heuristic value',
            'aStar': isTurkish ? 'En düşük f(n) = g(n) + h(n)' : 'Lowest f(n) = g(n) + h(n)',
            'iterativeDeepening': isTurkish ? 'Derinlik sınırlı DFS' : 'Depth-limited DFS'
        };
        return reasons[algorithmType] || (isTurkish ? 'Algoritmaya özgü' : 'Algorithm-specific');
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
            var isTurkish = I18n && I18n.currentLocale === 'tr';
            var message = isTurkish ? 'Sınırda alternatif yok' : 'No alternatives in frontier';
            alternativesList.innerHTML = `<div class="no-alternatives">${message}</div>`;
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