const Datastore = require('nedb');

const db = new Datastore({filename : './server/models/db/bikes'});
db.loadDatabase();

class Bike {
	constructor(bikeId) {
		this.bikeId = bikeId;
	}

	async getBike() {
		return new Promise((resolve, reject) => {
			db.findOne({ _id: this.bikeId }, (err, bike) => {
				if (err) reject(err);
				resolve(bike);
			});
		});
	}

  async setRented(isRented) {
    return new Promise((resolve, reject) => {
      db.update({ _id: this.bikeId },
        { $set: { isRented } }, {},
        (err) => {
          if (err) reject(err);
          resolve();
        });
    });
  }

	static async getList() {
    return new Promise((resolve, reject) => {
      db.find({}, (err, bikes) => {
        if (err) reject(err);
        resolve(bikes);
      });
    });
  }

  static async getListByIds(idList) {
    const bikesPromises = idList.map(bikeId => {
      const bike = new Bike(bikeId);
      return bike.getBike();
    });
    return await Promise.all(bikesPromises);
  }
}

module.exports = Bike;
