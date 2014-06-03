"use strict";

Kurve.Lightbox = {
    
    lightboxOverlay: null,
    lightboxContent: null,
    
    init: function() {
        this.lightboxOverlay = document.getElementById('lightbox-overlay');
        this.lightboxContent = document.getElementById('lightbox-content');
    },
    
    show: function(htmlContent) {
        Kurve.Utility.removeClass('hidden', 'lightbox-overlay')
        
        this.lightboxContent.innerHTML = htmlContent;
    }
    
}; 
