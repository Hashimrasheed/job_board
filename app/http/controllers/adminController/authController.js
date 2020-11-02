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
            req.session.email = email;
            req.session.password = password
            if(req.body.email === email && req.body.password === password) {
                res.render('admin/dashboard')
                req.session.admin = email
            } else {
                res.render('admin/login')
            }
        },
        logout(req, res){
            // req.session.destroy();
            // res.clearCookie('adminCookie')
            res.redirect('/admin/login')
        },
        dashboard(req, res) {
            console.log(req.session.admin);

            res.render('admin/dashboard')
        }
    }
}

module.exports = authController;