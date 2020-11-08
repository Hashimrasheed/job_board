const express = require('express')
const app = express.Router();
const loginController = require('../app/http/controllers/employerController/authController')
const jobController = require('../app/http/controllers/employerController/jobController')




const loginProtect = (req, res, next) => {

    if (req.session.employer === null) {
        res.redirect('/employer/login');
    }else {
        next();
    }
}

const dashboardredirect = (req, res, next) => {

    if (req.session.employer) {
        res.redirect('/employer/dashboard');
    }else {
        next();
    }
}



app.get('/login', dashboardredirect,loginController().login)
app.get('/otplogin', dashboardredirect,loginController().otpLogin)
app.get('/otpverify', dashboardredirect,loginController().otpVerify)
app.get('/register', dashboardredirect,loginController().register)
app.get('/dashboard', loginProtect,loginController().dashboard)
app.get('/jobs', loginProtect,jobController().displayJobs)
app.get('/addjobs', loginProtect,jobController().addJobs)

app.post('/login',loginController().postLogin)
app.post('/otplogin',loginController().postOtpLogin)
app.post('/otpverify',loginController().postOtpVerify)
app.post('/register',loginController().postRegister)
app.post('/logout',loginController().logout)
app.post('/addjob', jobController().postAddJob)

module.exports = app;