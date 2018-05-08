'use strict';

(function () {
  var block = document.querySelector('.pictures');

  // заполнение данными изображения
  var fillPhotoTemplate = function (object) {
    var temp = document.querySelector('#picture').content.cloneNode(true);
    temp.querySelector('img').src = object.url;
    temp.querySelector('.picture__stat--likes').textContent = object.likes;
    temp.querySelector('.picture__stat--comments').textContent = object.comments.length;
    return temp;
  };

  window.pictures = {
    block: block,
    renderGallery: function (pictures) {
      var template = document.createDocumentFragment();
      for (var i = 0; i < pictures.length; i++) {
        var picture = fillPhotoTemplate(pictures[i]);
        picture.querySelector('.picture__link').dataset.number = i;
        template.appendChild(picture);
      }
      block.appendChild(template);
    }
  };
})();
