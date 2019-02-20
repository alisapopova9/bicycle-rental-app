const Datastore = require('nedb');

const db = new Datastore({filename : './server/models/db/users'});
db.loadDatabase();

class User {
	constructor(userId) {
		this.userId = userId;
	}

	async create(login, password) {
		return new Promise((resolve, reject) => {
			const id = db.insert({ login, password }, (err, newDoc) => {
				if (err) reject(err);

				this.userId = newDoc._id;
				resolve(newDoc._id);
			});
		});
	}

	async getUser(login, password) {
		const findParams = this.userId ? { _id: this.userId } : { login, password };
		return new Promise((resolve, reject) => {
			db.findOne(findParams, (err, user) => {
				if (err) reject(err);

				if (!user) {
					resolve();
					return;
				}

				this.userId = user._id;
				this.login = user.login;
				this.password = user.password;
				this.cardRequisites = user.cardRequisites;

				resolve(user._id);
			});
		});
	}

  async setCardRequisites({ number, date, cvv }) {
    return new Promise((resolve, reject) => {
      db.update({ _id: this.userId },
        { $set: { cardRequisites: { number, date, cvv } } },
        (err, user) => {
        	if (err) reject(err);
          resolve();
        });
    });
  }
}

module.exports = User;
