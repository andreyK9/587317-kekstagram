'use strict';

var LIKES_RANGE = [15, 200];
var PICTURE_RANGE = 25;
var RESIZE_STEP = 25;
var ESC_CODE = 27;
var DEFAULT_POSITION = 100;
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
var filterGroup = {
  chrome: {
    filter: 'filter: grayscale(',
    unit: ')',
    getValue: function (value) {
      return value / 100;
    }
  },
  sepia: {
    filter: 'filter: sepia(',
    unit: ')',
    getValue: function (value) {
      return value / 100;
    }
  },
  marvin: {
    filter: 'filter: invert(',
    unit: '%)',
    getValue: function (value) {
      return value;
    }
  },
  phobos: {
    filter: 'filter: blur(',
    unit: 'px)',
    getValue: function (value) {
      return value / 100 * 3;
    }
  },
  heat: {
    filter: 'filter: brightness(',
    unit: ')',
    getValue: function (value) {
      return value / 100 * 3;
    }
  }
};
var imgUpload = document.querySelector('.img-upload');
var uploadFile = imgUpload.querySelector('#upload-file');
var imgOverlay = imgUpload.querySelector('.img-upload__overlay');
var uploadCancel = imgOverlay.querySelector('#upload-cancel');
var btnUp = imgOverlay.querySelector('.resize__control--plus');
var btnDown = imgOverlay.querySelector('.resize__control--minus');
var resizeControl = imgOverlay.querySelector('.resize__control--value');
var imgPreview = imgOverlay.querySelector('.img-upload__preview > img');
var effectsImg = imgOverlay.querySelector('.effects__list');
var scale = imgOverlay.querySelector('.scale');
var scalePin = scale.querySelector('.scale__pin');
var scaleLine = scale.querySelector('.scale__line');
var scaleLevel = scale.querySelector('.scale__level');
var scaleValue = scale.querySelector('.scale__value');
var bigPicture = document.querySelector('.big-picture');
var cancel = bigPicture.querySelector('.big-picture__cancel');


var saturEffect = function (event) {
  var x = event.offsetX;
  var persent = scaleLine.clientWidth / 100;
  return Math.round(x / persent);
};

var setScale = function (value) {
  scalePin.style.left = value + '%';
  scaleLevel.style.width = value + '%';
  scaleValue.value = value;
};

var togleScale = function () {
  if (imgPreview.classList.value === 'effects__preview--none') {
    scale.classList.add('hidden');
  } else {
    scale.classList.remove('hidden');
  }
};

var changeScale = function (evt) {
  var result = saturEffect(evt);
  setScale(result);
  setFilter(result);
};

var getFilter = function (filter, value) {
  return filter.filter + filter.getValue(value) + filter.unit;
};

var setFilter = function (result) {
  var modif = imgPreview.classList.value.split('--').pop();
  var insert = imgPreview.style;
  insert.cssText = getFilter(filterGroup[modif], result);
};

var closePopup = function () {
  imgOverlay.classList.add('hidden');
  uploadFile.value = '';

  effectsImg.removeEventListener('click', setEffect);
  scaleLine.removeEventListener('mouseup', changeScale);
  imgOverlay.removeEventListener('click', managEvent);
  document.removeEventListener('keydown', managEvent);
};

var setResize = function (value) {
  resizeControl.value = value + '%';
  if (value === 100) {
    imgPreview.style.transform = '';
    return false;
  }
  imgPreview.style.transform = 'scale(' + value / 100 + ')';
  return true;
};

var setSizeUp = function () {
  var value = +resizeControl.value.slice(0, -1);
  if (value > 75) {
    return value;
  }
  setResize(value + RESIZE_STEP);
  return true;
};

var setSizeDown = function () {
  var value = +resizeControl.value.slice(0, -1);
  if (value < 50) {
    return value;
  }
  setResize(value - RESIZE_STEP);
  return true;
};

var setEffect = function (evt) {
  var value = evt.target.value;
  imgPreview.style.filter = '';
  setScale(DEFAULT_POSITION);
  imgPreview.setAttribute('class', 'effects__preview--' + value);
  togleScale();
};

var managEvent = function (evt) {
  if (evt.keyCode === ESC_CODE) {
    closePopup();
  } else {
    if (!evt.keyCode) {
      if (evt.target === uploadCancel) {
        closePopup();
      } else if (evt.target === btnUp) {
        setSizeUp();
      } else if (evt.target === btnDown) {
        setSizeDown();
      }
    }
  }
};

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
var createPhotoObject = function (value) {
  return {
    url: 'photos/' + value + '.jpg',
    likes: getRandomInteger(LIKES_RANGE[0], LIKES_RANGE[1]),
    comments: getCopyArray(shuffle(ARRAY_COMMENT), getRandomInteger(1, 4)),
    description: shuffle(ARRAY_DESCRIPTION)[0]
  };
};

// заполняет галерею данными
var fillGalleryData = function () {
  var arr = [];

  for (var i = 1; i <= PICTURE_RANGE; i++) {
    arr.push(createPhotoObject(i));
  }

  return arr;
};

// заполнение данными изображения
var getPhotoTemplate = function (object) {
  var temp = document.querySelector('#picture').content.cloneNode(true);

  temp.querySelector('img').src = object.url;
  temp.querySelector('.picture__stat--likes').textContent = object.likes;
  temp.querySelector('.picture__stat--comments').textContent = object.comments.length;

  return temp;
};

// заполнение шаблона изображений
var fillGalleryTemplate = function (arr) {
  var template = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var photo = getPhotoTemplate(arr[i]);
    photo.querySelector('.picture__link').dataset.number = i;
    template.appendChild(photo);
  }

  return template;
};

// отрисовка галереи
var renderGallery = function (template) {
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
var fillBigPhoto = function (element, object) {
  element.querySelector('.big-picture__img > img').src = object.url;
  element.querySelector('.likes-count').textContent = object.likes;
  element.querySelector('.social__caption').textContent = object.description;
  element.querySelector('.comments-count').textContent = object.comments.length;
};

var getCommentList = function (object) {
  var template = document.createDocumentFragment();
  for (var i = 0; i < object.comments.length; i++) {
    template.appendChild(createLi(object.comments[i]));
  }
  return template;
};

// создание блока комментария
var createLi = function (text) {
  var li = createTag('li', ['social__comment', 'social__comment--text'], text);
  var img = createAvatarIcon(['social__picture']);

  li.insertAdjacentElement('afterbegin', img);
  return li;
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

var galleryData = fillGalleryData();
var galleryTemplate = fillGalleryTemplate(galleryData);
renderGallery(galleryTemplate);

var pictureLink = document.querySelectorAll('.picture__link');

for (var i = 0; i < pictureLink.length; i++) {
  pictureLink[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    if (evt.target.parentElement.dataset.number) {
      renderBigPhoto(galleryData[evt.target.parentElement.dataset.number]);
    }

    document.addEventListener('keydown', closePicture);
    cancel.addEventListener('click', closePicture);
  });
}

uploadFile.addEventListener('change', function () {
  scale.classList.add('hidden');
  imgOverlay.classList.remove('hidden');

  imgOverlay.addEventListener('click', managEvent);
  effectsImg.addEventListener('click', setEffect);
  scaleLine.addEventListener('mouseup', changeScale);
  document.addEventListener('keydown', managEvent);
});
