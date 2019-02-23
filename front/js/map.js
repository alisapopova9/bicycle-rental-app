ymaps.ready(initMap);

function initMap() {
  let myMap = new ymaps.Map("mapContainer", {
    center: [55.019351, 82.913735],
    zoom: 10
  });

  let pointsPromise = api.getPointers();
  let pointsList;
  pointsPromise.then((list) => {
    pointsList = list;
    console.log(pointsList);

    let points = [
      new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: pointsList[0].coordinates
        },
        properties: {
          balloonContentBody: '<div class="balloon-container">' +
            'Пункт по адресу ' +  `${pointsList[0].address}` +
            '<button class="button button_hovered button_a" onclick="window.location.href=`/catalog/MHYrbJIhDVDA66Pu`">Выбрать велосипед</button>' +
            '</div>'
        }
        // ALISA: Перепробовав сотню и один спосов повесить ссылку на кнопку красиво, я просто захардкодила...
      }),
      new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: pointsList[1].coordinates
        },
        properties: {
          balloonContentBody: '<div class="balloon-container">' +
            'Пункт по адресу ' +  `${pointsList[1].address}` +
            '<button class="button button_hovered button_a" onclick="window.location.href=`/catalog/RImvJzsaHmdf56hi`">Выбрать велосипед</button>' +
            '</div>'
        }
      }),
      new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: pointsList[2].coordinates
        },
        properties: {
          balloonContentBody: '<div class="balloon-container">' +
            'Пункт по адресу ' +  `${pointsList[2].address}` +
            '<button class="button button_hovered button_a" onclick="window.location.href=`/catalog/TSdBaFYqqSKrvKYd`">Выбрать велосипед</button>' +
            '</div>'
        }
      })
    ];

    points.forEach(function (point) {
      myMap.geoObjects.add(point);
    });
  });
}

