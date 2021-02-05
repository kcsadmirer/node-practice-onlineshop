const path = require('path');

const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const express = require('express');
const bodyParser = require('body-parser');

// const Session = require('./models/session');
const sequelize = require('./util/database');
const errorController = require('./controllers/error');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// function extendDefaultFields(defaults, session) {//for custom userId field
//     return {
//         userId: session.userId,
//         isLoggedIn: session.isLoggedIn,
//         expires: defaults.expires,
//         data: defaults.data
//     };
// }

// const store = new SequelizeStore({
//     db: sequelize,
// table: 'Session',
// extendDefaultFields: extendDefaultFields
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'long string in prod', resave: false, saveUninitialized: false, store: new SequelizeStore({ db: sequelize }) }));//session is stored in memory if we u dont specify the store prop.Dont forget!


app.use((req, res, next) => {
    if (!req.session.userId) {
        return next();
    }
    User.findByPk(req.session.userId).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
// By default, the association is considered optional. In other words, in below example, the userId is allowed to be null, meaning that one cart can exist without a user. Changing this can be done by specifying allowNull: false in the foreign key options
User.hasOne(Cart, {
    constraints: true,
    onDelete: 'CASCADE',
    // foreignKey: { allowNull: false } Dont use this as this means 1 user cant exist without a cart
}); //1user-1cart
Cart.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Order, { constraints: true, onDelete: 'CASCADE' }); //1user-manyords
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasMany(Product, { constraints: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' }); //1user-manyprods
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