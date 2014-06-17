"use strict";

var Kurve = {    
    
    players: [],
    
    init: function() {
        this.initPlayers();
        this.Field.init();
        this.Menu.init();
        this.Game.init();
        this.Lightbox.init();
    },
        
    initPlayers: function() {
        Kurve.Config.players.forEach(function(player) {
            Kurve.players.push(new Kurve.Player(player.id, player.color, player.keyLeft, player.keyRight, player.keySpecial));
        });
    }

};

document.addEventListener("DOMContentLoaded", function() {
    Kurve.init();
});
