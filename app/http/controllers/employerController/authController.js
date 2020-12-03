const db = require('../../../config/connection');
const collection = require('../../../config/collections')
const bcrypt = require('bcrypt');
let axios = require('axios')
let FormData = require('form-data')

function authController() {
    return {
        login(req, res) {
            res.render('employer/login', {error: req.flash('error')})
        },
        async postLogin(req, res) {
            const email = req.body.email;
            const password = req.body.password;
            if(email && password) {
                await db.get().collection('employer').findOne({email: req.body.email}, async (err, data) => {
                    console.log(data);
                    if(data == null) {
                        req.flash('error', 'No employer in this mail')
                        res.redirect('/employer/login')
                    } else {
                        const isMatch = await bcrypt.compare(req.body.password, data.password)
                        if(isMatch === false) {
                            req.flash('error', 'Incorrect password')
                            res.redirect('/employer/login')
                        }else {
                            req.session.employer = data;
                            res.redirect('/employer/dashboard')
                        }
                    }
                    
                })
            } else {
                req.flash('error', 'Please fill all fields')
                res.redirect('/employer/login')
            }
            
        },
        register(req, res) {
            res.render('employer/register')
        },
        async postRegister(req, res) {
            console.log(req.body.email);
            
            //hash password
            const hashPassword = await bcrypt.hash(req.body.password, 10)

            //user details
            const employer = {
                username: req.body.username,
                email: req.body.email,
                password: hashPassword
            }

            // check the email is already exist and register
            db.get().collection('employer').findOne({email: req.body.email}, (err, data) => {
                if(data == null) {
                    db.get().collection('employer').insertOne(employer, (err, done) => {
                        if(err) throw err;
                        console.log('one employer logged in');
                        req.session.employer = employer
                        res.redirect('/employer/dashboard')
                    })

                }
                else {
                    console.log("employer already exist");
                    res.redirect('/employer/register')
                }
            })

        },
        otpLogin(req, res) {
            res.render('employer/otpLogin')
        },
        postOtpLogin(req, res) {
            mobile = req.body.phone;
            console.log(mobile);
            db.get().collection('employer').findOne({mobile}, (err, result) => {
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
                        res.redirect('/employer/otpVerify');
                      })
                      .catch(() => {
                        // req.flash('error', 'No user with this number');
                        res.redirect('/employer/otplogin');
                      });
            })
        },
        otpVerify(req, res) {
            res.render('employer/otpVerify')
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
            let employer = {
                mobile: mobile
            }
            axios(config)
                .then((response) => {
                    console.log(response.data.status);
                    if (response.data.status == 'success') {
                        db.get().collection('employer').findOne({mobile: mobile}, (err, result) => {
                            if (err) throw err;
                            if(result == null) {
                                db.get().collection('employer').insertOne(employer, (err, done) => {
                                    if(err) throw err;
                                     req.session.employer = employer._id;
                                    res.redirect('/employer/dashboard')
                                })
                            } else {
                                console.log("employer already exist");
                                req.session.employer = result._id;
                                res.redirect('/employer/dashboard')
                            }
                            
                        })

                    } else {
                        res.redirect('/employer/otplogin')
                    }
                })
                .catch(function (error) {
                    // req.flash('error', 'Something went wrong');
                    res.redirect('/employer/otpVerify');
                });
            
        },
        logout(req, res){
            req.session.employer = null
            req.session.destroy();
            res.clearCookie('employerCookie');
            req.logout();
            res.redirect('/employer/login')
        },
        async dashboard(req, res) {
            const employer = req.session.employer
            let jobsNum = await db.get().collection(collection.JOBS).aggregate([
                {
                    $match: { "companyEmail": employer.email}
                },
                {
                    $count: "jobCount"
                }
            ]).toArray()
            let requests = await db.get().collection(collection.JOBS).aggregate([
                {
                    $match: { "companyEmail": employer.email}
                },
                {
                    $project: { "jobrequests": 1}
                },
                {
                    $unwind: "$jobrequests"
                },
                {
                    $count: "jobCount"
                }
            ]).toArray()
            let approveNum = await db.get().collection(collection.USERS).aggregate([
                {$group:{_id:{$gt:["$appliedJobs", null]}, count:{$sum:1}}},
             
            ]).toArray()
            
            let jobNum = await db.get().collection(collection.JOBS).aggregate([
                {
                    $match: { "companyEmail": employer.email}
                },
                {
                    $project: { "jobrequests": 1}
                },
            ]).toArray()
            // console.log(jobName);
            
            // console.log(jobNum);
            let RepliedJobs = approveNum[0].count
            let reqs = requests[0].jobCount
            let num = jobsNum[0].jobCount
            res.render('employer/dashboard', {employer, num, reqs, RepliedJobs})
        },
        async header(req, res) {
            const employer = req.session.employer;
            let jobName = await db.get().collection(collection.JOBS).aggregate([
                {
                    $match: { "companyEmail": employer.email}
                },
                {
                    $project: { "header": 1, _id: 0}
                },
            ]).toArray()
            let jobNum = await db.get().collection(collection.JOBS).aggregate([
                {
                    $match: { "companyEmail": employer.email}
                },
            ]).toArray()
            let jobNumArray = []
            for (let i = 0; i < jobNum.length; i++) {
                if(jobNum[i].jobrequests) {
                    jobNumArray = [...jobNumArray, jobNum[i].jobrequests.length]
                } else {
                    jobNumArray = [...jobNumArray, 0]
                }
                
            }

            let headerArray = [];
            for (let i = 0; i < jobName.length; i++) {
                headerArray = [...headerArray, ...Object.values(jobName[i])]
                
            }
            let datas = {
                headerArray,
                jobNumArray
            }
            res.json(datas)
        }
    }
}

module.exports = authController;