# Приложение "Прокат велосипедов"

## О приложении

Представим, что вы работаете над стартапом, вы хотите создать в Новосибирске автоматизированную сеть по прокату велосипедов, работающую без продавцов. Велосипед можно взять и сдать в любом пункте проката. Чтобы взять велосипед, нужно только ввести код.

В приложении пользователь выбирает пункт выдачи, велосипед, и получает код. Естественно, кто попало это сделать не может, нужно авторизоваться и заполнить данные о банковской карте для оплаты.

## Страницы приложения

/ - главная

/catalog - каталог всех доступных велосипедов

/catalog/:pointId - каталог доступных велосипедов в конкретном пункте pointId

/map - страница с картой

/login - авторизация

/registration - регистрация

/logout

/card-requsites - реквизиты карты

/lk - личный кабинет

/order/:bikeId - аренда велосипеда bikeId


## Начало работы

* npm i
* Файлы "pointers" и "bikes" нужно скопировать в папку "server/models/db"
* npm run start

Макеты - https://www.figma.com/file/OAYtuZYjTYFZ9zIuit26gpaE/%D0%9F%D1%80%D0%BE%D0%BA%D0%B0%D1%82
