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
    CURRENT_FRAME_DATE:     null,
    
    init: function() {
        this.fps = Kurve.Config.Game.fps;
        this.intervalTimeOut = Math.round(1000 / this.fps);
        this.playerScoresElement = document.getElementById('player-scores');

        this.Audio.init();
    },
    
    run: function() {
        this.CURRENT_FRAME_DATE = new Date();
        requestAnimationFrame(this.drawFrame.bind(this));
    },
    
    drawFrame: function() {
        for (var i in this.runningCurves) {
            for (var j = 0; this.runningCurves[i] && j < this.runningCurves[i].length; ++j) {
                this.runningCurves[i][j].drawNextFrame();
            }
        }
    },
    
    addWindowListeners: function() {
        Kurve.Menu.removeWindowListeners();
        
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));  
    },
    
    onKeyDown: function(event) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Spacebar', ' '].indexOf(event.key) >= 0) {
            event.preventDefault(); //prevent page scrolling
        }

        if ( event.keyCode === 32 ) {
            this.onSpaceDown();
        }

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
            this.Audio.pauseOut();
            Kurve.Lightbox.hide();
            this.startRun();
        } else {
            this.Audio.pauseIn();
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

        Kurve.Piwik.trackPageVariable(1, 'theme', Kurve.Theming.currentTheme);
        Kurve.Piwik.trackPageVariable(2, 'number_of_players', this.players.length);
        Kurve.Piwik.trackPageView('Game');
        
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
        var playerId = curve.getPlayer().getId();
        // Drop this curve.
        if ( this.runningCurves[playerId] === undefined ) return;

        this.runningCurves[playerId].splice(this.runningCurves[playerId].indexOf(curve), 1);

        if ( this.runningCurves[playerId].length === 0 ) {
            // Drop this player.
            delete this.runningCurves[curve.getPlayer().getId()];
            for (var i in this.runningCurves) {
                this.runningCurves[i][0].getPlayer().incrementPoints();
            }
        
            this.renderPlayerScores();

            if ( Object.keys(this.runningCurves).length === 2 ) {
                this.Audio.tension();
            }
        
            if ( Object.keys(this.runningCurves).length === 1 ) this.terminateRound();
        }
    },
    
    startNewRound: function() {
        this.isRoundStarted = true;

        Kurve.Field.clearFieldContent();
        this.initRun();
        this.renderPlayerScores();

        setTimeout(this.startRun.bind(this), Kurve.Config.Game.startDelay);
        this.Audio.startNewRound();
    },
    
    startRun: function() {
        this.isRunning = true;
        this.runIntervalId = setInterval(this.run.bind(this), this.intervalTimeOut);

        if (this.isPaused) {
            for (var i in this.runningCurves) {
                for (var j = 0; this.runningCurves[i] && j < this.runningCurves[i].length; ++j) {
                    this.runningCurves[i][j].setImmunity([this.runningCurves[i][j]], 5);
                }
            }
        } else {
            this.curves.forEach(function(curve) {
                curve.setImmunity([curve], 5);
            });
        }
    },
    
    stopRun: function() {
        this.isRunning = false;
        clearInterval(this.runIntervalId);
    },
    
    initRun: function() {
        this.curves.forEach(function(curve) {
            Kurve.Game.runningCurves[curve.getPlayer().getId()] = [curve];
            
            curve.setPosition(Kurve.Field.getRandomPosition().getPosX(), Kurve.Field.getRandomPosition().getPosY());
            curve.setRandomAngle();
            curve.getPlayer().getSuperpower().init(curve);
            curve.drawCurrentPosition(Kurve.Field);
        });
    },
    
    terminateRound: function() {
        this.curves.forEach(function(curve) {
            curve.getPlayer().getSuperpower().close(curve);
        });

        if ( this.deathMatch ) {
            var curve = this.runningCurves[Object.keys(this.runningCurves)[0]][0];
            this.gameOver(curve.getPlayer());
        }

        this.isRoundStarted = false;
        this.stopRun();
        this.runningCurves  = {};
        this.incrementSuperpowers();
        this.Audio.terminateRound();
        this.checkForWinner();
    },

    incrementSuperpowers: function() {
        var numberOfPlayers = this.players.length;
        var lastPlayerIndex = numberOfPlayers - 1;

        this.players[lastPlayerIndex].getSuperpower().incrementCount();

        if (numberOfPlayers > 2) {
            this.players[lastPlayerIndex].getSuperpower().incrementCount();
        }

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
        this.Audio.initDeathMatch();
        Kurve.Lightbox.show('<div class="deathmatch"><h1>DEATHMATCH!</h1></div>');

        var winnerCurves = [];
        this.curves.forEach(function(curve) {
            winners.forEach(function(player){
                if (curve.getPlayer() === player) {
                    winnerCurves.push(curve);
                    player.setColor(Kurve.Theming.getThemedValue('field', 'deathMatchColor'));
                }
            });
        });

        this.curves = winnerCurves;
    },
    
    startDeathMatch: function(winners) {
        Kurve.Piwik.trackPageVariable(3, 'death_match', 'yes');
        Kurve.Lightbox.hide();
        this.startNewRound();
    },
    
    gameOver: function(winner) {
        this.isGameOver = true;

        this.Audio.gameOver();
        Kurve.Piwik.trackPageVariable(4, 'finished_game', 'yes');
        Kurve.Piwik.trackPageView('GameOver');

        Kurve.Lightbox.show(
            '<h1 class="active ' + winner.getId() + '">' + winner.getId() + ' wins!</h1>' +
            '<a href="#" onclick="Kurve.reload(); return false;" title="Go back to the menu"  class="button">Start new game</a>'
        );
    },

    Audio: {
        stemLevel: 1,
        audioPlayer: null,
        defaultFadeTime: 1000,

        init: function() {
            this.audioPlayer = Kurve.Sound.getAudioPlayer();
        },

        startNewRound: function() {
            var startIn1Delay = Kurve.Config.Game.startDelay / 3;
            var startIn2Delay = 2 * startIn1Delay;
            var startOutDelay = 3 * startIn1Delay;

            setTimeout(this.audioPlayer.play.bind(this.audioPlayer, 'game-start-in', {reset: true}), startIn1Delay);
            setTimeout(this.audioPlayer.play.bind(this.audioPlayer, 'game-start-in', {reset: true}), startIn2Delay);
            setTimeout(function() {
                this.audioPlayer.play('game-start-out', {reset: true});
                this.setAllCurvesMuted('all', false);

                if ( Kurve.Game.deathMatch ) {
                    this.stemLevel = 3;
                    this.audioPlayer.play('game-music-stem-1', {fade: this.defaultFadeTime, volume: 1, background: true, loop: true, reset: true});
                    this.audioPlayer.play('game-music-stem-4', {fade: this.defaultFadeTime, volume: 0.5, background: true, loop: true, reset: true});
                } else {
                    this.stemLevel = 1;
                    this.audioPlayer.play('game-music-stem-1', {fade: this.defaultFadeTime, volume: 1, background: true, loop: true, reset: true});
                    this.audioPlayer.play('game-music-stem-2', {fade: this.defaultFadeTime, volume: 0, background: true, loop: true, reset: true});
                    this.audioPlayer.play('game-music-stem-3', {fade: this.defaultFadeTime, volume: 0, background: true, loop: true, reset: true});
                }
            }.bind(this), startOutDelay);
        },

        terminateRound: function() {
            this.pauseAllCurves('all', {reset: true});
            this.audioPlayer.pause('game-music-stem-1', {fade: this.defaultFadeTime, reset: true});
            this.audioPlayer.pause('game-music-stem-2', {fade: this.defaultFadeTime, reset: true});
            this.audioPlayer.pause('game-music-stem-3', {fade: this.defaultFadeTime, reset: true});
            this.audioPlayer.pause('game-music-stem-4', {fade: this.defaultFadeTime, reset: true});
            this.audioPlayer.play('game-end');
        },

        pauseIn: function() {
            this.audioPlayer.play('game-pause-in');
            this.setAllCurvesMuted('all', true);
            this.audioPlayer.setVolume('game-music-stem-1', {volume: 0.25, fade: this.defaultFadeTime});

            if (this.stemLevel > 1) {
                this.audioPlayer.setVolume('game-music-stem-2', {volume: 0, fade: this.defaultFadeTime});
            }

            if (this.stemLevel > 2) {
                this.audioPlayer.setVolume('game-music-stem-3', {volume: 0, fade: this.defaultFadeTime});
            }

            if (Kurve.Game.deathMatch) {
                this.audioPlayer.setVolume('game-music-stem-4', {volume: 0, fade: this.defaultFadeTime});
            }
        },

        pauseOut: function() {
            this.audioPlayer.play('game-pause-out');
            this.setAllCurvesMuted('all', false);
            this.audioPlayer.setVolume('game-music-stem-1', {volume: 1, fade: this.defaultFadeTime});

            if (this.stemLevel > 1) {
                this.audioPlayer.setVolume('game-music-stem-2', {volume: 0.75, fade: this.defaultFadeTime});
            }

            if (this.stemLevel > 2) {
                this.audioPlayer.setVolume('game-music-stem-3', {volume: 0.75, fade: this.defaultFadeTime});
            }

            if (Kurve.Game.deathMatch) {
                this.audioPlayer.setVolume('game-music-stem-4', {volume: 0.5, fade: this.defaultFadeTime});
            }
        },

        tension: function() {
            if (Kurve.Game.deathMatch) {
                return;
            }

            this.stemLevel = 3;
            this.audioPlayer.setVolume('game-music-stem-2', {volume: 0.75, fade: this.defaultFadeTime});
            this.audioPlayer.setVolume('game-music-stem-3', {volume: 0.75, fade: this.defaultFadeTime});
        },

        initDeathMatch: function() {
            this.audioPlayer.play('game-deathmatch');
        },

        gameOver: function() {
            this.audioPlayer.pause('all');
            this.audioPlayer.play('game-victory');
        },

        setAllCurvesMuted: function(soundKey, muted) {
            Kurve.Game.curves.forEach(function(curve) {
                curve.setMuted(soundKey, muted);
            });
        },

        pauseAllCurves: function(soundKey, options) {
            Kurve.Game.curves.forEach(function(curve) {
                curve.pause(soundKey, options);
            });
        }
    }
};
