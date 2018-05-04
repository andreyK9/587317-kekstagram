'use strict';
(function () {
  var setGalaryData = function (galary) {
    window.pictures.renderGallery(galary);
    window.preview.addListener(galary);
    window.form.addListener();
  };

  window.backend.load(setGalaryData, window.backend.errorMessage);
})();
