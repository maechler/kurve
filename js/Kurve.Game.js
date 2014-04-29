"use strict";

Kurve.Game = {    
    
    runIntervalID:      null,
    framesPerSecond:    25,
    intervalTimeOut:    null,
        
    keysPressed:        {},
    running:            false,
    curves:             [],
    runningCurves:      [],
    players:            [],
    imageData:          {},
    
    init: function() {
        this.intervalTimeOut = Math.round(1000 / this.framesPerSecond);
    },
    
    run: function() {
        var start = new Date().getTime() / 1000;
        
        this.imageData = Kurve.Field.getFieldData();

        for (var curve in this.runningCurves) {
            this.runningCurves[curve].draw(Kurve.Field.ctx);
            this.runningCurves[curve].moveToNextFrame();
            this.runningCurves[curve].checkForCollision(Kurve.Field.ctx);
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
        
        this.initRun();
        setTimeout(Kurve.Game.startNewRound.bind(this), 2000);
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
        var everyBodyDied = true;
        
        for (var i in this.runningCurves) {
            this.runningCurves[i].getPlayer().incrementPoints();
            everyBodyDied = false;
        }
        
        this.renderPlayerScores();
        
        //should be everybody but one!
        if (everyBodyDied) this.terminateRound();
    },
    
    startNewRound: function() {
        Kurve.Field.drawField();
        this.running        = true;
        this.runIntervalID  = setInterval(this.run.bind(this), this.intervalTimeOut);
    },
    
    initRun: function() {
        console.log(this.runningCurves);
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