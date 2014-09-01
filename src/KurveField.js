/**
 *
 * Program:     Kurve
 * Author:      Markus Mächler, marmaechler@gmail.com
 * License:     http://www.gnu.org/licenses/gpl.txt
 * Link:        http://achtungkurve.com
 *
 * Copyright © 2014 Markus Mächler
 *
 * Kurve is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Kurve is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Kurve.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

'use strict';

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
        
        this.canvas         = document.getElementById('field');
        this.canvas.width   = width;
        this.canvas.height  = height;
        this.width          = width;
        this.height         = height;
    },
    
    initContext: function() {
        this.ctx = this.canvas.getContext('2d');
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
    
    addPointsToDrawnPixel: function(points) {
        points.forEach(function(point) {
            Kurve.Field.addPointToDrawnPixel(point);
        });
    },
    
    addPointToDrawnPixel: function(point) {
        if ( this.drawnPixels[point.getPosX(0)] === undefined ) {
            this.drawnPixels[point.getPosX(0)] = [];  
        } 

        this.drawnPixels[point.getPosX(0)][point.getPosY(0)] = true;
    },
    
    isPointOutOfBounds: function(point) {
        return point.getPosX() <= 0 || point.getPosY() <= 0 || point.getPosX() >= this.width || point.getPosY() >= this.height;
    },
    
    isPointDrawn: function(point) {
        return this.drawnPixels[point.getPosX(0)] !== undefined && this.drawnPixels[point.getPosX(0)][point.getPosY(0)] === true;
    },
    
    getRandomPosition: function(borderPadding) {
        if ( borderPadding === undefined ) borderPadding = 20;
        
        var posX = borderPadding + Math.round( (this.width - 2*borderPadding)*Math.random() );
        var posY = borderPadding + Math.round( (this.height - 2*borderPadding)*Math.random() );
        
        return new Kurve.Point(posX, posY);
    }

};
