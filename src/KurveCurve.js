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

Kurve.Curve = function(player, game, field, config, superpower) {
    
    var position = null;
    var nextPosition = null;
    var justStarted = false;
    var isInvisible = false;
    var previousMiddlePoint = null;
    var previousMiddlePosition = null;

    var options = {
        stepLength: config.stepLength,
        lineWidth: config.lineWidth,
        angle: 0,
        dAngle: config.dAngle,
        holeInterval: config.holeInterval,
        holeCountDown: config.holeInterval,
        selfCollisionTimeout: config.selfCollisionTimeout
    };
    
    this.incrementAngle = function() { options.angle += options.dAngle };
    this.decrementAngle = function() { options.angle -= options.dAngle };
    
    this.setPosition = function(newPosition) { position = newPosition; };
    this.setNextPosition = function(newPosition) { nextPosition = newPosition; };
    this.setRandomPosition = function(newPosition) { position = nextPosition = previousMiddlePosition = previousMiddlePoint = newPosition; };
    this.setAngle = function(newAngle) { options.angle = newAngle; };
    this.setPosition = function(newPosition) { position = newPosition; };
    this.setJustStarted = function(newJustStarted) { justStarted = newJustStarted; };
    this.setIsInvisible = function(newIsInvisible) { isInvisible = newIsInvisible; };
    this.setPreviousMiddlePoint = function(newPreviousMiddlePoint) { previousMiddlePoint = newPreviousMiddlePoint; };
    this.setPreviousMiddlePosition = function(newPreviousMiddlePosition) { previousMiddlePosition = newPreviousMiddlePosition; };

    this.hasJustStarted = function() { return justStarted; };
    this.getPlayer = function() { return player; };
    this.getGame = function() { return game; };
    this.getField = function() { return field; };
    this.getSuperpower = function() { return superpower };
    this.getPosition = function() { return position; };
    this.getNextPosition = function() { return nextPosition; };
    this.getOptions = function() { return options; };
    this.isInvisible = function() { return isInvisible; };
    this.getPreviousMiddlePoint = function() { return previousMiddlePoint };
    this.getPreviousMiddlePosition = function() { return previousMiddlePosition };

};

Kurve.Curve.prototype.drawNextFrame = function() {
    this.moveToNextFrame();
    this.checkForCollision();
    this.drawLine(this.getField());
    
    if ( this.useSuperpower(Kurve.Superpowerconfig.hooks.DRAW_NEXT_FRAME) ) {
        this.getPlayer().getSuperpower().act(Kurve.Superpowerconfig.hooks.DRAW_NEXT_FRAME, this);
    }

    if ( Kurve.Config.Debug.curvePosition ) {
        this.getField().ctx.fillStyle = "#000";
        this.getField().ctx.fillRect(this.getPosition().getPosX(0), this.getPosition().getPosY(0), 1, 1);
    }
};

Kurve.Curve.prototype.drawCurrentPosition = function(field) {
    field.drawUntrackedPoint(this.getPosition(), this.getPlayer().getColor());
};

Kurve.Curve.prototype.drawLine = function(field) {
    this.setIsInvisible(this.getOptions().holeCountDown < 0);

    if ( this.useSuperpower(Kurve.Superpowerconfig.hooks.DRAW_LINE) ) {
        this.getPlayer().getSuperpower().act(Kurve.Superpowerconfig.hooks.DRAW_LINE, this);
    }

    if ( this.isInvisible() ) {
        if ( this.getOptions().holeCountDown < -2 ) this.resetHoleCountDown();
    } else {
        field.drawLine(this.getPreviousMiddlePosition(), this.getNextPosition(), this.getPlayer().getColor());
    }

    this.getOptions().holeCountDown--;
};

Kurve.Curve.prototype.moveToNextFrame = function() {
    this.computeNewAngle();
    
    var middlePoint = this.getMovedPosition(this.getOptions().stepLength / 2);
    var nextPoint   = this.getMovedPosition(this.getOptions().stepLength);

    if ( this.getPreviousMiddlePoint() === null ) this.setPreviousMiddlePoint(middlePoint);

    this.setPreviousMiddlePosition(this.getPreviousMiddlePoint());
    this.setPosition(this.getNextPosition());
    this.setNextPosition(nextPoint);
    this.setPreviousMiddlePoint(middlePoint);
};

Kurve.Curve.prototype.getMovedPosition = function(step) {
    var posX = this.getNextPosition().getPosX() + step * Math.cos(this.getOptions().angle);
    var posY = this.getNextPosition().getPosY() + step * Math.sin(this.getOptions().angle);

    return new Kurve.Point(posX, posY);
};

Kurve.Curve.prototype.checkForCollision = function() {
    if ( this.useSuperpower(Kurve.Superpowerconfig.hooks.IS_COLLIDED) ) {
        var superpowerIsCollided = this.getPlayer().getSuperpower().act(Kurve.Superpowerconfig.hooks.IS_COLLIDED, this);

        //use === to make sure it is not null, null leads to default collision detection
        if ( superpowerIsCollided === true ) return this.die();
        if ( superpowerIsCollided === false ) return;
    } else if ( this.hasJustStarted() ) {
        this.setJustStarted(false);
        return;
    }

    var trace = u.interpolateTwoPoints(this.getPosition(), this.getNextPosition());
    var isCollided = false;
    var that = this;

    trace.forEach(function(point) {
        if ( that.isCollided(point) ) isCollided = true;

        if ( Kurve.Config.Debug.curveTrace ) {
            that.getField().ctx.globalAlpha = 0.5;
            that.getField().ctx.fillStyle = "#000";
            that.getField().ctx.fillRect(point.getPosX(0), point.getPosY(0), 1, 1);
        }
    });

    if ( isCollided ) this.die();
};

Kurve.Curve.prototype.isCollided = function(position) {
    if ( this.getField().isPointOutOfBounds(position) ) return true;
    if ( !this.getField().isPointDrawn(position) ) return false;
    if ( !this.getField().isPointDrawnInColor(position, this.getPlayer().getColor()) ) return true;

    return !this.isPointInImmediateTrace(position);
};

Kurve.Curve.prototype.isPointInImmediateTrace = function(position) {
    var now = new Date();
    var point = this.getField().getDrawnPoint(position);

    if ( now.getTime() - point.time.getTime() < this.getOptions().selfCollisionTimeout ) return true;

    return false;
};

Kurve.Curve.prototype.die = function() {
    this.getGame().notifyDeath(this);
};

Kurve.Curve.prototype.computeNewAngle = function() {
    if ( this.getGame().isKeyDown(this.getPlayer().getKeyRight()) ) {
        this.incrementAngle();
    } else if ( this.getGame().isKeyDown(this.getPlayer().getKeyLeft()) ) {
        this.decrementAngle();
    }
};
    
Kurve.Curve.prototype.setRandomAngle = function() {
    this.setAngle(2 * Math.PI * Math.random());
};

Kurve.Curve.prototype.useSuperpower = function(hook) {
    if ( !this.getPlayer().getSuperpower().usesHook(hook) ) return false;
    if ( this.getPlayer().getSuperpower().isActive() ) return true;
    if ( Kurve.Game.isKeyDown(this.getPlayer().getKeySuperpower()) && this.getPlayer().getSuperpower().getCount() > 0 ) return true;

    return false;
};

Kurve.Curve.prototype.resetHoleCountDown = function() {
    this.getOptions().holeCountDown = this.getOptions().holeInterval;
};
