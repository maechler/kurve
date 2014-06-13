"use strict";

Kurve.Curve = function(player, game, field, config) {
    this.isAlive        = true;

    var posX            = 0;
    var posY            = 0;
    var nextPosX        = 0;
    var nextPosY        = 0;

    var stepLength      = config.stepLength; 
    var lineWidth       = config.lineWidth;
    var angle           = 0;
    var dAngle          = config.dAngle;
    var holeInterval    = config.holeInterval;
    var holeCountDown   = config.holeCountDown;
    var tracedPoints    = [];
    
    this.drawStep = function(ctx) {
        ctx.beginPath();    

        ctx.strokeStyle = player.getColor();        
        ctx.lineWidth   = lineWidth;
        
        ctx.moveTo(posX, posY);
        ctx.lineTo(nextPosX, nextPosY);
       
        if (holeCountDown < 0) {
            ctx.globalAlpha = 0;
            if (holeCountDown < -1) holeCountDown = holeInterval; 
        } else {
            ctx.globalAlpha = 1;  
            
            field.addDrawnPixel(new Kurve.Point(posX, posY));
            this.addPointToTrace(new Kurve.Point(posX, posY));
        } 
        
        holeCountDown--;  
        
        ctx.stroke();
    };
    
    this.drawPoint = function(ctx) {
        ctx.beginPath();
        ctx.fillStyle = player.getColor();  
        ctx.arc(posX, posY, 2, 0, 2 * Math.PI, false);
        ctx.fill();
    };

    this.checkForCollision = function(ctx) {
        if ( this.isCollided(nextPosX, nextPosY) ) this.die(ctx);
    };
    
    this.isCollided = function(nextPosX, nextPosY) {
        var posX = Kurve.Utility.round(nextPosX, 0);
        var posY = Kurve.Utility.round(nextPosY, 0);
        
        var position = new Kurve.Point(posX, posY);
        
        return field.isPointOutOfBounds(position) || ( field.isPointDrawn(position) && !this.isPointInTrace(position) );
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
        
        posX       = nextPosX;
        posY       = nextPosY;
        nextPosX  += stepLength * Math.cos(angle);
        nextPosY  += stepLength * Math.sin(angle);
        nextPosX   = Kurve.Utility.round(nextPosX, 1);
        nextPosY   = Kurve.Utility.round(nextPosY, 1);
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
        posX        = randomPosition.posX;
        posY        = randomPosition.posY;
        nextPosX    = randomPosition.posX;
        nextPosY    = randomPosition.posY;
    };
    
    this.setRandomAngle = function() {
        angle = 2*Math.PI*Math.random();
    };
    
    this.getPlayer = function() { return player; };
};
