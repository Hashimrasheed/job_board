const db = require('../../../config/connection');
const collection = require('../../../config/collections')

function jobController() {
    return {
        async displayJobs(req, res) {
            const jobs = await db.get().collection(collection.JOBS).find({companyEmail: req.session.employer.email}).toArray()
            console.log(jobs);
            const employer = req.session.employer
            res.render('employer/jobs', {jobs, employer})
            
        },
        addJobs(req, res) {
            const employer = req.session.employer
            res.render('employer/addJob', {employer})
        },
        postAddJob(req, res) {
            let logo = req.files.logo;
            let job = {
                header: req.body.header,
                companyName: req.body.companyName,
                location: req.body.location,
                hiresNum: req.body.hiresNum,
                minimumSalary: req.body.minimumSalary,
                maximumSalary: req.body.maximumSalary,
                minExp: req.body.minExp,
                maxExp: req.body.maxExp,
                workTime: req.body.workTime,
                discription: req.body.discription,
                skills: req.body.skills,
                companyEmail: req.body.email
            }
            db.get().collection(collection.JOBS).insertOne(job).then((data) => {
                let id = data.ops[0]._id
                logo.mv('public/images/brandLogo/'+id+'.png', (err) => {
                    if(!err) {
                        res.redirect('/employer/jobs')
                    } else {
                        console.log(err);
                    }
                })
            })
        }
    }
}

module.exports = jobController;