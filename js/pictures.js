'use strict';

var LIKES_BEGIN = 15;
var LIKES_END = 200;
var COMMENTS_BEGIN = 1;
var COMMENTS_END = 4;

function compareRandom(a, b) {
  return Math.random() - 0.5;
};

var randomInteger = function (min, max) {
  return Math.round( min - 0.5 + Math.random() * (max - min + 1));
};

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

var createPictureBase = function () {
  var galery = [];

  for (var i = 1; i <= 25; i++) {
    var usersPhoto = {
      url : 'photos/' + i + '.jpg',
      likes : randomInteger(LIKES_BEGIN, LIKES_END),
      comments : randomComments(),
      description : randomDescription()
    };

    galery.push(usersPhoto);
  }

  return galery;
};

var createPictureItem = function (template, iteration) {
  var item = template.cloneNode(true);
  item.querySelector('img').src = galery[iteration].url;
  item.querySelector('.picture__stat--likes').textContent = galery[iteration].likes;
  item.querySelector('.picture__stat--comments').textContent = galery[iteration].comments.length;

  return item;
};

var createPictureList = function (galery) {
  var fragment = document.createDocumentFragment();
  var template = document.querySelector('#picture').content;

  for (var i = 0; i < galery.length; i++) {
    var picture = createPictureItem(template, i);
    fragment.appendChild(picture);
  }

  return fragment;
};

var renderPictureList = function (fragment) {
  var pictures = document.querySelector('.pictures');
  pictures.appendChild(fragment);
};

var renderBigPicture = function (galery) {
  var bigPicture = document.querySelector('.big-picture');
  var socialComments = document.querySelector('.social__comments');
  var listComments = createElement('li', ['social__comment', 'social__comment--text'], galery[0].comments[0]);
  var avatarComments = createElement('img', ['social__picture']);

  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.big-picture__img > img').src = galery[0].url;
  bigPicture.querySelector('.likes-count').textContent = galery[0].likes;
  var sterrr = bigPicture.querySelector('.social__caption').textContent = galery[0].description;
  bigPicture.querySelector('.comments-count').textContent = galery[0].comments.length;

  listComments.insertAdjacentElement('afterbegin', avatarComments);
  socialComments.appendChild(listComments);
};

var createElement = function (tagName, className, text) {
  var element = document.createElement(tagName);

  for (var i = 0; i < className.length; i++) {
    element.classList.add(className[i]);
  }

  if (text) {
    element.textContent = galery[0].comments[0];
  }

  if (tagName === 'img') {
    element.src = 'img/avatar-' + randomInteger(1,6) + '.svg';
    element.alt = 'Аватар комментатора фотографии';
    element.width='35';
    element.height='35';
  }

  return element;
};

var galery = createPictureBase();

var fragment = createPictureList(galery);

renderPictureList(fragment);

renderBigPicture(galery);
