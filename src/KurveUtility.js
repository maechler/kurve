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

Kurve.Utility = function(element) {
    if ( element instanceof String ) {}

    return new Kurve.Utility.Element(element);
};

Kurve.Utility.Element = function(element) {
    this.element = element;
};

Kurve.Utility.round = function(number, digitsAfterComa) {
    return Math.round(number * Math.pow(10, digitsAfterComa)) / Math.pow(10, digitsAfterComa); 
};

Kurve.Utility.addClass = function(className, elementId) {
    var element = document.getElementById(elementId);
    if (element === null) return false;

    element.className += ' ' + className;
};
    
Kurve.Utility.removeClass = function(className, elementId) {
    var element = document.getElementById(elementId);
    if (element === null) return false;

    var regExp = new RegExp('(^|\\s)' + className + '($|\\s)', 'g');

    element.className = element.className.replace(regExp, ' ');
};

Kurve.Utility.setClassName = function(className, elementId) {
    var element = document.getElementById(elementId);
    if (element === null) return false;

    element.className = className;        
};

Kurve.Utility.hasClass = function(className, elementId) {
    var element = document.getElementById(elementId);
    if (element === null) return false;

    var regExp = new RegExp('(^|\\s)' + className + '($|\\s)', 'g');

    return regExp.test(element.className);
};

/**
 *  y = mx + d
 */
Kurve.Utility.interpolateTwoPoints = function(fromPoint, toPoint) {
    var interpolatedPoints = [];
    var pointsUniqueChecker = [];
    var precision = Kurve.Config.Utility.interpolatedPixelsPrecision;

    var dX      = toPoint.getPosX() - fromPoint.getPosX();
    var dY      = toPoint.getPosY() - fromPoint.getPosY();
    var m       = dY / dX;
    var d       = toPoint.getPosY() - m * toPoint.getPosX();
    var absDX   = u.round(Math.abs(dX) * precision, 0);
    var steps   = absDX < 1 ? 1 : absDX; //at least interpolate one point

    for (var i=0; i < steps; i++) {
        var step = dX > 0 ? (i / precision) : -(i / precision);
        var posX = fromPoint.getPosX() + step;
        var posY = m * posX + d;
        var point = new Kurve.Point(posX, posY);
        var posX0 = point.getPosX(0);
        var posY0 = point.getPosY(0);

        if ( pointsUniqueChecker[posX0] === undefined ) pointsUniqueChecker[posX0] = [];
        if ( pointsUniqueChecker[posX0][posY0] === true ) continue;

        pointsUniqueChecker[posX0][posY0] = true;
        interpolatedPoints.push(point);
    }

    return interpolatedPoints;
};

var u = Kurve.Utility;
