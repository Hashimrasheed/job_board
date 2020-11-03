const express = require('express')
const app = express.Router();
const loginController = require('../app/http/controllers/employerController/authController')




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
app.get('/register', dashboardredirect,loginController().register)
app.get('/dashboard', loginProtect,loginController().dashboard)

app.post('/login',loginController().postLogin)
app.post('/register',loginController().postRegister)
app.post('/logout',loginController().logout)


module.exports = app;