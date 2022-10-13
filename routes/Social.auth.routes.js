const passport = require('passport');
const express = require('express');
const { config } = require('../config/index');

const app = express();

const router = express.Router();

const CLIENT_URL = "http://localhost:3000/";

router.get('/', (req, res) => {

    return res.send({
        success: true,
        message: 'auth route working',
        user: req.user
    })
})

router.get("/login", (req, res) => {

    if (req.user) {
        res.redirect(CLIENT_URL.concat(`?id=${req.user.id}`));
    }
})

router.get("/login/failed", (req, res) => {
    res.redirect(CLIENT_URL.concat(`?id=${null}`));
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});

router.get("/google", passport.authenticate("google", { scope: ["email", 'profile'] }));

router.get('/discord', passport.authenticate('discord'));


router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: config.SUCCESS_REDIRECT,
        failureRedirect: config.FAILED_REDIRECT,
    })
);

router.get('/discord/callback', passport.authenticate('discord', {
    successRedirect: config.SUCCESS_REDIRECT,
    failureRedirect: config.FAILED_REDIRECT,
}))

exports.googleAuth = app.use('/auth', router);