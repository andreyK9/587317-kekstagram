'use strict';
var scaleFeature = {MAX_LENGTH: 100, MIN_LENGTH: 0, maxCoord: null, minCoord: null};
(function () {
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
    insert.cssText = getFilterSaturation(filterGroup[modif], result);
  };

  var getFilterSaturation = function (filter, value) {
    return 'filter: ' + filter.filter + '(' + filter.getValue(value) + (filter.unit ? filter.unit : '') + ')';
  };

  var onEffectSaturationTouch = function (evt) {
    evt.preventDefault();
    scaleFeature.maxCoord = scaleFeature.maxCoord ? scaleFeature.maxCoord : evt.clientX;
    scaleFeature.minCoord = scaleFeature.minCoord ? scaleFeature.minCoord : scaleFeature.maxCoord - line.clientWidth;

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

  pin.addEventListener('mousedown', onEffectSaturationTouch);
})();
