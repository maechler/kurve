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
        if (Kurve.Storage.get('kurve.privacy-policy-accepted') === 'yes') {
            this.enableTracking();
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
        }, 500);

        var matomoOptOutIframe = document.getElementById('lightbox-content').querySelector('#privacy-policy-matomo-opt-out');

        if (matomoOptOutIframe.dataset.src) {
            matomoOptOutIframe.src = matomoOptOutIframe.dataset.src;
        }
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

        this.enableTracking();
    },

    enableTracking: function() {
        window._paq = window._paq || [];
        _paq.push(['setDocumentTitle', 'Home']);
        _paq.push(['trackPageView']);

        (function() {
            var u='https://matomo.achtungkurve.com/';
            _paq.push(['setTrackerUrl', u+'piwik.php']);
            _paq.push(['setSiteId', 1]);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0]; g.type='text/javascript';
            g.defer=true; g.async=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
        })();
    }
};
