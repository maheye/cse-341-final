const router = require('express').Router();
const passport = require('passport');
const mongodb = require('../data/database');


router.use('/', require('./swagger'));

router.use("/users", require("./users"));

router.use('/plans', require('./plans'));

router.use('/events', require('./events'));

if (process.env.NODE_ENV !== 'test') {
    router.get('/login', passport.authenticate('github', { session: false }), (req, res) => {
        console.log(req.session);
        res.redirect('/');
    });
} else {
    router.get('/login', (req, res) => {
        res.send('Logged in successfully for testing.');
    });
}

if (process.env.NODE_ENV !== 'test') {
    router.get('/logout', function(req, res, next) {
        console.log(req.session);
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });
} else {
    router.get('/logout', (req, res) => {
        res.send('Logged out successfully for testing.');
    });
}

module.exports = router;