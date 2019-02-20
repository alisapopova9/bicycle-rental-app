const koaRouter = require('koa-router');

const Pointers = require('./models/pointers');
const Order = require('./models/order');
const Bike = require('./models/bike');
const User = require('./models/users');

const { checkAuth, getPagination } = require('./utils');

const router = new koaRouter({
  prefix: '/api'
});

router
  .get('/pointers', pointersList)
  .get('/catalog/:pointId?', bikesList)

  .use(checkAuth)
  .delete('/order/:orderId', deleteOrder)
  .put('/card-requisites', updateCardRequisites);


async function pointersList(ctx) {
	const pointersList = await Pointers.getList();
	ctx.body = pointersList;
}

async function updateCardRequisites(ctx) {
  const userId = ctx.session.userId;
  const { date, number, cvv } = ctx.request.body;

  if (!date || !number || !cvv) {
    ctx.throw(400);
  }

  const user = new User(userId);
  try {
    await user.setCardRequisites({ date, number, cvv });
    ctx.status = 200;
  } catch (e) {
    ctx.throw();
  }

}

async function deleteOrder(ctx) {
  const { orderId } = ctx.params;

  const order = new Order(orderId);
  await order.getOrder();

  const pointList = await Pointers.getList();
  const i = getRandomIndex(pointList.length - 1);
  const point = new Pointers(pointList[i]._id);

  const bikeId = order.bikeId;
  await point.addBike(bikeId);

  const bike = new Bike(bikeId);
  await bike.setRented(false);

  await order.delete();

  ctx.status = 200;
}

async function bikesList(ctx) {
  const { pointId } = ctx.params;
  const { page } = ctx.request.query;

  let pointInfo = null;
  let bikesList = [];

	if (pointId) {
		const point = new Pointers(pointId);
		pointInfo = await point.getPoint();
		if (!pointInfo) ctx.throw(404);

		bikesList = await Bike.getListByIds(pointInfo.bikesList);
	} else {
		bikesList = await Bike.getList();
	}

	bikesList = bikesList.filter(bike => {
		return Boolean(bike) && !bike.isRented;
	});
  const {
    itemsInPage,
    hasMore
  } = getPagination(bikesList, page);
  bikesList = itemsInPage;

  ctx.body = {
    hasMore,
    bikesList
  };
  ctx.status = 200;
}

function getRandomIndex(length) {
  const randomNumber = Math.random() * length;
  return Math.round(randomNumber);
}

module.exports = router.routes();
