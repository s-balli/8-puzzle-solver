var PerformanceManager = {
    currentMetrics: null,
    startTime: null,
    enabled: false,
    
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
    },
    
    init: function() {
        // PerformanceManager init - HTML panels are already in DOM
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
        
        // Update live metrics during search
        this.updateLiveMetrics();
    },
    
    updateLiveMetrics: function() {
        var panel = document.getElementById('performancePanel');
        var isVisible = panel && panel.style.display !== 'none';
        
        if (!this.currentMetrics || !isVisible) return;
        
        var currentTime = performance.now();
        var elapsed = currentTime - this.currentMetrics.startTime;
        
        // Update individual metric elements
        var timeElapsed = document.getElementById('timeElapsed');
        var nodesExpanded = document.getElementById('nodesExpanded');
        var frontierSize = document.getElementById('frontierSize');
        
        if (timeElapsed) {
            timeElapsed.textContent = Math.round(elapsed) + 'ms';
        }
        if (nodesExpanded) {
            nodesExpanded.textContent = this.currentMetrics.expandedNodes;
        }
        if (frontierSize) {
            frontierSize.textContent = this.currentMetrics.maxFrontierSize;
        }
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
        var metricsDiv = document.getElementById('currentMetrics');
        if (!metricsDiv || !this.currentMetrics) return;
        
        var duration = Math.round(this.currentMetrics.duration * 100) / 100;
        var iterationsPerSecond = Math.round((this.currentMetrics.iterations / (this.currentMetrics.duration / 1000)) * 100) / 100;
        
        var durationLabel = window.t ? t('performance.duration') : 'Duration:';
        var iterationsLabel = window.t ? t('performance.iterations') : 'Iterations:';
        var speedLabel = window.t ? t('performance.speed') : 'Speed:';
        var expandedLabel = window.t ? t('performance.expandedNodes') : 'Expanded Nodes:';
        var frontierLabel = window.t ? t('performance.maxFrontier') : 'Max Frontier:';
        var memoryLabel = window.t ? t('performance.memoryUsed') : 'Memory Used:';
        var iterPerSecSuffix = window.t ? t('performance.iterPerSec') : ' iter/s';
        var mbSuffix = window.t ? t('performance.megabytes') : ' MB';
        
        metricsDiv.innerHTML = 
            '<div class="metric-item">' +
                '<span class="metric-label">' + durationLabel + '</span>' +
                '<span class="metric-value">' + duration + 'ms</span>' +
            '</div>' +
            '<div class="metric-item">' +
                '<span class="metric-label">' + iterationsLabel + '</span>' +
                '<span class="metric-value">' + this.currentMetrics.iterations + '</span>' +
            '</div>' +
            '<div class="metric-item">' +
                '<span class="metric-label">' + speedLabel + '</span>' +
                '<span class="metric-value">' + iterationsPerSecond + iterPerSecSuffix + '</span>' +
            '</div>' +
            '<div class="metric-item">' +
                '<span class="metric-label">' + expandedLabel + '</span>' +
                '<span class="metric-value">' + this.currentMetrics.expandedNodes + '</span>' +
            '</div>' +
            '<div class="metric-item">' +
                '<span class="metric-label">' + frontierLabel + '</span>' +
                '<span class="metric-value">' + this.currentMetrics.maxFrontierSize + '</span>' +
            '</div>' +
            '<div class="metric-item">' +
                '<span class="metric-label">' + memoryLabel + '</span>' +
                '<span class="metric-value">' + this.currentMetrics.memoryUsageEnd.used + mbSuffix + '</span>' +
            '</div>';
        
        // Auto-show performance panel when search completes
        var checkbox = document.getElementById('performanceMode');
        if (checkbox && checkbox.checked) {
            this.show();
        }
    },
    
};