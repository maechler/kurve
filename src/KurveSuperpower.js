'use strict';

Kurve.Superpower = function(hooks, act, helpers, type) {
    this.count          = 1;
    this.isActive       = false;
    this.act            = act;
    this.helpers        = helpers;
    
    this.incrementCount = function() { 
        this.count++;
        Kurve.Game.renderPlayerScores();
    };
    
    this.decrementCount = function() { 
        this.count--;
        Kurve.Game.renderPlayerScores();
    };
    
    this.usesHook       = function(hook) {
        return hooks.indexOf(hook) > -1;
    };

    this.getType        = function() { return type; };
    this.getLabel       = function() { return Kurve.Superpowerconfig[this.getType()].label; }
};