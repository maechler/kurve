"use strict";

Kurve.Player = function(id, color, keyLeft, keyRight) {
    this.id         = id;
    this.color      = color;
    this.keyLeft    = keyLeft;
    this.keyRight   = keyRight;
    
    this.isActive   = false;
    this.points     = 0;
    
    this.renderMenuItem = function() {
        var menuItemHTML    = '<div id="' + this.id + '" class="player inactive ' + this.id +'">';
        menuItemHTML       +=      '<div class="title"><h2>' + this.id + '</h2></div>'
        menuItemHTML       +=      '<div class="keys">' + String.fromCharCode(this.keyLeft) + ' + ' + String.fromCharCode(this.keyRight) + '</div>';
        menuItemHTML       +=      '<div class="clear"></div>';
        menuItemHTML       += '</div>';
        
        return menuItemHTML;
    };
    
    this.renderScoreItem = function() {
        var scoreItemHTML   = '<div>';
        scoreItemHTML      +=      '<div class="title active ' + this.id + '"><h2>' + this.id + '</h2></div>'
        scoreItemHTML      +=      '<div>' + this.points + '</div>';
        scoreItemHTML      += '</div>';
        
        return scoreItemHTML;
    };
    
    this.isKeyRight = function(keyCode) {
        return this.keyRight === keyCode;
    };
    
    this.isKeyLeft = function(keyCode) {
        return this.keyLeft === keyCode;
    };
    
};

