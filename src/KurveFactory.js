'use strict';

Kurve.Factory = {
    getSuperpower: function(type) {
        if ( !Kurve.Superpowerconfig.hasOwnProperty(type) ) throw 'Superpower type ' + type + ' is not yet registered.';
        
        var hooks   = Kurve.Superpowerconfig[type].hooks;
        var act     = Kurve.Superpowerconfig[type].act;
        var helpers = Kurve.Superpowerconfig[type].helpers;
        
        return new Kurve.Superpower(hooks, act, helpers, type);
    }    
};