"use strict";

/**
 * @todo
 * set functions in prototype
 */

Kurve.Curve = function(player, field, game, config) {
    this.isAlive        = true;

    var randomPosition  = field.getRandomPosition();
    var posX            = randomPosition.posX;
    var posY            = randomPosition.posY;
    var nextPosX        = randomPosition.posX;
    var nextPosY        = randomPosition.posY;

    var stepLength      = config.stepLength; 
    var lineWidth       = config.lineWidth;
    var angle           = config.angle;
    var dAngle          = config.dAngle;
    var holeInterval    = config.holeInterval;
    var holeCount       = config.holeCount;
    
    this.draw = function(ctx) {
        holeCount--;
        
        ctx.beginPath();
        ctx.globalAlpha = 1;    
       
        if (holeCount < 0) {
            ctx.globalAlpha = 0;
            if (holeCount < -1) holeCount = holeInterval; 
        }  

        ctx.strokeStyle = player.getColor();        
        ctx.lineWidth   = lineWidth;
        
        ctx.moveTo(posX, posY);
        ctx.lineTo(nextPosX, nextPosY);
        
        ctx.stroke();
    };

    this.checkForCollision = function(ctx) {
        if (this.isCollided(nextPosX, nextPosY, ctx)) {
            this.die(ctx);
        }
    };
    
    this.die = function(ctx) {
        this.draw(ctx);
        this.isAlive = false;
        game.notifyDeath(this);
    };

    this.moveToNextFrame = function() {
        if ( game.isKeyPressed(player.getKeyRight()) ) {
            angle += dAngle;
        } else if ( game.isKeyPressed(player.getKeyLeft()) ) {
            angle -= dAngle;
        }
        
        posX       = nextPosX;
        posY       = nextPosY;
        nextPosX  += stepLength * Math.cos(angle);
        nextPosY  += stepLength * Math.sin(angle);
    };
    
    this.getPlayer = function() {
        return player;
    };

};

Kurve.Curve.prototype.isCollided = function(posX, posY, ctx) {
    return ctx.getImageData(posX, posY, 1, 1).data[3] !== 0;
};