"use strict";

Kurve.Field = {
    
    canvas:         null,
    ctx:            null,
    
    width:          null,
    height:         null,
    
    drawnPixels:    [],
    
    init: function() {
        this.initCanvas();
        this.initContext();
        this.initField();
    },
        
    initCanvas: function() {
        var width           = window.innerWidth * Kurve.Config.Field.width;
        var height          = window.innerHeight;
        
        this.canvas         = document.getElementById("field");
        this.canvas.width   = width;
        this.canvas.height  = height;
        this.width          = width;
        this.height         = height;
    },
    
    initContext: function() {
        this.ctx = this.canvas.getContext("2d");
    },
    
    initField: function() {
        this.drawField();
    },
    
    drawField: function() {
        this.ctx.strokeStyle    = Kurve.Config.Field.borderColor;
        this.ctx.lineWidth      = 3;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.rect(0, 0, this.width, this.height);
      
        this.ctx.stroke();
        
        this.drawnPixels = [];
    },
    
    isPointOutOfBounds: function(point) {
        return point.getPosX() <= 0 || point.getPosY() <= 0 || point.getPosX() >= this.width || point.getPosY() >= this.height;
    },
    
    isPointDrawn: function(point) {
        return this.drawnPixels[point.getPosX()] !== undefined && this.drawnPixels[point.getPosX()][point.getPosY()] === true;
    },
    
    getFieldData: function() {
        return this.ctx.getImageData(0, 0, this.width, this.height);
    },
    
    getRandomPosition: function(borderPadding) {
        if (borderPadding === undefined) borderPadding = 20;
        
        var posX = borderPadding + Math.round( (this.width - 2*borderPadding)*Math.random() );
        var posY = borderPadding + Math.round( (this.height - 2*borderPadding)*Math.random() );
        
        return {posX:posX,posY:posY};
    }

};
