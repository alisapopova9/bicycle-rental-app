function howManyDigits(value) {
  let digitsCnt = 0;
  for (let i = 0; i < value.length; i++) {
    digitsCnt += isNaN(value[i]) ? 0 : 1;
  }
  return digitsCnt;
}

function dataValidation(event) {
  let currentElement = event.target;

  switch (currentElement.id) {
    case 'card-num':
      cardNumberValidate(currentElement.value);
  }
}

function cardNumberValidate(cardDateNumber) {
    const CARD_NUM_LENGHT = 16;
    let value = this.value.replace(/\s+/g,'');
    const error = document.getElementById("error-1");
    const submit = document.getElementById("submit-card-req");

    function howManyDigits(value) {
      let digitsCnt = 0;
      for (let i = 0; i < value.length; i++) {
        digitsCnt += isNaN(value[i]) ? 0 : 1;
      }
      return digitsCnt;
    }
    function formatCardNum() {
      let i = 0;
      while (i !== CARD_NUM_LENGHT - 3) {

      }
    }

    if (isNaN(value) || howManyDigits() !== 16) {
      this.style.borderColor = "red";

      // here should be renderError

      if (error.classList.contains("hidden"))
        error.classList.remove('hidden');
      error.innerHTML = "Invalid card number value"
    }
    else {
      this.style.borderColor = "green";
      if (!error.classList.contains("hidden"))
        error.classList.add('hidden');
    }
}

// function setSpace() {
//   let value = this.value;
//   if (value.length % 4 === 0) {
//     this.value = value.match(new RegExp('.[1-9]{4}', 'g')).join(' ');
//   }
// }

function cardDateValidation(cardDateValue) {
}

function cvvValidate(cardCvvValue) {

}

function renderError(tooltipDataId, error, elem) {

}

function hideError(tooltipDataId, elem) {
  if (this.id === "card-num") {
    const error1 = document.getElementById("error-1");
    error1.classList.add("hidden");
  }
}

const cardNum = document.getElementById("card-num");
cardNum.addEventListener("blur", cardNumberValidate, true);
cardNum.addEventListener("input", hideError, true);
// cardNum.addEventListener("keyup", setSpace);
