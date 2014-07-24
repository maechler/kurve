'use strict';

Kurve.Superpower = function(hooks, act, helpers) {
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
    
    this.usesHook       = function(hook) {
        return hooks.indexOf(hook) > -1;
    };
};