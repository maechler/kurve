"use strict";

Kurve.Curve = function() {
    this.keyLeft;
    this.keyRight;
    this.ctx;
    this.player;
    this.direction = "";

    this.isAlive = true;

    this.posX = 10;
    this.posY = 10;
    this.nextPosX = 10;
    this.nextPosY = 10;

    this.step = 3;

    this.angle = 0;
    this.holeCount = 50;

    this.draw = function(ctx) {
        ctx.moveTo(this.posX, this.posY);
        ctx.lineTo(this.nextPosX, this.nextPosY);
        ctx.strokeStyle = "#A6C94A";
        ctx.lineWidth = 3;
        ctx.stroke();
    };

    this.checkForCollision = function() {
        if (this.isCollided(this.nextPosX, this.nextPosY)) {
            this.draw(Kurve.ctx);
            Kurve.running = false;
            console.log("GAME OVER");
        }
    };
    
    this.isCollided = function(posX, posY) {
        return Kurve.ctx.getImageData(posX, posY, 1, 1).data[3] !== 0;
    }

    this.moveTo = function() {

    };

    this.moveToNextFrame = function() {
        this.direction = "";
        for (var key in Kurve.keysPressed) {
            this.direction = key;
        }

        if (this.direction === "Right") {
            this.angle += 0.05;
        }
        if (this.direction === "Left") {
            this.angle -= 0.05;
        }

        this.posX = this.nextPosX;
        this.posY = this.nextPosY;
        this.nextPosX += this.step * Math.cos(this.angle);
        this.nextPosY += this.step * Math.sin(this.angle);
    };
};
