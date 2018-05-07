'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var cancel = bigPicture.querySelector('.big-picture__cancel');
  var isCorrect = {'click': true, '27': true};

  var getRandomInteger = function (min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
  };

  // заполнение иконки аватара атрибутами
  var setAvatarAttr = function (img) {
    img.src = 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
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
  var createTag = function (tag, classNames, text) {
    var element = document.createElement(tag);
    for (var i = 0; i < classNames.length; i++) {
      element.classList.add(classNames[i]);
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

  var closePicture = function (evt) {
    if (isCorrect[evt.keyCode] || isCorrect[evt.type]) {
      document.body.classList.remove('modal-open');
      bigPicture.classList.add('hidden');
    }
  };

  window.preview = {
    addListener: function (dataList) {
      var pictureLinks = document.querySelectorAll('.picture__link');
      for (var i = 0; i < pictureLinks.length; i++) {
        pictureLinks[i].addEventListener('click', function (evt) {
          evt.preventDefault();
          var number;
          if (evt.target.parentElement.dataset.number) {
            number = evt.target.parentElement.dataset.number;
          } else {
            number = evt.target.dataset.number;
          }
          renderBigPhoto(dataList[number]);
          document.body.classList.add('modal-open');
          document.addEventListener('keydown', closePicture);
          cancel.addEventListener('click', closePicture);
        });
      }
    }
  };
})();
