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

    defaultColor:       null,
    defaultLineWidth:   null,

    drawnPixelPrecision: null,
    
    init: function() {
        this.initCanvas();
        this.initContext();
        this.initDrawing();
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

    initDrawing: function() {
        this.defaultColor = Kurve.Config.Field.defaultColor;
        this.defaultLineWidth = Kurve.Config.Field.defaultLineWidth;
        this.drawnPixelPrecision = Kurve.Config.Field.drawnPixelPrecision;
    },

    drawField: function() {
        this.ctx.strokeStyle    = Kurve.Config.Field.borderColor;
        this.ctx.lineWidth      = 3;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.rect(0, 0, this.width, this.height);
      
        this.ctx.stroke();
        
        this.drawnPixels = [];
    },

    drawLine: function(fromPointX, fromPointY, toPointX, toPointY, color) {
        if ( color === undefined ) color = this.defaultColor;

        this.ctx.beginPath();

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth   = this.defaultLineWidth;

        this.ctx.moveTo(fromPointX, fromPointY);
        this.ctx.lineTo(toPointX, toPointY);

        this.ctx.stroke();

        this.addLineToDrawnPixel(fromPointX, fromPointY, toPointX, toPointY, color);
    },

    drawUntrackedPoint: function(pointX, pointY, color) {
        if ( color === undefined ) color = this.defaultColor;

        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(pointX, pointY, 2, 0, 2 * Math.PI, false);
        this.ctx.fill();
    },

    drawPoint: function(pointX, pointY, color) {
        this.drawUntrackedPoint(pointX, pointY, color);
        this.addPointToDrawnPixel(pointX, pointY, color);
    },

    addLineToDrawnPixel: function(fromPointX, fromPointY, toPointX, toPointY, color) {
        var interpolatedPoints = u.interpolateTwoPoints(fromPointX, fromPointY, toPointX, toPointY);


        for( var pointX in interpolatedPoints ) {
            for( var pointY in interpolatedPoints[pointX]) {
                this.addPointsToDrawnPixel(this.getPointSurroundings(pointX, pointY), color);
            }
        }
    },
    
    addPointsToDrawnPixel: function(points, color) {
        for( var pointX in points ) {
            for( var pointY in points[pointX]) {
                this.addPointToDrawnPixel(pointX, pointY, color);
            }
        }
    },
    
    addPointToDrawnPixel: function(pointX, pointY, color) {
        var pointX0 = u.round(pointX, 0);
        var pointY0 = u.round(pointY, 0);

        if ( this.drawnPixels[pointX0] === undefined ) {
            this.drawnPixels[pointX0] = [];
        }

        this.drawnPixels[pointX0][pointY0] = {
            color: color,
            time: new Date()
        };

        if ( Kurve.Config.Debug.fieldDrawnPixels ) {
            this.ctx.fillStyle = '#37FDFC';
            this.ctx.fillRect(pointX0, pointY0, 1, 1);
        }
    },
    
    isPointOutOfBounds: function(pointX, pointY) {
        return pointX <= 0 || pointY <= 0 || pointX >= this.width || pointY >= this.height;
    },

    isPointDrawn: function(pointX, pointY) {
        return this.drawnPixels[u.round(pointX, 0)] !== undefined &&
               this.drawnPixels[u.round(pointX, 0)][u.round(pointY, 0)] !== undefined;
    },

    isPointDrawnInColor: function(pointX, pointY, color) {
        return this.drawnPixels[u.round(pointX, 0)] !== undefined &&
               this.drawnPixels[u.round(pointX, 0)][u.round(pointY, 0)].color === color;
    },

    getDrawnPoint: function(pointX, pointY) {
        var pointX0 = u.round(pointX, 0);
        var pointY0 = u.round(pointY, 0);

        if ( this.drawnPixels[pointX0] !== undefined &&
             this.drawnPixels[pointX0][pointY0] !== undefined ) {
            return this.drawnPixels[pointX0][pointY0];
        } else {
            return false;
        }
    },
    
    getRandomPosition: function(borderPadding) {
        if ( borderPadding === undefined ) borderPadding = 20;
        
        var posX = borderPadding + Math.round( (this.width - 2*borderPadding)*Math.random() );
        var posY = borderPadding + Math.round( (this.height - 2*borderPadding)*Math.random() );
        
        return new Kurve.Point(posX, posY);
    },

    getPointSurroundings: function(pointX, pointY) {
        var pointX0 = u.round(pointX, 0);
        var pointY0 = u.round(pointY, 0);
        var pointSurroundings   = [];

        u.addPointToArray(pointSurroundings, pointX0,     pointY0);
        u.addPointToArray(pointSurroundings, pointX0 + 1, pointY0);
        u.addPointToArray(pointSurroundings, pointX0 + 1, pointY0 - 1);
        u.addPointToArray(pointSurroundings, pointX0,     pointY0 - 1);
        u.addPointToArray(pointSurroundings, pointX0 - 1, pointY0 - 1);
        u.addPointToArray(pointSurroundings, pointX0 - 1, pointY0);
        u.addPointToArray(pointSurroundings, pointX0 - 1, pointY0 + 1);
        u.addPointToArray(pointSurroundings, pointX0,     pointY0 + 1);
        u.addPointToArray(pointSurroundings, pointX0 + 1, pointY0 + 1);

        return pointSurroundings;
    }

};
