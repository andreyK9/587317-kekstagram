'use strict';

(function () {
  var scaleFeature = {MAX_LENGTH: 100, MIN_LENGTH: 0, maxCoord: null, minCoord: null};
  var TEXT_MAX_LENGTH = 140;
  var START_POSITION = 18;
  var DELETE_PERCENT = -1;
  var hashOption = {MIN_LENGTH: 1, MAX_LENGTH: 20};
  var HASH_GROUP_MAX_LENGTH = 4;
  var RESIZE_STEP = 25;
  var ESC_CODE = 27;
  var DEFAULT_POSITION = 100;
  var imgUpload = document.querySelector('.img-upload');
  var imgForm = document.querySelector('.img-upload__form');
  var imgOverlay = imgUpload.querySelector('.img-upload__overlay');
  var uploadCancel = imgOverlay.querySelector('#upload-cancel');
  var btnUp = imgOverlay.querySelector('.resize__control--plus');
  var btnDown = imgOverlay.querySelector('.resize__control--minus');
  var uploadFile = imgUpload.querySelector('#upload-file');
  var resizeControl = imgOverlay.querySelector('.resize__control--value');
  var effectsImg = imgOverlay.querySelector('.effects__list');
  var radioBtn = imgOverlay.querySelector('.effects__radio');
  var hashTags = imgOverlay.querySelector('.text__hashtags');
  var imgUploadText = imgOverlay.querySelector('.text__description');
  var imgError = document.querySelector('.img-upload__message--error');
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
    var modification = imgPreview.classList.value.slice(START_POSITION);
    var insert = imgPreview.style;
    insert.filter = getFilterSaturation(filterGroup[modification], result);
  };

  var getFilterSaturation = function (current, value) {
    return current.filter + '(' + current.getValue(value) + (current.unit ? current.unit : '') + ')';
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

  var onFormSubmitTouch = function (evt) {
    window.backend.save(new FormData(imgForm), function () {
      closePopup();
    }, window.backend.errorMessage);
    evt.preventDefault();
  };

  var onEffectSaturationTouch = function (evt) {
    evt.preventDefault();
    scaleFeature.maxCoord = scaleFeature.maxCoord ? scaleFeature.maxCoord : evt.clientX;
    scaleFeature.minCoord = scaleFeature.minCoord ? scaleFeature.minCoord : scaleFeature.maxCoord - line.clientWidth;

    var onEffectSaturationMove = function (moveEvt) {
      var levelSaturation = getLevelSaturation(moveEvt);
      setLevelSaturation(levelSaturation);
      setFilterSaturation(levelSaturation);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onEffectSaturationMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onEffectSaturationMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var toggleScaleSaturation = function () {
    if (imgPreview.classList.value === 'effects__preview--none') {
      scaleBlock.classList.add('hidden');
    } else {
      scaleBlock.classList.remove('hidden');
    }
  };

  var deleteListener = function () {
    imgOverlay.removeEventListener('change', manageEvent);
    imgOverlay.removeEventListener('click', manageEvent);
    effectsImg.removeEventListener('click', setEffectType);
    imgForm.removeEventListener('submit', onFormSubmitTouch);
    pin.removeEventListener('mousedown', onEffectSaturationTouch);
    document.removeEventListener('keydown', manageEvent);
  };

  var setDefault = function () {
    imgPreview.style.filter = '';
    imgPreview.style.transform = '';
    hashTags.value = '';
    imgUploadText.value = '';
    setLevelSaturation(DEFAULT_POSITION);
    setResize(DEFAULT_POSITION);
    imgPreview.setAttribute('class', 'effects__preview--none');
  };

  var closePopup = function () {
    uploadFile.value = '';
    imgError.classList.add('hidden');
    imgOverlay.classList.add('hidden');
    deleteListener();
  };

  var openError = function () {
    imgError.classList.remove('hidden');
    imgOverlay.classList.add('hidden');
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
    var value = +resizeControl.value.slice(0, DELETE_PERCENT);
    if (value > 75) {
      return value;
    }
    setResize(value + RESIZE_STEP);
    return true;
  };

  var setSizeDown = function () {
    var value = +resizeControl.value.slice(0, DELETE_PERCENT);
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
    toggleScaleSaturation();
  };

  var isArrayUnique = function (str) {
    var result = false;
    var tags = str.toLowerCase().split(' ');
    tags.forEach(function (item, iteration) {
      var repeat = tags.indexOf(item);
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

    var tags = hashTags.value.split(' ');
    tags.forEach(function (hash, iteration) {
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
    ESC_CODE: ESC_CODE,
    imgOverlay: imgOverlay,
    uploadFile: uploadFile,
    closePopup: closePopup,
    openError: openError,
    addListener: function () {
      uploadFile.addEventListener('change', function () {
        radioBtn.checked = true;
        setDefault();
        scaleBlock.classList.add('hidden');
        imgOverlay.classList.remove('hidden');
        imgOverlay.addEventListener('change', manageEvent);
        imgOverlay.addEventListener('click', manageEvent);
        effectsImg.addEventListener('click', setEffectType);
        imgForm.addEventListener('submit', onFormSubmitTouch);
        pin.addEventListener('mousedown', onEffectSaturationTouch);
        document.addEventListener('keydown', manageEvent);
      });
    }
  };
})();
