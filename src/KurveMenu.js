"use strict";

Kurve.Menu = {
    
    boundKeyDown: null,
    
    init: function() {
        this.initPlayerMenu();
        this.addWindowListeners();
    },
        
    initPlayerMenu: function() {
        var playerHTML = '';
        
        Kurve.players.forEach(function(player) {
            playerHTML += player.renderMenuItem();
        });
        
        document.getElementById('menu-players').innerHTML += playerHTML;
    },
    
    addWindowListeners: function() {
        this.boundKeyDown = this.onKeyDown.bind(this);
        window.addEventListener('keydown', this.boundKeyDown, false);
    },
    
    removeWindowListeners: function() {
        window.removeEventListener('keydown', this.boundKeyDown, false);  
    },
    
    onKeyDown: function(event) {
        if (event.keyCode === 32)  Kurve.Menu.onSpaceDown();
        var playerId    = '';
        var className   = '';
        
        Kurve.players.forEach(function(player) {
            if ( player.isKeyLeft(event.keyCode) ) {
                playerId        = player.getId();
                className       = 'active';
                player.isActive = true;
                
            } else if ( player.isKeyRight(event.keyCode) ) {
                playerId        = player.getId();
                className       = 'inactive';
                player.isActive = false;
            }    
        });
        
        if (playerId !== '' && className !== '') {
            u.removeClass('inactive', playerId);
            u.removeClass('active', playerId);
            u.addClass(className, playerId);
        }
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
    
    requestFullScreen: function() {
        window.document.getElementById('content').requestFullScreen();   
    }
    
};