const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();

const sessionOptions = {
  secret: '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', // must be the same for cookieparser
  name: 'session-id',
  resave: false,
  saveUninitialized: false,
  cookie: {httpOnly: false, maxAge: 5184000000},
};

app.use(session(sessionOptions));
app.use(passport.initialize({userProperty: 'currentUser'}));
app.use(passport.session());

// Setup Passport to use Google OAuth 2.0
passport.use(new GoogleStrategy({
  clientID: '258639327-k0f2v19bcplg61nqu1cbkiinbef7itcs.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/projectTwo/contest', // Redirect URL after Google login
},
// Callback function for handling user authentication
(accessToken, refreshToken, profile, done) => {
  // Check if the user profile has a valid ID
  if (profile.id != null) {
    return done(null, profile); // Return authenticated user profile
  } else {
    return done(null, false); // Return false indicating authenticating faiulure
  }
}));

// Serialize the user object so we can store it in the session
passport.serializeUser((user, done) => {
  done(null, user);
});
// Deserialize the user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});


const indexRouter = require('./routes/home');
// Project One route
const projectOneRouter = require('./routes/projectOne');
const projectTwoRouter = require('./routes/projectTwo');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(sessionOptions.secret));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
// Use our project one router
app.use('/projectOne', projectOneRouter);
app.use('/projectTwo', projectTwoRouter);
app.use('/bw', express.static(__dirname + '/node_modules/bootswatch/dist'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
