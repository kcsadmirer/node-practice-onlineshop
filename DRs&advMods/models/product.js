const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

const getProductsFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price, id = null) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = +price;
    this.id = id;
  }

  save() {
    getProductsFile(products => {
      if (this.id) {
        const index = products.findIndex(obj => obj.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[index] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      } else {
        this.id = +(Math.random() * 9 + 1).toString().split('.').join('');
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static delete(id) {
    getProductsFile(products => {
      const product = products.find(x => x.id === id);
      if(!product){
        return;
      }
      const updatedProducts = products.filter(x => x.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (err) {
          console.log(err);
        } else {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFile(cb);
  }

  static findById(id, cb) {
    getProductsFile(products => {
      const product = products.find(obj => obj.id === id);
      cb(product);
    });
  }
};
