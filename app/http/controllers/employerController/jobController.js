const db = require('../../../config/connection');
const collection = require('../../../config/collections')
var ObjectID = require('mongodb').ObjectID;


function jobController() {
    return {
        async displayJobs(req, res) {
            const jobs = await db.get().collection(collection.JOBS).find({companyEmail: req.session.employer.email}).toArray()
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
                description: req.body.description,
                skills: req.body.skills,
                companyEmail: req.body.email,
                requirements: req.body.jobrequirements,
                status: 'progress'

            }
            db.get().collection(collection.JOBS).insertOne(job).then((data) => {
                let id = data.ops[0]._id
                logo.mv('public/images/brandLogo/'+id+'.png', (err) => {
                    if(!err) {
                        res.redirect(`/employer/jobquestions/${id}`)
                    } else {
                        console.log(err);
                    }
                })
            })
        },
        async editJob(req, res) {
            const employer = req.session.employer
            let id = req.params.id
            const job = await db.get().collection(collection.JOBS).aggregate([
                {
                    $match: {_id: ObjectID(id)}
                }
            ]).toArray()
            console.log(job);
            res.render('employer/editJob', {employer, job: job[0]})
        },
        async deletejob(req, res) {
            let id = req.params.id
            await db.get().collection(collection.JOBS).deleteOne({_id: ObjectID(id)})
            res.redirect('/employer/jobs')
        },
        async jobQuestions(req, res) {
            const jobId = new ObjectID(req.params.id)
            res.render('employer/jobquestions', {jobId})
        },
        postjobQuestions(req, res) {
            const jobId = new ObjectID(req.body.id)
            db.get().collection(collection.JOBS).updateOne({_id: jobId}, {$set: {jobquestions: req.body.jobquestions, status: 'completed'}}, () => {
                res.redirect('/employer/jobs')
            })

        }
    }
}

module.exports = jobController;