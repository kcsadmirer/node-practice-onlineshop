const Sequelize = require('sequelize');

const sequelize = new Sequelize('db/user', 'root', 'password', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;