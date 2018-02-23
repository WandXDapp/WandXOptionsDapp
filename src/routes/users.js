const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

//register test for user
router.post('/register', (req, res, next) => {
    //res.send('REGISTER TEST');
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({
                success: false, msg: 'Failed To Registered User'
            });
        }
        else {
            res.json({
                success: true, msg: "User Registered..."
            });
        }
    });
});

//authenticate test for user
router.post('/authenticate', (req, res, next) => {
    //res.send('AUTHENTICATE TEST');
    const username = req.body.username;
    const password = req.body.password;
    //console.log("ouutside error  2 ",password, username);

    User.getUserByUsername(username, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({ success: false, msg: 'User Not Found!!!' });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) {
                throw err;
            }
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 300000//5 sec over session
                });
                res.json({
                    success: true,
                    token: 'JWT::: ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            }
            else {
                return res.json({ success: false, msg: 'Wrong Password !!!!' });
            }
        });
    });
});

//profile test for user
// router.get('/profile', (req, res, next) => {
//     res.send('PROFILE TEST');
// });
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

// //validate test for user
// router.get('/validate', (req, res, next) => {
//     res.send('VALIDATE TEST');
// });

module.exports = router;