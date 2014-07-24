'use strict';

Kurve.Player = function(id, color, keyLeft, keyRight, keySuperpower) {
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
    this.getKeySuperpower  = function() { return keySuperpower; };
    
};

Kurve.Player.prototype.renderMenuItem = function() {
    return  '<div id="' + this.getId() + '" class="player inactive ' + this.getId() +'">' +
                '<div class="title light"><h2>' + this.getId() + '</h2></div>' +
                '<div class="key left light"><div>' + this.getKeyLeftChar() + '</div></div>' +
                '<div class="key right light"><div>' + this.getKeyRightChar() + '</div></div>' +
                '<div class="superpower">' +
                    '<div class="key light">' + this.getKeySuperpowerChar() + '</div>' +
                    '<div class="superpowerType light">' + this.renderSuperpowerMenu() + '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
            '</div>';
};

Kurve.Player.prototype.renderScoreItem = function() {
    return  '<div class="active ' + this.getId() + '">' +
                '<div class="title"><h2>' + this.getId() + '</h2></div>' +
                '<div class="points">' + this.getPoints() + '</div>' +
                '<div class="clear"></div>' +
            '</div>';
};

Kurve.Player.prototype.superpowerMenu = null;

Kurve.Player.prototype.renderSuperpowerMenu = function() {
    if ( !(typeof Kurve.Player.prototype.superpowerMenu === 'string') ) {
        var superpowerMenu = '<div class="left"></div> ' +
                                '<div class="superpowers">';
        var classesFirstElement = 'class="active"';

        for (var superpowerType in Kurve.Superpowerconfig.types) {
            superpowerMenu +=  '<div ' + classesFirstElement + ' data-superpowerType="' + superpowerType + '">' +
                                    Kurve.Superpowerconfig[superpowerType].label +
                                '</div>';
            classesFirstElement = '';
        }

        superpowerMenu +=       '</div> <div class="right">' +
                            '</div>';

        Kurve.Player.prototype.superpowerMenu = superpowerMenu;
    }

    return Kurve.Player.prototype.superpowerMenu;
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

Kurve.Player.prototype.getKeySuperpowerChar = function() {
    return String.fromCharCode(this.getKeySuperpower());
a};