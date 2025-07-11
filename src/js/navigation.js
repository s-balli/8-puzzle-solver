var NavigationManager = {
    currentStep: 0,
    solutionSteps: [],
    
    init: function(solutionPath) {
        this.solutionSteps = solutionPath || [];
        this.currentStep = 0;
        this.updateUI();
    },
    
    updateUI: function() {
        var prevBtn = document.getElementById('prevStep');
        var nextBtn = document.getElementById('nextStep');
        var resetBtn = document.getElementById('resetSteps');
        
        if (prevBtn) prevBtn.disabled = this.currentStep <= 0;
        if (nextBtn) nextBtn.disabled = this.currentStep >= this.solutionSteps.length - 1;
        if (resetBtn) resetBtn.disabled = this.solutionSteps.length === 0;
    },
    
    goToStep: function(step) {
        if (step >= 0 && step < this.solutionSteps.length) {
            this.currentStep = step;
            Board.draw(this.solutionSteps[step]);
            this.updateUI();
            SoundManager.play('move');
        }
    },
    
    nextStep: function() {
        if (this.currentStep < this.solutionSteps.length - 1) {
            this.currentStep++;
            Board.draw(this.solutionSteps[this.currentStep]);
            this.updateUI();
            SoundManager.play('move');
        }
    },
    
    prevStep: function() {
        if (this.currentStep > 0) {
            this.currentStep--;
            Board.draw(this.solutionSteps[this.currentStep]);
            this.updateUI();
            SoundManager.play('move');
        }
    },
    
    reset: function() {
        this.currentStep = 0;
        if (this.solutionSteps.length > 0) {
            Board.draw(this.solutionSteps[0]);
        }
        this.updateUI();
        SoundManager.play('click');
    }
};