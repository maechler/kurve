"use strict";

Kurve.Point = function(posX, posY) {
    this.getPosX = function() { return posX; };
    this.getPosY = function() { return posY; };
};

Kurve.Point.prototype.equals = function(point) {
    return point.getPosX() === this.getPosX() && point.getPosY() === this.getPosY();
};
