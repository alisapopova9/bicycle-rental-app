const koaRouter = require('koa-router');
const moment = require('moment');

const User = require('./models/users');
const Pointers = require('./models/pointers');
const Bike = require('./models/bike');
const Order = require('./models/order');

const {
  getLinkWithBackUrl,
  checkAuth,
  getPagination,
  redirectToBackUrl
} = require('./utils');

const router = new koaRouter();

router
	.get('/', mainPage)

	.get('/catalog/:pointId?', catalogList)
	.get('/map', cardPage)

	.get('/login', loginPage)
  .post('/login', loginPage)
	.get('/registration', registrationPage)
	.post('/registration', registrationPage)
  .get('/logout', logout)

	.use(checkAuth)

	.get('/lk', lkPage)
	.get('/order/:bikeId', bikeOrder)
	.get('/card-requisites', cardRequisites);

async function mainPage(ctx) {
	await ctx.render('index', {
		title: 'Сервис бронирования велосипедов',
    isLogin: Boolean(ctx.session.userId)
	});
}

async function catalogList(ctx) {
	const { pointId } = ctx.params;

  let pointInfo = null;
  let bikeListFull = [];

	if (pointId) {
		const point = new Pointers(pointId);
		pointInfo = await point.getPoint();
		if (!pointInfo) ctx.throw(404);

		bikeListFull = await Bike.getListByIds(pointInfo.bikesList);
	} else {
		bikeListFull = await Bike.getList();
	}

	bikeListFull = bikeListFull.filter(bike => {
		return Boolean(bike) && !bike.isRented;
	});
  const { hasMore, itemsInPage: bikeList } = getPagination(bikeListFull);

  let pointersList = await Pointers.getList();
  if (pointInfo) {
    pointersList = pointersList.map(point => {
      if (point._id === pointInfo._id) return { ...point, isActive: true };
      return point;
    });
  }

	let title = 'Каталог велосипедов в аренду';
	if (pointId) title = `Каталог велосипедов в аренду по
		адресу ${pointInfo.address}`;

	await ctx.render('catalog', {
		title,
		pointInfo,
		bikeList,
    isLogin: Boolean(ctx.session.userId),
    pointersList,
    hasMore
	});
}

async function cardPage(ctx) {
	await ctx.render('map', {
		title: 'Местоположение пунктов выдачи',
    isLogin: Boolean(ctx.session.userId)
	});
}

async function bikeOrder(ctx) {
	const userId = ctx.session.userId;

	const user = new User(userId);
	await user.getUser();

	const cardRequisites = user.cardRequisites;
	if (cardRequisites) {
		const { bikeId } = ctx.params;
		const bike = new Bike(bikeId);
		const bikeInfo = await bike.getBike();
		await bike.setRented(true);

		const order = new Order();
		await order.create(userId, bikeId);

		const point = new Pointers();
		await point.findWithBike(bikeId);
		await point.removeBike(bikeId);

		const orderCode = order.getCode();

		await ctx.render('order', {
			title: `Аренда велосипеда ${bikeInfo.name}`,
			orderCode,
			bikeInfo,
      isLogin: Boolean(ctx.session.userId)
		})
	} else {
		ctx.status = 303;
		ctx.redirect(getLinkWithBackUrl('/card-requisites', ctx.request));
	}
}

async function cardRequisites(ctx){
  const userId = ctx.session.userId;

	const user = new User(userId);
	await user.getUser();

	const cardRequisites = user.cardRequisites;

	await ctx.render('card-requisites', {
		title: 'Данные карты для оплаты',
		cardRequisites,
    isLogin: Boolean(ctx.session.userId)
	});
}

async function loginPage(ctx) {
  const { login, password } = ctx.request.body;

  let isLoginError = false;

  if (ctx.method === 'POST') {
    const user = new User();
    const userId = await user.getUser(login, password);

  	if (userId) {
  		ctx.session.userId = userId;
      redirectToBackUrl(ctx, '/lk');
      return;
    } else {
      isLoginError = true;
  	}
  }

	await ctx.render('login', {
		title: 'Авторизация',
    isLoginError,
    login,
    isLogin: Boolean(ctx.session.userId)
	});
}

async function registrationPage(ctx) {
  const { login, password1, password2 } = ctx.request.body;
  let errors = null;

  if (ctx.method === 'POST') {
    errors = getRegistrationErrors(login, password1, password2);
    if (!errors)  {
      const user = new User();
    	ctx.session.userId = await user.create(login, password1);

      redirectToBackUrl(ctx, '/lk');
      return;
    }
  }

	await ctx.render('registation', {
		title: 'Регистрация',
    login,
    isLogin: Boolean(ctx.session.userId),
    ...errors
	});
}

function getRegistrationErrors(login, password1, password2) {
  if (!login || !password1 || !password2) {
    return {
      isEmptyValuesError: true
    };
  }
  if (password1 !== password2) {
    return {
      notEqualPasswordsError: true
    };
  }
}

async function lkPage(ctx) {
	const userId = ctx.session.userId;

	const user = new User(userId);
	await user.getUser();
	const cardRequisites = user.cardRequisites;
	const login = user.login;

	const orders = new Order();
	const orderList = await orders.getOrders(userId);

	const bikeIdList = orderList.map(order => order.bikeId);
	const bikeList = await Bike.getListByIds(bikeIdList);

	for (let i in orderList) {
		orderList[i].bike = bikeList[i];
		const totalTime = moment().diff(orderList[i].time, 'minutes');
		orderList[i].totalCost = totalTime * orderList[i].bike.cost;
    orderList[i].formatTotalTime = formatTotalTime(totalTime);
	}

	const isDevelop = ctx.cookies.get('isDevelop');

	await ctx.render('lk', {
		title: 'Личный кабинет',
		login,
		cardRequisites,
		orderList,
		isDevelop,
    isLogin: Boolean(ctx.session.userId)
	});
}

function formatTotalTime(totalTime) {
  const time = '';

  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;
  const formatingMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formatingMinutes}`;
}

async function logout(ctx) {
  if (ctx.session.userId) {
    delete ctx.session.userId;
  }
  ctx.status = 303;
  ctx.redirect('/');
}

module.exports = router.routes();
