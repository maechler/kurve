"use strict";

/**
 * 
 * @todo refactor methods! implement round feature!
 */

Kurve.Game = {    
    
    runIntervalID:      null,
    framesPerSecond:    25,
    intervalTimeOut:    null,
        
    keysDown:           {},
    running:            false,
    curves:             [],
    runningCurves:      [],
    players:            [],
    imageData:          {},
    
    init: function() {
        this.intervalTimeOut = Math.round(1000 / this.framesPerSecond);
    },
    
    run: function() {
        this.imageData = Kurve.Field.getFieldData();

        for (var curve in this.runningCurves) {
            this.runningCurves[curve].draw(Kurve.Field.ctx);
            this.runningCurves[curve].moveToNextFrame();
            this.runningCurves[curve].checkForCollision(Kurve.Field.ctx);
        }
    },
    
    addWindowListeners: function() {
        Kurve.Menu.removeWindowListeners();
        
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));  
    },
    
    onKeyDown: function(event) {
        if (event.keyCode === 32) this.onSpaceDown();
        
        this.keysDown[event.keyCode] = true;
    },
    
    onKeyUp: function(event) {
        delete this.keysDown[event.keyCode];
    },
    
    isKeyDown: function(keyCode) {
        return this.keysDown[keyCode] === true;
    },
    
    onSpaceDown: function() {
        if (this.running) return;
        
        this.startNewRound();
    },
    
    startGame: function() {
        this.addPlayers();
        this.renderPlayerScores();
        this.addWindowListeners();
        
        this.initRun();
        setTimeout(Kurve.Game.startNewRound.bind(this), Kurve.Config.Game.startDelay);
    },
    
    renderPlayerScores: function() {
        var playerHTML = '';
        var sortArray = [];
        
        for (var i in this.players) {
            sortArray.push(this.players[i]);
        }
        
        sortArray.sort(function(a,b) {
            return b.getPoints() - a.getPoints();
        });
        
        for (var i in sortArray) {
            playerHTML += sortArray[i].renderScoreItem();
        }
        
        document.getElementById('player-scores').innerHTML = playerHTML;
    },
    
    addPlayers: function() {
        for (var i in Kurve.players) {
            if (!Kurve.players[i].isActive) continue;
            
            this.players[Kurve.players[i].getId()] = Kurve.players[i];
        }
    },
    
    notifyDeath: function(curve) {
        delete this.runningCurves[curve.getPlayer().getId()];
        
        for (var i in this.runningCurves) {
            this.runningCurves[i].getPlayer().incrementPoints();
        }
        
        this.renderPlayerScores();
        
        if (Object.keys(this.runningCurves).length === 1) this.terminateRound();
    },
    
    startNewRound: function() {
        Kurve.Field.drawField();
        
        this.running        = true;
        this.runIntervalID  = setInterval(this.run.bind(this), this.intervalTimeOut);
    },
    
    initRun: function() {
        for (var i in this.curves) {
            var curve = this.curves[i];
            this.runningCurves[curve.getPlayer().getId()] = curve;
        }
        
        for (var curve in this.runningCurves) {
            this.runningCurves[curve].moveToNextFrame();
            this.runningCurves[curve].draw(Kurve.Field.ctx);
        }
    },
    
    terminateRound: function() {
        this.running = false;
        clearInterval(this.runIntervalID);
    }         

};