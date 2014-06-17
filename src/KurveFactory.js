"use strict";

Kurve.Factory = {
    getSpecial: function(type) {
        if ( !Kurve.Specialconfig.hasOwnProperty(type) ) throw 'Special type ' + type + ' is not yet registered.';
        
        var hooks   = Kurve.Specialconfig[type].hooks;
        var act     = Kurve.Specialconfig[type].act;
        var helpers = Kurve.Specialconfig[type].helpers;
        
        return new Kurve.Special(hooks, act, helpers);
    }    
};