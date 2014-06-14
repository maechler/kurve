"use strict";

Kurve.Game = {    
    
    runIntervalId:      null,
    fps:                Kurve.Config.Game.fps,
    intervalTimeOut:    null,
    maxPoints:          null,
        
    keysDown:           {},
    running:            false,
    curves:             [],
    runningCurves:      {},
    players:            [],
    deathMatch:         false,
    isPaused:           false,
    
    init: function() {
        this.intervalTimeOut = Math.round(1000 / this.fps);
    },
    
    run: function() {
        requestAnimationFrame(this.drawFrame.bind(this));
    },
    
    drawFrame: function() {
        for (var i in this.runningCurves) this.runningCurves[i].drawNextFrame();
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
        if ( this.running || this.isPaused ) {
            this.togglePause();   
        } else {
            this.startNewRound();
        }
    },
    
    togglePause: function() {
        if ( this.isPaused ) {
            Kurve.Lightbox.hide();
            this.startRun();
        } else {
            this.stopRun();
            Kurve.Lightbox.show("<h1>Paused</h1>");
        }
        
        this.isPaused = !this.isPaused;
    },
    
    startGame: function() {
        this.maxPoints = (this.curves.length - 1) * 10;
        
        this.addPlayers();
        this.addWindowListeners();
        this.renderPlayerScores();
        
        this.startNewRound.bind(this);
    },
    
    renderPlayerScores: function() {
        var playerHTML  = '';
        
        this.players.sort(this.playerSorting);
        this.players.forEach(function(player) { playerHTML += player.renderScoreItem() });
        
        document.getElementById('player-scores').innerHTML = playerHTML;
    },
    
    playerSorting: function(playerA, playerB) {
        return playerB.getPoints() - playerA.getPoints();
    },
    
    addPlayers: function() {
        Kurve.Game.curves.forEach(function(curve) {
            Kurve.Game.players.push( curve.getPlayer() );
        });
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
        Kurve.Field.drawField();
        this.initRun();
        setTimeout(this.startRun.bind(this), Kurve.Config.Game.startDelay);
    },
    
    startRun: function() {        
        this.running        = true;
        this.runIntervalId  = setInterval(this.run.bind(this), this.intervalTimeOut);
    },
    
    stopRun: function() {        
        this.running        = false;
        clearInterval(this.runIntervalId);
    },
    
    initRun: function() {
        this.curves.forEach(function(curve) {
            Kurve.Game.runningCurves[curve.getPlayer().getId()] = curve;
            
            curve.setRandomPosition(Kurve.Field.getRandomPosition());
            curve.setRandomAngle();
            curve.drawPoint(Kurve.Field.ctx);
        });
    },
    
    terminateRound: function() {
        this.stopRun();
        this.runningCurves  = {};
        this.checkForWinner();
    },
    
    checkForWinner: function() {
        var winners = [];
        
        this.players.forEach(function(player) {
            if (player.getPoints() >= Kurve.Game.maxPoints) winners.push(player); 
        });
        
        if (winners.length === 0) return;
        if (winners.length === 1) this.gameOver(winners[0]);
        if (winners.length  >  1) this.startDeathMatch(winners);
    },
    
    startDeathMatch: function(winners) {
        this.deathMatch = true;
        console.log('death match');
        Kurve.Lightbox.show("DEATHMATCH!");
        setTimeout(Kurve.Lightbox.hide.bind(Kurve.Lightbox), 3000);
        
        var winnerCurves = [];
        this.curves.forEach(function(curve) {
            winners.forEach(function(player){
                if (curve.getPlayer() === player) winnerCurves.push(curve);
            });
        });
        
        this.curves = winnerCurves;
        
        this.startNewRound();
    },
    
    gameOver: function(player) {
        var winnerHTML   = '<h1 class="active ' + player.getId() + '">' + player.getId() + ' wins!</h1>';
        winnerHTML      += '<a href="/">Start new game</a>';
        
        Kurve.Lightbox.show(winnerHTML);
    }

};