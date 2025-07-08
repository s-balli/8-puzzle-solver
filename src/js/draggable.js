/**
 * Draggable Panel Manager
 * Makes panels draggable within the viewport
 */
var DraggableManager = {
    draggedElement: null,
    offset: { x: 0, y: 0 },
    
    init: function() {
        // Make panels draggable
        this.makeDraggable('.education-panel', '.education-header');
        this.makeDraggable('.graph-panel', '.graph-header');
        this.makeDraggable('.performance-panel', '.performance-header');
        this.makeDraggable('.comparison-panel', '.comparison-header');
    },
    
    makeDraggable: function(panelSelector, headerSelector) {
        var panel = document.querySelector(panelSelector);
        if (!panel) return;
        
        var header = panel.querySelector(headerSelector);
        if (!header) return;
        
        // Add draggable cursor to header
        header.style.cursor = 'move';
        
        // Add drag event listeners
        header.addEventListener('mousedown', this.startDrag.bind(this, panel));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        
        // Prevent text selection during drag
        header.addEventListener('selectstart', function(e) {
            e.preventDefault();
        });
    },
    
    startDrag: function(panel, e) {
        this.draggedElement = panel;
        
        var rect = panel.getBoundingClientRect();
        this.offset.x = e.clientX - rect.left;
        this.offset.y = e.clientY - rect.top;
        
        // Add dragging class for visual feedback
        panel.classList.add('dragging');
        
        // Prevent default to avoid text selection
        e.preventDefault();
    },
    
    drag: function(e) {
        if (!this.draggedElement) return;
        
        var newX = e.clientX - this.offset.x;
        var newY = e.clientY - this.offset.y;
        
        // Get viewport dimensions
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
        var panelWidth = this.draggedElement.offsetWidth;
        var panelHeight = this.draggedElement.offsetHeight;
        
        // Constrain to viewport bounds
        newX = Math.max(0, Math.min(newX, viewportWidth - panelWidth));
        newY = Math.max(0, Math.min(newY, viewportHeight - panelHeight));
        
        // Apply new position
        this.draggedElement.style.left = newX + 'px';
        this.draggedElement.style.top = newY + 'px';
        this.draggedElement.style.right = 'auto';
        this.draggedElement.style.bottom = 'auto';
        
        e.preventDefault();
    },
    
    endDrag: function(e) {
        if (this.draggedElement) {
            this.draggedElement.classList.remove('dragging');
            this.draggedElement = null;
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    DraggableManager.init();
});

// Re-initialize when panels are dynamically shown
var originalEducationShow = null;
var originalGraphShow = null;
var originalPerformanceShow = null;

// Override panel show functions to re-initialize dragging
setTimeout(function() {
    // Re-init when education panel is shown
    if (typeof EducationManager !== 'undefined' && EducationManager.showPanel) {
        originalEducationShow = EducationManager.showPanel;
        EducationManager.showPanel = function() {
            originalEducationShow.call(this);
            setTimeout(function() {
                DraggableManager.makeDraggable('.education-panel', '.education-header');
            }, 100);
        };
    }
    
    // Re-init when graph panel is shown
    if (typeof GraphManager !== 'undefined' && GraphManager.showPanel) {
        originalGraphShow = GraphManager.showPanel;
        GraphManager.showPanel = function() {
            originalGraphShow.call(this);
            setTimeout(function() {
                DraggableManager.makeDraggable('.graph-panel', '.graph-header');
            }, 100);
        };
    }
    
    // Re-init when performance panel is shown
    if (typeof PerformanceManager !== 'undefined' && PerformanceManager.showPanel) {
        originalPerformanceShow = PerformanceManager.showPanel;
        PerformanceManager.showPanel = function() {
            originalPerformanceShow.call(this);
            setTimeout(function() {
                DraggableManager.makeDraggable('.performance-panel', '.performance-header');
            }, 100);
        };
    }
}, 1000);