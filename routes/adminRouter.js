const express = require('express')
const session = require('express-session');
const app = express.Router();
const loginController = require('../app/http/controllers/adminController/authController')
const userController = require('../app/http/controllers/adminController/userController')
const employerController = require('../app/http/controllers/adminController/employerController')


const loginProtect = (req, res, next) => {

    if (req.session.admin === null) {
        res.redirect('/admin/login');
    }else {
        next();
    }
}

const dashboardredirect = (req, res, next) => {

    if (req.session.admin) {
        res.redirect('/admin/dashboard');
    }else {
        next();
    }
}



app.get('/login', dashboardredirect,loginController().login)
app.get('/dashboard', loginProtect,loginController().dashboard)
app.get('/users', loginProtect,userController().users)
app.get('/employers', loginProtect,employerController().employers)
app.get('/editemployer', loginProtect,employerController().editEmployer)
app.get('/edituser', loginProtect,userController().editUser)
app.get('/blockedusers', loginProtect,userController().blockedUsers)



app.post('/login',loginController().postLogin)
app.post('/logout',loginController().logout)
app.post('/postuseredit',userController().postuseredit)
app.post('/usereditsave',userController().usereditsave)
app.post('/userblock',userController().userblock)
app.post('/userUnblock',userController().userUnblock)


module.exports = app;