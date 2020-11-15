const express = require('express')
const homeController = require('../app/http/controllers/JobseekerController/homeController')
const app = express.Router();
const passport = require('passport');
const isLogged = require('../app/http/midlewares/googleAuth');
const jobController = require('../app/http/controllers/JobseekerController/jobController');
const profileController = require('../app/http/controllers/JobseekerController/profileController');


const loginProtect = (req, res, next) => {

    if (req.session.user) {
        res.redirect('/user');
    }else {
        next();
    }
}



//Get routers
app.get('/',  homeController().home)
app.get('/login', loginProtect, homeController().login)
app.get('/register', loginProtect, homeController().register)
app.get('/otplogin', homeController().otpLogin)
app.get('/otpverify', homeController().otpVerify)
app.get('/googlelogin', passport.authenticate('google', {scope: ['profile', 'email']}))
app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/user/login' }), homeController().postGoogleLogin)
app.get('/facebooklogin', passport.authenticate('facebook', {scope: 'email'}))
app.get('/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/user/login' }), homeController().postfacebookLogin)
app.get('/logout', homeController().logout)
app.get('/alljobs',  jobController().displayJobs)
app.get('/jobdetails/:id',  jobController().jobDetails)
app.get('/jobquestions/:id', jobController().jobQuestions)
app.get('/profile/:id', profileController().userProfile)
app.get('/profileEdit', profileController().editProfile)
app.get('/resumeupload', profileController().resumeUpload)


//post routers
app.post('/register', homeController().postRegister)
app.post('/login', homeController().postLogin)
app.post('/otplogin', homeController().postOtpLogin)
app.post('/otpverify', homeController().postOtpVerify)
app.post('/jobquestions', jobController().postJobQuestions)
app.post('/editprofile', profileController().postEditProfile)
app.post('/resumeAdd', profileController().resumeAdd)

module.exports = app;