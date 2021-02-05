const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {//Dont do any conversions, formatting of data for neat display here becoz it needs to be done on the front end
  // const { title, imageUrl, price, description } = req.body;
  // const product = new Product(title, imageUrl, description, price);
  // product.save();
  // res.redirect('/');
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save().then(() => {
    res.redirect('/');
  }).catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const canEdit = req.query.edit == 'true' ? true : false;
  if (!canEdit) {
    return res.redirect('/');
  }
  const id = +req.params.productId;
  Product.findById(id).then((product) => {
    if (!product) {
      return res.render('404', {
        pageTitle: 'Error',
        path: '/404',
      });
    }
    // console.log(product[0][0].id);
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: canEdit,
      product: product[0][0]
    });
  }).catch(err => {
    console.log(err);
  });
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, productId } = req.body;
  // const updatedProduct = new Product(title, imageUrl, description, price, +productId);
  Product.edit(title, imageUrl, +price, description, +productId).then(() => {
    res.redirect('/admin/products');
  }).catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const id = +req.body.productId;
  Product.delete(id).then(() => {
    res.redirect('/admin/products');
  }).catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([products]) => { //destructuring here
    res.render('admin/products', {
      path: '/admin/products',
      pageTitle: 'Admin Products',
      prods: products
    });
  });
};
