const db = require('../../../config/connection');
const collection = require('../../../config/collections')
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
        async dashboard(req, res) {
            const admin = req.session.admin
            let jobsNum = await db.get().collection(collection.JOBS).aggregate([
                {
                    $count: 'count'
                }
            ]).toArray()
            let userNum = await db.get().collection(collection.USERS).aggregate([
                {
                    $count: 'count'
                }
            ]).toArray()
            let empNum = await db.get().collection(collection.EMPLOYERS).aggregate([
                {
                    $count: 'count'
                }
            ]).toArray()
            res.render('admin/dashboard', {jobsNum: jobsNum[0].count, userNum: userNum[0].count, empNum: empNum[0].count})
        },
        async headers(req, res) {
            let jobName = await db.get().collection(collection.EMPLOYERS).aggregate([
                
                {
                    $project: { "username": 1, _id: 0}
                },  
            ]).toArray()
            let jobNum = await db.get().collection(collection.JOBS).aggregate([
                {
                    $group: { _id: "$companyName",count: { $sum: 1 }}
                },
            ]).toArray()
            let jobNumArray = []
            for (let i = 0; i < jobNum.length; i++) {
                jobNumArray = [...jobNumArray, jobNum[i].count]
                
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
        },
        async requests(req, res) {
            let jobName = await db.get().collection(collection.EMPLOYERS).aggregate([
                
                {
                    $project: { "username": 1, _id: 0}
                },  
            ]).toArray()
            let jobNum = await db.get().collection(collection.JOBS).aggregate([]).toArray()
            let jobNumArray = [0, 0]
            // for (let i = 0; i < jobNum.length; i++) {
            //     if(jobNum[i].jobrequests) {
            //         jobNumArray = [...jobNumArray, jobNum[i].jobrequests.length]
            //     } else {
            //         jobNumArray = [...jobNumArray, 0]
            //     }
            // }
            for (let i = 0; i < jobName.length; i++) {
                for (let j = 0; j < jobNum.length; j++) {
                            // console.log(jobNum[3].jobrequests.length);
                    if(jobName[i].username == jobNum[j].companyName) {
                        // console.log(j);
                        
                        if(jobNum[j].jobrequests) {
                            jobNumArray[i] += jobNum[j].jobrequests.length
                        } 
                    }else {
                        console.log(j);
                        console.log(jobNum[j]);
                        console.log(jobName[i].username);
                    }
                }
            }
            let headerArray = [];
            for (let i = 0; i < jobName.length; i++) {
                headerArray = [...headerArray, ...Object.values(jobName[i])]
            }
            console.log(jobNumArray);
            console.log(jobName);
            let datas = {
                headerArray,
                jobNumArray
            }
            res.json(datas)
        }
    }
}

module.exports = authController;