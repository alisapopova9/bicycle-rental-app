'use strict';
function init() {
  // вызови функцию loadCatalog для загрузки первой страницы каталога

  // Реализуй и установи обработчик нажатия на кнопку "Загрузить еще"
}

function loadCatalog(page) {
  // Здесь необходимо сделать загрузку каталога (api.getBikes)
  // и передать полученные данные в функции appendCatalog и showButtonLoadMore
}

function appendCatalog(items) {
  // отрисуй велосипеды из items в блоке <div id="bikeList">
}

function showButtonLoadMore(hasMore) {
  // если hasMore == true, то показывай кнопку #loadMore
  // иначе скрывай
}

function disableButtonLoadMore() {
  // заблокируй кнопку "загрузить еще"
}

function enableButtonLoadMore() {
  // разблокируй кнопку "загрузить еще"
}

function getPointId() {
  // сделай определение id выбранного пункта проката
  return ''
}


document.addEventListener('DOMContentLoaded', init)
