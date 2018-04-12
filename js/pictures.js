'use strict';

var LIKES_RANGE = [15, 200];
var COMMENTS_RANGE = [1, 4];
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
var copyArray = function (arr, max) {
  if(!max) {
    return arr.slice();
  }

  return arr.slice(0, max);
}

// создает параметры фото
var createFotoObject = function (value) {
  return {
      url: 'photos/' + value + '.jpg',
      likes: getRandomInteger(LIKES_RANGE[0], LIKES_RANGE[1]),
      comments: copyArray(shuffle(ARRAY_COMMENT), getRandomInteger(1,4)),
      description: shuffle(ARRAY_DESCRIPTION)[0]
    }
};

// заполняет галерею параметрами
var fillGalary = function () {
  var arr = [];

  for (var i = 1; i <= PICTURE_RANGE; i++) {
    arr.push(createFotoObject(i));
  }

  return arr;
};

// заполнение данными одного изображения
var createFotoElement = function (object) {
  var temp = document.querySelector('#picture').content.cloneNode(true);

  temp.querySelector('img').src = object.url;
  temp.querySelector('.picture__stat--likes').textContent = object.likes;
  temp.querySelector('.picture__stat--comments').textContent = object.comments.length;

  return temp;
};

// создание шаблона изображений
var fillFotoTemplate = function (arr) {
  var template = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var foto = createFotoElement(arr[i]);
    template.appendChild(foto);
  }

  return template;
};

// отрисовка всех изображений
var renderGalary = function (template) {
  var block = document.querySelector('.pictures');
  block.appendChild(template);
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

  createBigPictureProperties(bigPicture);
  socialComments.appendChild(listComments);

  bigPicture.classList.remove('hidden');
  hiddenElementComments(bigPicture, 'social__comment-count');
  hiddenElementComments(bigPicture, 'social__comment-loadmore');
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
    element.src = 'img/avatar-' + getRandomInteger(1, 6) + '.svg';
    element.alt = 'Аватар комментатора фотографии';
    element.width = '35';
    element.height = '35';
  }

  return element;
};

var gallery = fillGalary();
var fotoTemplate = fillFotoTemplate(gallery);
renderGalary(fotoTemplate);
renderBigPictureText(gallery);
