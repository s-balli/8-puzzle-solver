var PuzzleManager = {
    currentSize: '3x3',
    boardElement: null,
    
    init: function() {
        this.boardElement = document.getElementById('board');
        this.bindEvents();
        this.updateBoardSize();
    },
    
    bindEvents: function() {
        var puzzleSizeSelect = document.getElementById('puzzleSize');
        if (puzzleSizeSelect) {
            puzzleSizeSelect.addEventListener('change', this.changePuzzleSize.bind(this));
        }
    },
    
    changePuzzleSize: function(event) {
        this.currentSize = event.target.value;
        this.updateBoardSize();
        this.resetGame();
    },
    
    updateBoardSize: function() {
        var is4x4 = this.currentSize === '4x4';
        var boardItems = document.querySelectorAll('.board-item');
        
        // Update board class
        if (is4x4) {
            this.boardElement.classList.add('size-4x4');
        } else {
            this.boardElement.classList.remove('size-4x4');
        }
        
        // Update board items
        boardItems.forEach(function(item, index) {
            var itemNumber = index + 1;
            
            if (is4x4) {
                item.classList.add('size-4x4');
                item.style.display = itemNumber <= 15 ? 'block' : 'none';
            } else {
                item.classList.remove('size-4x4');
                item.style.display = itemNumber <= 8 ? 'block' : 'none';
            }
        });
    },
    
    resetGame: function() {
        // Reset game state based on current size
        if (this.currentSize === '4x4') {
            game = new Game('012345678ABCDEF0');
            Game.DesiredState = '123456789ABCDEF0';
        } else {
            game = new Game('012345678');
            Game.DesiredState = '123456780';
        }
        
        Board.draw(game.state);
        
        // Clear search results
        var searchResultDiv = document.getElementById('searchResult');
        if (searchResultDiv) {
            searchResultDiv.innerHTML = '';
        }
        
        // Reset navigation
        if (typeof NavigationManager !== 'undefined') {
            NavigationManager.init([]);
        }
    },
    
    getBoardSize: function() {
        return this.currentSize === '4x4' ? 4 : 3;
    },
    
    getMaxTileNumber: function() {
        return this.currentSize === '4x4' ? 15 : 8;
    },
    
    getTileSize: function() {
        return this.currentSize === '4x4' ? 50 : 66;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    PuzzleManager.init();
});