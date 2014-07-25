'use strict';

Kurve.Game = {    
    
    runIntervalId:          null,
    fps:                    Kurve.Config.Game.fps,
    intervalTimeOut:        null,
    maxPoints:              null,
        
    keysDown:               {},
    running:                false,
    curves:                 [],
    runningCurves:          {},
    players:                [],
    deathMatch:             false,
    isPaused:               false,
    isRoundStarted:         false,
    playerScoresElement:    null,
    
    init: function() {
        this.intervalTimeOut        = Math.round(1000 / this.fps);
        this.playerScoresElement    = document.getElementById('player-scores');
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
        if ( event.keyCode === 32 ) this.onSpaceDown();
        
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
        } else if ( !this.isRoundStarted ) {
            this.startNewRound();
        }
    },
    
    togglePause: function() {
        if ( this.isPaused ) {
            Kurve.Lightbox.hide();
            this.startRun();
        } else {
            this.stopRun();
            Kurve.Lightbox.show('<h2>Game is paused</h2>');
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
        
        this.playerScoresElement.innerHTML = playerHTML;
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
        this.losers.push(curve);
        
        for (var i in this.runningCurves) {
            this.runningCurves[i].getPlayer().incrementPoints();
        }
        
        this.renderPlayerScores();
        
        if ( Object.keys(this.runningCurves).length === 1 ) this.terminateRound();
    },
    
    startNewRound: function() {
        this.isRoundStarted = true;
        this.losers         = [];
        
        Kurve.Field.drawField();
        this.initRun();
        this.renderPlayerScores();
        setTimeout(this.startRun.bind(this), Kurve.Config.Game.startDelay);
    },
    
    startRun: function() {        
        this.running        = true;
        this.runIntervalId  = setInterval(this.run.bind(this), this.intervalTimeOut);
    },
    
    stopRun: function() {        
        this.running = false;
        clearInterval(this.runIntervalId);
    },
    
    initRun: function() {
        this.curves.forEach(function(curve) {
            Kurve.Game.runningCurves[curve.getPlayer().getId()] = curve;
            
            curve.setRandomPosition(Kurve.Field.getRandomPosition());
            curve.setRandomAngle();
            curve.drawPoint(Kurve.Field.ctx);
            curve.getPlayer().getSuperpower().isActive = false;
        });
    },
    
    terminateRound: function() {
        this.isRoundStarted = false;
        
        this.stopRun();
        this.runningCurves  = {};
        this.incrementSuperpowers();
        this.checkForWinner();
    },

    incrementSuperpowers: function() {
        var numberOfPlayers = this.players.length;

        this.players[numberOfPlayers - 1].getSuperpower().count += 2;

        var numberOfOtherPlayersGettingSomething = u.round((numberOfPlayers - 2) / 2, 0);

        for (var i = numberOfOtherPlayersGettingSomething; i > 0; i--) {
            this.players[numberOfPlayers - 1 - i].getSuperpower().count++;
        }
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
        Kurve.Lightbox.show('DEATHMATCH!');
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
    
    gameOver: function(winner) {
        var winnerHTML   = '<h1 class="active ' + winner.getId() + '">' + winner.getId() + ' wins!</h1>';
        winnerHTML      += '<a href="/">Start new game</a>';
        
        Kurve.Lightbox.show(winnerHTML);
    }

};