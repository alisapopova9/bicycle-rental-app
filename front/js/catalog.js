'use strict';
function init() {
  let page = 1;
  // вызови функцию loadCatalog для загрузки первой страницы каталога
  loadCatalog(page);
  page++;
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
  const url = document.URL;
  const id = url.substring(url.lastIndexOf("/") + 1);
  console.log(id);
  let itemsPromise = api.getBikes(id, page);
  let list, hasMore;
  itemsPromise.then((bikesList) => {
    console.log(bikesList);
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
  parent.appendChild(newUl);
  items.forEach(function (item) {
    let bikeNode = document.createElement("li");
    let bikeImage = document.createElement("img");
    let bikeName = document.createElement("h4");
    bikeImage.src = `../images/${item.img}`;
    bikeImage.width = "250";
    bikeName.innerText = item.name;
    bikeNode.appendChild(bikeImage);
    bikeNode.appendChild(bikeName);
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
  return ''
}

// const delay = ms => new Promise(resolve => setTimeout(resolve, 3000));

document.addEventListener('DOMContentLoaded', init);
