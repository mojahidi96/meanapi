var express = require('express');
var router = express.Router();
const authModel = require('../models/auth-model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
router.post('/signup', function (req, res) {
    const password = req.body.password;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function (err, hash) {
        req.body.password = hash;
        authModel.signup(req.body, function (err, result) {
            res.json({ data: result, error: err })
        });
    });
});

router.post('/login', function (req, res, next) {
    console.log('login')
    passport.authenticate('local', { session: false }, function (err, user, info) {
        console.log('entered')
        if (err) { return next(err); }
        if (!user) {
            return res.status(500).json(info.message);
        }
        const payload = {
            username: user.username,
            email: user.email
        }
        const options = {
            subject: `${user.id}`,
            expiresIn: 3600
        }
        console.log(payload, 'secret123', options)
        const token = jwt.sign(payload, 'secret123', options);
        res.json({ token });
    })(req, res, next);
})

// router.get('/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: '/login' }),
//     function (req, res) {
//         console.log('Successful')
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get("/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/",
        failureRedirect: "/fail"
    })
);

router.get("/fail", (req, res) => {
    res.send("Failed attempt");
});

router.get("/", (req, res) => {
    res.send("Success");
});

module.exports = router;