const db = require('../../../config/connection');
const collection = require('../../../config/collections')
const bcrypt = require('bcrypt');
const passport = require('passport');
let axios = require('axios')
let FormData = require('form-data')

let otpId;
let mobile;

function homeController() {
    return {
        async home(req, res) {
            const jobs = await db.get().collection(collection.JOBS).find({status: 'completed'}).sort({ _id : -1 }).limit(5).toArray();
            const employers = await db.get().collection(collection.EMPLOYERS).aggregate([]).toArray();
            const employersCount = await db.get().collection(collection.EMPLOYERS).aggregate([
                {
                    $count: 'empCount'
                }
            ]).toArray();
            const jobsCount = await db.get().collection(collection.JOBS).aggregate([
                {
                    $count: 'jobCount'
                }
            ]).toArray();

            
            if(req.session.user) {
                if(!req.user) {
                        res.render('home', {name: req.session.user.name,pic:'/assets/images/avatars/guest-user.jpg', jobs, employers, empCount: employersCount[0], jobCount: jobsCount[0]})
                }else {
                    if(req.user.provider == 'facebook') {
                        res.render('home', {name:req.user.displayName,pic:req.user.photos[0].value, jobs, employers, empCount: employersCount[0], jobCount: jobsCount[0]});
                    } else if(req.user.provider == 'google') {
                        res.render('home', {name:req.user.displayName,pic:req.user.photos[0].value, jobs, employers, empCount: employersCount[0], jobCount: jobsCount[0]})
                    }
                }
            } else {
                res.render('home', {name: null, pic : null , jobs, employers, empCount: employersCount[0], jobCount: jobsCount[0]})
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
                            req.session.user = data;
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
        },
        otpVerify(req, res) {
            res.render('user/otpVerify')
        },
        postOtpVerify(req, res) {
            let otp = req.body.otp
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
                pic: '/assets/images/avatars/guest-user.jpg',
                name: '.....',
                email: '.....',
                mobile: mobile,
                provider: otp
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
                                     req.session.user = user;
                                    res.redirect('/user')
                                })
                            } else {
                                console.log("user already exist");
                                 req.session.user = result;
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
            
        },
        postGoogleLogin(req, res) {
            db.get().collection(collection.USERS).findOne({uid: req.user.id}).then((data) => {
                req.session.user = data
                res.redirect('/user')
            })
        },
        postfacebookLogin(req, res) {
            db.get().collection(collection.USERS).findOne({uid: req.user.id}).then((data) => {
                req.session.user = data
                res.redirect('/user')
            })
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
                pic: '/assets/images/avatars/guest-user.jpg',
                mobile: '.....',
                name: req.body.username,
                email: req.body.email,
                password: hashPassword
            }

            // check the email is already exist and register
            db.get().collection('users').findOne({email: req.body.email}, (err, data) => {
                if(data == null) {
                    db.get().collection('users').insertOne(user, (err, done) => {
                        if(err) throw err;
                        req.session.user = user
                        res.redirect('/user')
                    })

                }
                else {
                    res.redirect('/user/register')
                }
            })

            

        },
        logout(req, res) {
            req.session.destroy();
            res.clearCookie('userCookie');
            req.logout();
            res.redirect('/user/login')
        }
    }
}
module.exports = homeController;