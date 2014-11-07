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

Kurve.Superpower = function(hooks, act, helpers, type, init, close) {

    var count = 1;
    var isActive = false;

    this.act = act;
    this.helpers = helpers;
    this.init = init;
    this.close = close;
    
    this.incrementCount = function() { 
        count++;
        Kurve.Game.renderPlayerScores();
    };
    
    this.decrementCount = function() { 
        count--;
        Kurve.Game.renderPlayerScores();
    };

    this.getHooks = function() { return hooks; };
    this.getType = function() { return type; };
    this.getCount = function() { return count; };
    this.isActive = function() { return isActive; };

    this.setIsActive = function(newIsActive) { isActive = newIsActive; };

};

Kurve.Superpower.prototype.getLabel = function() {
    return Kurve.Superpowerconfig[this.getType()].label;
};

Kurve.Superpower.prototype.usesHook = function(hook) {
    return this.getHooks().indexOf(hook) > -1;
}