const answers = {
  2: null,
  3: null,
  4: null,
  5: null
}

// Получаем кнопки вперёд
const btnNext = document.querySelectorAll('[data-nav="next"]');
// Перебираем все полученные кнопки
btnNext.forEach(function (btn) {
  // Вешаем событие click на кнопку
  btn.addEventListener('click', function () {
    // Находим родителя кнопки по data атрибуту data-card
    const thisCard = this.closest('[data-card]');
    // Получаем номер карточки
    const thisCardNumber = +thisCard.dataset.card;
    // Валидация карточек
    // Если карточка не требует валидации то переходим на следующую карточку
    // Проверка значения атрибута data-validate у карточки
    if (thisCard.dataset.validate === 'novalidate') {
      // Если true то переходим вперёд
      navigate('next', thisCard);
      // Функция обновления прогрессбара
      updateProgressBar('next', thisCardNumber)
    } else {
      // Запускаем функцию сохранения данных в объект answer
      // Первый параметр номер текущей карточки
      // Второй параметр функция сбора данных с номером карточки
      saveAnswer(thisCardNumber, gatherCardDate(thisCardNumber));
      // Валидация на заполненность
      if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
        // Если true то переходим вперёд
        navigate('next', thisCard);
         // Функция обновления прогрессбара
        updateProgressBar('next', thisCardNumber)
      } else {
        // Если false то выводим alert
        alert('Сдедайте ответ, прежде чем переходить далее.');
      }
    }
  });
});

// Получаем кнопки назад
const btnPrev = document.querySelectorAll('[data-nav="prev"]');
// Перебираем все полученные кнопки
btnPrev.forEach(function (btn) {
  // Вешаем событие клик на кнопку
  btn.addEventListener('click', function () {
    // Находим родителя кнопки по data атрибуту data-card
    const thisCard = this.closest('[data-card]');
    // Получаем номер карточки
    const thisCardNumber = +thisCard.dataset.card;
    // Фнкция для навигации вперёд или назад
    navigate('prev', thisCard);
    // Функция обновления прогрессбара
    updateProgressBar('prev', thisCardNumber)
  });
});

// Функция для навигации вперёд и назад
// Первый аргумент 'next' или 'prev'. Второй аргумент текущая карточка
function navigate(direction, thisCard) {
  // Получаем номер текущей карточки
  const thisCardNumber = +thisCard.dataset.card;
  let nextCard;
  if (direction === 'next') {
    // К номеру текущей карточки прибавляем 1
    nextCard = thisCardNumber + 1;
  } else if (direction === 'prev') {
    // От номера текущей карточки отнимаем 1
    nextCard = thisCardNumber - 1;
  }
  // Скрываем текущую карточку классом hidden
  thisCard.classList.add('hidden');
  // Показываем предыдущую карточку убрав класс hidden
  document.querySelector(`[data-card="${nextCard}"]`).classList.remove('hidden');
}

// Функция сбора заполненных данных с карточек
function gatherCardDate(number) {
  // Массив для занисения данный из выбранной radio
  const result = [];
  // Находим карточку по номеру и data-атрибуту
  const currentCard = document.querySelector(`[data-card="${number}"]`);
  // Находим вопрос текущей карточки
  const question = currentCard.querySelector('[data-question]').innerText;
  // Находим все radio текущей карточки
  const radioValues = currentCard.querySelectorAll('[type="radio"]');
  // Перебираем полученные radio
  radioValues.forEach(function (radio) {
    // Если радиокнопка выбрана
    if (radio.checked) {
      // Заносим name и value выбранной radio в массив result
      result.push({
        name: radio.name,
        value: radio.value
      });
    }
  });
  // Находим все checkbox текущей карточки
  const checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
  // Перебираем полученные checkbox
  checkBoxValues.forEach(function (checkBox) {
    // Если checkbox выбран
    if (checkBox.checked) {
      // Заносим name и value выбранного checkbox в массив result
      result.push({
        value: checkBox.value,
        name: checkBox.name
      });
    }
  });
  // Находим все input текущей карточки
  const inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
  // Перебираем найденные input
  inputValues.forEach(function (input) {
    // Если input не пустой
    if (input.value.trim() != '') {
      // Заносим name и value input в массив result
      result.push({
        name: input.name,
        value: input.value
      });
    }
  });
  // Формируем объект из полученных данных
  const data = {
    question: question,
    answer: result
  };
  return data;
}

// Функция записи ответа в объект с ответами
function saveAnswer(number, data) {
  answers[number] = data;
}

// Функция проверки на заполненность
function isFilled(number) {
  if (answers[number].answer.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Функция для проверки email
function validateEmail(email) {
  const pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
  return pattern.test(email);
}

// Проверка на заполненность required checkbox и input с email
function checkOnRequired(number) {
  // Получаем текущую карточку по номеру карточки
  const currentCard = document.querySelector(`[data-card="${number}"]`);
  // Получаем input выбранной карточки с атрибутом required
  const requiredFields = currentCard.querySelectorAll('[required]');
  let isValidArray = [];
  // Перебираем полученные input
  requiredFields.forEach(function (item) {
    // Если получили checkbox и он не выбран
    if (item.type == 'checkbox' && item.checked == false) {
      // Записываем в массив false
      isValidArray.push(false);
      // Если получили email
    } else if (item.type == 'email') {
      // Проверяем на корректный email
      if ((validateEmail(item.value))) {
        // Записываем в массив
        isValidArray.push(true);
      } else {
        // Записываем в массив
        isValidArray.push(false);
      }
    }
  });
  // Если в массиве нет значения false
  if (isValidArray.indexOf(false) == -1) {
    return true;
  } else {
    return false;
  }
}

// Подсветка рамки у radio
// Получаем группу radio и перебираем
document.querySelectorAll('.radio-group').forEach(function(item) {
  // На каждую radio вешаем событие click
  item.addEventListener('click', function(event) {
    // Возвращает блок по которому был клик до ближайшего родителя label
    const label = event.target.closest('label')
    // Если клик был внутри label
    if (label) {
      // Получаем ближайшего родителя с классом radio-group, выбираем у этого родителя все вложенные label и перебираем их
      label.closest('.radio-group').querySelectorAll('label').forEach(function(item) {
        // Удаляем активный класс у всех label
        item.classList.remove('radio-block--active');
      });
      // Добавляем активный класс к label по которому был клик
      label.classList.add('radio-block--active');
    }
  });
});

// Подсветка рамки у checkbox
// Внутри label с классом checkbox-block находим все input с type="checkbox" и перебираем их
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item) {
  // Вешаем событие change
  item.addEventListener('change', function() {
    // Если checkbox выбран
    if (item.checked) {
      // Добавляем ближащему родителю label класс checkbox-block--active
      item.closest('label').classList.add('checkbox-block--active');
    } else {
      // Удаляем у ближайшего родителя label класс checkbox-block--active
      item.closest('label').classList.remove('checkbox-block--active');
    }
  });
});

// Отображение прогресс бара
// Принимает первый параметр 'next' или 'prev' второй параметр номер текущей карточки
function updateProgressBar(direction, cardNumber) {
  // Находим все div с атрибутом data-card и получаем их количество
  const cardsTotalNumber = document.querySelectorAll('[data-card]').length;
  // Если в параметр direction приходит next
  if (direction == 'next') {
    // К номеру текущей карточке прибавляем 1
    cardNumber = cardNumber + 1;
    // Если в параметр direction приходит prev
  } else if (direction == 'prev') {
    // От номера текущей карточке отнимаем 1
    cardNumber = cardNumber - 1;
  }

  // Расчёт процентов прохождения
  const progress = ((cardNumber * 100) / cardsTotalNumber).toFixed();
  // Находим в текущей карточке блок с прогрессбаром
  const progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector('.progress');
  // Если прогрессбар есть
  if (progressBar) {
    // Записываем значение const progress в тег strong
    progressBar.querySelector('.progress__label strong').innerText = `${progress}%`;
    // Меняем стиль у полоски прогресса
    progressBar.querySelector('.progress__line-bar').style = `width: ${progress}%`;
  }
}
