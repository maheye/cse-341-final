const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config()
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');



const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use(cors({methods:['GET', 'POST', 'DELETE', 'UPDATE', 'PUT','PATCH']}))
app.use(cors({origin: '*'}))
app.use('/', require("./routes/index.js"));

passport.use(new GitHubStrategy ({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
},
function(accessToken, refreshToken, profile, done){
    //User.findOrCreate({githubId: profile.id}, function(err,user){
       return done(null,profile);
    //})
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => {
    if (req.session.user !== undefined) {
        const userid = req.session.user.id;
        const displayName = req.session.user.displayName;
        const profilePicture = req.session.user.photos[0].value;
        res.send(`
            <h1>Logged in as ${displayName}</h1>
            <h2>Use this to represent your user_id for collection fields in swagger: ${userid}</h2>
            <h2><a href="http://localhost:3000/api-docs">Click here to go to Swagger</a></h2>
            <img src="${profilePicture}" alt="Profile Picture">
        `);
    } else {
        res.send(`
        <h1>Logged Out</h1>
    `);
    }
});

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
});

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
                console.log(`Database is listening and node Running on port ${port}`);
            });
    }
});

module.exports = app;