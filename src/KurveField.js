/**
 *
 * Program:     Kurve
 * Author:      Markus Mächler, marmaechler@gmail.com
 * License:     http://www.gnu.org/licenses/gpl.txt
 * Link:        http://achtungkurve.com
 *
 * Copyright © 2014, 2015 Markus Mächler
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
    
    canvas: null,
    pixiApp: null,
    pixiCurves: null,
    pixiDebug: null,
    
    width: null,
    height: null,
    
    drawnPixels: [],
    defaultLineWidth: null,
    drawnPixelPrecision: null,
    
    init: function() {
        this.initWindow();
        this.initCanvas();
        this.initPixi();
        this.initDrawing();
        this.initField();
    },

    initWindow: function() {
        //Fix window width in order to prevent window resize to change field size
        document.body.style.height = window.innerHeight + 'px';
        document.body.style.width = window.innerWidth + 'px';
    },
        
    initCanvas: function() {
        this.width = window.innerWidth * Kurve.Config.Field.width;
        this.height = window.innerHeight;
        this.canvas = document.getElementById('field');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    
    initPixi: function() {
        this.pixiApp = new PIXI.Application({width: this.canvas.width, height: this.canvas.height});
        this.pixiApp.renderer = new PIXI.autoDetectRenderer(
            this.canvas.width,
            this.canvas.height,
            {
                view: this.canvas,
                transparent: true,
                antialias: true
            }
        );
        this.pixiCurves = new PIXI.Graphics();
        this.pixiField = new PIXI.Graphics();
        this.pixiDebug = new PIXI.Graphics();

        this.pixiApp.stage.addChild(this.pixiCurves);
        this.pixiApp.stage.addChild(this.pixiField);
        this.pixiApp.stage.addChild(this.pixiDebug);
    },
    
    initField: function() {
        this.drawField();
    },

    initDrawing: function() {
        this.defaultLineWidth = Kurve.Config.Field.defaultLineWidth;
        this.drawnPixelPrecision = Kurve.Config.Field.drawnPixelPrecision;
    },

    clearFieldContent: function() {
        this.drawnPixels = [];

        this.pixiCurves.clear();
        this.pixiDebug.clear();
    },

    drawField: function() {
        var borderColor = u.stringToHex(Kurve.Theming.getThemedValue('field', 'borderColor'));

        this.pixiField.clear();
        this.pixiField.lineStyle(2, borderColor);
        this.pixiField.drawRect(0, 0, this.width, this.height);
    },

    drawLine: function(fromPointX, fromPointY, toPointX, toPointY, color, curve) {
        if ( color === undefined ) color = Kurve.Theming.getThemedValue('field', 'defaultColor');

        this.pixiCurves.lineStyle(this.defaultLineWidth, u.stringToHex(color));
        this.pixiCurves.moveTo(fromPointX, fromPointY);
        this.pixiCurves.lineTo(toPointX, toPointY);

        this.addLineToDrawnPixel(fromPointX, fromPointY, toPointX, toPointY, color, curve);
    },

    drawUntrackedPoint: function(pointX, pointY, color) {
        if ( color === undefined ) color = Kurve.Theming.getThemedValue('field', 'defaultColor');

        this.pixiCurves.beginFill(u.stringToHex(color));
        this.pixiCurves.lineStyle(0);
        this.pixiCurves.drawCircle(pointX, pointY, 2);
        this.pixiCurves.endFill();
    },

    drawPoint: function(pointX, pointY, color, curve) {
        this.drawUntrackedPoint(pointX, pointY, color);
        this.addPointToDrawnPixel(pointX, pointY, color, curve);
    },

    addLineToDrawnPixel: function(fromPointX, fromPointY, toPointX, toPointY, color, curve) {
        var interpolatedPoints = u.interpolateTwoPoints(fromPointX, fromPointY, toPointX, toPointY);

        for( var pointX in interpolatedPoints ) {
            for( var pointY in interpolatedPoints[pointX]) {
                this.addPointsToDrawnPixel(this.getPointSurroundings(pointX, pointY), color, curve);
            }
        }
    },
    
    addPointsToDrawnPixel: function(points, color, curve) {
        for( var pointX in points ) {
            for( var pointY in points[pointX]) {
                this.addPointToDrawnPixel(pointX, pointY, color, curve);
            }
        }
    },
    
    addPointToDrawnPixel: function(pointX, pointY, color, curve) {
        var pointX0 = u.round(pointX, 0);
        var pointY0 = u.round(pointY, 0);

        if ( this.drawnPixels[pointX0] === undefined ) {
            this.drawnPixels[pointX0] = [];
        }

        this.drawnPixels[pointX0][pointY0] = {
            color: color,
            curve: curve,
            time: new Date()
        };

        if ( Kurve.Config.Debug.fieldDrawnPixels ) {
            this.pixiDebug.lineStyle(1, 0x37FDFC);
            this.pixiDebug.drawRect(pointX0, pointY0, 1, 1);
        }
    },
    
    isPointOutOfBounds: function(pointX, pointY) {
        //todo subtract boundary width
        return pointX <= 0 || pointY <= 0 || pointX >= this.width || pointY >= this.height;
    },

    isPointDrawn: function(pointX, pointY) {
        return this.drawnPixels[u.round(pointX, 0)] !== undefined &&
               this.drawnPixels[u.round(pointX, 0)][u.round(pointY, 0)] !== undefined;
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
        if ( borderPadding === undefined ) borderPadding = 25;
        
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
