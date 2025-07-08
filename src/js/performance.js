var PerformanceManager = {
    currentMetrics: null,
    startTime: null,
    enabled: false,
    
    init: function() {
        this.createPerformancePanel();
        this.bindEvents();
    },
    
    createPerformancePanel: function() {
        var panel = document.createElement('div');
        panel.id = 'performancePanel';
        panel.className = 'performance-panel';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <div class="performance-header">
                <h3>Performance Analysis</h3>
                <button id="closePerformance">×</button>
            </div>
            <div class="performance-content">
                <div class="performance-section">
                    <button id="compareAlgorithms" class="compare-button">Compare Algorithms</button>
                </div>
                
                <div class="performance-section">
                    <h4>Current Search Metrics</h4>
                    <div id="performanceMetrics" class="performance-metrics"></div>
                </div>
                
                <div class="performance-section">
                    <h4>Algorithm Comparison</h4>
                    <div id="comparisonResults" class="comparison-results"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    },
    
    bindEvents: function() {
        var performanceCheckbox = document.getElementById('performanceMode');
        var closeButton = document.getElementById('closePerformance');
        
        if (performanceCheckbox) {
            performanceCheckbox.addEventListener('change', this.toggle.bind(this));
        }
        
        if (closeButton) {
            closeButton.addEventListener('click', this.hide.bind(this));
        }
        
        // Move compare button event to dynamic binding
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'compareAlgorithms') {
                this.compareAlgorithms();
            }
        }.bind(this));
    },
    
    toggle: function() {
        var checkbox = document.getElementById('performanceMode');
        this.enabled = checkbox.checked;
        
        if (this.enabled) {
            this.show();
        } else {
            this.hide();
        }
        
        localStorage.setItem('performanceMode', this.enabled);
    },
    
    show: function() {
        var panel = document.getElementById('performancePanel');
        if (panel) {
            panel.style.display = 'block';
        }
    },
    
    hide: function() {
        var panel = document.getElementById('performancePanel');
        if (panel) {
            panel.style.display = 'none';
        }
        
        var checkbox = document.getElementById('performanceMode');
        if (checkbox) {
            checkbox.checked = false;
        }
        
        this.enabled = false;
        localStorage.setItem('performanceMode', false);
    },
    
    startMeasurement: function() {
        this.startTime = performance.now();
        this.currentMetrics = {
            startTime: this.startTime,
            endTime: null,
            duration: null,
            iterations: 0,
            expandedNodes: 0,
            maxFrontierSize: 0,
            maxExpandedSize: 0,
            memoryUsage: this.getMemoryUsage()
        };
    },
    
    updateMetrics: function(options) {
        if (!this.currentMetrics) return;
        
        this.currentMetrics.iterations = options.iteration || 0;
        this.currentMetrics.expandedNodes = _.size(options.expandedNodes) || 0;
        this.currentMetrics.maxFrontierSize = Math.max(this.currentMetrics.maxFrontierSize, options.frontierList.length || 0);
        this.currentMetrics.maxExpandedSize = Math.max(this.currentMetrics.maxExpandedSize, this.currentMetrics.expandedNodes);
    },
    
    endMeasurement: function(success, solutionDepth) {
        if (!this.currentMetrics) return;
        
        this.currentMetrics.endTime = performance.now();
        this.currentMetrics.duration = this.currentMetrics.endTime - this.currentMetrics.startTime;
        this.currentMetrics.success = success;
        this.currentMetrics.solutionDepth = solutionDepth || 0;
        this.currentMetrics.memoryUsageEnd = this.getMemoryUsage();
        
        this.displayMetrics();
    },
    
    getMemoryUsage: function() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100
            };
        }
        return { used: 0, total: 0 };
    },
    
    displayMetrics: function() {
        var metricsDiv = document.getElementById('performanceMetrics');
        if (!metricsDiv || !this.currentMetrics) return;
        
        var duration = Math.round(this.currentMetrics.duration * 100) / 100;
        var iterationsPerSecond = Math.round((this.currentMetrics.iterations / (this.currentMetrics.duration / 1000)) * 100) / 100;
        
        metricsDiv.innerHTML = `
            <div class="metric-item">
                <span class="metric-label">Duration:</span>
                <span class="metric-value">${duration}ms</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Iterations:</span>
                <span class="metric-value">${this.currentMetrics.iterations}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Speed:</span>
                <span class="metric-value">${iterationsPerSecond} iter/s</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Expanded Nodes:</span>
                <span class="metric-value">${this.currentMetrics.expandedNodes}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Max Frontier:</span>
                <span class="metric-value">${this.currentMetrics.maxFrontierSize}</span>
            </div>
            <div class="metric-item">
                <span class="metric-label">Memory Used:</span>
                <span class="metric-value">${this.currentMetrics.memoryUsageEnd.used} MB</span>
            </div>
        `;
        
        // Auto-show performance panel when search completes
        if (this.enabled) {
            this.show();
        }
    },
    
    compareAlgorithms: function() {
        var algorithms = ['breadthFirst', 'depthFirst', 'uniformCost', 'greedyBest', 'aStar'];
        var currentState = game.state;
        var results = [];
        var completedCount = 0;
        
        var resultsDiv = document.getElementById('comparisonResults');
        resultsDiv.innerHTML = '<div class="comparison-progress">Comparing algorithms...</div>';
        
        algorithms.forEach(function(algorithm) {
            var startTime = performance.now();
            var testMetrics = {
                algorithm: algorithm,
                startTime: startTime,
                success: false,
                duration: 0,
                iterations: 0,
                expandedNodes: 0,
                solutionDepth: 0
            };
            
            var initialNode = new Node({state: currentState});
            
            search({
                node: initialNode,
                iterationLimit: 5000,
                depthLimit: 50,
                timeLimit: 10000, // 10 seconds max for comparison
                type: algorithm,
                callback: function(err, options) {
                    testMetrics.duration = performance.now() - startTime;
                    testMetrics.iterations = options.iteration;
                    testMetrics.expandedNodes = _.size(options.expandedNodes);
                    
                    if (!err) {
                        testMetrics.success = true;
                        testMetrics.solutionDepth = options.node.depth;
                    }
                    
                    results.push(testMetrics);
                    completedCount++;
                    
                    if (completedCount === algorithms.length) {
                        this.displayComparison(results);
                    }
                }.bind(this)
            });
        }.bind(this));
    },
    
    displayComparison: function(results) {
        var resultsDiv = document.getElementById('comparisonResults');
        
        var html = '<div class="comparison-table"><table><thead><tr>' +
            '<th>Algorithm</th><th>Success</th><th>Time(ms)</th><th>Iterations</th><th>Nodes</th><th>Depth</th>' +
            '</tr></thead><tbody>';
        
        results.forEach(function(result) {
            var algorithmNames = {
                'breadthFirst': 'BFS',
                'depthFirst': 'DFS', 
                'uniformCost': 'UCS',
                'greedyBest': 'Greedy',
                'aStar': 'A*'
            };
            
            html += '<tr>' +
                '<td>' + algorithmNames[result.algorithm] + '</td>' +
                '<td>' + (result.success ? '✓' : '✗') + '</td>' +
                '<td>' + Math.round(result.duration) + '</td>' +
                '<td>' + result.iterations + '</td>' +
                '<td>' + result.expandedNodes + '</td>' +
                '<td>' + (result.success ? result.solutionDepth : '-') + '</td>' +
                '</tr>';
        });
        
        html += '</tbody></table></div>';
        resultsDiv.innerHTML = html;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    PerformanceManager.init();
    
    // Load saved performance mode setting
    var savedPerformanceMode = localStorage.getItem('performanceMode') === 'true';
    var checkbox = document.getElementById('performanceMode');
    if (checkbox) {
        checkbox.checked = savedPerformanceMode;
        PerformanceManager.enabled = savedPerformanceMode;
        if (savedPerformanceMode) {
            PerformanceManager.show();
        }
    }
});