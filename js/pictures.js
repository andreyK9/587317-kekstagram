'use strict';

var TEXT_MAX_LENGTH = 140;
var hashOption = {MIN_LENGTH: 1, MAX_LENGTH: 20};
var HASH_GROUP_MAX_LENGTH = 4;
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
var imgUpload = document.querySelector('.img-upload');
var uploadFile = imgUpload.querySelector('#upload-file');
var imgOverlay = imgUpload.querySelector('.img-upload__overlay');
var uploadCancel = imgOverlay.querySelector('#upload-cancel');
var btnUp = imgOverlay.querySelector('.resize__control--plus');
var btnDown = imgOverlay.querySelector('.resize__control--minus');
var resizeControl = imgOverlay.querySelector('.resize__control--value');
var imgPreview = imgOverlay.querySelector('.img-upload__preview > img');
var effectsImg = imgOverlay.querySelector('.effects__list');
var hashTags = imgOverlay.querySelector('.text__hashtags');
var imgUploadText = imgOverlay.querySelector('.text__description');
var scale = imgOverlay.querySelector('.scale');
var scalePin = scale.querySelector('.scale__pin');
var scaleLevel = scale.querySelector('.scale__level');
var scaleValue = scale.querySelector('.scale__value');
var bigPicture = document.querySelector('.big-picture');
var cancel = bigPicture.querySelector('.big-picture__cancel');


var setLevelSaturation = function (value) {
  scalePin.style.left = value + '%';
  scaleLevel.style.width = value + '%';
  scaleValue.defaultValue = value;
};

var togleScaleSaturation = function () {
  if (imgPreview.classList.value === 'effects__preview--none') {
    scale.classList.add('hidden');
  } else {
    scale.classList.remove('hidden');
  }
};

var closePopup = function () {
  imgOverlay.classList.add('hidden');
  uploadFile.value = '';
  imgPreview.style.filter = '';
  imgPreview.setAttribute('class', 'effects__preview--none');

  imgOverlay.removeEventListener('change', manageEvent);
  imgOverlay.removeEventListener('click', manageEvent);
  effectsImg.removeEventListener('click', setEffectType);
  // scaleLine.removeEventListener('mouseup', onEffectSaturationSet);
  document.removeEventListener('keydown', manageEvent);
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

var setEffectType = function (evt) {
  var value = evt.target.value;
  imgPreview.style.filter = '';
  scale.maxCoord = null;
  scale.minCoord = null;
  setLevelSaturation(DEFAULT_POSITION);
  imgPreview.setAttribute('class', 'effects__preview--' + value);
  togleScaleSaturation();
};

var isArrayUnique = function (str) {
  var result = false;
  var arr = str.toLowerCase().split(' ');
  arr.forEach(function (item, iteration) {
    var repeat = arr.indexOf(item);
    if (repeat >= 0) {
      if (repeat !== iteration) {
        result = true;
      }
    }
  });
  return result;
};

var checkHashTags = function () {
  if (!hashTags.value) {
    return false;
  }

  var hashList = hashTags.value.split(' ');
  hashList.forEach(function (hash, iteration) {
    if (hash[0] !== '#') {
      hashTags.setCustomValidity('Хэш-тег начинается с символа # (решётка)');
      return true;
    } else if (hash.length === hashOption.MIN_LENGTH) {
      hashTags.setCustomValidity('Хеш-тег не может состоять только из одной решётки');
      return true;
    } else if (hash.length > hashOption.MAX_LENGTH) {
      hashTags.setCustomValidity('Максимальная длина одного хэш-тега 20 символов');
      return true;
    } else if (isArrayUnique(hashTags.value)) {
      hashTags.setCustomValidity('Хеш-теги не должны повторяться');
      return true;
    } else if (iteration > HASH_GROUP_MAX_LENGTH) {
      hashTags.setCustomValidity('Хеш-тегов не должно быть больше 5');
      return true;
    } else {
      hashTags.setCustomValidity('');
      return true;
    }
  });
  return true;
};

var checksText = function () {
  if (!imgUploadText.value) {
    return false;
  }

  if (imgUploadText.value.length > TEXT_MAX_LENGTH) {
    imgUploadText.setCustomValidity('Длина комментария не может составлять больше 140 символов');
  } else {
    imgUploadText.setCustomValidity('');
  }
  return true;
};

var manageEvent = function (evt) {
  if (evt.keyCode === ESC_CODE) {
    if (evt.target !== hashTags && evt.target !== imgUploadText) {
      closePopup();
    }
  } else {
    if (!evt.keyCode) {
      if (evt.target === uploadCancel) {
        closePopup();
      } else if (evt.target === btnUp) {
        setSizeUp();
      } else if (evt.target === btnDown) {
        setSizeDown();
      } else if (evt.target === hashTags) {
        checkHashTags();
      } else if (evt.target === imgUploadText) {
        checksText();
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

  imgOverlay.addEventListener('change', manageEvent);
  imgOverlay.addEventListener('click', manageEvent);
  effectsImg.addEventListener('click', setEffectType);
  // scaleLine.addEventListener('mouseup', onEffectSaturationSet);
  document.addEventListener('keydown', manageEvent);
});
