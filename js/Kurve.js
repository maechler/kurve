"use strict";

var Kurve = {    
    runIntervalID:      null,
    framesPerSecond:    25,
    
    keysPressed:        {},
    running:            false,
    curves:             [],
    players:            [],
    
    init: function() {
        Kurve.Field.init();
        this.initPlayers();
        this.addWindowListeners();
        //this.Menu.init();
        //this.Game.init(); --> initPlayers()
    },
    
    initPlayers: function() {
        var playersConfig = Kurve.Config.players;
        var playerHTML = '';
        
        for (var i in playersConfig) {
            var player = playersConfig[i];
            this.players[player.id] = new Kurve.Player(player.id,player.color,player.keyLeft,player.keyRight);
            playerHTML += this.players[player.id].renderMenuItem();
        }
        
        document.getElementById('menu').innerHTML += playerHTML;
    },
    
    addWindowListeners: function() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('keypress', this.onKeyPress);   
    },
    
    onKeyDown: function(event) {
        Kurve.keysPressed[event.keyCode] = true;
    },
    
    onKeyUp: function(event) {
        delete Kurve.keysPressed[event.keyCode];
    },
    
    //make empty function and then set either Kurve.Menu.onKeyPress or Kurve.Game.onKeyPress as reference
    //only use keydown and keyup --> because keypress returns different keycodes
    onKeyPress: function(event) {
        console.log('we');
        if (event.keyCode===32) {
            Kurve.onSpacePress();
        }
        
        if (Kurve.running) return;
        
        for (var player in Kurve.players) {
            if ( Kurve.players[player].isKeyLeft(event.keyCode) ) {
                var playerID = Kurve.players[player].id;
                var className = 'active';
                Kurve.players[playerID].isActive = true;
                break;
            } else if (Kurve.players[player].isKeyRight(event.keyCode)) {
                var playerID = Kurve.players[player].id;
                var className = 'inactive';
                this.players[player].isActive = false;
                break;
            }
        }
        
        if (playerID !== undefined) {
            var playerElement = document.getElementById(playerID);
            playerElement.className = playerElement.className.replace('inactive','');
            playerElement.className = playerElement.className.replace('active','');
            playerElement.className += ' ' + className;
        }
    },
    
    //use in Curve
    isKeyPressed: function(keyCode) {
        return this.keysPressed[keyCode] === true;
    },
    
    onSpacePress: function() {
        this.curves = [];
        for (var player in this.players) {
            if (!this.players[player].isActive) continue;
            this.curves.push(new Kurve.Curve(this.players[player]));
        }
        if (this.curves.length === 0) return;
        
        document.getElementById('menu').className = 'hidden';
        document.getElementById('canvas').className = '';
        var contentRight = document.getElementById('content-right');
        contentRight.className = contentRight.className.replace(' hidden', '');
        Kurve.startGame();
    },
    
    startGame: function() {
        window.removeEventListener('keypress',  this.onKeyPress);
        Kurve.running = true;
        this.run();
        this.runIntervalID = setInterval(this.run.bind(this), 1000 / this.framesPerSecond);
    },
    
    run: function() {
        this.curves[0].imageTest();
        var start = new Date().getTime() / 1000;
        
        for (var curve in this.curves) {
            this.curves[curve].draw(Kurve.Field.ctx);
            this.curves[curve].moveToNextFrame();
            this.curves[curve].checkForCollision(Kurve.Field.ctx);
        }

        if (!this.running) clearInterval(this.runIntervalID);
        
        var executionTime = new Date().getTime() / 1000 - start;
        if (executionTime > 0.040) {
            console.log('Interval limit exceeded: ' + executionTime);
        }
    }

};

document.addEventListener("DOMContentLoaded", function() {
    Kurve.init();
});
