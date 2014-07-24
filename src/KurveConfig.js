'use strict';

Kurve.Config = {
    
    Field: {
        borderColor:    '#ACAC9D',
        width:          0.7,        //70% percent of the screen
    },
    
    Curve: {
        stepLength:     3,
        lineWidth:      4,
        dAngle:         0.08,
        holeInterval:   150,
    },
    
    Game: {
        startDelay:     2000,
        fps:            25,
    },
    
    players: [
        { id:'red',      color:'#D4373E',   keyLeft:49,   keyRight:81,   keySuperpower:65  },
        { id:'orange',   color:'#FFA039',   keyLeft:90,   keyRight:85,   keySuperpower:73  },
        { id:'green',    color:'#3BCB69',   keyLeft:89,   keyRight:88,   keySuperpower:67  },
        { id:'blue',     color:'#3B90C3',   keyLeft:86,   keyRight:66,   keySuperpower:78  },
        { id:'purple',   color:'#7D11CD',   keyLeft:79,   keyRight:48,   keySuperpower:80  },
        { id:'pink',     color:'#DC72FF',   keyLeft:53,   keyRight:54,   keySuperpower:55  },
    ]

};