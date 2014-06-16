"use strict";

Kurve.Special = function(hook, act, helpers) {
    this.count          = 1;
    this.isActive       = false;
    this.act            = act;
    this.helpers        = helpers;
    
    this.incrementCount = function() { 
        this.count++; 
    };
    this.decrementCount = function() { 
        this.count--; 
    };
    
    this.getHook        = function() { return hook; };
};