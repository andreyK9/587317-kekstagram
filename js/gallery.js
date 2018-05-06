'use strict';
(function () {
  var setGalleryData = function (gallery) {
    window.gallery = gallery.slice();
    window.pictures.renderGallery(gallery);
    window.preview.addListener(gallery);
    window.form.addListener();
    window.filter.addListener();
  };

  window.backend.load(setGalleryData, window.backend.errorMessage);
})();
