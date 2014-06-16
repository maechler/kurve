"use strict";

Kurve.Specialconfig = [];

Kurve.Specialconfig.type = {
    RUN_FASTER: 'RUN_FASTER'
};

Kurve.Specialconfig.hook = {
    DRAW_NEXT_FRAME: 'DRAW_NEXT_FRAME'
};
 
Kurve.Specialconfig[Kurve.Specialconfig.type.RUN_FASTER] = {
     type:              Kurve.Specialconfig.type.RUN_FASTER,
     hook:              Kurve.Specialconfig.hook.DRAW_NEXT_FRAME,
     executionTime:     4,
     initAct:           function(curve) {
        this.isActive = true;
     },
     closeAct:          function(curve) {
         this.isActive = false;
         this.executionTime = 4 * Kurve.Game.fps; //4s        
         this.count--;
     },
     act:               function(curve) {
        if ( !this.isActive )           this.initAct(curve);
        if ( this.executionTime < 1 )   this.closeAct(curve); 

        curve.moveToNextFrame();
        curve.checkForCollision();
        curve.drawLine(curve.getField().ctx);

        this.executionTime--;
     }
 };
 