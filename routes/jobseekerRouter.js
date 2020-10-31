const express = require('express')
const homeController = require('../app/http/controllers/JobseekerController/homeController')
const app = express.Router();
const passport = require('passport');
require('../app/config/googlepassport')
const isLogged = require('../app/http/midlewares/googleAuth')


//Get routers
app.get('/',  homeController().home)
app.get('/login', homeController().login)
app.get('/register', homeController().register)
app.get('/otplogin', homeController().otpLogin)
app.get('/googlelogin', passport.authenticate('google', {scope: ['profile', 'email']}), homeController().googleLogin)
app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), homeController().postGoogleLogin)
app.post('/logout', homeController().logout)


//post routers
app.post('/register', homeController().postRegister)
app.post('/login', homeController().postLogin)
app.post('/otplogin', homeController().postOtpLogin)
app.post('/otpverify', homeController().postOtpVerify)

module.exports = app;