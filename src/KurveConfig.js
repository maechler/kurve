"use strict";

Kurve.Config = {
    
    Field: {
        borderColor:    "#ddd",
        width:          0.7,    //70% percent of the screen
    },
    
    Curve: {
        stepLength:     3,
        lineWidth:      4,
        dAngle:         0.08,
        holeInterval:   150,
    },
    
    Game: {
        startDelay:     2000,
        fps:            25
    },
    
    players: [
        { id:"red",      color:"#C9000A",   keyLeft:49,   keyRight:81,   keySpecial:65  },
        { id:"green",    color:"#027C00",   keyLeft:89,   keyRight:88,   keySpecial:67  },
        { id:"blue",     color:"#2A368C",   keyLeft:86,   keyRight:66,   keySpecial:78  },
        { id:"purple",   color:"#63238C",   keyLeft:79,   keyRight:48,   keySpecial:80 },
        { id:"pink",     color:"#FF92EA",   keyLeft:53,   keyRight:54,   keySpecial:55  },
        { id:"orange",   color:"#FF7219",   keyLeft:90,   keyRight:85,   keySpecial:73  }
    ]

};