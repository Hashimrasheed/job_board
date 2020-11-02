const express = require('express')
const session = require('express-session');
const app = express.Router();
const loginController = require('../app/http/controllers/adminController/authController')


app.use(session({
    secret: 'adminsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
}))



app.get('/login',loginController().login)
app.get('/dashboard',loginController().dashboard)

app.post('/login',loginController().postLogin)
app.post('/logout',loginController().logout)


module.exports = app;