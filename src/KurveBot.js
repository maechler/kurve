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


class NeuralNetwork {
    constructor(neuronCounts) {
        this.levels = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }
    }

    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(
            givenInputs, network.levels[0]);
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(
                outputs, network.levels[i]);
        }
        return outputs;
    }

    static mutate(network, amount = 1) {
        network.levels.forEach(level => {
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1,
                    amount
                )
            }
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    )
                }
            }
        });
    }
}


function lerp(a, b, t) {
    return a + (b - a) * t;
}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(givenInputs, level) {
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; i++) {

            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }
}

Kurve.Bot = function(curve, id) {
    console.log('Kurve.Bot.id', id);
    this.getCurve = function() { return curve; };
    this.getPlayer = function() { return curve.getPlayer(); };
    this.getGame = function() { return curve.getGame(); };
    this.getField = function() { return curve.getField(); };

    if (localStorage.getItem("brain")) {

        this.brain = JSON.parse(
            localStorage.getItem("brain"));

        if (id != 'red') {
            NeuralNetwork.mutate(this.brain, 0.02)
            console.log('Kurve.Bot:mutateBrain');
        }
        if (id == 'green') {
            this.brain = new NeuralNetwork([10, 30, 3]);
            console.log('Kurve.Bot:createBrainOfPlayerGreen');
        }

    } else {
        this.brain = new NeuralNetwork([10, 30, 3]); // [input, hidden layer, outputs(left, right)]
        console.log('Kurve.Bot:createNewBrain');
    }
};

Kurve.Bot.prototype.act = function() {
    var currentFrameId = this.getCurrentFrameId();

    if (this.getField().isPointDrawn(0, 0)) {
        var drawnPoint = this.getField().getDrawnPoint(0, 0)
        var isItMe = drawnPoint.curve.getPlayer() === this.getPlayer();
    }

    if (currentFrameId == 2) {
        //console.log(this.getField());
        //console.log(this.getField().drawnPixels);
    }

    let offsets = [];
    let sensorSpread = Math.PI / 2;
    let sensorCount = 10;
    let sensorLength = 100;

    for (var i = 0; i < sensorCount; i++) {
        offsets[i] = sensorLength;
    }
    //offsets = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]
    for (let sensorRay = 0; sensorRay < sensorCount; sensorRay++) {
        //TODO make it continious not only ten fixed sensor points

        let sensorTargetX = this.getCurve().getPositionX() + Math.cos(this.getCurve().getOptions().angle + (sensorRay - sensorCount / 2) / sensorCount) * sensorLength;
        let sensorTargetY = this.getCurve().getPositionY() + Math.sin(this.getCurve().getOptions().angle + (sensorRay - sensorCount / 2) / sensorCount) * sensorLength;

        // Debug sensors
        if (Kurve.Game.roundCount % Kurve.Config.Debug.gymVisualisationRoundCountModulo === 0) {
            Kurve.Field.pixiDebugFrame.lineStyle(1, 0x37FDFC);
            Kurve.Field.pixiDebugFrame.drawRect(sensorTargetX, sensorTargetY, 1, 1);
        }

        let interpolatedPoints = u.interpolateTwoPoints(
            this.getCurve().getPositionX(),
            this.getCurve().getPositionY(),
            sensorTargetX,
            sensorTargetY,
        )

        outerLoop:
        for (var pointX in interpolatedPoints) {
            for (var pointY in interpolatedPoints[pointX]) {
                if (this.getCurve().isCollided(pointX, pointY)) {
                    offsets[sensorRay] =
                        Math.sqrt(Math.pow(this.getCurve().getPositionX() - pointX, 2) +
                        Math.pow(this.getCurve().getPositionY() - pointY, 2))

                    if (Kurve.Game.roundCount % Kurve.Config.Debug.gymVisualisationRoundCountModulo === 0) {
                        Kurve.Field.pixiDebugFrame.lineStyle(1, 0xFD379B);
                        Kurve.Field.pixiDebugFrame.drawRect(sensorTargetX - 1, sensorTargetY - 1, 3, 3);
                    }

                    break outerLoop;
                }
            }
        }

        // normalizie offsetss
        for (var i = 0; i < offsets.length; i++) {
            offsets[i] = (offsets[i] - sensorLength) / sensorLength;
        }

        for (let i = 1; i < sensorLength; i++) {
            let sensorPoint = [
                this.getCurve().getPositionX() + Math.cos(this.getCurve().getOptions().angle + (i - sensorCount / 2) / sensorCount) * sensorLength,
                this.getCurve().getPositionY() + Math.sin(this.getCurve().getOptions().angle + (i - sensorCount / 2) / sensorCount) * sensorLength,
            ]

            if (currentFrameId == 2) {
                //console.log("sensor Point");
                //console.log(sensorPoint);
            }

            /*
            if (this.getField().isPointOutOfBounds(positionX, positionY)) return true;

            var drawnPoint = this.getField().getDrawnPoint(positionX, positionY);

            if (!drawnPoint) return false;
            */

            if (this.getCurve().isCollided(...sensorPoint)) {
                offsets[sensorRay] = i / 10;
            }
        }
    }

    const outputs = NeuralNetwork.feedForward(offsets, this.brain);

    if (outputs[0] > 0.5) {
        this.goLeft();
    } else if (outputs[1] > 0.5) {
        this.goRight();
    }
};

Kurve.Bot.prototype.resetKeysDown = function() {
    this.getGame().keysDown[this.getPlayer().getKeyLeft()] = false;
    this.getGame().keysDown[this.getPlayer().getKeyRight()] = false;
    this.getGame().keysDown[this.getPlayer().getKeySuperpower()] = false;
};

Kurve.Bot.prototype.goLeft = function() {
    this.getGame().keysDown[this.getPlayer().getKeyLeft()] = true;
};

Kurve.Bot.prototype.goRight = function() {
    this.getGame().keysDown[this.getPlayer().getKeyRight()] = true;
};

Kurve.Bot.prototype.useSuperpower = function() {
    this.getGame().keysDown[this.getPlayer().getKeySuperpower()] = true;
};

Kurve.Bot.prototype.getCurrentFrameId = function() {
    return this.getGame().CURRENT_FRAME_ID;
};
