"use strict";

var Kurve = {    
    
    players: [],
    
    init: function() {
        this.initPlayers();
        
        this.Field.init();
        this.Menu.init();
        this.Game.init();
    },
        
    initPlayers: function() {
        for (var i in Kurve.Config.players) {
            var player = Kurve.Config.players[i];
            this.players[player.id] = new Kurve.Player(player.id,player.color,player.keyLeft,player.keyRight);
        }
    }

};

document.addEventListener("DOMContentLoaded", function() {
    Kurve.init();
});
