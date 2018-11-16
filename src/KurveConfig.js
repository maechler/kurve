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

Kurve.Config = {

    Debug: {
        curvePosition: false,
        curveTrace: false,
        fieldDrawnPixels: false,
    },
    
    Field: {
        defaultColor: '#333333',
        defaultLineWidth: 4,
        borderColor: '#ACAC9D',
        width: 0.7, //70% percent of the screen
    },
    
    Curve: {
        stepLength: 1.4,
        lineWidth: 4,
        dAngle: 0.035,
        holeInterval: 150,
        holeIntervalRandomness: 300,
        selfCollisionTimeout: 150,
    },
    
    Game: {
        startDelay: 2000,
        fps: 60,
    },
    
    Players: [
        { id:'red',      keyLeft:49,   keyRight:81,   keySuperpower:65  },
        { id:'orange',   keyLeft:37,   keyRight:40,   keySuperpower:39  },
        { id:'green',    keyLeft:89,   keyRight:88,   keySuperpower:67  },
        { id:'blue',     keyLeft:66,   keyRight:78,   keySuperpower:77  },
        { id:'purple',   keyLeft:76,   keyRight:79,   keySuperpower:80  },
        { id:'pink',     keyLeft:53,   keyRight:54,   keySuperpower:55  },
    ],

    Theming: {
        default: {
            players: {
                red: '#D4373E',
                orange: '#FFA039',
                green: '#3BCB69',
                blue: '#3B90C3',
                purple: '#7D11CD',
                pink: '#DC72FF'
            },
            field: {
                defaultColor: '#333333',
                borderColor: '#ACAC9D',
                deathMatchColor: '#333333',
            }
        },
        dark: {
            players: {
                red: '#FF0000',
                orange: '#FFA500',
                green: '#7CFC00',
                blue: '#1E90FF',
                purple: '#9370DB',
                pink: '#FF1493'
            },
            field: {
                defaultColor: '#DDDDDD',
                borderColor: '#999999',
                deathMatchColor: '#DDDDDD',
            }
        }
    }

};