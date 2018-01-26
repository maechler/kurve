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

Kurve.Storage = {
    get: function(itemId) {
        return JSON.parse(localStorage.getItem(itemId));
    },

    set: function(itemId, item) {
        localStorage.setItem(itemId, JSON.stringify(item));
    },

    remove: function(itemId) {
        localStorage.removeItem(itemId);
    },

    has: function(itemId) {
        return localStorage.getItem(itemId) !== null;
    },

    clear: function() {
        localStorage.clear();
    }
};
