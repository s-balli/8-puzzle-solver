var Node = function(opt_data) {
    var data = opt_data || {};

    this.state = data.state || '012345678';
    this.parent = data.parent || null;
    this.cost = data.cost || 0;
    this.depth = data.depth || 0;

    // Validate input data
    if (this.cost < 0) {
        console.warn('Invalid cost value:', this.cost);
        this.cost = 0;
    }
    
    if (this.depth < 0) {
        console.warn('Invalid depth value:', this.depth);
        this.depth = 0;
    }

    try {
        this.game = new Game(this.state);
    } catch (error) {
        console.error('Failed to create game with state:', this.state, error.message);
        this.game = new Game(); // Use default state
        this.state = this.game.state;
    }
}


Node.prototype.expand = function() {
    var that = this;
    var result = [];

    try {
        var availableActionsAndStates = this.game.getAvailableActionsAndStates();

        _.forEach(availableActionsAndStates, function(state, action) {
            try {
                var childData = {
                    state: state,
                    parent: that,
                    depth: that.depth + 1,
                    cost: that.cost + that.game.getActionCost(action)
                };

                result.push(new Node(childData));
            } catch (error) {
                console.warn('Failed to create child node for action:', action, error.message);
            }
        });
    } catch (error) {
        console.error('Failed to expand node:', error.message);
    }

    return result;
}
