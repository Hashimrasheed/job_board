const express = require('express')
const homeController = require('../app/http/controllers/JobseekerController/homeController')
const app = express.Router();


app.get('/', homeController().home)
app.get('/login', homeController().login)

module.exports = app;