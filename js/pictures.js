'use strict';

var LIKES_RANGE = [15, 200];
var PICTURE_RANGE = 25;
var ARRAY_COMMENT = [
  'В целом всё неплохо. Но не всё.',
  'Всё отлично!',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше'
];
var ARRAY_DESCRIPTION = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

// генерирует случайное число от -0.5 до 0.5
var getCompareRandom = function () {
  return Math.random() - 0.5;
};

// возращает случайное натуральное число в диапазоне от min до max
var getRandomInteger = function (min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
};

// перемешивает массив
var shuffle = function (arr) {
  return arr.sort(getCompareRandom);
};

// копирует часть массива
var getCopyArray = function (arr, max) {
  if (!max) {
    return arr.slice();
  }

  return arr.slice(0, max);
};

// создает обьект фото
var createFotoObject = function (value) {
  return {
    url: 'photos/' + value + '.jpg',
    likes: getRandomInteger(LIKES_RANGE[0], LIKES_RANGE[1]),
    comments: getCopyArray(shuffle(ARRAY_COMMENT), getRandomInteger(1, 4)),
    description: shuffle(ARRAY_DESCRIPTION)[0]
  };
};

// заполняет галерею данными
var fillGalaryData = function () {
  var arr = [];

  for (var i = 1; i <= PICTURE_RANGE; i++) {
    arr.push(createFotoObject(i));
  }

  return arr;
};

// заполнение данными изображения
var getFotoTemplate = function (object) {
  var temp = document.querySelector('#picture').content.cloneNode(true);

  temp.querySelector('img').src = object.url;
  temp.querySelector('.picture__stat--likes').textContent = object.likes;
  temp.querySelector('.picture__stat--comments').textContent = object.comments.length;

  return temp;
};

// заполнение шаблона изображений
var fillGalaryTemplate = function (arr) {
  var template = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var foto = getFotoTemplate(arr[i]);
    template.appendChild(foto);
  }

  return template;
};

// отрисовка галереи
var renderGalary = function (template) {
  var block = document.querySelector('.pictures');
  block.appendChild(template);
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

// заполнение данными Большого фото
var fillBigFoto = function (element, object) {
  element.querySelector('.big-picture__img > img').src = object.url;
  element.querySelector('.likes-count').textContent = object.likes;
  element.querySelector('.social__caption').textContent = object.description;
  element.querySelector('.comments-count').textContent = object.comments.length;
};

// создание блока комментария
var createComment = function (text) {
  var li = createTag('li', ['social__comment', 'social__comment--text'], text);
  var img = createAvatarIcon(['social__picture']);

  li.insertAdjacentElement('afterbegin', img);
  return li;
};

// отрисовка Большого фото
var renderBigfoto = function (object) {
  var bigPicture = document.querySelector('.big-picture');
  var commentBlock = document.querySelector('.social__comments');
  var comment = createComment(object.comments[0]);

  fillBigFoto(bigPicture, object);
  commentBlock.appendChild(comment);

  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.social__comment-loadmore').classList.add('visually-hidden');
  bigPicture.classList.remove('hidden');
};

var galleryData = fillGalaryData();
var galaryTemplate = fillGalaryTemplate(galleryData);
renderGalary(galaryTemplate);
renderBigfoto(galleryData[0]);
