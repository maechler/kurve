"use strict";

Kurve.Game = {    
    
    runIntervalID:      null,
    framesPerSecond:    25,
    intervalTimeOut:    null,
        
    keysPressed:        {},
    running:            false,
    curves:             [],
    activeCurvesInThisRound: [],
    players:            [],
    
    init: function() {
        this.intervalTimeOut = Math.round(1000 / this.framesPerSecond);
    },
    
    run: function() {
        var start = new Date().getTime() / 1000;
        
        for (var curve in this.curves) {
            if (!this.curves[curve].isAlive) continue;
            this.curves[curve].draw(Kurve.Field.ctx);
            this.curves[curve].moveToNextFrame();
            this.curves[curve].checkForCollision(Kurve.Field.ctx);
        }
        
        var executionTime = new Date().getTime() / 1000 - start;
        if (executionTime > this.intervalTimeOut / 1000) {
            console.log('Interval limit exceeded: ' + executionTime);
        }
    },
    
    addWindowListeners: function() {
        Kurve.Menu.removeWindowListeners();
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));  
    },
    
    onKeyDown: function(event) {
        if (event.keyCode === 32) this.onSpaceDown();
        
        this.keysPressed[event.keyCode] = true;
    },
    
    onKeyUp: function(event) {
        delete this.keysPressed[event.keyCode];
    },
    
    //refactor isKeyDown
    isKeyPressed: function(keyCode) {
        return this.keysPressed[keyCode] === true;
    },
    
    onSpaceDown: function() {
        if (this.running) return;
        
        this.startNewRound();
    },
    
    startGame: function() {
        this.addPlayers();
        this.renderPlayerScores();
        this.addWindowListeners();
        
        this.startNewRound();
    },
    
    renderPlayerScores: function() {
        var playerHTML = '';
        
        for (var i in this.players) {
            playerHTML += this.players[i].renderScoreItem();
        }
        
        document.getElementById('player-scores').innerHTML = playerHTML;
    },
    
    addPlayers: function() {
        for (var i in Kurve.players) {
            if (!Kurve.players[i].isActive) continue;
            
            this.players[Kurve.players[i].id] = Kurve.players[i];
        }
    },
    
    notifyDeath: function(curve) {
        console.log('notify Death');
        delete this.activeCurvesInThisRound[curve.player.id];
        var everyBodyDied = true;
        
        for (var i in this.activeCurvesInThisRound) {
            console.log('pont++');
            this.activeCurvesInThisRound[i].player.points += 1;
            everyBodyDied = false;
        }
        console.log(this.activeCurvesInThisRound.length);
        this.renderPlayerScores();
        
        //should be everybody but one!
        if (everyBodyDied) this.terminateRound();
    },
    
    startNewRound: function() {
        for (var i in this.curves) {
            var curve = this.curves[i];
            this.activeCurvesInThisRound[curve.player.id] = curve;
        }
        
        this.running        = true;
        this.runIntervalID  = setInterval(this.run.bind(this), this.intervalTimeOut);
    },
    
    terminateRound: function() {
        console.log('terminateRound');
        this.running = false;
        clearInterval(this.runIntervalID);
    }         

};