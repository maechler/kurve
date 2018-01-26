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

Kurve.Theming = {
    currentTheme: 'default',

    init: function() {
        if (Kurve.Storage.has('kurve.theme')) {
            this.currentTheme = Kurve.Storage.get('kurve.theme');
        } else {
            Kurve.Storage.set('kurve.theme', this.currentTheme);
        }

        if (this.currentTheme === 'default') {
            document.getElementById('change-theme').innerText = 'Lights off';
        } else {
            document.getElementById('change-theme').innerText = 'Lights on';
        }

        u.addClass(this.currentTheme + '-theme', 'app');
    },

    getThemedValue: function(section, value) {
        if (Kurve.Config['Theming'][this.currentTheme] !== undefined) {
            return Kurve.Config['Theming'][this.currentTheme][section][value];
        }
    },

    changeTheme: function(theme) {
        u.removeClass(this.currentTheme + '-theme', 'app');
        u.addClass(theme + '-theme', 'app');

        this.currentTheme = theme;
        Kurve.Storage.set('kurve.theme', this.currentTheme);
    },

    toggleTheme: function() {
        if (this.currentTheme === 'default') {
            this.changeTheme('dark');
            document.getElementById('change-theme').innerText = 'Lights on';
        } else {
            this.changeTheme('default');
            document.getElementById('change-theme').innerText = 'Lights off';
        }
    },
};
