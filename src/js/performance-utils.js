// Performance utility functions
var PerformanceUtils = {
    // Debounce function - delays execution until after wait time
    debounce: function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    // Throttle function - limits execution to once per wait time
    throttle: function(func, wait) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        var later = function() {
            previous = Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function() {
            var now = Date.now();
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    },
    
    // Object pool for memory management
    ObjectPool: function(createFn, resetFn, maxSize) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.maxSize = maxSize || 100;
        this.pool = [];
        
        this.get = function() {
            if (this.pool.length > 0) {
                return this.pool.pop();
            }
            return this.createFn();
        };
        
        this.release = function(obj) {
            if (this.pool.length < this.maxSize) {
                this.resetFn(obj);
                this.pool.push(obj);
            }
        };
    },
    
    // Batch DOM operations
    batchDOMOperations: function(operations) {
        var fragment = document.createDocumentFragment();
        operations.forEach(function(operation) {
            operation(fragment);
        });
        return fragment;
    },
    
    // RAF-based animation queue
    AnimationQueue: function() {
        this.queue = [];
        this.running = false;
        
        this.add = function(fn) {
            this.queue.push(fn);
            if (!this.running) {
                this.process();
            }
        };
        
        this.process = function() {
            if (this.queue.length === 0) {
                this.running = false;
                return;
            }
            
            this.running = true;
            var self = this;
            requestAnimationFrame(function() {
                var fn = self.queue.shift();
                if (fn) fn();
                self.process();
            });
        };
    }
};