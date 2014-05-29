"use strict";

var Kurve = {    
    
    players: {},
    
    init: function() {
        this.initPlayers();
        this.Field.init();
        this.Menu.init();
        this.Game.init();
    },
        
    initPlayers: function() {
        Kurve.Config.players.forEach(function(player) {
            Kurve.players[player.id] = new Kurve.Player(player.id, player.color, player.keyLeft, player.keyRight);
        });
    }

};

document.addEventListener("DOMContentLoaded", function() {
    Kurve.init();
});
