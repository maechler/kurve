"use strict";

Kurve.Game = {    
    
    runIntervalID:      null,
    framesPerSecond:    25,
    intervalTimeOut:    null,
    maxPoints:          null,
        
    keysDown:           {},
    running:            false,
    curves:             [],
    runningCurves:      {},
    players:            {},
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
        this.maxPoints = (this.curves.length - 1) * 10;
        
        this.addPlayers();
        this.renderPlayerScores();
        this.addWindowListeners();
        this.startNewRound.bind(this);
    },
    
    renderPlayerScores: function() {
        var playerHTML      = '';
        var sortedPlayers   = [];
        
        for (var i in this.players) sortedPlayers.push(this.players[i]);
        sortedPlayers.sort(this.playerSorting);
        
        for (var i in sortedPlayers) playerHTML += sortedPlayers[i].renderScoreItem();
        
        document.getElementById('player-scores').innerHTML = playerHTML;
    },
    
    playerSorting: function(playerA, playerB) {
        return playerB.getPoints() - playerA.getPoints();
    },
    
    addPlayers: function() {
        for (var i in Kurve.players) {
            if ( !Kurve.players[i].isActive ) continue;
            
            this.players[Kurve.players[i].getId()] = Kurve.players[i];
        }
    },
    
    notifyDeath: function(curve) {
        delete this.runningCurves[curve.getPlayer().getId()];
        
        for (var i in this.runningCurves) {
            this.runningCurves[i].getPlayer().incrementPoints();
        }
        
        this.renderPlayerScores();
        
        if ( Object.keys(this.runningCurves).length === 1 ) this.terminateRound();
    },
    
    startNewRound: function() {        
        this.running = true;
        
        Kurve.Field.drawField();
        this.initRun();
        setTimeout(this.startRun.bind(this), Kurve.Config.Game.startDelay);
    },
    
    startRun: function() {
        this.runIntervalID  = setInterval(this.run.bind(this), this.intervalTimeOut);
    },
    
    initRun: function() {
        this.curves.forEach(function(curve) {
            Kurve.Game.runningCurves[curve.getPlayer().getId()] = curve;
            
            curve.setRandomPosition(Kurve.Field.getRandomPosition());
            curve.drawPoint(Kurve.Field.ctx);
            curve.moveToNextFrame();
        });
    },
    
    terminateRound: function() {
        this.running        = false;
        this.runningCurves  = {};
        
        clearInterval(this.runIntervalID);
        this.checkForWinner();
    },
    
    checkForWinner: function() {
        for(var i in this.players) {
            if (this.players[i].getPoints() >= this.maxPoints) this.gameOver(this.players[i]); 
        }        
    },
    
    gameOver: function(player) {
        alert("And the winner is: " + player.getId() + " !!!");
    }

};