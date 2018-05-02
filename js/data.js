'use strict';
(function () {
  var LIKES_RANGE = [15, 200];
  var PICTURE_RANGE = 25;
  var createData = {
    COMMENT: [
      'В целом всё неплохо. Но не всё.',
      'Всё отлично!',
      'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
      'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше'
    ],
    DESCRIPTION: [
      'Тестим новую камеру!',
      'Затусили с друзьями на море',
      'Как же круто тут кормят',
      'Отдыхаем...',
      'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
      'Вот это тачка!'
    ]
  };

  // генерирует случайное число от -0.5 до 0.5
  var getCompareRandom = function () {
    return Math.random() - 0.5;
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
  var createPhotoObject = function (value) {
    return {
      url: 'photos/' + value + '.jpg',
      likes: window.data.getRandomInteger(LIKES_RANGE[0], LIKES_RANGE[1]),
      comments: getCopyArray(shuffle(createData.COMMENT), window.data.getRandomInteger(1, 4)),
      description: shuffle(createData.DESCRIPTION)[0]
    };
  };

  // заполняет галерею данными
  window.data = {
    getRandomInteger: function (min, max) {
      return Math.round(min - 0.5 + Math.random() * (max - min + 1));
    },
    fillGalleryData: function () {
      var arr = [];
      for (var i = 1; i <= PICTURE_RANGE; i++) {
        arr.push(createPhotoObject(i));
      }
      return arr;
    }
  };
})();
