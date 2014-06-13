"use strict";

Kurve.Lightbox = {
    
    lightboxOverlay: null,
    lightboxContent: null,
    
    init: function() {
        this.lightboxOverlay = document.getElementById('lightbox-overlay');
        this.lightboxContent = document.getElementById('lightbox-content');
    },
    
    show: function(htmlContent) {
        u.removeClass('hidden', 'lightbox-overlay')
        
        this.lightboxContent.innerHTML = htmlContent;
    },
    
    hide: function() {
        u.addClass('hidden', 'lightbox-overlay')
      
        this.lightboxContent.innerHTML = '';
    }
    
}; 
