let passport = require('passport')
const db = require('../config/connection')

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {

  done(null, user);
});

passport.deserializeUser(function(user, done) {
  db.get().collection('users').findOne({_id: user.id}, function(err, data) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: '149726536644-483oep39csd6bd7bh9o1rg77lgilkvpq.apps.googleusercontent.com',
    clientSecret: '_BamcoGQyBjdxSoLW1RjyaMq',
    callbackURL: "http://localhost:3000/user/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    // console.log(profile)
    // done(null, profile);

    process.nextTick(function() {

      // find the user in the database based on their facebook id
      db.get().collection('users').findOne({ uid : profile.id }, function(err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err)
              return done(err);

          // if the user is found, then log them in
          if (user) {
              return done(null, profile); // user found, return that user
          } else {
              // if there is no user found with that facebook id, create them

              var newUser = {
                  // set all of the facebook information in our user model
                  uid    : profile.id, // set the users facebook id                   
                  name  : profile.displayName, // look at the passport user profile to see how names are returned
                  email : profile.emails[0].value, // facebook can return multiple emails so we'll take the first
                  pic : profile.photos[0].value
              }
              console.log(profile.displayName);
              db.get().collection('users').insertOne(newUser, (err) => {
                  if (err)
                      throw err;

                  // if successful, return the new user
                  return done(err, profile);
              })
              
              // save our user to the database
              
          }

      });

  })
  }
));
