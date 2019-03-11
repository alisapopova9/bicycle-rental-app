const CARD_NUM_LENGTH = 16;
let invalidData = [0, 0, 0];
const ERROR_MESSAGES = {
  isEmpty: "Поле не должно быть пустым",
  notNumber: "Поле должно содержать только числовое значение",
  notNumbers: "Поле должно содержать только два числовых значения",
  invalidCardNumLength: "Номер карты должен состоять из 16 цифр",
  invalidCvvLength: "CVV-код должен состоять из 3 цифр",
  invalidDateFormat: "Некорректный формат даты",
  invalidMonthValue: "Несуществующий номер месяца",
  notDoubleDigitDateFormat: "Не двузначный формат даты",
  invalidYearValue: "Карта недействительна",
  invalidCvvValue: "Некорректное значение cvv",
  invalidCardNumValue: "Некорректное значение номера карты"
};

/**
 * Add event listeners
 */
function init() {
  const inputsArea = document.getElementById('card-req__input-area');
  inputsArea.addEventListener('blur', dataValidation, true);
  inputsArea.addEventListener('focus', tooltipHandler, true);
  inputsArea.addEventListener('submit', submitValidation, true);
}

/**
 * Invoke validation function of the card data input
 * And check what was returned:
 * If it's error, then generate the error tooltip and mark error position (needs for submit)
 * If it's not, then hide the error tooltip, unmark error position and set valid input value
 * @param event Data input blur event
 */
function dataValidation(event) {
  const elem = event.target;
  let status;

  switch (elem.id) {
    case 'card-num':
      status = cardNumberValidation(elem.value);
      break;
    case 'validity':
      status = cardDateValidation(elem.value);
      break;
    case 'cvv':
      status = cvvValidation(elem.value);
      break;
  }

  if (isError(status)) {
    setErrorPosition(elem.id);
    renderError(getTooltipId(elem.id), status, elem.id);
  }
  else {
    hideError(getTooltipId(elem.id), elem.id);
    removeErrorPosition(elem.id);
    elem.value = status;
  }
}

/**
 * Card number validation
 * @param            value Input value from user
 * @returns {String}       Formatted valid card number value or error
 */
function cardNumberValidation(value) {
  let cardNum = value.replace(/\s+/g,'');

  if (isNaN(cardNum)) {
    return ERROR_MESSAGES.notNumber;
  }

  if (cardNum.length !== CARD_NUM_LENGTH  && cardNum.length > 0) {
    return ERROR_MESSAGES.invalidCardNumLength;
  }

  if (cardNum < 0) {
    return ERROR_MESSAGES.invalidCardNumValue;
  }
  return formatCardNum(cardNum);
}

/**
 * Card date validation
 * @param            value Input value from user
 * @returns {String}       Formatted valid card date value or error
 */
function cardDateValidation(value) {
  let month, year;

  if (!value.includes('/') && !value.includes(' ') && value !== '') {
    if (isNaN(value)) {
      return ERROR_MESSAGES.notNumber;
    }
    if (value.length !== 4 && value !== '') {
      return ERROR_MESSAGES.invalidDateFormat;
    }
    let valueContent = value.match(/.{1,2}/g);
    month = valueContent[0];
    year = valueContent[1];
  }
  if (value.includes('/')) {
    value = value.split('/');
    if(value.some(isNaN)) {
      return ERROR_MESSAGES.notNumbers;
    }
    if (value.length !== 2) {
      return ERROR_MESSAGES.invalidDateFormat;
    }
    month = value[0];
    year = value[1];
  }
  if (value.includes(' ')) {
    value = value.split(' ');
    if(value.some(isNaN)) {
      return ERROR_MESSAGES.notNumbers;
    }
    if (value.length !== 2) {
      return ERROR_MESSAGES.invalidDateFormat;
    }
    month = value[0];
    year = value[1];
  }

  if (value !== '' && (month.length !== 2 || year.length !== 2)) {
    return ERROR_MESSAGES.notDoubleDigitDateFormat;
  }
  if (value !== '' && month <= 0 || month > 12) {
    return ERROR_MESSAGES.invalidMonthValue;
  }

  let today = new Date();
  let yyyy = today.getFullYear();
  if (!isValidDate(month, getFullYearFromCard(year, yyyy)) && value !== '') {
    return ERROR_MESSAGES.invalidYearValue;
  }

  if (value !== '')
    return month + '/' + year;
  else return '';
}

/**
 * Card cvv validation
 * @param            value Input value from user
 * @returns {String}       Formatted valid card cvv value or error
 */
function cvvValidation(value) {
  if (isNaN(value)) {
    return ERROR_MESSAGES.notNumber;
  }

  if (value < 0) {
    return ERROR_MESSAGES.invalidCvvValue;
  }

  if (value.length !== 3 && value !== '') {
    return ERROR_MESSAGES.invalidCvvLength;
  }

  if (value !== '') {
    return value;
  }
  return '';
}

/**
 * Check inputs values to post it in database or not
 * @param event Submit value
 * @returns {boolean}
 */
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

  if (invalidData.some(data => data === 1))
    return false;

    let options = {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      number: cardNum.value,
      date: validity.value,
      cvv: cvv.value,
    }),
    credentials: 'include',
  };
    fetch('/api/card-requisites', options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Запрос завершился неуспешно: ${response.status} ${response.statusText}`);
        }
        else {
          window.location.href = document.referrer;
        }
      })
      .catch(error => {
        console.error(error);
      });
}

/**
 * Show error tooltip beside current input block
 * @param tooltipId Tooltip block id
 * @param status Error text
 * @param elemId Input block id
 */
function renderError(tooltipId, status, elemId) {
  const tooltip = document.getElementById(tooltipId);
  const currentElem = document.getElementById(elemId);

  tooltip.classList.remove("hidden");
  tooltip.innerText = status;

  currentElem.style.borderColor = 'red';
}

/**
 * Hide error tooltip beside current input block
 * @param tooltipId Tooltip block id
 * @param elem Input block id
 */
function hideError(tooltipId, elem) {
  const tooltip = document.getElementById(tooltipId);
  const currentElem = document.getElementById(elem);

  tooltip.classList.add("hidden");
  currentElem.style.borderColor = '#CECECE';
}

/**
 * Get tooltip block id by input block id
 * @param            elem Input block id
 * @returns {string}      Error tooltip id
 */
function getTooltipId(elem) {
  switch(elem) {
    case 'card-num':
      return 'error-1';
    case 'validity':
      return 'error-2';
    case 'cvv':
      return 'error-3';
  }
}

/**
 * Set in which input block error was fired
 * @param elem Input block id
 */
function setErrorPosition(elem) {
  switch(elem) {
    case 'card-num':
      invalidData[0] = 1;
      break;
    case 'validity':
      invalidData[1] = 1;
      break;
    case 'cvv':
      invalidData[2] = 1;
      break;
  }
}

/**
 * Remove fact of input error
 * @param elem Input block id
 */
function removeErrorPosition(elem) {
  switch(elem) {
    case 'card-num':
      invalidData[0] = 0;
      break;
    case 'validity':
      invalidData[1] = 0;
      break;
    case 'cvv':
      invalidData[2] = 0;
      break;
  }
}

/**
 * Separate card number value by space
 * @param            value Valid card number value
 * @returns {string}       Formatted card number value
 */
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

/**
 * Check if string in error list
 * @param value String
 * @returns {boolean}
 */
function isError(value) {
  for (let prop in ERROR_MESSAGES) {
    if (ERROR_MESSAGES[prop] === value)
      return true;
  }
  return false;
}

/**
 * Translate two-digit year format to four-digit format
 * @param value Two-digit year format
 * @param currentYear Current year value
 * @returns {string} Four-digit year value
 */
function getFullYearFromCard(value, currentYear) {
  let tmp = currentYear.toString();
  if (value >= 0 && value <= parseInt(tmp.substring(tmp.length - 2, tmp.length)) + 5) {
    return '20' + value;
  }
    return '19' + value;
}

/**
 * Check if card still valid
 * @param month
 * @param year
 * @returns {boolean}
 */
function isValidDate(month, year) {
  let today = new Date();

  let expirationDate = new Date();
  expirationDate.setFullYear(parseInt(year), month - 1);
  return expirationDate >= today;
}

/**
 * Hide error tooltip by input focus event
 * @param event Input ficus event
 */
function tooltipHandler(event) {
  const elem = event.target;

  if (elem.nodeName === 'INPUT')
    hideError(getTooltipId(elem.id), elem.id);
}

document.addEventListener('DOMContentLoaded', init);
