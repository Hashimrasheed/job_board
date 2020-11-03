const express = require('express')
const session = require('express-session');
const app = express.Router();
const loginController = require('../app/http/controllers/adminController/authController')


// app.use(session({
//     secret: 'adminsecret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 1000 * 60 * 60 * 24 },
// }))


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

app.post('/login',loginController().postLogin)
app.post('/logout',loginController().logout)


module.exports = app;