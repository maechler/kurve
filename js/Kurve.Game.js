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
    imageData:            {},
    
    init: function() {
        this.intervalTimeOut = Math.round(1000 / this.framesPerSecond);
    },
    
    run: function() {
        var start = new Date().getTime() / 1000;
        
        this.imageData = Kurve.Field.getFieldData();

        for (var curve in this.activeCurvesInThisRound) {
            this.activeCurvesInThisRound[curve].draw(Kurve.Field.ctx);
            this.activeCurvesInThisRound[curve].moveToNextFrame();
            this.activeCurvesInThisRound[curve].checkForCollision(Kurve.Field.ctx);
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
        console.log(this.players);
        var sortArray = [];
        
        for (var i in this.players) {
            sortArray.push(this.players[i]);
        }
        
        sortArray.sort(function(a,b) {
            console.log("playa " + a.points);
            return b.points - a.points;
        });
        
        console.log('sorted:');
        console.log(sortArray);
        
        for (var i in sortArray) {
            console.log(i);
            playerHTML += sortArray[i].renderScoreItem();
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
        Kurve.Field.drawField();
        this.running        = true;
        this.runIntervalID  = setInterval(this.run.bind(this), this.intervalTimeOut);
    },
    
    initRun: function() {
        for (var i in this.curves) {
            var curve = this.curves[i];
            this.activeCurvesInThisRound[curve.player.id] = curve;
        }
        
        for (var curve in this.activeCurvesInThisRound) {
            this.activeCurvesInThisRound[curve].moveToNextFrame();
            this.activeCurvesInThisRound[curve].draw(Kurve.Field.ctx);
        }
    },
    
    terminateRound: function() {
        console.log('terminateRound');
        this.running = false;
        clearInterval(this.runIntervalID);
    }         

};