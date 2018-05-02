'use strict';
(function () {
  // заполнение данными изображения
  var fillPhotoTemplate = function (object) {
    var temp = document.querySelector('#picture').content.cloneNode(true);

    temp.querySelector('img').src = object.url;
    temp.querySelector('.picture__stat--likes').textContent = object.likes;
    temp.querySelector('.picture__stat--comments').textContent = object.comments.length;

    return temp;
  };

  window.pictures = {
    fillGalleryTemplate: function (arr) {
      var template = document.createDocumentFragment();

      for (var i = 0; i < arr.length; i++) {
        var photo = fillPhotoTemplate(arr[i]);
        photo.querySelector('.picture__link').dataset.number = i;
        template.appendChild(photo);
      }

      return template;
    },
    renderGallery: function (template) {
      var block = document.querySelector('.pictures');
      block.appendChild(template);
    }
  };
})();
