"use strict";

/**
 * 
 * @todo refactor methods!
 */

Kurve.Menu = {
    
    boundKeyDown: null,
    
    init: function() {
        this.initPlayerMenu();
        this.addWindowListeners();
    },
        
    initPlayerMenu: function() {
        var playerHTML = '';
        
        for (var i in Kurve.players) {
            playerHTML += Kurve.players[i].renderMenuItem();
        }
        
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
        if (event.keyCode === 32) {
            Kurve.Menu.onSpaceDown();
        }
        
        for (var player in Kurve.players) {
            if ( Kurve.players[player].isKeyLeft(event.keyCode) ) {
                var playerId    = Kurve.players[player].getId();
                var className   = 'active';
                Kurve.players[playerId].isActive = true;
                
                break;
            } else if (Kurve.players[player].isKeyRight(event.keyCode)) {
                var playerId    = Kurve.players[player].getId();
                var className   = 'inactive';
                Kurve.players[player].isActive = false;
                
                break;
            }
        }
                
        if (playerId !== undefined && className !== undefined) {
            Kurve.Utility.removeClass('inactive', playerId);
            Kurve.Utility.removeClass('active', playerId);
            Kurve.Utility.addClass(className, playerId);
        }
    },
    
    onSpaceDown: function() {
        for (var player in Kurve.players) {
            if (!Kurve.players[player].isActive) continue;
            
            Kurve.Game.curves.push(
                new Kurve.Curve(Kurve.players[player], Kurve.Game, Kurve.Config.Curve)
            );
        }
        
        if (Kurve.Game.curves.length === 0) return;
        
        Kurve.Utility.addClass('hidden', 'menu');
        Kurve.Utility.removeClass('hidden', 'field');
        Kurve.Utility.removeClass('hidden', 'content-right');
        
        Kurve.Game.startGame();
    },
    
    requestFullScreen: function() {
        window.document.getElementById('content').webkitRequestFullScreen();   
    }
    
};