const db = require('../db');
const model = {
    getProducts(cb) {
        return db.query("select * from products", cb);
    }
}
module.exports = model;