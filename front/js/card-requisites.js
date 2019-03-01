const CARD_NUM_LENGTH = 16;
const ERROR_MESSAGES = {
  isEmpty: "Поле не должно быть пустым",
  notNumber: "Поле должно содержать только числовое значение",
  notNumbers: "Поле должно содержать только два числовых значения",
  invalidCardNumLength: "Номер карты должен состоять из 16 цифр",
  invalidCvvLength: "CVV-код должен состоять из 3 цифр",
  invalidDateFormat: "Некорректный формат даты",
  invalidMonthValue: "Несуществующий номер месяца",
  notDoubleDigitMonthFormat: "Не двузначный формат месяца",
  notDoubleDigitYearFormat: "Не двузначный формат года",
  invalidYearValue: "Карта недействительна",
};

function howManyDigits(value) {
  let digitsCnt = 0;
  for (let i = 0; i < value.length; i++) {
    digitsCnt += isNaN(value[i]) ? 0 : 1;
  }
  return digitsCnt;
}

function dataValidation(event) {
  let currentElement = event.target;
  let status;

  switch (currentElement.id) {
    case 'card-num':
      status = cardNumberValidate(currentElement.value);
      if (status !== -1) {
        currentElement.value = status;
      }
      break;
    case 'validity':
      status = cardDateValidation(currentElement.value);
      if (status !== -1) {
        currentElement.value = status;
      }
      break;
    case 'cvv':
      cvvValidate(currentElement.value);
      break;
  }
}

function cardNumberValidate(cardNumber) {
    let value = cardNumber.replace(/\s+/g,'');

    function formatCardNum(value) {
      let formatted = '';
      if (value === '')
        return '';
      for (let i = 0; i < CARD_NUM_LENGTH; i++) {
        if(i % 4 === 0 && i !== 0) {
          formatted += ' ';
        }
        formatted += value[i];
      }
      return formatted;
    }

    if (isNaN(value)) {
      renderError('error-1', ERROR_MESSAGES.notNumber, 'card-num');
      return -1;
    }
    if (howManyDigits(value) !== 16 && howManyDigits(value) > 0) {
      renderError('error-1', ERROR_MESSAGES.invalidCardNumLength, 'card-num');
      return -1;
    }

    return formatCardNum(value);
}

function cardDateValidation(cardDateValue) {
  function getFullYearFromCard(value, currentYear) {
    let tmp = currentYear.toString();
    if (value >= 0 && value <= parseInt(tmp.substring(tmp.length - 2, tmp.length)) + 5) {
      return '20' + value;
    }
      return '19' + value;
  }
  function isValid(month, year) {
    let today = new Date();

    let expirationDate = new Date();
    expirationDate.setFullYear(parseInt(year), month - 1);
    return expirationDate >= today;

  }
  let value = cardDateValue;

  if (value.indexOf('/') !== -1) {
    value = value.replace(/\s+/g,'');
    value = value.split('/');
  }
  else
    value = value.split(/\s+/);

  if (value.length !== 2 && value[0] !== '') {
    renderError('error-2', ERROR_MESSAGES.invalidDateFormat, 'validity');
    return -1;
  }

  function isNotNumeric(currentValue) {
    return isNaN(currentValue);
  }
  if(value.some(isNotNumeric)) {
    renderError('error-2', ERROR_MESSAGES.notNumbers, 'validity');
    return -1;
  }

  let month = value[0];
  let year = value[1];

  if (value[0] !== '') {
    if (month <= 0 || month > 12) {
      renderError('error-2', ERROR_MESSAGES.invalidMonthValue, 'validity');
      return -1;
    }

    if (month.length === 1) {
      renderError('error-2', ERROR_MESSAGES.notDoubleDigitMonthFormat, 'validity');
      return -1;
    }
    if (year.length !== 2) {
      renderError('error-2', ERROR_MESSAGES.notDoubleDigitYearFormat, 'validity');
      return -1;
    }

    let today = new Date();
    let yyyy = today.getFullYear();
    if (!isValid(month, getFullYearFromCard(year, yyyy)) && value[0] !== '') {
      renderError('error-2', ERROR_MESSAGES.invalidYearValue, 'validity');
      return -1;
    }

    return month + '/' + year;
  }

  return '';
}

function cvvValidate(cardCvvValue) {
  let value = cardCvvValue;

  if(isNaN(value)) {
    renderError('error-3', ERROR_MESSAGES.notNumber, 'cvv');
    return;
  }

  if (value.length !== 3 && value !== '') {
    renderError('error-3', ERROR_MESSAGES.invalidCvvLength, 'cvv');
    return;
  }
}

function renderError(tooltipDataId, error, elem) {
  const tooltip = document.getElementById(tooltipDataId);
  const currentElem = document.getElementById(elem);

  tooltip.classList.remove("hidden");
  tooltip.innerText = error;

  currentElem.style.borderColor = 'red';
}

function tooltipHandler(event) {
  switch (event.target.id) {
    case 'card-num':
      hideError('error-1', event.target.id);
      break;
    case 'validity':
      hideError('error-2', event.target.id);
      break;
    case 'cvv':
      hideError('error-3', event.target.id);
      break;
  }
}

function hideError(tooltipDataId, elem) {
  const tooltip = document.getElementById(tooltipDataId);
  const currentElem = document.getElementById(elem);

  tooltip.classList.add("hidden");
  currentElem.style.borderColor = '#CECECE';
}

function submitValidation(event) {
  event.preventDefault();

  let cardNum = document.getElementById('card-num');
  if (cardNum.value === '') {
    renderError('error-1', ERROR_MESSAGES.isEmpty, 'card-num');
  }

  let validity = document.getElementById('validity');
  if (validity.value === '') {
    renderError('error-2', ERROR_MESSAGES.isEmpty, 'validity');
  }

  let cvv = document.getElementById('cvv');
  if (cvv.value === '') {
    renderError('error-3', ERROR_MESSAGES.isEmpty, 'cvv');
  }
}

const inputsArea = document.getElementById('card-req__input-area');
inputsArea.addEventListener('blur', dataValidation, true);
inputsArea.addEventListener('focus', tooltipHandler, true);
inputsArea.addEventListener('submit', submitValidation, true);
