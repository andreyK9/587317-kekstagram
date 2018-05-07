'use strict';

(function () {
  var errorLink = document.querySelector('.error__links');
  var REPEAT = 0;

  var onErrorLinkClick = function (evt) {
    if (evt.target === errorLink.children[REPEAT]) {
      evt.preventDefault();
      window.form.imgOverlay.classList.remove('hidden');
    } else {
      window.form.uploadFile.value = '';
    }
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      var URL = 'https://js.dump.academy/kekstagram/data';
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });
      xhr.timeout = 10000;
      xhr.open('GET', URL);
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var URL = 'https://js.dump.academy/kekstagram';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError();
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });
      xhr.open('POST', URL);
      xhr.send(data);
    },
    errorMessage: function () {
      window.form.openError();
      errorLink.addEventListener('click', onErrorLinkClick);
    }
  };
})();
