const express = require('express')
const app = express.Router();
const loginController = require('../app/http/controllers/employerController/authController')
const jobController = require('../app/http/controllers/employerController/jobController')
const jobseekerController = require('../app/http/controllers/employerController/jobseekerController')
const employerProfileController = require('../app/http/controllers/employerController/employerProfileController')
const jobrequestController = require('../app/http/controllers/employerController/jobRequestController')



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
app.get('/jobquestions/:id', loginProtect,jobController().jobQuestions)
app.get('/jobrequests/:id', loginProtect,jobseekerController().jobrequests)
app.get('/jobrequestsDetails/:jobId/:userId', loginProtect,jobseekerController().jobrequestsDetails)
app.get('/employerProfile', loginProtect,employerProfileController().jobrequestsDetails)
app.get('/profileEdit', loginProtect,employerProfileController().profileEdit)
app.get('/approvedJobs', loginProtect,jobrequestController().approvedJobs)
app.get('/rejectedJobs', loginProtect,jobrequestController().rejectedJobs)
app.get('/headers', loginProtect,loginController().header)


app.post('/login',loginController().postLogin)
app.post('/otplogin',loginController().postOtpLogin)
app.post('/otpverify',loginController().postOtpVerify)
app.post('/register',loginController().postRegister)
app.post('/logout',loginController().logout)
app.post('/addjob', jobController().postAddJob)
app.post('/jobquestions', jobController().postjobQuestions)
app.post('/editprofile', employerProfileController().postProfileEdit)
app.post('/rejectrequest/:jobId/:userId', jobrequestController().rejectRequest)
app.post('/approverequest/:jobId/:userId', jobrequestController().approveRequest)

module.exports = app;