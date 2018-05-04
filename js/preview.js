'use strict';
(function () {
  var bigPicture = document.querySelector('.big-picture');
  var cancel = bigPicture.querySelector('.big-picture__cancel');

  // заполнение иконки аватара атрибутами
  var setAvatarAttr = function (img) {
    img.src = 'img/avatar-' + window.data.getRandomInteger(1, 6) + '.svg';
    img.alt = 'Аватар комментатора фотографии';
    img.width = '35';
    img.height = '35';
  };

  // создание иконки аватара
  var createAvatarIcon = function (className, text) {
    var icon = createTag('img', className, text);
    setAvatarAttr(icon);
    return icon;
  };

  // создание тега
  var createTag = function (tag, className, text) {
    var element = document.createElement(tag);

    for (var i = 0; i < className.length; i++) {
      element.classList.add(className[i]);
    }

    if (text) {
      element.textContent = text;
    }

    return element;
  };

  // создание блока комментария
  var createLi = function (text) {
    var li = createTag('li', ['social__comment', 'social__comment--text'], text);
    var img = createAvatarIcon(['social__picture']);

    li.insertAdjacentElement('afterbegin', img);
    return li;
  };

  var getCommentList = function (object) {
    var template = document.createDocumentFragment();
    for (var i = 0; i < object.comments.length; i++) {
      template.appendChild(createLi(object.comments[i]));
    }
    return template;
  };

  // заполнение данными Большого фото
  var fillBigPhoto = function (element, object) {
    element.querySelector('.big-picture__img > img').src = object.url;
    element.querySelector('.likes-count').textContent = object.likes;
    element.querySelector('.social__caption').textContent = object.comments[0];
    element.querySelector('.comments-count').textContent = object.comments.length;
  };

  // отрисовка Большого фото
  var renderBigPhoto = function (object) {
    var commentBlock = document.querySelector('.social__comments');
    var comment = getCommentList(object);

    commentBlock.innerHTML = '';

    fillBigPhoto(bigPicture, object);
    commentBlock.appendChild(comment);

    bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigPicture.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
    bigPicture.classList.remove('hidden');
  };

  var closePicture = function () {
    bigPicture.classList.add('hidden');
  };

  window.preview = {
    addListener: function (dataList) {
      var pictureLink = document.querySelectorAll('.picture__link');
      for (var i = 0; i < pictureLink.length; i++) {
        pictureLink[i].addEventListener('click', function (evt) {
          evt.preventDefault();
          if (evt.target.parentElement.dataset.number) {
            renderBigPhoto(dataList[evt.target.parentElement.dataset.number]);
          }

          document.addEventListener('keydown', closePicture);
          cancel.addEventListener('click', closePicture);
        });
      }
    }
  };
})();
