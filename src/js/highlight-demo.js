// Demo script to test the yellow highlight animation during replay
var HighlightDemo = {
    
    // Test the highlighting system with a simple sequence
    testHighlighting: function() {
        console.log('Testing yellow highlight animation...');
        
        // Sample moves sequence for testing
        var testMoves = [
            '123456780',  // Initial state
            '123456708',  // Move 8 down
            '123456078',  // Move 7 right
            '123450678',  // Move 5 down
            '123406578',  // Move 6 left
            '123460578',  // Move 6 down
            '103426578',  // Move 1 down
            '130426578'   // Move 3 right
        ];
        
        console.log('Starting highlight demo with', testMoves.length, 'moves');
        
        // Test manual highlighting
        if (Board && Board.highlightCurrentNode) {
            console.log('Testing manual highlighting...');
            
            // Simulate the highlighting for first two moves
            Board.previousState = testMoves[0];
            Board.draw(testMoves[0]);
            
            setTimeout(function() {
                Board.draw(testMoves[1], true);
                console.log('Move 1: Should highlight tile 8');
            }, 1000);
            
            setTimeout(function() {
                Board.draw(testMoves[2], true);
                console.log('Move 2: Should highlight tile 7');
            }, 2000);
            
            setTimeout(function() {
                Board.clearAllHighlights();
                console.log('Highlights cleared');
            }, 4000);
        }
        
        return testMoves;
    },
    
    // Test the full replay with highlighting
    testReplayWithHighlight: function() {
        console.log('Testing full replay with yellow highlighting...');
        
        var testMoves = this.testHighlighting();
        
        // Wait a bit then start full replay
        setTimeout(function() {
            if (Board && Board.replay) {
                console.log('Starting replay with highlighting...');
                Board.replay(testMoves.slice()); // Clone array since replay modifies it
            } else {
                console.error('Board.replay not available');
            }
        }, 5000);
    },
    
    // Show CSS animation info
    showAnimationInfo: function() {
        console.log('Yellow Highlight Animation Features:');
        console.log('- Golden yellow color (#ffd700)');
        console.log('- Pulsing box-shadow effect');
        console.log('- Slight scale animation (1.0 to 1.05)');
        console.log('- Enhanced visibility in dark theme');
        console.log('- Automatic cleanup when replay ends');
        console.log('- CSS class: .current-node');
        
        // Show if animation is supported
        var element = document.createElement('div');
        element.style.animation = 'test 1s';
        var supportsAnimation = element.style.animation !== '';
        console.log('CSS animations supported:', supportsAnimation);
        
        return {
            animationSupported: supportsAnimation,
            currentTheme: document.documentElement.getAttribute('data-theme') || 'light'
        };
    },
    
    // Manual test function
    manualTest: function() {
        console.log('Manual highlighting test...');
        
        // Get a random tile to test
        var tiles = Object.keys(Board.elements);
        var randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        var element = Board.elements[randomTile];
        
        console.log('Adding highlight to tile', randomTile);
        element.classList.add('current-node');
        
        setTimeout(function() {
            console.log('Removing highlight from tile', randomTile);
            element.classList.remove('current-node');
        }, 3000);
    }
};

// Auto-expose to global scope for testing
if (typeof window !== 'undefined') {
    window.HighlightDemo = HighlightDemo;
    console.log('HighlightDemo loaded. Available methods:');
    console.log('- HighlightDemo.testHighlighting()');
    console.log('- HighlightDemo.testReplayWithHighlight()');
    console.log('- HighlightDemo.showAnimationInfo()');
    console.log('- HighlightDemo.manualTest()');
}