const db = require('../../../config/connection');
const bcrypt = require('bcrypt');
// const { default: messagebird } = require('messagebird/types');
const passport = require('passport');
var request = require('request');
let axios = require('axios')
let FormData = require('form-data')

let otpId;
let phone;

function homeController() {
    return {
        home(req, res) {
            if(!req.user) {
                res.render('home', {name: ' ',pic:' '})
            }else {
                if(req.user.provider == 'facebook') {
                    res.render('home', {name:req.user.displayName,pic:req.user.photos[0].value});
                } else if(req.user.provider == 'google') {
                    res.render('home', {name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value})
                }
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
        async postOtpLogin(req, res) {
            phone = req.body.phone;
            res.redirect('/otpVerify')
            if(!phone) {
                res.redirect('/otplogin')
            }
            await db.get().collection('users').findOne({phone: phone}, (err, result) => {
                if(result) {
                    let data = new FormData();
                    data.append('mobile', '91' + phone)
                    data.append('sender_id', 'SMSINFO')
                    data.append('message', 'Your otp code is {code}')
                    data.append('expiry', '900')

                    var config = {
                        'method': 'post',
                        'url': 'https://d7networks.com/api/verifier/send',
                        'headers': {
                            'Authorization': 'Token 278b0d5aec962cac55a52a07175ce33c5b6fc0db',
                            ...data.getHeaders()
                        },
                        data: data
                    };
                    axios(config).then(function(response) {
                        console.log(JSON.stringify(response.data));
                        otpId = response.data.otp_id;
                        res.redirect('/otpVerify')
                    }).catch(function(error) {
                        req.redirect('/otplogin')
                    })
                } else {
                    res.redirect('/otplogin')
                }
            })
        },
        otpVerify(req, res) {
            res.render('user/otpVerify')
        },
        async postOtpVerify(req, res) {
            let otp = req.body.otp
            var data = new FormData();
            data.append('otp_id', otp_id);
            data.append('otp_code', req.body.otp);

            var config = {
                'method': 'POST',
                'url': 'https://d7networks.com/api/verifier/verify',
                'headers': {
                  'Authorization': 'Token 278b0d5aec962cac55a52a07175ce33c5b6fc0db',
                  ...data.getHeaders()
                },
                data: data
            };
            
            await axios(config)
                .then((response) => {
                    console.log(response.data.status);
                    if (response.data.status == 'success') {
                        db.get().collection('users').findOne({ phone: phone }, (err, result) => {
                            
                            res.redirect('/');
                        })

                    }
                })
                .catch(function (error) {
                    res.redirect('/otpVerify');
                });
            
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