const db = require('../../../config/connection');
const bcrypt = require('bcrypt');

function authController() {
    return {
        login(req, res) {
            res.render('admin/login')
            console.log(req.session);
        },
        postLogin(req, res) {
            const email = "admin@jobboard.com";
            const password = "12345"
            req.session.admin = email;
            if(req.body.email === email && req.body.password === password) {
                res.render('admin/dashboard')
            } else {
                res.render('admin/login')
            }
        },
        logout(req, res){
            req.session.admin = null
            // req.session.destroy();
            // res.clearCookie('adminCookie')
            res.redirect('/admin/login')
        },
        dashboard(req, res) {
            console.log(req.session.admin);
            console.log(req.session);
            res.render('admin/dashboard')
        }
    }
}

module.exports = authController;