var GraphManager = {
    enabled: false,
    chart: null,
    dataPoints: [],
    
    show: function() {
        var panel = document.getElementById('graphPanel');
        if (panel) {
            panel.style.display = 'block';
            this.initChart();
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
    },
    
    initChart: function() {
        var canvas = document.getElementById('realTimeChart');
        if (!canvas) return;
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dataPoints = [];
        this.clearChart();
    },
    
    clearChart: function() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        for (var i = 0; i <= 10; i++) {
            var x = (this.canvas.width / 10) * i;
            var y = (this.canvas.height / 10) * i;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    },
    
    updateChart: function(options) {
        var panel = document.getElementById('graphPanel');
        var isVisible = panel && panel.style.display !== 'none';
        
        if (!isVisible || !this.ctx || !options) return;
        
        var frontierSize = options.frontierList ? options.frontierList.length : 0;
        var expandedSize = options.expandedNodes ? _.size(options.expandedNodes) : 0;
        var iteration = options.iteration || 0;
        
        // Add data point
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
        
        // Update metrics display
        this.updateMetricsDisplay(options);
        
        // Redraw chart
        this.drawChart();
    },
    
    updateMetricsDisplay: function(options) {
        var frontierCount = document.getElementById('frontierCount');
        var expandedCount = document.getElementById('expandedCount');
        var iterationCount = document.getElementById('iterationCount');
        var elapsedTime = document.getElementById('elapsedTime');
        
        if (frontierCount) {
            frontierCount.textContent = options.frontierList ? options.frontierList.length : 0;
        }
        if (expandedCount) {
            expandedCount.textContent = options.expandedNodes ? _.size(options.expandedNodes) : 0;
        }
        if (iterationCount) {
            iterationCount.textContent = options.iteration || 0;
        }
        if (elapsedTime && options.searchStartTime) {
            var elapsed = performance.now() - options.searchStartTime;
            elapsedTime.textContent = Math.round(elapsed) + 'ms';
        }
    },
    
    drawChart: function() {
        if (!this.ctx || !this.canvas || this.dataPoints.length === 0) return;
        
        this.clearChart();
        
        var frontierValues = this.dataPoints.map(function(p) { return p.frontier; });
        var expandedValues = this.dataPoints.map(function(p) { return p.expanded; });
        var maxFrontier = Math.max.apply(Math, frontierValues.concat([1]));
        var maxExpanded = Math.max.apply(Math, expandedValues.concat([1]));
        var maxValue = Math.max(maxFrontier, maxExpanded);
        
        var width = this.canvas.width;
        var height = this.canvas.height;
        var padding = 20;
        
        // Draw frontier line (blue)
        this.ctx.strokeStyle = '#2196F3';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        this.dataPoints.forEach(function(point, index) {
            var x = padding + (index / (this.dataPoints.length - 1)) * (width - 2 * padding);
            var y = height - padding - (point.frontier / maxValue) * (height - 2 * padding);
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }.bind(this));
        this.ctx.stroke();
        
        // Draw expanded line (green)
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        this.dataPoints.forEach(function(point, index) {
            var x = padding + (index / (this.dataPoints.length - 1)) * (width - 2 * padding);
            var y = height - padding - (point.expanded / maxValue) * (height - 2 * padding);
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }.bind(this));
        this.ctx.stroke();
        
        // Draw legend
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#2196F3';
        this.ctx.fillText('Frontier', 10, 15);
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillText('Expanded', 70, 15);
    },
    
    init: function() {
        this.dataPoints = [];
    }
};