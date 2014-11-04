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

Kurve.Superpowerconfig = {};

Kurve.Superpowerconfig.types = {
    RUN_FASTER: 'RUN_FASTER',
    RUN_SLOWER: 'RUN_SLOWER',
    JUMP: 'JUMP',
    INVISIBLE: 'INVISIBLE',
    VERTICAL_BAR: 'VERTICAL_BAR',
    CROSS_WALLS: 'CROSS_WALLS',
    DARK_KNIGHT: 'DARK_KNIGHT'
};

Kurve.Superpowerconfig.hooks = {
    DRAW_NEXT_FRAME: 'DRAW_NEXT_FRAME',
    DRAW_LINE: 'DRAW_LINE',
    IS_COLLIDED: 'IS_COLLIDED'
};
 
Kurve.Superpowerconfig[Kurve.Superpowerconfig.types.RUN_FASTER] = {
    label: 'run faster',

    hooks: [Kurve.Superpowerconfig.hooks.DRAW_NEXT_FRAME],

    helpers: {
       executionTime: 0,
       initAct: function() {
          this.decrementCount();
          this.isActive  = true;
          this.helpers.executionTime = 4 * Kurve.Game.fps; //4s
       },
       closeAct: function() {
           this.isActive = false;
       }
    },

    init: function(curve) {

    },

    act: function(hook, curve) {
       if ( !this.isActive )                   this.helpers.initAct.call(this);
       if ( this.helpers.executionTime < 1 )   this.helpers.closeAct.call(this);

       curve.moveToNextFrame();
       curve.checkForCollision();
       curve.drawLine(curve.getField());

       this.helpers.executionTime--;
    },

    close: function(curve) {
        this.isActive = false;
    }
 };

Kurve.Superpowerconfig[Kurve.Superpowerconfig.types.RUN_SLOWER] = {
    label: 'run slower',

    hooks: [Kurve.Superpowerconfig.hooks.DRAW_NEXT_FRAME],

    helpers: {
        initialStepLength: null,
        executionTime: 0,
        initAct: function(curve) {
            this.decrementCount();
            this.isActive  = true;
            this.helpers.executionTime = 4 * Kurve.Game.fps; //4s
            this.helpers.initialStepLength = curve.getOptions().stepLength;

            curve.getOptions().stepLength = this.helpers.initialStepLength / 2;
        },
        closeAct: function(curve) {
            this.isActive = false;
            curve.getOptions().stepLength = this.helpers.initialStepLength;
        }
    },

    init: function(curve) {

    },

    act: function(hook, curve) {
        if ( !this.isActive )                   this.helpers.initAct.call(this, curve);
        if ( this.helpers.executionTime < 1 )   this.helpers.closeAct.call(this, curve);

        this.helpers.executionTime--;
    },

    close: function(curve) {
        this.isActive = false;
        if ( this.helpers.initialStepLength !== null ) curve.getOptions().stepLength = this.helpers.initialStepLength;
    }
};
  
Kurve.Superpowerconfig[Kurve.Superpowerconfig.types.JUMP] = {
    label: 'jump',

    hooks: [Kurve.Superpowerconfig.hooks.DRAW_NEXT_FRAME],
     
    helpers: {
        jumpWidth:         10,
        timeOut:           250, //until superpower can be called again
        previousExecution: new Date()
    },

    init: function(curve) {

    },
     
    act: function(hook, curve) {
        var now = new Date();
         
        if ( now.getTime() - this.helpers.previousExecution.getTime() > this.helpers.timeOut ) {
            var jumpedPosition = curve.getMovedPosition(curve.getOptions().stepLength * this.helpers.jumpWidth);
            curve.setNextPosition(jumpedPosition);
            curve.setPreviousMiddlePoint(jumpedPosition);

            this.helpers.previousExecution = now;
            this.decrementCount();
        }
    },

    close: function(curve) {
        this.isActive = false;
    }
 };
  
Kurve.Superpowerconfig[Kurve.Superpowerconfig.types.INVISIBLE] = {
    label: 'invisible',

    hooks: [
        Kurve.Superpowerconfig.hooks.DRAW_LINE,
        Kurve.Superpowerconfig.hooks.IS_COLLIDED
    ],

    helpers: {
        executionTime: 0,
        initAct: function() {
           this.decrementCount();
           this.isActive  = true;
           this.helpers.executionTime = 4 * Kurve.Game.fps; //4s
        },
        closeAct: function() {
            this.isActive = false;
        }
    },

    init: function(curve) {

    },

    act: function(hook, curve) {
        if ( hook === Kurve.Superpowerconfig.hooks.DRAW_LINE ) {
            if ( !this.isActive )                   this.helpers.initAct.call(this);
            if ( this.helpers.executionTime < 1 )   this.helpers.closeAct.call(this); 

            curve.setIsInvisible(true);

            this.helpers.executionTime--;          
        } else if ( hook === Kurve.Superpowerconfig.hooks.IS_COLLIDED && this.isActive ) {
            return false;
        }
    },

    close: function(curve) {
        this.isActive = false;
    }
 };

Kurve.Superpowerconfig[Kurve.Superpowerconfig.types.VERTICAL_BAR] = {
    label: 'vertical bar',

    hooks: [
        Kurve.Superpowerconfig.hooks.DRAW_NEXT_FRAME
    ],

    helpers: {
        timeOut:            250, //until superpower can be called again
        previousExecution:  new Date(),
        barWidth:           40
    },

    init: function(curve) {

    },

    act: function(hook, curve) {
        var now = new Date();

        if ( now.getTime() - this.helpers.previousExecution.getTime() > this.helpers.timeOut ) {

            var leftEndX     = Math.cos(curve.getOptions().angle - Math.PI / 2) * this.helpers.barWidth + curve.getPosition().getPosX();
            var leftEndY     = Math.sin(curve.getOptions().angle - Math.PI / 2) * this.helpers.barWidth + curve.getPosition().getPosY();
            var rightEndX    = Math.cos(curve.getOptions().angle + Math.PI / 2) * this.helpers.barWidth + curve.getPosition().getPosX();
            var rightEndY    = Math.sin(curve.getOptions().angle + Math.PI / 2) * this.helpers.barWidth + curve.getPosition().getPosY();

            Kurve.Field.drawLine(new Kurve.Point(leftEndX, leftEndY), new Kurve.Point(rightEndX, rightEndY), curve.getPlayer().getColor());

            this.helpers.previousExecution = now;
            this.decrementCount();
        }
    },

    close: function(curve) {
        this.isActive = false;
    }
};

Kurve.Superpowerconfig[Kurve.Superpowerconfig.types.CROSS_WALLS] = {
    label: 'cross walls',

    hooks: [
        Kurve.Superpowerconfig.hooks.IS_COLLIDED
    ],

    helpers: {
        getWallCrossedPosition: function(curve) {
            var position = curve.getNextPosition();
            var field = curve.getField();
            var posX, posY = 0;

            if ( position.getPosX() > field.width ) {
                posX = position.getPosX() - field.width;
                posY = position.getPosY();
            } else if ( position.getPosX() < 0 ) {
                posX = position.getPosX() + field.width;
                posY = position.getPosY();
            } else if ( position.getPosY() > field.height ) {
                posX = position.getPosX();
                posY = position.getPosY() - field.height;
            } else {
                //position.getPosY() < 0 or an error occured
                posX = position.getPosX();
                posY = position.getPosY() + field.height;
            }

            return new Kurve.Point(posX, posY);
        }
    },

    init: function(curve) {
        this.isActive = true;
    },

    act: function(hook, curve) {
        var position = curve.getNextPosition();

        if ( curve.getField().isPointOutOfBounds(position) && this.count > 0 ) {
            this.decrementCount();
            var movedPosition = this.helpers.getWallCrossedPosition(curve);

            //todo refactor in a away that from outside only one call is needed to change position
            curve.setPosition(movedPosition);
            curve.setNextPosition(movedPosition);
            curve.setPreviousMiddlePoint(movedPosition);
            curve.setPreviousMiddlePosition(movedPosition);

            return false;
        } else {
            //standard collision detection todo refactor not to use same logic twice
            return curve.getField().isPointOutOfBounds(position) || curve.getField().isPointDrawn(position);
        }
    },

    close: function(curve) {
        this.isActive = false;
    }
};

Kurve.Superpowerconfig[Kurve.Superpowerconfig.types.DARK_KNIGHT] = {
    label: 'dark knight',

    hooks: [
        Kurve.Superpowerconfig.hooks.DRAW_NEXT_FRAME
    ],

    helpers: {
        executionTime: 0,
        darkNightDivId: 'dark-knight',
        initAct: function() {
            if ( !u.hasClass('hidden', this.helpers.darkNightDivId) ) return;

            u.removeClass('hidden', this.helpers.darkNightDivId);
            this.decrementCount();
            this.isActive  = true;
            this.helpers.executionTime = 3 * Kurve.Game.fps; //3s
        },
        closeAct: function() {
            u.addClass('hidden', this.helpers.darkNightDivId);
            this.isActive = false;
        }
    },

    init: function(curve) {

    },

    act: function(hook, curve) {
        if ( !this.isActive )                   this.helpers.initAct.call(this);
        if ( this.helpers.executionTime < 1 )   this.helpers.closeAct.call(this);

        this.helpers.executionTime--;
    },

    close: function(curve) {
        this.isActive = false;

        if ( !u.hasClass('hidden', this.helpers.darkNightDivId) ) u.addClass('hidden', this.helpers.darkNightDivId);
    }
};
 