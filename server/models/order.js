const Datastore = require('nedb');

const db = new Datastore({filename : './server/models/db/order'});
db.loadDatabase();

class Order {
  constructor(orderId) {
    this.orderId = orderId;
  }
  async create(userId, bikeId) {
    const time = (new Date()).toISOString();
    return new Promise((resolve, reject) => {
      const id = db.insert({ userId, bikeId, time }, (err, newDoc) => {
        if (err) reject(err);

        this.orderId = newDoc._id;
        resolve(newDoc._id);
      });
    });
  }

  async getOrder() {
    return new Promise((resolve, reject) => {
      db.findOne({ _id: this.orderId }, (err, order) => {
        if (err) reject(err);

        if (!order) {
          resolve(order);
          return;
        }

        this.bikeId = order.bikeId;
        this.userId = order.userId;
        resolve(order);
      });
    });
  }

  async delete() {
    return new Promise((resolve, reject) => {
      db.remove({ _id: this.orderId }, {}, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  getCode() {
  	const max = 1000;
  	const min = 100;

  	const randomNumber = Math.random() * (max - min) + min;
  	return Math.round(randomNumber);
  }

  async getOrders(userId) {
    return new Promise((resolve, reject) => {
      db.find({ userId }, (err, orders) => {
        if (err) reject(err);
        resolve(orders);
      });
    });
  }
}

module.exports = Order;
