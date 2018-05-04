'use strict';
(function () {
  var galleryData = window.data.fillGalleryData();
  var galleryTemplate = window.pictures.fillGalleryTemplate(galleryData);
  window.pictures.renderGallery(galleryTemplate);
  window.preview.addListener(galleryData);
  window.form.addListener();
})();
