"use strict";

Kurve.Config = {
    
    Field: {
        borderColor:    "#ddd",
        width:          0.7,    //70% percent of the screen
    },
    
    Curve: {
        stepLength:     1,
        lineWidth:      4,
        dAngle:         0.03,
        holeInterval:   150,
        holeCountDown:  150,
    },
    
    Game: {
        startDelay:     2000,
        fps:      40
    },
    
    players: [
        { id:"red",      color:"#C9000A",   keyLeft:49,   keyRight:81 },
        { id:"green",    color:"#027C00",   keyLeft:89,   keyRight:88 },
        { id:"blue",     color:"#2A368C",   keyLeft:67,   keyRight:86 },
        { id:"purple",   color:"#63238C",   keyLeft:79,   keyRight:48 },
        { id:"pink",     color:"#FF92EA",   keyLeft:53,   keyRight:54 },
        { id:"orange",   color:"#FF7219",   keyLeft:90,   keyRight:85 }
    ]

};