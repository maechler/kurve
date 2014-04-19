"use strict";

Kurve.Curve = function(player) {
    this.player     = player;
    this.isAlive    = true;

    this.posX       = 10;
    this.posY       = 10;
    this.nextPosX   = 10;
    this.nextPosY   = 10;

    this.stepLength = 3;
    this.lineWidth  = 3;
    this.angle      = 0;
    this.dAngle     = 0.08;
    this.holeCount  = 100;

    this.draw = function(ctx) {
        ctx.beginPath();
        
        ctx.moveTo(this.posX, this.posY);
        ctx.lineTo(this.nextPosX, this.nextPosY);
       
        ctx.strokeStyle = this.player.color;
        ctx.lineWidth   = this.lineWidth;
        
        ctx.stroke();
    };

    this.checkForCollision = function(ctx) {
        if (this.isCollided(this.nextPosX, this.nextPosY, ctx)) {
            this.draw(ctx);
            Kurve.running = false;
            console.log("GAME OVER");
        }
    };
    
    this.isCollided = function(posX, posY, ctx) {
        return ctx.getImageData(posX, posY, 1, 1).data[3] !== 0;
    }

    this.moveTo = function() {

    };

    this.moveToNextFrame = function() {
        if (Kurve.keysPressed[this.player.keyRight] === true) {
            this.angle += this.dAngle;
        } else if (Kurve.keysPressed[this.player.keyLeft] === true) {
            this.angle -= this.dAngle;
        }

        this.moveTo();

        this.posX       = this.nextPosX;
        this.posY       = this.nextPosY;
        this.nextPosX  += this.stepLength * Math.cos(this.angle);
        this.nextPosY  += this.stepLength * Math.sin(this.angle);
    };
};
