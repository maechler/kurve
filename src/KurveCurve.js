"use strict";

Kurve.Curve = function(player, game, field, config) {
    this.isAlive        = true;

    var position        = null;
    var nextPosition    = null;

    var stepLength      = config.stepLength; 
    var lineWidth       = config.lineWidth;
    var angle           = 0;
    var dAngle          = config.dAngle;
    var holeInterval    = config.holeInterval;
    var holeCountDown   = config.holeCountDown;
    var tracedPoints    = [];
    
    this.drawNextFrame  = function() {
        this.drawStep(field.ctx);
        this.moveToNextFrame();
        this.checkForCollision(field.ctx);
    };
    
    this.drawStep = function(ctx) {
        ctx.beginPath();    

        ctx.strokeStyle = player.getColor();        
        ctx.lineWidth   = lineWidth;
        
        ctx.moveTo(position.getPosX(), position.getPosY());
        ctx.lineTo(nextPosition.getPosX(), nextPosition.getPosY());
       
        if (holeCountDown < 0) {
            ctx.globalAlpha = 0;
            
            if (holeCountDown < -1) holeCountDown = holeInterval; 
        } else {
            ctx.globalAlpha = 1;  
            
            field.addDrawnPixel(position);
            this.addPointToTrace(position.clone());
        } 
        
        holeCountDown--;  
        
        ctx.stroke();
    };
    
    this.drawPoint = function(ctx) {
        ctx.beginPath();
        ctx.fillStyle = player.getColor();  
        ctx.arc(position.getPosX(), position.getPosY(), 2, 0, 2 * Math.PI, false);
        ctx.fill();
    };

    this.checkForCollision = function(ctx) {
        if ( this.isCollided(nextPosition) ) this.die(ctx);
    };
    
    this.isCollided = function(nextPosition) {
        return field.isPointOutOfBounds(nextPosition) || ( field.isPointDrawn(nextPosition) && !this.isPointInTrace(nextPosition) );
    };
    
    this.die = function(ctx) {
        this.isAlive = false;
        
        this.drawStep(ctx);
        game.notifyDeath(this);
    };

    this.moveToNextFrame = function() {
        if ( game.isKeyDown(player.getKeyRight()) ) {
            angle += dAngle;
        } else if ( game.isKeyDown(player.getKeyLeft()) ) {
            angle -= dAngle;
        }
        
        position        = nextPosition;
        nextPosition    = this.getNextPosition(angle);
    };
    
    this.getNextPosition = function(angle) {
        var posX = position.getPosX() + stepLength * Math.cos(angle);
        var posY = position.getPosY() + stepLength * Math.sin(angle);
                
        //field.addDrawnPixel(new Kurve.Point(position.getPosX() + (stepLength / 2) * Math.cos(angle), position.getPosY() + (stepLength / 2) * Math.sin(angle)));
            
        return new Kurve.Point(posX, posY);
    };
    
    this.addPointToTrace = function(point) {
        if (tracedPoints.length > 4) tracedPoints.shift();

        tracedPoints.push(point);
    };
    
    this.isPointInTrace = function(point) {
        var isPointInTrace = false;
        
        tracedPoints.forEach(function(tracedPoint) {
            if ( point.equals(tracedPoint) ) isPointInTrace = true;
        });
        
        return isPointInTrace;
    };
    
    this.setRandomPosition = function(randomPosition) {
        position        = randomPosition;
        nextPosition    = randomPosition;
    };
    
    this.setRandomAngle = function() {
        angle = 2*Math.PI*Math.random();
    };
    
    this.getPlayer = function() { return player; };
};
