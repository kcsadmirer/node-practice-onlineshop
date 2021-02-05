const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

User.hasOne(Cart, { constraints: true, onDelete: 'CASCADE', foreignKey: { allowNull: false } }); //1user-1cart
Cart.belongsTo(User, { constraints: true, onDelete: 'CASCADE', foreignKey: { allowNull: false } });

User.hasMany(Order, { constraints: true, onDelete: 'CASCADE', foreignKey: { allowNull: false } });//1user-manyords
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE', foreignKey: { allowNull: false } });

User.hasMany(Product, { constraints: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' });//1user-manyprods
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Cart.belongsToMany(Product, { through: CartItem, unique: false });
Product.belongsToMany(Cart, { through: CartItem, unique: false });

Order.belongsToMany(Product, { through: OrderItem, unique: false });
Product.belongsTo(Order, { through: OrderItem, unique: false });

let userG;
sequelize.sync().then(res => {
    return User.findByPk(1);
}).then(user => {
    if (!user) {
        return User.create({ name: "KC", email: 'k@k.com' });
    }
    return user;
}).then(user => {
    userG = user;
    return user.getCart();
}).then(cart => {
    if (!cart) {
        return userG.createCart();
    }
    return cart;
}).then(() => {
    app.listen(3000);
}).catch(err => console.log(err));

