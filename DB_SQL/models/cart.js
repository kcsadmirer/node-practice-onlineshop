const db = require('../util/database');

module.exports = class Cart {
    static async addProduct(id) {
        const [product] = await db.execute('SELECT * FROM products WHERE id=?', [id]);
        if (!product) {
            return;
        }
        const [res] = await db.execute('SELECT * FROM cart WHERE id=?', [id]);
        if (!res[0]?.id) {
            const [cartProds] = await db.execute('SELECT * FROM cart');
            return Promise.all([db.execute('INSERT INTO cart (id,qty,price) VALUES (?,?,?)', [id, 1, product[0].price]), db.execute('UPDATE cart SET totalPrice=?', [+((cartProds[0]?.totalPrice || 0) + product[0].price).toFixed(2)])]);
        } else {
            return Promise.all([db.execute('UPDATE cart SET totalPrice=?', [+(res[0].totalPrice + res[0].price).toFixed(2)]), db.execute('UPDATE cart SET qty=? WHERE id=?', [res[0].qty + 1, id])]);
        }
    }

    static async deleteProduct(id) {
        const [res] = await db.execute('SELECT * FROM cart WHERE id=?', [id]);
        return db.execute('UPDATE cart SET totalPrice=?', [+(res[0].totalPrice - (res[0].qty * res[0].price)).toFixed(2)]);

        // return db.execute('UPDATE cart SET totalPrice=?', [res1[0].totalPrice -= res1[0].price]);
    }

    static getCart() {
        return db.execute('SELECT * FROM cart');
    }
};