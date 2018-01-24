/**
 *
 * Program:     Kurve
 * Author:      Markus Mächler, marmaechler@gmail.com
 * License:     http://www.gnu.org/licenses/gpl.txt
 * Link:        http://achtungkurve.com
 *
 * Copyright © 2014, 2015 Markus Mächler
 *
 * Kurve is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Kurve is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Kurve.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

'use strict';

Kurve.Game = {    
    
    runIntervalId:          null,
    fps:                    null,
    intervalTimeOut:        null,
    maxPoints:              null,
        
    keysDown:               {},
    isRunning:              false,
    curves:                 [],
    runningCurves:          {},
    players:                [],
    deathMatch:             false,
    isPaused:               false,
    isRoundStarted:         false,
    playerScoresElement:    null,
    isGameOver:             false,
    
    init: function() {
        this.fps                    = Kurve.Config.Game.fps;
        this.intervalTimeOut        = Math.round(1000 / this.fps);
        this.playerScoresElement    = document.getElementById('player-scores');
    },
    
    run: function() {
        requestAnimationFrame(this.drawFrame.bind(this));
    },
    
    drawFrame: function() {
        for (var i in this.runningCurves) {
            if ( this.runningCurves[i] !== undefined ) this.runningCurves[i].drawNextFrame();
        }
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
        if ( this.isGameOver ) return location.reload();
        if ( this.isRunning || this.isPaused ) return this.togglePause();
        if ( !this.isRoundStarted && !this.deathMatch) return this.startNewRound();
        if ( !this.isRoundStarted && this.deathMatch) return this.startDeathMatch();
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

        Kurve.Piwik.trackPageVariable('number_of_players', this.players.length);
        
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
        
        for (var i in this.runningCurves) {
            this.runningCurves[i].getPlayer().incrementPoints();
        }
        
        this.renderPlayerScores();
        
        if ( Object.keys(this.runningCurves).length === 1 ) this.terminateRound();
    },
    
    startNewRound: function() {
        this.isRoundStarted = true;

        Kurve.Field.drawField();
        this.initRun();
        this.renderPlayerScores();
        setTimeout(this.startRun.bind(this), Kurve.Config.Game.startDelay);
    },
    
    startRun: function() {        
        this.isRunning = true;
        this.runIntervalId = setInterval(this.run.bind(this), this.intervalTimeOut);

        this.curves.forEach(function(curve) {
            curve.setJustStarted(true);
        });
    },
    
    stopRun: function() {        
        this.isRunning = false;
        clearInterval(this.runIntervalId);
    },
    
    initRun: function() {
        this.curves.forEach(function(curve) {
            Kurve.Game.runningCurves[curve.getPlayer().getId()] = curve;
            
            curve.setRandomPosition(Kurve.Field.getRandomPosition().getPosX(), Kurve.Field.getRandomPosition().getPosY());
            curve.setRandomAngle();
            curve.drawCurrentPosition(Kurve.Field);
            curve.getPlayer().getSuperpower().init(curve);
        });
    },
    
    terminateRound: function() {
        this.curves.forEach(function(curve) {
            curve.getPlayer().getSuperpower().close(curve);
        });

        if ( this.deathMatch ) {
            var curve = this.runningCurves[Object.keys(this.runningCurves)[0]];
            this.gameOver(curve.getPlayer());
        }

        this.isRoundStarted = false;
        this.stopRun();
        this.runningCurves  = {};
        this.incrementSuperpowers();
        this.checkForWinner();
    },

    incrementSuperpowers: function() {
        var numberOfPlayers = this.players.length;

        this.players[numberOfPlayers - 1].getSuperpower().incrementCount();
        this.players[numberOfPlayers - 1].getSuperpower().incrementCount();

        var numberOfOtherPlayersGettingSomething = u.round((numberOfPlayers - 2) / 2, 0);

        for (var i = numberOfOtherPlayersGettingSomething; i > 0; i--) {
            this.players[numberOfPlayers - 1 - i].getSuperpower().incrementCount();
        }
    },
    
    checkForWinner: function() {
        if ( this.deathMatch ) return;

        var winners = [];
        
        this.players.forEach(function(player) {
            if (player.getPoints() >= Kurve.Game.maxPoints) winners.push(player); 
        });
        
        if (winners.length === 0) return;
        if (winners.length === 1) this.gameOver(winners[0]);
        if (winners.length  >  1) this.initDeathMatch(winners);
    },

    initDeathMatch: function(winners) {
        this.deathMatch = true;
        Kurve.Lightbox.show('<div class="deathmatch"><h1>DEATHMATCH!</h1></div>');

        var winnerCurves = [];
        this.curves.forEach(function(curve) {
            winners.forEach(function(player){
                if (curve.getPlayer() === player) {
                    winnerCurves.push(curve);
                    player.setColor('#333');
                }
            });
        });

        this.curves = winnerCurves;
    },
    
    startDeathMatch: function(winners) {
        Kurve.Lightbox.hide();
        this.startNewRound();
    },
    
    gameOver: function(winner) {
        Kurve.Piwik.trackPageVariable('finished_game', 'yes');
        this.isGameOver = true;

        Kurve.Lightbox.show(
            '<h1 class="active ' + winner.getId() + '">' + winner.getId() + ' wins!</h1>' +
            '<a href="#" onclick="Kurve.reload(); return false;" title="Go back to the menu"  class="button">Start new game</a>'
        );
    }

};