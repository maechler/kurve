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

var u = Kurve.Utility;
