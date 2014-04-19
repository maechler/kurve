"use strict";

var Kurve = {
    
    config: {
        borderColor: "#535353"
    },
    
    runIntervalID:      null,
    canvas:             null,
    ctx:                null,
    
    framesPerSecond:    25,
    
    keysPressed:        {},
    running:            false,
    curves:             [],
    players:             [],
    
    toggleRunning: function() {
        Kurve.running = !Kurve.running;
        if (Kurve.running) {
            Kurve.startGame();
        }
    },
    
    init: function() {
        this.initCanvas();
        this.initContext();
        this.initField();

        this.curves.push(new Kurve.Curve(
            new Kurve.Player(37,39,"#A6C94A")
        ));

        this.curves.push(new Kurve.Curve(
            new Kurve.Player(81,87,"#990000")
        ));

        this.addWindowListeners();
        this.startGame();
    },
    
    initCanvas: function() {
        this.canvas         = document.getElementById("canvas");
        this.canvas.width   = window.innerWidth - 40;
        this.canvas.height  = window.innerHeight - 40;
    },
    
    initContext: function() {
        this.ctx = this.canvas.getContext("2d");
    },
    
    initField: function() {
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.config.borderColor;
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.canvas.width, 0);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.lineTo(0, 0);
        this.ctx.stroke();

        this.ctx.beginPath(); //in order to start a new path and let the border keep its style
    },
    
    addWindowListeners: function() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    },
    
    onKeyDown: function(event) {
        Kurve.keysPressed[event.keyCode] = true;
    },
    
    onKeyUp: function(event) {
        delete Kurve.keysPressed[event.keyCode];
    },
    
    startGame: function() {
        this.running = true;
        this.run();
        this.runIntervalID = setInterval(this.run.bind(this), 1000 / this.framesPerSecond);
    },
    
    run: function() {
        var start = new Date().getTime() / 1000;
        
        for (var curve in this.curves) {
            this.curves[curve].draw(this.ctx);
            this.curves[curve].moveToNextFrame();
            this.curves[curve].checkForCollision(this.ctx);
        }

        if (!this.running) clearInterval(this.runIntervalID);
        
        var executionTime = new Date().getTime() / 1000 - start;
        if (executionTime > 0.05) {
            console.log(executionTime);
        }
    }

};

//window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
//        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

document.addEventListener("DOMContentLoaded", function(event) {
    Kurve.init();
});
