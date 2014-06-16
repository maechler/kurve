"use strict";

Kurve.Special = function(type, hook, executionTime, act, initAct, closeAct) {
    this.count          = 1;
    this.isActive       = false;
    this.executionTime  = Kurve.Game.fps * executionTime;
    
    this.act            = act;
    this.initAct        = initAct;
    this.closeAct       = closeAct;
    
    this.getType        = function() { return type; };
    this.getHook        = function() { return hook; };
};