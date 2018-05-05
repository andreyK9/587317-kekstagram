'use strict';
(function () {
  var currentFilter;
  var filterGroup = document.querySelector('.img-filters');
  var filterform = document.querySelector('.img-filters__form');
  var activeClass = 'img-filters__button--active';
  var filter = {
    'filter-new': function () {
      return window.gallery;
    },
    'filter-popular': function () {
      return getPopular();
    },
    'filter-discussed': function () {
      return getDiscussed();
    }
  };
  filterform.querySelector('.' + activeClass).classList.remove(activeClass);
  filterform.querySelector('#filter-new').classList.add(activeClass);
  filterGroup.classList.remove('img-filters--inactive');

  var compareNumber = function (left, right) {
    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    } else {
      return 0;
    }
  };

  var getPopular = function () {
    var resultArr = window.gallery.slice();
    resultArr.sort(function (left, right) {
      var rankDiff = right.likes - left.likes;
      if (rankDiff === 0) {
        rankDiff = compareNumber(left.comments.length, right.comments.length);
      }
      return rankDiff;
    });
    return resultArr;
  };

  var getDiscussed = function () {
    var resultArr = window.gallery.slice();
    resultArr.sort(function (left, right) {
      var rankDiff = right.comments.length - left.comments.length;
      if (rankDiff === 0) {
        rankDiff = compareNumber(left.likes, right.likes);
      }
      return rankDiff;
    });
    return resultArr;
  };

  var changeFilter = function () {
    while (window.pictures.block.children[2]) {
      window.pictures.block.removeChild(window.pictures.block.children[2]);
    }
    window.pictures.renderGallery(filter[currentFilter]());
  };

  window.filter = function () {
    filterform.addEventListener('click', function (evt) {
      filterform.querySelector('.' + activeClass).classList.remove(activeClass);
      evt.target.classList.add(activeClass);
      currentFilter = evt.target.id;

      window.debounce(changeFilter);
    });
  };
})();
