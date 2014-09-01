/**
 *
 * Program:     Kurve
 * Author:      Markus Mächler, marmaechler@gmail.com
 * License:     http://www.gnu.org/licenses/gpl.txt
 * Link:        http://achtungkurve.com
 *
 * Copyright © 2014 Markus Mächler
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

var Kurve = {
    
    players: [],
    playersById: {},
    
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
