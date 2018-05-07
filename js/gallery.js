'use strict';

(function () {
  var setGalleryData = function (pictures) {
    window.gallery = {pictures: pictures.slice()};
    window.pictures.renderGallery(pictures);
    window.preview.addListener(pictures);
    window.form.addListener();
    window.filter.addListener();
  };
  window.backend.load(setGalleryData, window.backend.errorMessage);
})();
