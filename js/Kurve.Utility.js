"use strict";

Kurve.Utility = {    
    
    round: function(number, digitsAfterComa) {
        return Math.round(number * Math.pow(10, digitsAfterComa)) / Math.pow(10, digitsAfterComa); 
    },
    
    addClass: function(className, elementId) {
        var element = document.getElementById(elementId);
        if (element === null) return false;
        
        element.className += ' ' + className;
    },
    
    removeClass: function(className, elementId) {
        var element = document.getElementById(elementId);
        if (element === null) return false;
        
        var regExp = new RegExp('(^|\\s)' + className + '($|\\s)', 'g');

        element.className = element.className.replace(regExp, ' ');
    },
    
    setClassName: function(className, elementId) {
        var element = document.getElementById(elementId);
        if (element === null) return false;
        
        element.className = className;        
    }
    
}; 
