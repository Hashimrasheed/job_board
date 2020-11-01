const express = require('express')
const homeController = require('../app/http/controllers/JobseekerController/homeController')
const app = express.Router();
const passport = require('passport');
// require('../app/config/googlepassport')
const isLogged = require('../app/http/midlewares/googleAuth')

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

//Get routers
app.get('/', isLoggedIn,  homeController().home)
app.get('/login', homeController().login)
app.get('/register', homeController().register)
app.get('/otplogin', homeController().otpLogin)
app.get('/googlelogin', passport.authenticate('google', {scope: ['profile', 'email']}))
app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), homeController().postGoogleLogin)
app.get('/facebooklogin', passport.authenticate('facebook', {scope: 'email'}))
app.get('/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login' }), homeController().postfacebookLogin)

app.post('/logout', homeController().logout)


//post routers
app.post('/register', homeController().postRegister)
app.post('/login', homeController().postLogin)
app.post('/otplogin', homeController().postOtpLogin)
app.post('/otpverify', homeController().postOtpVerify)

module.exports = app;