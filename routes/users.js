const express = require('express');
const passport = require('passport');
const router = express.Router();

const users = require('../controllers/users');
const { validateUser } = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(validateUser, users.register);

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: 'Login unsuccessful. Please check your credentials.', failureRedirect: '/login', keepSessionInfo: true }), users.login);

router.get('/logout', users.logout);

module.exports = router;