const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(obj => obj.id === id);
            let updatedProduct;
            if (existingProductIndex !== -1) {
                updatedProduct = { ...cart.products[existingProductIndex] };
                updatedProduct.qty += 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id, qty: 1 };
                cart.products.push(updatedProduct);
            }
            cart.totalPrice += price;
            cart.totalPrice = +cart.totalPrice.toFixed(2);
            fs.writeFile(p, JSON.stringify(cart), err => console.log(err));
        });
    }
    static deleteProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const cart = JSON.parse(fileContent);
            const updatedCart = { ...cart };
            const product = updatedCart.products.find(obj => obj.id === id);
            if(!product){
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(x => x.id !== id);
            updatedCart.totalPrice -= price * productQty;
            updatedCart.totalPrice = +updatedCart.totalPrice.toFixed(2);
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }
    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb(null);
            } else {
                const cart = JSON.parse(fileContent);
                cb(cart);
            }
        });
    }
};