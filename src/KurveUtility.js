"use strict";

Kurve.Utility = function() {    
    //to be used for good
};

Kurve.Utility.round = function(number, digitsAfterComa) {
    return Math.round(number * Math.pow(10, digitsAfterComa)) / Math.pow(10, digitsAfterComa); 
};

Kurve.Utility.addClass = function(className, elementId) {
    var element = document.getElementById(elementId);
    if (element === null) return false;

    element.className += ' ' + className;
};
    
Kurve.Utility.removeClass = function(className, elementId) {
    var element = document.getElementById(elementId);
    if (element === null) return false;

    var regExp = new RegExp('(^|\\s)' + className + '($|\\s)', 'g');

    element.className = element.className.replace(regExp, ' ');
};

Kurve.Utility.setClassName = function(className, elementId) {
    var element = document.getElementById(elementId);
    if (element === null) return false;

    element.className = className;        
};

var u = Kurve.Utility;
