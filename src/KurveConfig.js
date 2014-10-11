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

Kurve.Config = {

    Debug: {
        curvePosition:      false,
        curveTrace:         false,
        fieldDrawnPixels:   false,
    },
    
    Field: {
        defaultColor:       '#333',
        defaultLineWidth:   4,
        borderColor:        '#ACAC9D',
        width:              0.7, //70% percent of the screen
    },
    
    Curve: {
        stepLength:     3,
        lineWidth:      4,
        dAngle:         0.08,
        holeInterval:   150,
        selfCollisionTimeout: 200,
    },
    
    Game: {
        startDelay:     2000,
        fps:            25,
    },

    Utility: {
        interpolatedPixelsPrecision: 100,
    },
    
    players: [
        { id:'red',      color:'#D4373E',   keyLeft:49,   keyRight:81,   keySuperpower:65  },
        { id:'orange',   color:'#FFA039',   keyLeft:37,   keyRight:40,   keySuperpower:39  },
        { id:'green',    color:'#3BCB69',   keyLeft:89,   keyRight:88,   keySuperpower:67  },
        { id:'blue',     color:'#3B90C3',   keyLeft:66,   keyRight:78,   keySuperpower:77  },
        { id:'purple',   color:'#7D11CD',   keyLeft:76,   keyRight:79,   keySuperpower:80  },
        { id:'pink',     color:'#DC72FF',   keyLeft:53,   keyRight:54,   keySuperpower:55  },
    ]

};