'use strict';

(function () {
  var scaleFeature = {MAX_LENGTH: 100, MIN_LENGTH: 0, maxCoord: null, minCoord: null};
  var TEXT_MAX_LENGTH = 140;
  var hashOption = {MIN_LENGTH: 1, MAX_LENGTH: 20};
  var HASH_GROUP_MAX_LENGTH = 4;
  var RESIZE_STEP = 25;
  var ESC_CODE = 27;
  var DEFAULT_POSITION = 100;
  var imgUpload = document.querySelector('.img-upload');
  var imgOverlay = imgUpload.querySelector('.img-upload__overlay');
  var uploadCancel = imgOverlay.querySelector('#upload-cancel');
  var btnUp = imgOverlay.querySelector('.resize__control--plus');
  var btnDown = imgOverlay.querySelector('.resize__control--minus');
  var uploadFile = imgUpload.querySelector('#upload-file');
  var resizeControl = imgOverlay.querySelector('.resize__control--value');
  var effectsImg = imgOverlay.querySelector('.effects__list');
  var hashTags = imgOverlay.querySelector('.text__hashtags');
  var imgUploadText = imgOverlay.querySelector('.text__description');
  var scaleBlock = document.querySelector('.scale');
  var line = scaleBlock.querySelector('.scale__line');
  var pin = line.querySelector('.scale__pin');
  var level = scaleBlock.querySelector('.scale__level');
  var scaleValue = scaleBlock.querySelector('.scale__value');
  var imgPreview = document.querySelector('.img-upload__preview > img');
  var filterGroup = {
    chrome: {
      filter: 'grayscale',
      unit: null,
      getValue: function (value) {
        return value / 100;
      }
    },
    sepia: {
      filter: 'sepia',
      unit: null,
      getValue: function (value) {
        return value / 100;
      }
    },
    marvin: {
      filter: 'invert',
      unit: '%',
      getValue: function (value) {
        return value;
      }
    },
    phobos: {
      filter: 'blur',
      unit: 'px',
      getValue: function (value) {
        return value / 100 * 3;
      }
    },
    heat: {
      filter: 'brightness',
      unit: null,
      getValue: function (value) {
        return value / 100 * 3;
      }
    }
  };

  var setFilterSaturation = function (result) {
    var modif = imgPreview.classList.value.split('--').pop();
    var insert = imgPreview.style;
    insert.filter = getFilterSaturation(filterGroup[modif], result);
  };

  var getFilterSaturation = function (filter, value) {
    return filter.filter + '(' + filter.getValue(value) + (filter.unit ? filter.unit : '') + ')';
  };

  var getLevelSaturation = function (event) {
    var currentCoord = event.clientX - scaleFeature.minCoord;
    var persent = line.clientWidth / 100;
    var result = Math.round(currentCoord / persent);

    if (result > 100) {
      return scaleFeature.MAX_LENGTH;
    } else if (result < 0) {
      return scaleFeature.MIN_LENGTH;
    }
    return result;
  };

  var setLevelSaturation = function (value) {
    pin.style.left = value + '%';
    level.style.width = value + '%';
    scaleValue.defaultValue = value;
  };

  var onEffectSaturationTouch = function (evt) {
    evt.preventDefault();
    scaleFeature.maxCoord = scaleFeature.maxCoord ? scaleFeature.maxCoord : evt.clientX;
    scaleFeature.minCoord = scaleFeature.minCoord ? scaleFeature.minCoord : scaleFeature.maxCoord - line.clientWidth;

    var onEffectSaturationMove = function (moveEvt) {
      var saturationValue = getLevelSaturation(moveEvt);
      setLevelSaturation(saturationValue);
      setFilterSaturation(saturationValue);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onEffectSaturationMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onEffectSaturationMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var togleScaleSaturation = function () {
    if (imgPreview.classList.value === 'effects__preview--none') {
      scaleBlock.classList.add('hidden');
    } else {
      scaleBlock.classList.remove('hidden');
    }
  };

  var closePopup = function () {
    imgOverlay.classList.add('hidden');
    uploadFile.value = '';
    imgPreview.style.filter = '';
    imgPreview.style.transform = '';
    imgPreview.setAttribute('class', 'effects__preview--none');

    imgOverlay.removeEventListener('change', manageEvent);
    imgOverlay.removeEventListener('click', manageEvent);
    effectsImg.removeEventListener('click', setEffectType);
    pin.removeEventListener('mousedown', onEffectSaturationTouch);
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
    scaleFeature.maxCoord = null;
    scaleFeature.minCoord = null;
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

  window.form = {
    addListener: function () {
      uploadFile.addEventListener('change', function () {
        scaleBlock.classList.add('hidden');
        imgOverlay.classList.remove('hidden');

        imgOverlay.addEventListener('change', manageEvent);
        imgOverlay.addEventListener('click', manageEvent);
        effectsImg.addEventListener('click', setEffectType);
        pin.addEventListener('mousedown', onEffectSaturationTouch);
        document.addEventListener('keydown', manageEvent);
      });
    }
  };
})();
