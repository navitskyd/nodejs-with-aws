const util = require("util");

class DbDao {
    constructor(db) {
        this.db = db;
    }

    async findAll() {
        return this.db.query('SELECT * FROM uploads;');
    }

    async findOne(id) {
        return this.db.query('SELECT * FROM uploads WHERE id = ?;', [id]);
    }

    async create(image) {
        this.db.query("INSERT INTO uploads(description, type, size) VALUES(?,?,?);", [image.description, image.type, image.size]);
    }

    async delete(id) {
        return this.db.query('DELETE FROM uploads WHERE id = ?;', [id]);
    }

    async createMany(images) {
        try {
            await this.db.connect();
            await this.db.connection.beginTransactionPromise();

            images.forEach(async image => await this.create(image));

            await this.db.connection.commitPromise();
        } catch (err) {
            await this.db.connection.rollbackPromise;
        }
    }
}

module.exports = BooksDao;