const Datastore = require('nedb');

const db = new Datastore({filename : './server/models/db/pointers'});
db.loadDatabase();

class Pointers {
	constructor(pointId) {
		this.pointId = pointId;
	}

	static async getList() {
		return new Promise((resolve, reject) => {
			db.find({}, (err, pointers) => {
				if (err) reject(err);
				resolve(pointers);
			});
		});
	}

	async getPoint() {
		return new Promise((resolve, reject) => {
			db.findOne({ _id: this.pointId }, (err, point) => {
				if (err) reject(err);
				resolve(point);
			});
		});
	}

	async findWithBike(bikeId) {
		return new Promise((resolve, reject) => {
			db.findOne({ bikesList: bikeId }, (err, point) => {
				if (err) reject(err);

				if (!point) {
					resolve();
					return;
				}

				this.pointId = point._id;
				resolve(point);
			});
		});
	}

	async removeBike(bikeId) {
		return new Promise((resolve, reject) => {
			db.update({ _id: this.pointId },
				{ $pull: { bikesList: bikeId } }, {},
				(err) => {
					if (err) reject(err);
					resolve();
				});
		});
	}

	async addBike(bikeId) {
		return new Promise((resolve, reject) => {
			db.update({ _id: this.pointId },
				{ $push: { bikesList: bikeId } }, {},
				(err, point) => {
					if (err) reject(err);
					resolve(point);
				});
		});
	}
}

module.exports = Pointers;
