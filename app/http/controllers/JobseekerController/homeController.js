const db = require('../../../config/connection');
const bcrypt = require('bcrypt');
const passport = require('passport');
let axios = require('axios')
let FormData = require('form-data')

let otpId;
let mobile;

function homeController() {
    return {
        home(req, res) {
            if(req.user) {
                req.session.user = req.user.id
            }
            console.log(req.session);
            if(req.session.user) {
                if(!req.user) {
                    res.render('home', {name: ' ',pic:' ', user: true})
                }else {
                    if(req.user.provider == 'facebook') {
                        res.render('home', {name:req.user.displayName,pic:req.user.photos[0].value, user: true});
                    } else if(req.user.provider == 'google') {
                        res.render('home', {name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value, user: true})
                    }
                }
            } else {
                res.render('home', {name: null, pic : null , user: true})
            }
            
        },
        login(req, res) {
            res.render('user/login', {error: req.flash('error')})
        },
        async postLogin(req, res) {
            const email = req.body.email;
            const password = req.body.password;
            if(email && password) {
                await db.get().collection('users').findOne({email: req.body.email}, async (err, data) => {
                    if(data == null) {
                        req.flash('error', 'No user in this mail')
                        res.redirect('/user/login')
                    } else {
                        const isMatch = await bcrypt.compare(req.body.password, data.password)
                        if(isMatch === false) {
                            req.flash('error', 'Incorrect password')
                            res.redirect('/user/login')
                        }else {
                            req.session.user = data._id;
                            res.redirect('/user')
                        } 
                    }
                    
                })
            } else {
                req.flash('error', 'Please fill all fields')
                res.redirect('/user/login')
            }
            
        },
        otpLogin(req, res) {
            res.render('user/otpLogin')
        },
        postOtpLogin(req, res) {
<<<<<<< HEAD
            let phone = req.body.phone;

            if(!phone) {
                res.redirect('/otplogin')
            }
            var config = {
                'method': 'POST',
                'url': 'https://d7networks.com/api/verifier/send',
                'headers': {
                    'Authorization': 'Token 278b0d5aec962cac55a52a07175ce33c5b6fc0db'
                },
                formData: {
                    'mobile': '91' + phone,
                    'sender_id': 'SMSINFO',
                    'message': 'Your otp code is {code}',
                    'expiry': '900'
                }
            };
            request(config, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
                otpId = response.body
                console.log(otpId);
            });
            res.redirect('/otpVerify')

=======
            mobile = req.body.phone;
            console.log(mobile);
            db.get().collection('users').findOne({mobile}, (err, result) => {
                if(err) throw err;
                    const data = new FormData();
                    data.append('mobile', `91${mobile}`);
                    data.append('sender_id', 'SMSINFO');
                    data.append('message', 'Your otp code is {code}');
                    data.append('expiry', '900');
          
                    const config = {
                      method: 'post',
                      url: 'https://d7networks.com/api/verifier/send',
                      headers: {
                        Authorization: 'Token 278b0d5aec962cac55a52a07175ce33c5b6fc0db',
                        ...data.getHeaders(),
                      },
                      data,
                    };
          
                    axios(config)
                      .then((response) => {
                        otpId = response.data.otp_id;
                        res.redirect('/user/otpVerify');
                      })
                      .catch(() => {
                        // req.flash('error', 'No user with this number');
                        res.redirect('/user/otplogin');
                      });
            })
>>>>>>> master
        },
        otpVerify(req, res) {
            res.render('user/otpVerify')
        },
        postOtpVerify(req, res) {
            let otp = req.body.otp
<<<<<<< HEAD
            var config = {
                'method': 'POST',
                'url': 'https://d7networks.com/api/verifier/verify',
                'headers': {
                  'Authorization': 'Token 278b0d5aec962cac55a52a07175ce33c5b6fc0db'
                },
                formData: {
                  'otp_id': otpId,
                  'otp_code': otp
                }
              };
              request(config, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
            });
=======
            const data = new FormData();
            data.append('otp_id', otpId);
            data.append('otp_code', otp);

            const config = {
                method: 'post',
                url: 'https://d7networks.com/api/verifier/verify',
                headers: {
                  Authorization: 'Token 278b0d5aec962cac55a52a07175ce33c5b6fc0db',
                  ...data.getHeaders(),
                },
                data: data,
            };
            let user = {
                mobile: mobile
            }
            axios(config)
                .then((response) => {
                    console.log(response.data.status);
                    if (response.data.status == 'success') {
                        db.get().collection('users').findOne({mobile: mobile}, (err, result) => {
                            if (err) throw err;
                            if(result == null) {
                                db.get().collection('users').insertOne(user, (err, done) => {
                                    if(err) throw err;
                                    console.log('one user logged in');
                                     req.session.user = user._id;
                                    res.redirect('/user')
                                })
                            } else {
                                console.log("user already exist");
                                 req.session.user = result._id;
                                res.redirect('/user')
                            }
                            
                        })

                    } else {
                        res.redirect('/user/otplogin')
                    }
                })
                .catch(function (error) {
                    // req.flash('error', 'Something went wrong');
                    res.redirect('/user/otpVerify');
                });
>>>>>>> master
            
        },
        postGoogleLogin(req, res) {
            res.redirect('/user')
        },
        postfacebookLogin(req, res) {
            res.redirect('/user')
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
                        req.session.user = user
                        res.redirect('/user')
                    })

                }
                else {
                    console.log("user already exist");
                    res.redirect('/user/register')
                }
            })

            

        },
        logout(req, res) {
            console.log(req.session);
            req.session.user = null;
            console.log(req.session);
            req.logout();
            res.redirect('/user/login')
        }
    }
}
module.exports = homeController;