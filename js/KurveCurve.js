"use strict";

Kurve.Curve = function(player, game, config) {
    this.isAlive        = true;

    var posX            = 0;
    var posY            = 0;
    var nextPosX        = 0;
    var nextPosY        = 0;

    var stepLength      = config.stepLength; 
    var lineWidth       = config.lineWidth;
    var angle           = config.angle;
    var dAngle          = config.dAngle;
    var holeInterval    = config.holeInterval;
    var holeCountDown   = config.holeCountDown;
    
    this.draw = function(ctx) {
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
        var nextPixelAlphaPosition = ( (Math.round(nextPosY) - 1) * game.imageData.width + Math.round(nextPosX) ) * 4;
        
        return game.imageData.data[nextPixelAlphaPosition] !== 0;
    };
    
    this.die = function(ctx) {
        this.isAlive = false;
        
        this.draw(ctx);
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
    
    this.setRandomPosition = function(randomPosition) {
        posX        = randomPosition.posX;
        posY        = randomPosition.posY;
        nextPosX    = randomPosition.posX;
        nextPosY    = randomPosition.posY;
    };
    
    this.getPlayer = function() { return player; };
};
