const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
        // errorMsg: req.flash('error')?.[0] ?? null
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
        // errorMsg: msg
    });
}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({
        where: {
            email: {
                [Op.eq]: email
            }
        }
    }).then(user => {
        if (!user) {
            // req.flash('error', 'Invalid Email or Password!');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password).then(matched => {
            if (matched) {
                req.session.isLoggedIn = true;
                req.session.userId = user.id;
                req.session.save(err => { // doing this is very important !!! otherwise the response would be given before the session is set as setting session is Async! and takes few milliseconds!
                    console.log(err);
                    res.redirect('/');
                });
            } else { //invalid password!
                res.redirect('/login');
            }
        }).catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    }).catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    User.findOne({
        where: {
            email: {
                [Op.eq]: email
            }
        }
    }).then(user => {
        if (user) {
            // req.flash('error', 'Already a User with the same Email ID. Please Enter a different One!');
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12).then(hashPassword => {
            User.create({
                email: email,
                password: hashPassword
            }).then(user => {
                return user.createCart();
            });
        }).then(cart => {
            res.redirect('/login');
        });             //async which return promise
    }).catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};