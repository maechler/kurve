"use strict";

Kurve.Utility = {    
    round: function(number, digitsAfterComa) {
        return Math.round(number * Math.pow(10, digitsAfterComa)) / Math.pow(10, digitsAfterComa); 
    }   
}; 
