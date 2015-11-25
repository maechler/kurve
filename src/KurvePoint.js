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

Kurve.Point = function(posX, posY) {

    this.getPosX = function(precision) {
        if ( precision === undefined ) return posX;
        return u.round(posX, precision); 
    };
    
    this.getPosY = function(precision) {
        if ( precision === undefined ) return posY;
        return u.round(posY, precision); 
    };

};

Kurve.Point.prototype.equals = function(point) {
    return point.getPosX(0) === this.getPosX(0) && point.getPosY(0) === this.getPosY(0);
};

Kurve.Point.prototype.clone = function() {
    return new Kurve.Point(this.getPosX(), this.getPosY());
};
