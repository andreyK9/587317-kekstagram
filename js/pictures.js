/* eslint-disable require-jsdoc */
(function() {
  var mapType = {
    PROPERTY: 1,
    ATTRIBUTE: 2,
    STYLE: 3,
    FUNCTION: 4,
    NEXT_TEXT: 5,
  }
  
  main()

  function main() {
    const pictures = createRandomPictures(25)
    const pictureElements = []
    pictures.forEach((i) => {
      pictureElements.push(createPictureElement(i))
    })
    const pictureElementsContainer =
        document.querySelector('.pictures')
    appendChilds(pictureElementsContainer, pictureElements)

    fillBigPicture(pictures[0])
    document.querySelector('.big-picture').classList.remove('hidden')
  }

  function renderComments(comments, commentsContainer) {
    const commentElements = []
    comments.forEach((i) => {
      commentElements.push(createCommentElement(i, commentsContainer))
    })
    // очищаем commentsContainer от старых комментов-элементов и заполняем его
    // новыми, но в ситуации, когда комментов нет эта очистка могла бы привести
    // к потере шаблона коммента, т.к. таким шаблоном мы считаем первый по
    // счету коммент. К счастью в данном примере фото без комментов нет.
    if (comments.length === 0) {
      comments.push(createCommentElement({icon: '', text: ''}, commentsContainer))
      comments[0].classList.add('hidden')
    }
    removeChildNodes(commentsContainer, 0)
    
    appendChilds(commentsContainer, commentElements)
  }

  function appendChilds(element, childs) {
    const fragment = document.createDocumentFragment()
    childs.forEach((i) => {fragment.appendChild(i)})
    element.appendChild(fragment)
  }

  function createPictureElement(picture) {
    const ObjectElementMap = [
      {
        source: 'url',
        selector: '.picture__img',
        target: 'src',
        type: mapType.ATTRIBUTE,
      },
      {
        source: 'likes',
        selector: '.picture__stat--likes',
        target: 'textContent',
        type: mapType.PROPERTY,
      },
      {
        source: 'comments',
        selector: '.picture__stat--comments',
        target: mapGetLenght,
        type: mapType.FUNCTION,
      },
    ]
    const pictureElement =
        document.querySelector('#picture')
            .content.querySelector('a').cloneNode(true)
    mapObjectOnElement(picture, pictureElement, ObjectElementMap)
    return pictureElement
  }

  function fillBigPicture(picture) {
    const ObjectElementMap = [
      {
        source: 'url',
        selector: '.big-picture__img img',
        target: 'src',
        type: mapType.ATTRIBUTE,
      },
      {
        source: 'likes',
        selector: '.social__likes .likes-count',
        target: 'textContent',
        type: mapType.PROPERTY,
      },
      {
        source: 'comments',
        selector: '.social__comment-count .comments-count',
        target: mapGetLenght,
        type: mapType.FUNCTION,
      },
    ]
    const bigPicture = document.querySelector('.big-picture')
    mapObjectOnElement(picture, bigPicture, ObjectElementMap)

    bigPicture.querySelector('.social__comment-count')
        .classList.add('visually-hidden')
    bigPicture.querySelector('.social__comment-loadmore')
        .classList.add('visually-hidden')

    renderComments(
        picture.comments, bigPicture.querySelector('.social__comments'))
  }

  function createCommentElement(comment, commentsContainer) {
    const ObjectElementMap = [
      {
        source: 'icon',
        selector: '.social__picture',
        target: 'src',
        type: mapType.ATTRIBUTE,
      },
      {
        source: 'text',
        selector: '.social__picture',
        target: undefined,
        type: mapType.NEXT_TEXT,
      },
    ]
    const commentElement =
        commentsContainer.querySelector('.social__comment').cloneNode(true)
    mapObjectOnElement(comment, commentElement, ObjectElementMap)
    return commentElement;
  }

  function removeChildNodes(element, childIndex) {
    while (element.childNodes[childIndex]) {
      element.removeChild(element.lastChild)
    }
  }

  function mapObjectOnElement(object, element, map) {
    map.forEach((i) => {
      let e = element.querySelector(i.selector)
      if (i.source in object && e) {
        switch (i.type) {
          case mapType.PROPERTY:
            e[i.target] = object[i.source]
            break
          case mapType.ATTRIBUTE:
            e.setAttribute(i.target, object[i.source])
            break
          case mapType.STYLE:
            e.style += ' ' + i.target + ':' + object[i.source] + ';'
            break
          case mapType.FUNCTION:
            e.textContent = i.target(object[i.source])
            break
          case mapType.NEXT_TEXT:
            do {
              e = e.nextSibling
            // eslint-disable-next-line no-undef
            } while (e && e.nodeType !== Node.TEXT_NODE)
            e.textContent = object[i.source]
            break
          default:
            break
        }
      }
    })
  }

  function mapGetLenght(o) {
    return o.length
  }

  function createRandomPictures(picturesCount) {
    var result = []
    var urnd = randomUniqueInt(picturesCount)
    for (var i = 0; i < picturesCount; i++) {
      result.push(createRandomPicture(urnd))
    }
    return result;
  }

  function createRandomPicture(urlRandom) {
    return {
      url: 'photos/' + (urlRandom() + 1) + '.jpg',
      likes: randomLikes(),
      comments: randomComment(),
      description: randomDescription(),
    }
  }

  function randomUniqueInt(max) {
    // можно было сделать не функцию, а объект randomUniqueInt,
    // но захотелось так
    let values = []
    for (let i = 0; i < max; i++) {
      values.push(i)
    }
    return function cutRandomArrayElement() {
      const rndI = Math.floor(Math.random() * values.length)
      const result = values[rndI]
      // удаляем этот элемент из массива
      values = values.slice(0, rndI).concat(values.slice(rndI + 1))
      return result
    }
  }

  function randomLikes() {
    const minLikes = 15
    const maxLikes = 200
    return minLikes + Math.floor(
        Math.random() * (maxLikes - minLikes + 1)
    )
  }

  function randomComment() {
    const maxComments = 2
    const maxSentences = 2
    const maxSocialPic = 6
    const sentences = [
      'Всё отлично!',
      'В целом всё неплохо. Но не всё.',
      // eslint-disable-next-line max-len
      'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
      // eslint-disable-next-line max-len
      'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
      // eslint-disable-next-line max-len
      'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
      // eslint-disable-next-line max-len
      'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
    ]
    const result = []
    const commentsCount = Math.ceil(Math.random() * maxComments)
    for (let i = 0; i < commentsCount; i++) {
      // Собираем комментарий из предложений (начало)
      let commentText = ''
      const urnd = randomUniqueInt(sentences.length)
      const sentencesCount = Math.ceil(Math.random() * maxSentences)
      for (let j = 0; j < sentencesCount; j++) {
        if (commentText !== '') {
          commentText += ' '  
        }
        commentText += sentences[urnd()];
      }
      // Собираем комментарий из предложений (конец)
      result.push(
          {
            icon: 'img/avatar-' + Math.ceil(Math.random() * maxSocialPic) + '.svg',
            text: commentText,
          }
      )
    }
    return result
  }

  function randomDescription() {
    const descriptions = [
      'Тестим новую камеру!',
      'Затусили с друзьями на море',
      'Как же круто тут кормят',
      'Отдыхаем...',
      // eslint-disable-next-line max-len
      'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
      'Вот это тачка!',
    ]
    return getRandomArrayElement(descriptions)
  }

  function getRandomArrayElement(a) {
    return a[Math.floor(Math.random() * a.length)]
  }
}())
