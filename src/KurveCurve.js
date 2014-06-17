"use strict";

Kurve.Curve = function(player, game, field, config) {
    
    var position        = null;
    var nextPosition    = null;
    
    this.trac           = [];
    this.special        = Kurve.Factory.getSpecial(Kurve.Specialconfig.types.INVISIBLE);
    this.invisible      = false;

    var options         = {
        stepLength:     config.stepLength,
        lineWidth:      config.lineWidth,
        angle:          0,
        dAngle:         config.dAngle,
        holeInterval:   config.holeInterval,
        holeCountDown:  config.holeInterval
    };
    
    this.incrementAngle     = function() { options.angle += options.dAngle };
    this.decrementAngle     = function() { options.angle -= options.dAngle };
    
    this.setPosition        = function(newPosition) { position = newPosition; };
    this.setNextPosition    = function(newPosition) { nextPosition = newPosition; };
    this.setRandomPosition  = function(newPosition) { position = nextPosition = newPosition; };
    this.setAngle           = function(newAngle)    { options.angle = newAngle; };
    
    this.getPlayer          = function() { return player; };
    this.getGame            = function() { return game; };
    this.getField           = function() { return field; };
    this.getPosition        = function() { return position; };
    this.getNextPosition    = function() { return nextPosition; };
    this.getOptions         = function() { return options; };
    
};

Kurve.Curve.prototype.drawNextFrame = function() {
    this.moveToNextFrame();
    this.checkForCollision();
    this.drawLine(this.getField().ctx);
    
    if ( this.useSpecial(Kurve.Specialconfig.hooks.DRAW_NEXT_FRAME) ) this.special.act(Kurve.Specialconfig.hooks.DRAW_NEXT_FRAME, this);
};

Kurve.Curve.prototype.drawPoint = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.getPlayer().getColor();  
    ctx.arc(this.getPosition().getPosX(), this.getPosition().getPosY(), 2, 0, 2 * Math.PI, false);
    ctx.fill();
};

Kurve.Curve.prototype.drawLine = function(ctx) {
    ctx.beginPath();    
    this.invisible = ( this.getOptions().holeCountDown < 0 );

    ctx.strokeStyle = this.getPlayer().getColor();        
    ctx.lineWidth   = this.getOptions().lineWidth;
    
    if ( this.useSpecial(Kurve.Specialconfig.hooks.DRAW_LINE) ) this.special.act(Kurve.Specialconfig.hooks.DRAW_LINE, this);

    ctx.moveTo(this.getPosition().getPosX(), this.getPosition().getPosY());
    ctx.lineTo(this.getNextPosition().getPosX(), this.getNextPosition().getPosY());

    if ( this.invisible ) {
        ctx.globalAlpha = 0;
        if (this.getOptions().holeCountDown < -1) this.getOptions().holeCountDown = this.getOptions().holeInterval;
    } else {
        ctx.globalAlpha = 1;  
        this.getField().addPointsToDrawnPixel(this.trace);
    } 

    this.getOptions().holeCountDown--;  

    ctx.stroke();
};

Kurve.Curve.prototype.moveToNextFrame = function() {
    this.computeNewAngle();
    
    var middlePoint = this.getMovedPosition(this.getOptions().stepLength / 2);
    var nextPoint   = this.getMovedPosition(this.getOptions().stepLength);
    
    this.trace = this.getPointSurroundings(nextPoint);
    this.trace.concat(this.getPointSurroundings(middlePoint));
    
    this.setPosition(this.getNextPosition());
    this.setNextPosition(nextPoint);
    
};

Kurve.Curve.prototype.getMovedPosition = function(step) {
    var posX = this.getNextPosition().getPosX() + step * Math.cos(this.getOptions().angle);
    var posY = this.getNextPosition().getPosY() + step * Math.sin(this.getOptions().angle);

    return new Kurve.Point(posX, posY);
};

Kurve.Curve.prototype.getPointSurroundings = function(point) {
    var posX                = point.getPosX(0);
    var posY                = point.getPosY(0);
    var pointSurroundings   = [];

    pointSurroundings.push(new Kurve.Point(posX,     posY));
    pointSurroundings.push(new Kurve.Point(posX + 1, posY));
    pointSurroundings.push(new Kurve.Point(posX + 1, posY - 1));
    pointSurroundings.push(new Kurve.Point(posX,     posY - 1));
    pointSurroundings.push(new Kurve.Point(posX - 1, posY - 1));
    pointSurroundings.push(new Kurve.Point(posX - 1, posY));
    pointSurroundings.push(new Kurve.Point(posX - 1, posY + 1));
    pointSurroundings.push(new Kurve.Point(posX,     posY + 1));
    pointSurroundings.push(new Kurve.Point(posX + 1, posY + 1));
    
    return pointSurroundings;
};

Kurve.Curve.prototype.checkForCollision = function() {
    if ( this.isCollided(this.getNextPosition()) ) this.die();
};

Kurve.Curve.prototype.isCollided = function(position) {
    if ( this.useSpecial(Kurve.Specialconfig.hooks.IS_COLLIDED) ) return this.special.act(Kurve.Specialconfig.hooks.IS_COLLIDED, this);
    
    return this.getField().isPointOutOfBounds(position) || this.getField().isPointDrawn(position);
};

Kurve.Curve.prototype.die = function() {
    this.getGame().notifyDeath(this);
};

Kurve.Curve.prototype.computeNewAngle = function() {
    if ( this.getGame().isKeyDown(this.getPlayer().getKeyRight()) ) {
        this.incrementAngle();
    } else if ( this.getGame().isKeyDown(this.getPlayer().getKeyLeft()) ) {
        this.decrementAngle();
    }
};
    
Kurve.Curve.prototype.setRandomAngle = function() {
    this.setAngle(2 * Math.PI * Math.random());
};

Kurve.Curve.prototype.useSpecial = function(hook) {
    if ( this.special.isActive
         || Kurve.Game.isKeyDown(this.getPlayer().getKeySpecial()) 
         && this.special.usesHook(hook) 
         && this.special.count > 0 )  return true;
     
    return false;
};
