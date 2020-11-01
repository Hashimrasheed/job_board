const db = require('../../../config/connection');
const bcrypt = require('bcrypt');
// const { default: messagebird } = require('messagebird/types');
require('dotenv').config();
const passport = require('passport');
// var request = require('request');

const messagebird = require('messagebird')(process.env.MESSAGEBIRD_API_KEY)

function homeController() {
    return {
        home(req, res) {
            console.log(req.user)
            console.log(req.user.id)
            if(req.user.provider == 'facebook') {
                res.render('home', {name:req.user.displayName,pic:req.user.photos[0].value});
            } else if(req.user.provider == 'google') {
                res.render('home', {name:req.user.givenName,pic:req.user.photos[0].value,email:req.user.emails[0].value})
            }
            
        },
        login(req, res) {
            res.render('user/login')
        },
        async postLogin(req, res) {
            await db.get().collection('users').findOne({email: req.body.email, password: req.body.password}, (err, data) => {
                if(data == null) {
                    console.log("No user exist with this email");
                    res.redirect('/login')
                }else {
                    res.redirect('/')
                } 
            })
            // bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
                // result == true
            // });
        },
        otpLogin(req, res) {
            res.render('user/otpLogin')
        },
        postOtpLogin(req, res) {
            let phone = req.body.phone;

            var options = {
            'method': 'POST',
            'url': 'https://d7networks.com/api/verifier/send',
            'headers': {
                'Authorization': 'Token {D7 verify token}'
            },
            formData: {
                'mobile': '97150900XXXX',
                'sender_id': 'SMSINFO',
                'message': 'Your otp code is {code}',
                'expiry': '900'
            }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
            });


            // make request to verify the api
            // messagebird.verify.create(phone, {
            //     template: "your verification code is token"
            // }, function(err, response) {
            //     if(err) {
            //         console.log(err);
            //         res.render('user/otpLogin', {error: err.error[0].discription})
            //     }else {
            //         console.log(response);
            //         res.render('user/otpVerify', {id: response.id})
            //     }
            // })
        },
        postOtpVerify(req, res) {
            let id = req.body.id;
            let token = req.body.token;

            // make request to verify api
            messagebird.verify.verify(id, token, function(err, response) {
                if(err) {
                    //verification has failed
                    res.render('user/otpVerify', {error: err.errors[0].discription, id: id})
                }else {
                    //verification successful
                    res.render('users/otpLogin')
                }
            })
        },
        googleLogin(req, res) {
            
        },
        postGoogleLogin(req, res) {
            res.redirect('/')
        },
        postfacebookLogin(req, res) {
            res.redirect('/')
        },
        register(req, res) {
            res.render('user/register')
        },
        async postRegister(req, res) {
            console.log(req.body.email);
            
            //hash password
            const hashPassword = await bcrypt.hash(req.body.password, 10)

            //user details
            const user = {
                username: req.body.username,
                email: req.body.email,
                password: hashPassword
            }

            // check the email is already exist and register
            db.get().collection('users').findOne({email: req.body.email}, (err, data) => {
                if(data == null) {
                    db.get().collection('users').insertOne(user, (err, done) => {
                        if(err) throw err;
                        console.log('one user logged in');
                        res.redirect('/')
                    })

                }
                else {
                    console.log("user already exist");
                    res.redirect('/register')
                }
            })

            

        },
        logout(req, res) {
            console.log(req.session);
            req.session = null;
            console.log(req.session);
            req.logout();
            res.redirect('/login')
        }
    }
}
module.exports = homeController;