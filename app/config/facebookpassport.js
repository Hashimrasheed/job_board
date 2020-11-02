let passport = require('passport')
const db = require('../config/connection')

const FacebookStrategy = require('passport-facebook').Strategy;



// passport.serializeUser(function(user, done) {
//     // console.log(user.id);
//     done(null, user.uid);
// });

// used to deserialize the user
// passport.deserializeUser(function(id, done) {
//     User.findById({uid: id}, function(err, user) {
//         done(err, user);
//     });
// });

passport.use(new FacebookStrategy({
    clientID: '3596005423794082',
    clientSecret: '356c4d9b315fd54184f33269d80d9af5',
    callbackURL: "http://localhost:3000/user/facebook/callback",
    profileFields: [ 'displayName', 'name','picture.type(large)', 'email']
  },
  function(token, refreshToken, profile, done) {
    //   console.log(profile);
    //   return done(null, profile);
   
    // asynchronous
    process.nextTick(function() {

        // find the user in the database based on their facebook id
        db.get().collection('users').findOne({ 'uid' : profile.id }, function(err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);

            // if the user is found, then log them in
            if (user) {
                console.log("user found")
                // console.log(user)
                return done(null, profile); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them

                var newUser            = {
                    // set all of the facebook information in our user model
                    uid    : profile.id, // set the users facebook id                   
                    name  : profile.name.givenName + ' ' + profile.name.familyName, // look at the passport user profile to see how names are returned
                    // email : profile.emails[0].value, // facebook can return multiple emails so we'll take the first
                    pic : profile.photos[0].value
                }

                db.get().collection('users').insertOne(newUser, (err) => {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, profile);
                })
                
                // save our user to the database
                
            }

        });

    })
  }
));
