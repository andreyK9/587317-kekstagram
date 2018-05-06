'use strict';

(function () {
  var currentFilter;
  var DEFAULT_FILTER = 'filter-recommended';
  var filterGroup = document.querySelector('.img-filters');
  var filterform = document.querySelector('.img-filters__form');
  var activeClass = 'img-filters__button--active';
  var filterType = {popular: true, discussed: false};
  var filter = {
    'filter-recommended': function () {
      return window.gallery;
    },
    'filter-popular': function () {
      return getSortedPhotos(filterType.popular);
    },
    'filter-discussed': function () {
      return getSortedPhotos(filterType.discussed);
    },
    'filter-random': function () {
      var resultArr = window.gallery.slice();
      return shuffle(resultArr);
    }
  };

  // генерирует случайное число от -0.5 до 0.5
  var getCompareRandom = function () {
    return Math.random() - 0.5;
  };

  // перемешивает массив
  var shuffle = function (arr) {
    return arr.sort(getCompareRandom);
  };

  var render = function (className) {
    filterform.querySelector('.' + activeClass).classList.remove(activeClass);
    filterform.querySelector('#' + className).classList.add(activeClass);
    filterGroup.classList.remove('img-filters--inactive');
  };

  var getSortedPhotos = function (likes) {
    var resultArr = window.gallery.slice();
    resultArr.sort(function (left, right) {
      var rankDiff;
      if (likes) {
        rankDiff = right.likes - left.likes;
      } else {
        rankDiff = right.comments.length - left.comments.length;
      }
      return rankDiff;
    });
    return resultArr;
  };

  var changeFilter = function () {
    while (window.pictures.block.children[2]) {
      window.pictures.block.removeChild(window.pictures.block.children[2]);
    }
    var resultArr = filter[currentFilter]();
    window.pictures.renderGallery(resultArr);
    window.preview.addListener(resultArr);
  };

  window.filter = {
    addListener: function () {
      render(DEFAULT_FILTER);
      filterform.addEventListener('click', function (evt) {
        filterform.querySelector('.' + activeClass).classList.remove(activeClass);
        evt.target.classList.add(activeClass);
        currentFilter = evt.target.id;

        window.debounce(changeFilter);
      });
    }
  };
})();
