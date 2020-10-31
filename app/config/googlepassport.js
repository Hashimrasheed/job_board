let passport = require('passport')
const db = require('../config/connection')

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.get().collection('users').findOne({_id: id}, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: '149726536644-483oep39csd6bd7bh9o1rg77lgilkvpq.apps.googleusercontent.com',
    clientSecret: '_BamcoGQyBjdxSoLW1RjyaMq',
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    db.get().collection('users').insertOne({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
    // console.log(profile);
    // done(null, profile);
  }
));
