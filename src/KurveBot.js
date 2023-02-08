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

Kurve.Bot = function(curve) {
    this.getCurve = function() { return curve; };
    this.getPlayer = function() { return curve.getPlayer(); };
    this.getGame = function() { return curve.getGame(); };
    this.getField = function() { return curve.getField(); };
};

Kurve.Bot.prototype.act = function() {
    var currentFrameId = this.getCurrentFrameId();

    if (this.getField().isPointDrawn(0, 0)) {
        var drawnPoint = this.getField().getDrawnPoint(0, 0)
        var isItMe = drawnPoint.curve.getPlayer() === this.getPlayer();
    }

    if (currentFrameId % 40 === 0) {
        var rand = Math.random()

        if (rand < 0.25) {
            this.direction = 'left';
        } else if (rand > 0.75) {
            this.direction = 'right';
        } else {
            this.direction = ''
        }
    }

    if (this.direction === 'left') {
        this.goLeft();
    } else if (this.direction === 'right') {
        this.goRight();
    }
};

Kurve.Bot.prototype.resetKeysDown = function() {
    this.getGame().keysDown[this.getPlayer().getKeyLeft()] = false;
    this.getGame().keysDown[this.getPlayer().getKeyRight()] = false;
    this.getGame().keysDown[this.getPlayer().getKeySuperpower()] = false;
};

Kurve.Bot.prototype.goLeft = function() {
    this.getGame().keysDown[this.getPlayer().getKeyLeft()] = true;
};

Kurve.Bot.prototype.goRight = function() {
    this.getGame().keysDown[this.getPlayer().getKeyRight()] = true;
};

Kurve.Bot.prototype.useSuperpower = function() {
    this.getGame().keysDown[this.getPlayer().getKeySuperpower()] = true;
};

Kurve.Bot.prototype.getCurrentFrameId = function() {
    return this.getGame().CURRENT_FRAME_ID;
};
