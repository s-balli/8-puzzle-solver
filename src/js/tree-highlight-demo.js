// Demo script to test tree node yellow highlighting during replay
var TreeHighlightDemo = {
    
    // Test tree node highlighting functionality
    testTreeHighlighting: function() {
        console.log('Testing tree node yellow highlighting...');
        
        if (!window.network) {
            console.error('Network visualization not available. Please run a search first.');
            return false;
        }
        
        // Get all nodes from the network
        var nodes = window.network.body.data.nodes.get();
        if (nodes.length === 0) {
            console.error('No nodes available in tree. Please run a search first.');
            return false;
        }
        
        console.log('Found', nodes.length, 'nodes in tree');
        
        // Test highlighting the first few nodes
        var testNodes = nodes.slice(0, Math.min(3, nodes.length));
        var testIndex = 0;
        
        var highlightNext = function() {
            if (testIndex >= testNodes.length) {
                console.log('Tree highlighting test completed');
                Board.clearTreeHighlight();
                return;
            }
            
            var nodeId = testNodes[testIndex].id;
            console.log('Highlighting node:', nodeId);
            Board.updateTreeNodeColor(nodeId, null, true);
            
            testIndex++;
            setTimeout(highlightNext, 2000); // 2 second intervals
        };
        
        highlightNext();
        return true;
    },
    
    // Test manual tree node highlighting
    manualHighlight: function(nodeState) {
        if (!nodeState) {
            console.log('Usage: TreeHighlightDemo.manualHighlight("123456780")');
            return;
        }
        
        console.log('Manually highlighting tree node:', nodeState);
        Board.updateTreeNodeColor(nodeState, null, true);
        
        setTimeout(function() {
            console.log('Clearing highlight');
            Board.clearTreeHighlight();
        }, 3000);
    },
    
    // Show available nodes in tree
    showAvailableNodes: function() {
        if (!window.network) {
            console.error('Network visualization not available');
            return [];
        }
        
        var nodes = window.network.body.data.nodes.get();
        console.log('Available tree nodes:');
        nodes.forEach(function(node, index) {
            console.log(index + ':', node.id, '- Label:', node.label);
        });
        
        return nodes.map(function(node) { return node.id; });
    },
    
    // Test the full replay with tree highlighting
    testReplayTreeHighlighting: function() {
        console.log('Testing replay with tree node highlighting...');
        
        // Sample solution moves for testing
        var testMoves = [
            '123456780',  // Goal state
            '123456708',  // Move 8 down
            '123456078',  // Move 7 right  
            '123450678',  // Move 5 down
            '123406578',  // Move 6 left
            '120456378',  // Move 2 down
            '102456378',  // Move 1 left
            '012456378'   // Initial state
        ].reverse(); // Reverse to show solution path
        
        if (Board && Board.replay) {
            console.log('Starting replay with tree highlighting...');
            Board.replay(testMoves.slice()); // Clone array
        } else {
            console.error('Board.replay not available');
        }
    },
    
    // Show tree highlighting features
    showFeatures: function() {
        console.log('Tree Node Yellow Highlighting Features:');
        console.log('- Golden yellow background (#FFD700)');
        console.log('- Orange border (#FFA500)');
        console.log('- Bold font and larger size');
        console.log('- Automatic focus and selection');
        console.log('- Smooth transitions');
        console.log('- Auto cleanup when replay ends');
        
        console.log('\nAvailable methods:');
        console.log('- TreeHighlightDemo.testTreeHighlighting()');
        console.log('- TreeHighlightDemo.manualHighlight("123456780")');
        console.log('- TreeHighlightDemo.showAvailableNodes()');
        console.log('- TreeHighlightDemo.testReplayTreeHighlighting()');
        
        return {
            networkAvailable: !!window.network,
            boardReplayAvailable: !!(Board && Board.replay),
            updateTreeNodeColorAvailable: !!(Board && Board.updateTreeNodeColor)
        };
    }
};

// Auto-expose to global scope for testing
if (typeof window !== 'undefined') {
    window.TreeHighlightDemo = TreeHighlightDemo;
    console.log('TreeHighlightDemo loaded. Run TreeHighlightDemo.showFeatures() to see available methods.');
}