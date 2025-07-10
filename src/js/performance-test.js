// Performance test for the optimized 8-puzzle solver
// This file demonstrates the performance improvements

var PerformanceTest = {
    
    // Test heuristic caching performance
    testHeuristicCache: function() {
        console.log('Testing Heuristic Caching Performance...');
        var game = new Game('142350678');
        var iterations = 1000;
        
        console.log('Cache size before test:', Game.getCacheSize());
        
        // Time without cache (clear cache first)
        Game.clearHeuristicCache();
        var startTime = performance.now();
        for (var i = 0; i < iterations; i++) {
            game.getHeuristicValue('manhattan');
            game.getHeuristicValue('euclidean');
            game.getHeuristicValue('linearConflict');
        }
        var timeWithoutCache = performance.now() - startTime;
        
        // Time with cache (calculations should be cached now)
        startTime = performance.now();
        for (var i = 0; i < iterations; i++) {
            game.getHeuristicValue('manhattan');
            game.getHeuristicValue('euclidean');
            game.getHeuristicValue('linearConflict');
        }
        var timeWithCache = performance.now() - startTime;
        
        console.log('Cache size after test:', Game.getCacheSize());
        console.log('Time without cache:', timeWithoutCache.toFixed(2), 'ms');
        console.log('Time with cache:', timeWithCache.toFixed(2), 'ms');
        console.log('Performance improvement:', (timeWithoutCache / timeWithCache).toFixed(2), 'x faster');
        
        return {
            withoutCache: timeWithoutCache,
            withCache: timeWithCache,
            improvement: timeWithoutCache / timeWithCache
        };
    },
    
    // Test search algorithm performance with optimized data structures
    testSearchOptimization: function() {
        console.log('Testing Search Algorithm Optimization...');
        
        // Create a moderately complex puzzle
        var testGame = new Game('142350678');
        var testNode = new Node({state: testGame.state});
        
        var searchOptions = {
            node: testNode,
            type: SearchType.A_STAR,
            heuristicType: 'manhattan',
            iterationLimit: 100,
            timeLimit: 5000,
            isComparisonTest: true,
            callback: function(error, result) {
                if (error) {
                    console.log('Search completed with limitation:', error.message);
                } else {
                    console.log('Search completed successfully!');
                }
                console.log('Total iterations:', result.iteration);
                console.log('Max frontier size:', result.maxFrontierListLength);
                console.log('Max expanded nodes:', result.maxExpandedNodesLength);
            }
        };
        
        console.log('Starting optimized search test...');
        var startTime = performance.now();
        search(searchOptions);
        var endTime = performance.now();
        
        console.log('Search test completed in:', (endTime - startTime).toFixed(2), 'ms');
    },
    
    // Test cache statistics
    testCacheStats: function() {
        console.log('Testing Cache Statistics...');
        
        // Generate different game states and calculate heuristics
        var states = [
            '012345678', '123456780', '142350678', 
            '123450678', '123456087', '132456780'
        ];
        
        states.forEach(function(state, index) {
            var game = new Game(state);
            var heuristics = ['manhattan', 'euclidean', 'misplaced', 'linearConflict'];
            
            heuristics.forEach(function(heuristic) {
                game.getHeuristicValue(heuristic);
            });
            
            console.log('After state', index + 1, '- Cache size:', Game.getCacheSize());
        });
        
        var stats = Game.getCacheStats();
        console.log('Final cache statistics:', stats);
        
        // Test cache clearing
        Game.clearHeuristicCache();
        console.log('After clearing cache:', Game.getCacheSize());
    },
    
    // Run all performance tests
    runAllTests: function() {
        console.log('=== 8-Puzzle Performance Test Suite ===');
        console.log('');
        
        try {
            this.testHeuristicCache();
            console.log('');
            
            this.testSearchOptimization();
            console.log('');
            
            this.testCacheStats();
            console.log('');
            
            console.log('=== All Performance Tests Completed ===');
        } catch (error) {
            console.error('Performance test failed:', error);
        }
    }
};

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined' && window.Game && window.Node) {
    console.log('Performance test module loaded. Run PerformanceTest.runAllTests() to execute tests.');
}