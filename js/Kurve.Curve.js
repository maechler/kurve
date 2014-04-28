"use strict";

Kurve.Curve = function(player, field, game, config) {
    this.player         = player;
    this.field          = field;
    this.game           = game;
    this.config         = config;
    
    this.isAlive        = true;

    var randomPosition  = this.field.getRandomPosition();
    this.posX           = randomPosition.posX;
    this.posY           = randomPosition.posY;
    this.nextPosX       = randomPosition.posX;
    this.nextPosY       = randomPosition.posY;

    this.stepLength     = 3;
    this.lineWidth      = 4;
    this.angle          = 5*Math.random();
    this.dAngle         = 0.08;
    this.holeInterval   = 150;
    this.holeCount      = this.holeInterval;

    this.draw = function(ctx) {
        this.holeCount--;
        
        ctx.beginPath();
        ctx.globalAlpha = 1;    
       
        if (this.holeCount < 0) {
            ctx.globalAlpha = 0;
            if (this.holeCount < -1) this.holeCount = this.holeInterval; 
        }  

        ctx.strokeStyle = this.player.color;        
        ctx.lineWidth   = this.lineWidth;
        
        ctx.moveTo(this.posX, this.posY);
        ctx.lineTo(this.nextPosX, this.nextPosY);
        
        ctx.stroke();
    };

    this.checkForCollision = function(ctx) {
        if (this.isCollided(this.nextPosX, this.nextPosY, ctx)) {
            this.die(ctx);
        }
    };
    
    this.die = function(ctx) {
        this.draw(ctx);
        this.isAlive = false;
        this.game.notifyDeath(this);
    };
    
        //getImageData of entire field just once save in Game or so for performance reasons!!!
    this.isCollided = function(posX, posY, ctx) {
        return ctx.getImageData(posX, posY, 1, 1).data[3] !== 0;
    };

    this.moveToNextFrame = function() {
        if ( this.game.isKeyPressed(this.player.keyRight) ) {
            this.angle += this.dAngle;
        } else if ( this.game.isKeyPressed(this.player.keyLeft) ) {
            this.angle -= this.dAngle;
        }
        
        this.posX       = this.nextPosX;
        this.posY       = this.nextPosY;
        this.nextPosX  += this.stepLength * Math.cos(this.angle);
        this.nextPosY  += this.stepLength * Math.sin(this.angle);
    };

};
