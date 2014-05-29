"use strict";

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

    this.checkForCollision = function(ctx) {
        if (this.isCollided(nextPosX, nextPosY, ctx)) {
            this.die(ctx);
        }
    };
    
    this.isCollided = function(nextPosX, nextPosY, ctx) {
        var imageData = game.imageData.data;
        var width     = game.imageData.width;
        
        var dataPos   = ((Math.round(nextPosY) - 1) * width + Math.round(nextPosX)) * 4;
        
        return imageData[dataPos] !== 0;
    };
    
    this.die = function(ctx) {
        this.draw(ctx);
        this.isAlive = false;
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
    
    this.getPlayer = function() {
        return player;
    };

};
