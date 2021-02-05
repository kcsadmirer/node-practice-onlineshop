const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    User.findByPk(1).then(user => {
        req.session.isLoggedIn = true;
        req.session.userId = user.id;
        req.session.save(err => { // doing this is very important !!! otherwise the response would be given before the session is set as setting session is Async! and takes few milliseconds!
            console.log(err);
            res.redirect('/');
        });
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};