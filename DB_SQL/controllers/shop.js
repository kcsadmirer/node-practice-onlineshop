const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([products]) => { //destructuring here
    res.render('shop/product-list', {
      path: '/products',
      pageTitle: 'Shop',
      prods: products
    });
  });
};

exports.getProduct = (req, res, next) => {
  const id = +req.params.productId;
  // Product.findById(id, product => {
  //   // console.log(locale);
  //   res.render('shop/product-detail', {
  //     path: `/products`,
  //     product,
  //     pageTitle: product?.title
  //   });
  // });
  Product.findById(id).then(([product]) => {
    if (!product) {
      return res.render('404', {
        pageTitle: 'Error',
        path: '/404',
      });
    }
    res.render('shop/product-detail', {
      path: '/products',
      pageTitle: product.title,
      product: product[0]
    });
  });
}

exports.getIndex = (req, res, next) => {
  // Product.fetchAll(products => {
  //   res.render('shop/index', {
  //     prods: products,
  //     pageTitle: 'Shop',
  //     path: '/'
  //   });
  // });
  Product.fetchAll().then(([products]) => { //destructuring here
    res.render('shop/index', {
      path: '/',
      pageTitle: 'Shop',
      prods: products
    });
  });
};

exports.postCart = (req, res, next) => {
  const id = +req.body.productId;
  // Product.findById(id).then(([product]) => {
  Cart.addProduct(id).then(() => {
    res.redirect('/');
  }).catch(err => console.log(err));
};

exports.postDeleteCartProduct = (req, res, next) => {
  const id = +req.body.productId;
  // Product.findById(id, product => {
  //   Cart.deleteProduct(id, product.price);
  //   res.redirect('/cart');
  // });
  Product.delete(id).then(() => {
    res.redirect('/cart');
  }).catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     if (cart.products.length) {
  //       products.forEach(x => {
  //         const cartProduct = cart.products.find(y => y.id === x.id);
  //         if (cartProduct) {
  //           cartProducts.push({ productData: x, qty: cartProduct.qty });
  //         }
  //       });
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
  Cart.getCart().then(([products]) => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products
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
