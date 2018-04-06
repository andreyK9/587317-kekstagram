'use strict';

var LIKES_BEGIN = 15;
var LIKES_END = 200;
var COMMENTS_BEGIN = 1;
var COMMENTS_END = 4;

// перемешивает массив комментариев
function compareRandom(a, b) {
  return Math.random() - 0.5;
};

// возращает случайное натуральное число в диапазоне от min до max
var randomInteger = function (min, max) {
  return Math.round( min - 0.5 + Math.random() * (max - min + 1));
};

// создание случайных комментариев
var randomComments = function () {
  var arr = [
    'В целом всё неплохо. Но не всё.',
    'Всё отлично!',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше'
  ];

  arr.sort(compareRandom);
  arr.length = randomInteger(COMMENTS_BEGIN, COMMENTS_END);

  return arr;
};

// создание случайной подписи для изображения
var randomDescription = function () {
  var descriptionOptions = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  descriptionOptions.sort(compareRandom);
  return descriptionOptions[0];
};

// создание базы данных других пользователей
var createPictureBase = function () {
  var gallery = [];

  for (var i = 1; i <= 25; i++) {
    var usersPhoto = {
      url : 'photos/' + i + '.jpg',
      likes : randomInteger(LIKES_BEGIN, LIKES_END),
      comments : randomComments(),
      description : randomDescription()
    };

    gallery.push(usersPhoto);
  }

  return gallery;
};

// заполнение данными одного изображения других пользователей
var createPictureItem = function (template, iteration) {
  var item = template.cloneNode(true);
  item.querySelector('img').src = gallery[iteration].url;
  item.querySelector('.picture__stat--likes').textContent = gallery[iteration].likes;
  item.querySelector('.picture__stat--comments').textContent = gallery[iteration].comments.length;

  return item;
};

// создание массива всех изображений других пользователей
var createPictureList = function (gallery) {
  var fragment = document.createDocumentFragment();
  var template = document.querySelector('#picture').content;

  for (var i = 0; i < gallery.length; i++) {
    var picture = createPictureItem(template, i);
    fragment.appendChild(picture);
  }

  return fragment;
};

// отрисовка всех изображений других пользователей
var renderPictureList = function (fragment) {
  var pictures = document.querySelector('.pictures');
  pictures.appendChild(fragment);
};

// заполнение всех данных Большого фото
var createBigPictureProperties = function (bigPicture) {
  bigPicture.querySelector('.big-picture__img > img').src = gallery[0].url;
  bigPicture.querySelector('.likes-count').textContent = gallery[0].likes;
  bigPicture.querySelector('.social__caption').textContent = gallery[0].description;
  bigPicture.querySelector('.comments-count').textContent = gallery[0].comments.length;
};

// скрывает элементы в блоке коментариев
var hiddenElementComments = function (bigPicture, className) {
  bigPicture.querySelector('.' + className).classList.add('visually-hidden');
};

// отрисовка всех данных других пользователей в Большое фото
var renderBigPictureText = function (gallery) {
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var listComments = createComments(gallery[0].comments[0]);

  bigPicture.classList.remove('hidden');
  hiddenElementComments(bigPicture, 'social__comment-count');
  hiddenElementComments(bigPicture, 'social__comment-loadmore');

  createBigPictureProperties(bigPicture);

  socialComments.appendChild(listComments);
};

// создание блока комментария
var createComments = function (text) {
  var сomment = createCommentElement('li', ['social__comment', 'social__comment--text'], text);
  var avatarComment = createCommentElement('img', ['social__picture']);

  сomment.insertAdjacentElement('afterbegin', avatarComment);

  return сomment;
};

// создание одного элемента блока комментариев
var createCommentElement = function (tagName, className, text) {
  var element = document.createElement(tagName);

  for (var i = 0; i < className.length; i++) {
    element.classList.add(className[i]);
  }

  if (text) {
    element.textContent = text;
  }

  if (tagName === 'img') {
    element.src = 'img/avatar-' + randomInteger(1,6) + '.svg';
    element.alt = 'Аватар комментатора фотографии';
    element.width='35';
    element.height='35';
  }

  return element;
};

var gallery = createPictureBase();
var fragmentPicture = createPictureList(gallery);
renderPictureList(fragmentPicture);
renderBigPictureText(gallery);
