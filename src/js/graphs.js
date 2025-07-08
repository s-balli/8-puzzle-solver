var GraphManager = {
    enabled: false,
    chart: null,
    dataPoints: [],
    
    init: function() {
        this.createGraphPanel();
        this.bindEvents();
    },
    
    createGraphPanel: function() {
        var panel = document.createElement('div');
        panel.id = 'graphPanel';
        panel.className = 'graph-panel';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <div class="graph-header">
                <h3>Real-time Statistics</h3>
                <button id="closeGraphs">×</button>
            </div>
            <div class="graph-content">
                <div class="graph-section">
                    <canvas id="searchChart" width="360" height="200"></canvas>
                </div>
                <div class="graph-metrics">
                    <div class="metric-row">
                        <div class="metric-box">
                            <span class="metric-title">Iterations</span>
                            <span class="metric-number" id="currentIterations">0</span>
                        </div>
                        <div class="metric-box">
                            <span class="metric-title">Frontier</span>
                            <span class="metric-number" id="currentFrontier">0</span>
                        </div>
                    </div>
                    <div class="metric-row">
                        <div class="metric-box">
                            <span class="metric-title">Expanded</span>
                            <span class="metric-number" id="currentExpanded">0</span>
                        </div>
                        <div class="metric-box">
                            <span class="metric-title">Speed</span>
                            <span class="metric-number" id="currentSpeed">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.initChart();
    },
    
    initChart: function() {
        var canvas = document.getElementById('searchChart');
        if (!canvas) return;
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.clearChart();
    },
    
    bindEvents: function() {
        var graphsCheckbox = document.getElementById('realTimeGraphs');
        var closeButton = document.getElementById('closeGraphs');
        
        if (graphsCheckbox) {
            graphsCheckbox.addEventListener('change', this.toggle.bind(this));
        }
        
        if (closeButton) {
            closeButton.addEventListener('click', this.hide.bind(this));
        }
    },
    
    toggle: function() {
        var checkbox = document.getElementById('realTimeGraphs');
        this.enabled = checkbox.checked;
        
        if (this.enabled) {
            this.show();
        } else {
            this.hide();
        }
        
        localStorage.setItem('realTimeGraphs', this.enabled);
    },
    
    show: function() {
        var panel = document.getElementById('graphPanel');
        if (panel) {
            panel.style.display = 'block';
        }
    },
    
    hide: function() {
        var panel = document.getElementById('graphPanel');
        if (panel) {
            panel.style.display = 'none';
        }
        
        var checkbox = document.getElementById('realTimeGraphs');
        if (checkbox) {
            checkbox.checked = false;
        }
        
        this.enabled = false;
        localStorage.setItem('realTimeGraphs', false);
    },
    
    clearChart: function() {
        if (!this.ctx) return;
        
        this.dataPoints = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw axes
        this.drawAxes();
    },
    
    drawGrid: function() {
        var ctx = this.ctx;
        var width = this.canvas.width;
        var height = this.canvas.height;
        
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        
        // Vertical lines
        for (var x = 0; x <= width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (var y = 0; y <= height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    },
    
    drawAxes: function() {
        var ctx = this.ctx;
        var width = this.canvas.width;
        var height = this.canvas.height;
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        
        // X axis
        ctx.beginPath();
        ctx.moveTo(0, height - 20);
        ctx.lineTo(width, height - 20);
        ctx.stroke();
        
        // Y axis
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(20, height);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.fillText('Iterations', width - 60, height - 5);
        ctx.save();
        ctx.translate(10, 20);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Nodes', 0, 0);
        ctx.restore();
    },
    
    updateChart: function(options) {
        if (!this.enabled || !this.ctx) return;
        
        var frontierSize = options.frontierList ? options.frontierList.length : 0;
        var expandedSize = options.expandedNodes ? Object.keys(options.expandedNodes).length : 0;
        var iteration = options.iteration || 0;
        
        // Add new data point
        this.dataPoints.push({
            iteration: iteration,
            frontier: frontierSize,
            expanded: expandedSize,
            timestamp: Date.now()
        });
        
        // Keep only last 50 points
        if (this.dataPoints.length > 50) {
            this.dataPoints.shift();
        }
        
        // Update metrics
        this.updateMetrics(iteration, frontierSize, expandedSize);
        
        // Redraw chart
        this.redrawChart();
    },
    
    updateMetrics: function(iteration, frontier, expanded) {
        var iterEl = document.getElementById('currentIterations');
        var frontierEl = document.getElementById('currentFrontier');
        var expandedEl = document.getElementById('currentExpanded');
        var speedEl = document.getElementById('currentSpeed');
        
        if (iterEl) iterEl.textContent = iteration;
        if (frontierEl) frontierEl.textContent = frontier;
        if (expandedEl) expandedEl.textContent = expanded;
        
        // Calculate speed (iterations per second)
        if (this.dataPoints.length > 1) {
            var recent = this.dataPoints.slice(-5);
            var timeDiff = recent[recent.length - 1].timestamp - recent[0].timestamp;
            var iterDiff = recent[recent.length - 1].iteration - recent[0].iteration;
            var speed = Math.round((iterDiff / (timeDiff / 1000)) * 10) / 10;
            if (speedEl) speedEl.textContent = speed + '/s';
        }
    },
    
    redrawChart: function() {
        var ctx = this.ctx;
        var width = this.canvas.width;
        var height = this.canvas.height;
        
        // Clear and redraw background
        ctx.clearRect(0, 0, width, height);
        this.drawGrid();
        this.drawAxes();
        
        if (this.dataPoints.length < 2) return;
        
        // Find max values for scaling
        var maxFrontier = Math.max(...this.dataPoints.map(p => p.frontier));
        var maxExpanded = Math.max(...this.dataPoints.map(p => p.expanded));
        var maxY = Math.max(maxFrontier, maxExpanded, 10);
        
        // Draw frontier line
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        this.dataPoints.forEach(function(point, index) {
            var x = 20 + (index / (this.dataPoints.length - 1)) * (width - 40);
            var y = height - 20 - (point.frontier / maxY) * (height - 40);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }.bind(this));
        
        ctx.stroke();
        
        // Draw expanded line
        ctx.strokeStyle = '#4ecdc4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        this.dataPoints.forEach(function(point, index) {
            var x = 20 + (index / (this.dataPoints.length - 1)) * (width - 40);
            var y = height - 20 - (point.expanded / maxY) * (height - 40);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }.bind(this));
        
        ctx.stroke();
        
        // Draw legend
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(width - 100, 10, 15, 3);
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText('Frontier', width - 80, 15);
        
        ctx.fillStyle = '#4ecdc4';
        ctx.fillRect(width - 100, 25, 15, 3);
        ctx.fillStyle = '#333';
        ctx.fillText('Expanded', width - 80, 30);
    },
    
    reset: function() {
        this.clearChart();
        this.updateMetrics(0, 0, 0);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    GraphManager.init();
    
    // Load saved setting
    var savedGraphs = localStorage.getItem('realTimeGraphs') === 'true';
    var checkbox = document.getElementById('realTimeGraphs');
    if (checkbox) {
        checkbox.checked = savedGraphs;
        GraphManager.enabled = savedGraphs;
        if (savedGraphs) {
            GraphManager.show();
        }
    }
});