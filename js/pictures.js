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
    renderGallery: function (pictureList) {
      var template = document.createDocumentFragment();
      for (var i = 0; i < pictureList.length; i++) {
        var picture = fillPhotoTemplate(pictureList[i]);
        picture.querySelector('.picture__link').dataset.number = i;
        template.appendChild(picture);
      }
      block.appendChild(template);
    }
  };
})();
