'use strict';

var Kurve = {    
    
    players: [],
    playersById: [],
    
    init: function() {
        this.initPlayers();
        this.Field.init();
        this.Menu.init();
        this.Game.init();
        this.Lightbox.init();
    },
        
    initPlayers: function() {
        Kurve.Config.players.forEach(function(player) {
            var player = new Kurve.Player(player.id, player.color, player.keyLeft, player.keyRight, player.keySuperpower);

            Kurve.players.push(player);
            Kurve.playersById[player.getId()] = player;
        });
    },

    getPlayer: function(playerId) {
        return this.playersById[playerId];
    }
};

document.addEventListener('DOMContentLoaded', Kurve.init.bind(Kurve));
