/**
 *
 * Program:     Kurve
 * Author:      Markus Mächler, marmaechler@gmail.com
 * License:     http://www.gnu.org/licenses/gpl.txt
 * Link:        http://achtungkurve.com
 *
 * Copyright © 2014, 2015, 2018 Markus Mächler
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

Kurve.Privacypolicy = {
    init: function() {
        if (Kurve.Storage.has('kurve.privacy-policy-accepted')) {
            return;
        }

        this.showAcceptPrivacyPolicy();
    },

    showAcceptPrivacyPolicy: function() {
        Kurve.Lightbox.show(document.getElementById('privacy-policy-accept').innerHTML);
    },

    showPrivacyPolicy: function() {
        Kurve.Lightbox.show(document.getElementById('privacy-policy').innerHTML);

        setTimeout(function() {
            document.body.addEventListener('click', Kurve.Privacypolicy.onPrivacyPolicyClose, false);
        },500);
    },

    onPrivacyPolicyClose: function() {
        Kurve.Lightbox.hide();

        if (!Kurve.Storage.has('kurve.privacy-policy-accepted')) {
            Kurve.Privacypolicy.showAcceptPrivacyPolicy();
        }

        document.body.removeEventListener('click', Kurve.Privacypolicy.onPrivacyPolicyClose);
    },

    onPrivacyPolicyAccepted: function() {
        Kurve.Storage.set('kurve.privacy-policy-accepted', 'yes');
        Kurve.Lightbox.hide();
    }
};