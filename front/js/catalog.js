'use strict';
function init() {
  let page = 1;
  // вызови функцию loadCatalog для загрузки первой страницы каталога

  if (document.URL.split("/").length > 4) {
    loadCatalog(page);
    page++;
  }
  // Реализуй и установи обработчик нажатия на кнопку "Загрузить еще"
  const buttonParent = document.getElementById("loadMore");
  const button = buttonParent.querySelector("button");
  button.addEventListener('click', function() {
    disableButtonLoadMore();
    loadCatalog(page);
    page++;
    enableButtonLoadMore();
  });
}

function loadCatalog(page) {
  // Здесь необходимо сделать загрузку каталога (api.getBikes)
  // и передать полученные данные в функции appendCatalog и showButtonLoadMore
  const id = getPointId();
  let itemsPromise = api.getBikes(id, page);
  let list, hasMore;
  itemsPromise.then((bikesList) => {
    list = bikesList.bikesList;
    hasMore = bikesList.hasMore;
    appendCatalog(list);
    showButtonLoadMore(hasMore);
  });

}

function appendCatalog(items) {
  // отрисуй велосипеды из items в блоке <div id="bikeList">
  const parent = document.getElementById("bikeList");
  const newUl = document.createElement("ul");
  newUl.classList.add("items-list");
  parent.appendChild(newUl);
  items.forEach(function (item) {
    let bikeNode = document.createElement("li");
    bikeNode.classList.add("bike");

    let bikeImageContainer = document.createElement("div");
    let bikeImage = document.createElement("img");
    let bikeName = document.createElement("a");
    let bikeCost = document.createElement("div");
    let rentButton = document.createElement("button");

    bikeImageContainer.className += "bike__img-container";

    bikeImage.src = `../images/${item.img}`;
    bikeImage.classList.add("bike__img");
    bikeImageContainer.appendChild(bikeImage);

    bikeName.innerText = item.name;
    bikeName.classList.add("bike__name");

    bikeCost.classList.add("bike__cost");
    bikeCost.innerText = `Стоимость за час - ${item.cost} ₽`;

    rentButton.className += "button button_bigger button_hovered";
    rentButton.innerText = "Арендовать";

    bikeNode.appendChild(bikeImageContainer);
    bikeNode.appendChild(bikeName);
    bikeNode.appendChild(bikeCost);
    bikeNode.appendChild(rentButton);

    parent.querySelector("ul").appendChild(bikeNode);
  });
}

function showButtonLoadMore(hasMore) {
  // если hasMore == true, то показывай кнопку #loadMore
  // иначе скрывай
  const loadMoreBlock = document.getElementById("loadMore");
  if (hasMore) {
    loadMoreBlock.classList.remove("hidden");
  }
  else {
    loadMoreBlock.classList.add("hidden");
  }
}

function disableButtonLoadMore() {
  // заблокируй кнопку "загрузить еще"
  const loadMoreButton = document.getElementById("loadMore").querySelector("button");
  loadMoreButton.disabled = true;
}

function enableButtonLoadMore() {
  // разблокируй кнопку "загрузить еще"
  const loadMoreButton = document.getElementById("loadMore").querySelector("button");
  loadMoreButton.disabled = false;
}

  function getPointId() {
  // сделай определение id выбранного пункта проката
    const url = document.URL;
    return url.substring(url.lastIndexOf("/") + 1);
}

document.addEventListener('DOMContentLoaded', init);
