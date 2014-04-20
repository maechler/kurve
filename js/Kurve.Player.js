"use strict";

Kurve.Player = function(id, color, keyLeft, keyRight) {
    this.id         = id;
    this.keyLeft    = keyLeft;
    this.keyRight   = keyRight;
    this.color      = color;
    this.isActive   = false;
    this.render     = function(parentContainer) { //renderMenuItem, renderScoreItem
        var playerHTML   = '<div id="' + this.id + '" class="player inactive ' + this.id +'">';
        playerHTML      +=      '<div class="title"><h2>' + this.id + '</h2></div>'
        playerHTML      +=      '<div class="keys">' + String.fromCharCode(this.keyLeft) + ' + ' + String.fromCharCode(this.keyRight) + '</div>';
        playerHTML      +=      '<div class="clear"></div>';
        playerHTML      += '</div>';
        
        parentContainer.innerHTML += playerHTML;
    };
};

