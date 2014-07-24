'use strict';

Kurve.Point = function(posX, posY) {
    this.getPosX = function(precision) {
        if ( precision === undefined ) return posX;
        
        return u.round(posX, precision); 
    };
    
    this.getPosY = function(precision) {
        if ( precision === undefined ) return posY;
        
        return u.round(posY, precision); 
    };
};

Kurve.Point.prototype.equals = function(point) {
    return point.getPosX(0) === this.getPosX(0) && point.getPosY(0) === this.getPosY(0);
};

Kurve.Point.prototype.clone = function() {
    return new Kurve.Point(this.getPosX(), this.getPosY());
};
