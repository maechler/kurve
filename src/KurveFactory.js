"use strict";

Kurve.Factory = {
    getSpecial: function(type) {
        if ( !Kurve.Specialconfig.hasOwnProperty(type) ) throw new Exception('Special type (' + type + ') is not yet registered.');
        
        var hook            = Kurve.Specialconfig[type].hook;
        var executionTime   = Kurve.Specialconfig[type].executionTime;
        var act             = Kurve.Specialconfig[type].act;
        var initAct         = Kurve.Specialconfig[type].initAct;
        var closeAct        = Kurve.Specialconfig[type].closeAct;
        
        return new Kurve.Special(type, hook, executionTime, act, initAct, closeAct);
    }    
};