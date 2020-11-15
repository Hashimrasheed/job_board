const db = require('../../../config/connection');
const bcrypt = require('bcrypt');

function authController() {
    return {
        login(req, res) {
            res.render('admin/login')
        },
        postLogin(req, res) {
            const email = "admin@gmail.com";
            const password = "1234"
            req.session.admin = email;
            if(req.body.email === email && req.body.password === password) {
                res.redirect('/admin/dashboard')
            } else {
                res.render('admin/login')
            }
        },
        logout(req, res){
            req.session.destroy();
            res.clearCookie('employerCookie');
            req.logout();
            res.redirect('/admin/login')
        },
        dashboard(req, res) {
            console.log(req.session);
            res.render('admin/dashboard')
        }
    }
}

module.exports = authController;