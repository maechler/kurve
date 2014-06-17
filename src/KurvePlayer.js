"use strict";

Kurve.Player = function(id, color, keyLeft, keyRight, keySpecial) {
    var points      = 0;
    this.isActive   = false;
    
    this.incrementPoints = function() {
        points++;
    };
    
    this.getPoints      = function() { return points; };   
    this.getId          = function() { return id; };
    this.getColor       = function() { return color; };
    this.getKeyLeft     = function() { return keyLeft; };
    this.getKeyRight    = function() { return keyRight; };
    this.getKeySpecial  = function() { return keySpecial; }; //A
    
};

Kurve.Player.prototype.renderMenuItem = function() {
    var menuItemHTML    = '<div id="' + this.getId() + '" class="player inactive ' + this.getId() +'">';
    menuItemHTML       +=      '<div class="title"><h2>' + this.getId() + '</h2></div>';
    menuItemHTML       +=      '<div class="keys">' + this.getKeyLeftChar() + ' + ' + this.getKeyRightChar() + ' + ' + this.getKeySpecialChar() + '</div>';
    menuItemHTML       +=      '<div class="clear"></div>';
    menuItemHTML       += '</div>';

    return menuItemHTML;
};

Kurve.Player.prototype.renderScoreItem = function() {
    var scoreItemHTML   = '<div class="active ' + this.getId() + '">';
    scoreItemHTML      +=      '<div class="title"><h2>' + this.getId() + '</h2></div>';
    scoreItemHTML      +=      '<div class="points">' + this.getPoints() + '</div>';
    scoreItemHTML      +=      '<div class="clear"></div>';
    scoreItemHTML      += '</div>';

    return scoreItemHTML;
};

Kurve.Player.prototype.isKeyRight = function(keyCode) {
    return this.getKeyRight() === keyCode;
};
    
Kurve.Player.prototype.isKeyLeft = function(keyCode) {
    return this.getKeyLeft() === keyCode;
};

Kurve.Player.prototype.getKeyLeftChar = function() {
    return String.fromCharCode(this.getKeyLeft());
};

Kurve.Player.prototype.getKeyRightChar = function() {
    return String.fromCharCode(this.getKeyRight());
};

Kurve.Player.prototype.getKeySpecialChar = function() {
    return String.fromCharCode(this.getKeySpecial());
};