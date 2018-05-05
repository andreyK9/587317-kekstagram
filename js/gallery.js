'use strict';
(function () {
  var setGalleryData = function (gallery) {
    window.pictures.renderGallery(gallery);
    window.preview.addListener(gallery);
    window.form.addListener();
  };

  window.backend.load(setGalleryData, window.backend.errorMessage);
})();
