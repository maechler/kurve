"use strict";

Kurve.Factory = {
    getSpecial: function(type) {
        if ( !Kurve.Specialconfig.hasOwnProperty(type) ) throw new Exception('Special type (' + type + ') is not yet registered.');
        
        var hook            = Kurve.Specialconfig[type].hook;
        var act             = Kurve.Specialconfig[type].act;
        var helpers         = Kurve.Specialconfig[type].helpers;
        
        return new Kurve.Special(hook, act, helpers);
    }    
};