'use strict';

Kurve.Superpowerconfig = {};

Kurve.Superpowerconfig.types = {
    RUN_FASTER: 'RUN_FASTER',
    JUMP:       'JUMP',
    INVISIBLE:  'INVISIBLE'
};

Kurve.Superpowerconfig.hooks = {
    DRAW_NEXT_FRAME:    'DRAW_NEXT_FRAME',
    DRAW_LINE:          'DRAW_LINE',
    IS_COLLIDED:        'IS_COLLIDED'
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
          console.log('init', this.helpers.executionTime);
       },
       closeAct: function() {
           console.log('close');
           this.isActive = false;
       }
    },

    act: function(hook, curve) {
       console.log('act', this.helpers.executionTime);
       console.log(this.isActive);

       if ( !this.isActive )                   this.helpers.initAct.call(this);
       if ( this.helpers.executionTime < 1 )   this.helpers.closeAct.call(this);


        console.log('act 2', this.helpers.executionTime);
        console.log(this.isActive);

       curve.moveToNextFrame();
       curve.checkForCollision();
       curve.drawLine(curve.getField().ctx);

       this.helpers.executionTime--;
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
     
    act: function(hook, curve) {
        var now = new Date();
         
        if ( now.getTime() - this.helpers.previousExecution.getTime() > this.helpers.timeOut ) {
            var jumpedPosition = curve.getMovedPosition(curve.getOptions().stepLength * this.helpers.jumpWidth);
            curve.setNextPosition(jumpedPosition);

            this.helpers.previousExecution = now;
            this.decrementCount();
        }
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

    act: function(hook, curve) {
        if ( hook === Kurve.Superpowerconfig.hooks.DRAW_LINE ) {
            if ( !this.isActive )                   this.helpers.initAct.call(this);
            if ( this.helpers.executionTime < 1 )   this.helpers.closeAct.call(this); 

            curve.invisible = true;

            this.helpers.executionTime--;          
        } else if ( hook === Kurve.Superpowerconfig.hooks.IS_COLLIDED && this.isActive ) {
            return false;
        }

    }
 };
 