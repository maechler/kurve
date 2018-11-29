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

Kurve.Sound = {
    onUserInteractionBound: null,
    muted: true,
    audios: {
        'menu-music': {
            source: 'menu-music.wav'
        },
        'menu-navigate': {
            source: 'menu-navigate.wav'
        },
        'menu-error': {
            source: 'menu-error.wav'
        },
        'game-music': {
            source: 'game-music.wav'
        },
        'game-music-intensified': {
            source: 'game-music-intensified.wav'
        },
        'game-victory': {
            source: 'game-victory.wav'
        },
        'game-end': {
            source: 'game-end.wav'
        },
        'game-deathmatch': {
            source: 'game-deathmatch.wav'
        },
        'game-deathmatch-music': {
            source: 'game-deathmatch-music.wav'
        },
        'game-pause-in': {
            source: 'game-pause-in.wav'
        },
        'game-pause-out': {
            source: 'game-pause-out.wav'
        },
        'game-start-in': {
            source: 'game-start-in.wav'
        },
        'game-start-out': {
            source: 'game-start-out.wav'
        },
        'curve-crashed': {
            source: 'curve-crashed.wav'
        }
    },
    audioPlayers: [],
    defaultOptions: {
        loop: false,
        background: false,
        fadeIn: 0,
        fadeOut: 0,
        reset: false,
        resetOnEnded: true,
        volume: 1,
    },

    init: function() {
        this.initSuperpowerSounds();
        this.preloadAudio();

        if (Kurve.Storage.has('kurve.sound.muted')) {
            this.muted = Kurve.Storage.get('kurve.sound.muted');
        } else {
            Kurve.Storage.set('kurve.sound.muted', this.muted);
        }

        if (this.muted) {
            this.setButtonText('Sound off');
        } else {
            this.setButtonText('Sound on');
        }
    },

    initSuperpowerSounds: function() {
        for (var i in Kurve.Superpowerconfig.types) {
            if ( !Array.isArray(Kurve.Superpowerconfig[i].audios) ) continue;

            Kurve.Superpowerconfig[i].audios.forEach(function(audio) {
                this.audios[audio['key']] = {
                    source: audio['source']
                }
            }.bind(this));
        }
    },

    preloadAudio: function() {
        for (var i in this.audios) {
            new Audio(Kurve.Config.Sound.soundPath + this.audios[i].source);
        }
    },

    registerUserInteractionListener: function(callback) {
        this.onUserInteractionBound = this.onUserInteraction.bind(this, callback);

        window.addEventListener('keydown', this.onUserInteractionBound, false);
        window.document.body.addEventListener('click', this.onUserInteractionBound, false);
    },

    onUserInteraction: function(callback) {
        window.removeEventListener('keydown', this.onUserInteractionBound, false);
        window.document.body.removeEventListener('click', this.onUserInteractionBound, false);

        if ( typeof callback === 'function' ) {
            callback();
        }
    },

    getPlayer: function() {
        var player = new Kurve.AudioPlayer(this.audios);

        player.setMuted(this.muted);
        this.audioPlayers.push(player);

        return player;
    },

    toggleSound: function() {
        if (this.muted === false) {
            this.audioPlayers.forEach(function(player) {
                player.setMuted('all', true);
            });
            this.muted = true;
            this.setButtonText('Sound off');
        } else {
            this.audioPlayers.forEach(function(player) {
                player.setMuted('all', false);
            });
            this.muted = false;
            this.setButtonText('Sound on');
        }

        Kurve.Storage.set('kurve.sound.muted', this.muted);
    },
    
    setButtonText: function (text) {
        var buttonList= document.getElementsByClassName('toggle-sound');

        for (var i = 0; i < buttonList.length; i++) {
            buttonList[i].innerText = text;
        }
    },

    onCreditsCloseClicked: function () {
        Kurve.Lightbox.hide();
    },

    onCreditsClicked: function () {
        Kurve.Lightbox.show(document.getElementById('credits').innerHTML);
    }
};

Kurve.AudioPlayer = function(audios) {
    this.audios = audios;
    this.activeAudioMap = {};
};

Kurve.AudioPlayer.prototype.play = function(soundKey, options) {
    if ( soundKey === undefined ) return;
    if ( this.audios[soundKey] === undefined ) return;
    if ( Kurve.Sound.muted && options !== undefined && !options['background'] ) return;

    var audioOptions = u.merge({}, Kurve.Sound.defaultOptions, options);

    if ( this.activeAudioMap[soundKey] === undefined ) {
        this.activeAudioMap[soundKey] = new Audio(Kurve.Config.Sound.soundPath + this.audios[soundKey].source);
    }

    var audio = this.activeAudioMap[soundKey];

    //todo:  test performance
    //audio.playbackRate = 1.25;

    audio.loop = audioOptions.loop;
    audio.muted = Kurve.Sound.muted;
    audio.volume = 0;
    audio.onended = function() {
        if ( audioOptions.resetOnEnded && audio.currentTime !== 0) {
            audio.currentTime = 0;
        }
    };

    if (audioOptions.reset && audio.currentTime !== 0) {
        audio.currentTime = 0;
    }

    this.setVolume(soundKey, {fade: audioOptions.fadeIn, volume: audioOptions.volume});

    audio.play().catch(function() {
        if ( audioOptions.background ) {
            // User interaction required to start sound because of the browser Autoplay Policy
            Kurve.Sound.registerUserInteractionListener(audio.play.bind(audio));
        }
    });
};

Kurve.AudioPlayer.prototype.pause = function(soundKey, options) {
    if ( soundKey !== 'all' && this.activeAudioMap[soundKey] === undefined ) return;

    if ( soundKey === 'all' ) {
        for (var i in this.activeAudioMap) {
            this.pause(i, options);
        }
    } else {
        var audioOptions = u.merge({}, Kurve.Sound.defaultOptions, options);
        var audio = this.activeAudioMap[soundKey];
        var stopAudio = function() {
            audio.pause();

            if (audioOptions.reset && audio.currentTime !== 0) {
                audio.currentTime = 0
            }
        };

        this.setVolume(soundKey, {fade: audioOptions.fadeOut, volume: 0}, stopAudio);
    }
};

Kurve.AudioPlayer.prototype.setVolume = function(soundKey, options, callback) {
    if ( options.volume === undefined ) return;
    if ( this.activeAudioMap[soundKey] === undefined ) return;

    var audio = this.activeAudioMap[soundKey];

    if (options.fade === undefined || options.fade === 0 ) {
        audio.volume = options.volume;
        if ( typeof callback === 'function' ) callback();
    } else {
        if ( typeof this.fadeTimeOut !== 'undefined' ) clearTimeout(this.fadeTimeOut);

        var fadeStep = 1 / (options.fade / Kurve.Config.Sound.fadeTimeOut);
        var fadeIn = audio.volume < options.volume;
        var fadeTimeOutFunction = function () {
            audio.volume = fadeIn ? Math.min(1, audio.volume + fadeStep) : Math.max(0, audio.volume - fadeStep);

            if (fadeIn && audio.volume < options.volume || !fadeIn && audio.volume > options.volume) {
                //still fading
                this.fadeTimeOut = setTimeout(fadeTimeOutFunction, Kurve.Config.Sound.fadeTimeOut);
            } else {
                //finished fading
                if ( typeof callback === 'function' ) callback();
            }
        }.bind(this);

        this.fadeTimeOut = setTimeout(fadeTimeOutFunction, Kurve.Config.Sound.fadeTimeOut);
    }
};

Kurve.AudioPlayer.prototype.setMuted = function(soundKey, muted) {
    if ( soundKey === undefined || muted === undefined ) return;

    if ( soundKey === 'all' ) {
        for (var i in this.activeAudioMap) {
            this.activeAudioMap[i].muted = muted;
        }
    } else if ( this.activeAudioMap[soundKey] !== undefined ) {
        this.activeAudioMap[soundKey].muted = muted;
    }
};
