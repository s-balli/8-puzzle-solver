var GraphManager = {
    enabled: false,
    chart: null,
    dataPoints: [],
    animationId: null,
    
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
        var heuristicValue = document.getElementById('heuristicValue');
        var fValue = document.getElementById('fValue');
        var heuristicMetricRow = document.getElementById('heuristicMetricRow');
        var currentDepth = document.getElementById('currentDepth');
        var currentCost = document.getElementById('currentCost');
        var currentPathLength = document.getElementById('currentPathLength');
        var searchStatus = document.getElementById('searchStatus');
        var solutionMetricRow = document.getElementById('solutionMetricRow');
        var pathMetricRow = document.getElementById('pathMetricRow');
        
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
        
        // Show/hide heuristic metrics based on search type
        var searchType = document.getElementById('searchType').value;
        var isInformed = searchType === 'greedyBest' || searchType === 'aStar';
        
        if (heuristicMetricRow) {
            heuristicMetricRow.style.display = isInformed ? 'flex' : 'none';
        }
        
        // Update heuristic values for informed search algorithms
        if (isInformed && options.currentNode) {
            var heuristicType = document.getElementById('heuristicFunction').value;
            var hValue = options.currentNode.game.getHeuristicValue(heuristicType);
            var gValue = options.currentNode.cost || 0;
            var fVal = searchType === 'aStar' ? (gValue + hValue) : hValue;
            
            if (heuristicValue) {
                heuristicValue.textContent = hValue.toFixed(2);
            }
            if (fValue) {
                fValue.textContent = fVal.toFixed(2);
            }
        }
        
        // Always show solution metrics row during search
        if (solutionMetricRow) {
            solutionMetricRow.style.display = 'flex';
        }
        if (pathMetricRow) {
            pathMetricRow.style.display = 'flex';
        }
        
        // Update current node metrics
        if (options.node) {
            if (currentDepth) {
                currentDepth.textContent = options.node.depth || 0;
            }
            if (currentCost) {
                currentCost.textContent = options.node.cost || 0;
            }
        }
        
        // Update search status
        if (searchStatus) {
            if (options.isSearchComplete) {
                var statusText = options.isError ? 
                    (window.t ? t('graphs.failed') : 'Failed') : 
                    (window.t ? t('graphs.solved') : 'Solved');
                searchStatus.textContent = statusText;
                searchStatus.style.color = options.isError ? '#f44336' : '#4CAF50';
            } else {
                var searchingText = window.t ? t('graphs.searching') : 'Searching...';
                searchStatus.textContent = searchingText;
                searchStatus.style.color = '#ff9800';
            }
        }
        
        // Update path length (only meaningful when solution is found)
        if (currentPathLength && options.solutionPath) {
            currentPathLength.textContent = options.solutionPath.length;
        } else if (currentPathLength) {
            currentPathLength.textContent = '0';
        }
    },
    
    drawChart: function() {
        if (!this.ctx || !this.canvas || this.dataPoints.length === 0) return;
        
        // Use requestAnimationFrame for smooth animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.animationId = requestAnimationFrame(function() {
            this.performDraw();
        }.bind(this));
    },
    
    performDraw: function() {
        this.clearChart();
        
        var frontierValues = this.dataPoints.map(function(p) { return p.frontier; });
        var expandedValues = this.dataPoints.map(function(p) { return p.expanded; });
        var maxFrontier = Math.max.apply(Math, frontierValues.concat([1]));
        var maxExpanded = Math.max.apply(Math, expandedValues.concat([1]));
        var maxValue = Math.max(maxFrontier, maxExpanded);
        
        var width = this.canvas.width;
        var height = this.canvas.height;
        var padding = 25; // Padding for Y-axis only
        
        // Enable anti-aliasing for smoother lines
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        // Draw axes
        this.drawAxes(width, height, padding, maxValue);
        
        // Draw frontier line (blue) with smooth curves
        this.ctx.strokeStyle = '#2196F3';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.beginPath();
        
        this.dataPoints.forEach(function(point, index) {
            var x = padding + (index / Math.max(1, this.dataPoints.length - 1)) * (width - 2 * padding);
            var y = height - padding - (point.frontier / maxValue) * (height - 2 * padding);
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }.bind(this));
        this.ctx.stroke();
        
        // Draw expanded line (green) with smooth curves
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.beginPath();
        
        this.dataPoints.forEach(function(point, index) {
            var x = padding + (index / Math.max(1, this.dataPoints.length - 1)) * (width - 2 * padding);
            var y = height - padding - (point.expanded / maxValue) * (height - 2 * padding);
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }.bind(this));
        this.ctx.stroke();
        
        // Draw legend with better typography
        this.ctx.font = '600 12px Arial';
        this.ctx.textAlign = 'center';
        var frontierText = window.t ? t('graphs.frontier') : 'Frontier';
        var expandedText = window.t ? t('graphs.expanded') : 'Expanded';
        
        this.ctx.fillStyle = '#2196F3';
        this.ctx.fillText(frontierText, width / 2, 15);
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillText(expandedText, width / 2, 30);
        
        // Point indicators removed for cleaner graph appearance
        // this.drawPointIndicators(maxValue, width, height, padding);
    },
    
    drawAxes: function(width, height, padding, maxValue) {
        // Set text properties
        this.ctx.font = '10px Arial';
        this.ctx.fillStyle = '#666';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        
        // Draw Y-axis (vertical)
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height - padding);
        this.ctx.stroke();
        
        // X-axis removed for cleaner appearance
        // this.ctx.beginPath();
        // this.ctx.moveTo(padding, height - padding);
        // this.ctx.lineTo(width - padding, height - padding);
        // this.ctx.stroke();
        
        // Y-axis labels and grid lines
        var numYTicks = 5;
        for (var i = 0; i <= numYTicks; i++) {
            var value = Math.round((maxValue / numYTicks) * i);
            var y = height - padding - (i / numYTicks) * (height - 2 * padding);
            
            // Grid line
            if (i > 0) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = '#f0f0f0';
                this.ctx.moveTo(padding, y);
                this.ctx.lineTo(width - padding, y);
                this.ctx.stroke();
                this.ctx.strokeStyle = '#ddd';
            }
            
            // Y-axis label
            this.ctx.textAlign = 'right';
            this.ctx.fillText(value.toString(), padding - 5, y + 3);
        }
        
        // X-axis labels and grid lines removed
        // var numXTicks = Math.min(5, this.dataPoints.length);
        // if (numXTicks > 1) {
        //     for (var i = 0; i < numXTicks; i++) {
        //         var dataIndex = Math.round((this.dataPoints.length - 1) * (i / (numXTicks - 1)));
        //         var x = padding + (dataIndex / Math.max(1, this.dataPoints.length - 1)) * (width - 2 * padding);
        //         var iteration = dataIndex + 1; // Iterations start from 1
        //         
        //         // Grid line
        //         if (i > 0) {
        //             this.ctx.beginPath();
        //             this.ctx.strokeStyle = '#f0f0f0';
        //             this.ctx.moveTo(x, padding);
        //             this.ctx.lineTo(x, height - padding);
        //             this.ctx.stroke();
        //             this.ctx.strokeStyle = '#ddd';
        //         }
        //         
        //         // X-axis label
        //         this.ctx.textAlign = 'center';
        //         this.ctx.fillText(iteration.toString(), x, height - padding + 12);
        //     }
        // }
        
        // Y-axis title only
        this.ctx.font = '11px Arial';
        this.ctx.fillStyle = '#333';
        this.ctx.textAlign = 'center';
        
        // Y-axis title (rotated)
        this.ctx.save();
        this.ctx.translate(8, height / 2);
        this.ctx.rotate(-Math.PI / 2);
        var countText = window.t ? t('graphs.nodeCount') : 'Node Count';
        this.ctx.fillText(countText, 0, 0);
        this.ctx.restore();
        
        // X-axis title removed
        // var iterationText = window.t ? t('graphs.iteration') : 'Iteration';
        // this.ctx.fillText(iterationText, width / 2, height - 2);
    },
    
    init: function() {
        this.dataPoints = [];
    }
};