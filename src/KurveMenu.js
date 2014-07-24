'use strict';

Kurve.Menu = {
    
    boundOnKeyDown: null,
    
    init: function() {
        this.initPlayerMenu();
        this.addWindowListeners();
        this.addMouseListeners();
    },
        
    initPlayerMenu: function() {
        var playerHTML = '';
        
        Kurve.players.forEach(function(player) {
            playerHTML += player.renderMenuItem();
        });
        
        document.getElementById('menu-players-list').innerHTML += playerHTML;
    },
    
    addWindowListeners: function() {
        this.boundOnKeyDown = this.onKeyDown.bind(this);
        window.addEventListener('keydown', this.boundOnKeyDown, false);
    },

    addMouseListeners: function() {
        var playerItems = document.getElementById('menu-players-list').children;

        for (var i=0; i < playerItems.length; i++) {
            playerItems[i].addEventListener('click', this.onPlayerItemClicked, false);
        }
    },
    
    removeWindowListeners: function() {
        window.removeEventListener('keydown', this.boundOnKeyDown, false);  
    },

    onPlayerItemClicked: function(event) {
        Kurve.Menu.togglePlayerActivation(this.id);
    },
    
    onKeyDown: function(event) {
        if (event.keyCode === 32) Kurve.Menu.onSpaceDown();

        Kurve.players.forEach(function(player) {
            if ( player.isKeyLeft(event.keyCode) ) {
                Kurve.Menu.activatePlayer(player.getId());
            } else if ( player.isKeyRight(event.keyCode) ) {
                Kurve.Menu.deactivatePlayer(player.getId());
            } else if ( player.isKeySuperpower(event.keyCode) ) {
                Kurve.Menu.nextSuperpower(player.getId());
            }
        });
    },
    
    onSpaceDown: function() {
        Kurve.players.forEach(function(player) {
            if ( player.isActive ) {
                Kurve.Game.curves.push(
                    new Kurve.Curve(player, Kurve.Game, Kurve.Field, Kurve.Config.Curve)
                );    
            }
        });
        
        if (Kurve.Game.curves.length === 0) return; //no players are ready
        
        u.addClass('hidden', 'menu');
        u.removeClass('hidden', 'field');
        u.removeClass('hidden', 'content-right');
        
        Kurve.Game.startGame();
    },

    onNextSuperPowerClicked: function(event, playerId) {
        event.stopPropagation();
        Kurve.Menu.nextSuperpower(playerId);
    },

    onPreviousSuperPowerClicked: function(event, playerId) {
        event.stopPropagation();
        Kurve.Menu.previousSuperpower(playerId);
    },

    nextSuperpower: function(playerId) {
        var player = Kurve.getPlayer(playerId);
        var count = 0;
        var superpowerType = '';

        for (var i in Kurve.Superpowerconfig.types) {
            count++;
            if ( !(Kurve.Superpowerconfig.types[i] === player.getSuperpower().getType() ) ) continue;

            if ( Object.keys(Kurve.Superpowerconfig.types).length === count) {
                superpowerType = Object.keys(Kurve.Superpowerconfig.types)[0];
                break;
            } else {
                superpowerType = Object.keys(Kurve.Superpowerconfig.types)[count];
                break;
            }
        }

        player.setSuperpower( Kurve.Factory.getSuperpower(superpowerType) );
    },

    previousSuperpower: function(playerId) {
        var player = Kurve.getPlayer(playerId);
        var count = 0;
        var superpowerType = '';

        for (var i in Kurve.Superpowerconfig.types) {
            count++;
            if ( !(Kurve.Superpowerconfig.types[i] === player.getSuperpower().getType() ) ) continue;

            if ( 1 === count) {
                superpowerType = Object.keys(Kurve.Superpowerconfig.types)[Object.keys(Kurve.Superpowerconfig.types).length - 1];
                break;
            } else {
                superpowerType = Object.keys(Kurve.Superpowerconfig.types)[count - 2];
                break;
            }
        }

        player.setSuperpower( Kurve.Factory.getSuperpower(superpowerType) );
    },

    activatePlayer: function(playerId) {
        Kurve.getPlayer(playerId).isActive = true;

        u.removeClass('inactive', playerId);
        u.addClass('active', playerId);
    },

    deactivatePlayer: function(playerId) {
        Kurve.getPlayer(playerId).isActive = false;

        u.removeClass('active', playerId);
        u.addClass('inactive', playerId);
    },

    togglePlayerActivation: function(playerId) {
        if ( Kurve.getPlayer(playerId).isActive ) {
            Kurve.Menu.deactivatePlayer(playerId);
        } else {
            Kurve.Menu.activatePlayer(playerId);
        }
    },

    requestFullScreen: function() {
        document.body.webkitRequestFullScreen();
    }
    
};