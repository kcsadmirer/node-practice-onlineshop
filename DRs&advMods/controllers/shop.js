const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const id = +req.params.productId;
  // Product.fetchAll(products => { //Could do this or do it the other way using the method from the model
  //   const product = products.find(obj => obj.id === id);
  //   res.render('shop/product-detail', {
  //     path: `/products/${id}`,
  //     product,
  //     pageTitle: product?.title
  //   });
  // });
  Product.findById(id, product => {
    // console.log(locale);
    res.render('shop/product-detail', {
      path: `/products`,
      product,
      pageTitle: product?.title
    });
  });
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.postCart = (req, res, next) => {
  const id = +req.body.productId;
  Product.findById(id, product => {
    Cart.addProduct(id, product?.price);
  });
  res.redirect('/cart');
};

exports.postDeleteCartProduct = (req, res, next) => {
  const id = +req.body.productId;
  Product.findById(id, product => {
    Cart.deleteProduct(id,product.price);
    res.redirect('/cart');
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      if (cart.products.length) {
        products.forEach(x => {
          const cartProduct = cart.products.find(y => y.id === x.id);
          if (cartProduct) {
            cartProducts.push({ productData: x, qty: cartProduct.qty });
          }
        });
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
