"use strict";

Kurve.Field = {
    
    canvas: null,
    ctx:    null,
    
    init: function() {
        this.initCanvas();
        this.initContext();
        this.initField();
    },
        
    initCanvas: function() {
        this.canvas         = document.getElementById("field");
        this.canvas.width   = window.innerWidth * Kurve.Config.Field.width;
        this.canvas.height  = window.innerHeight;
    },
    
    initContext: function() {
        this.ctx            = this.canvas.getContext("2d");
    },
    
    initField: function() {
        this.drawField();
    },
    
    drawField: function() {
        this.ctx.strokeStyle    = Kurve.Config.Field.borderColor;
        this.ctx.lineWidth      = 3;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
      
        this.ctx.stroke();
    },
    
    getFieldData: function() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    },
    
    getRandomPosition: function(borderPadding) {
        if (borderPadding === undefined) borderPadding = 20;
        
        var posX = borderPadding + Math.round( (this.canvas.width - 2*borderPadding)*Math.random() );
        var posY = borderPadding + Math.round( (this.canvas.height - 2*borderPadding)*Math.random() );
        
        return {posX:posX,posY:posY};
    }

};
