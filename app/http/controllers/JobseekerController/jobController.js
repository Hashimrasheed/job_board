const db = require('../../../config/connection');
const collection = require('../../../config/collections')
var ObjectID = require('mongodb').ObjectID;

function jobController() {
    return {
        async displayJobs(req, res) {
            const jobs = await db.get().collection(collection.JOBS).find({status: 'completed'}).toArray()
            const employers = await db.get().collection(collection.EMPLOYERS).find().toArray();
            
            if(req.session.user) {
                if(!req.user) {
                    if(req.session.user.mobile == Number) {
                        res.render('user/alljobs', {name: 'Hi..',pic:'/assets/images/avatars/guest-user.jpg', jobs})
                    } else {
                        res.render('user/alljobs', {name: req.session.user.name,pic:'/assets/images/avatars/guest-user.jpg', jobs})
                    }
                }else {
                    if(req.user.provider == 'facebook') {
                        res.render('user/alljobs', {name:req.user.displayName,pic:req.user.photos[0].value, jobs});
                    } else if(req.user.provider == 'google') {
                        res.render('user/alljobs', {name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value, jobs})
                    }
                }
            } else {
                res.render('home', {name: null, pic : null , jobs, employers})
            }
        },
        async jobDetails(req, res) {
            const jobId = new ObjectID(req.params.id)
            const job = await db.get().collection(collection.JOBS).find({_id: jobId}).toArray()
            let empEmail = job[0].companyEmail
            const employer = await db.get().collection(collection.EMPLOYERS).aggregate([
                {
                    $match: {email: empEmail}
                }
            ]).toArray()
            res.render('user/jobDetails', {name: null, pic : null , user: true, job: job[0], employer: employer[0], success: req.flash('success'), error: req.flash('error')})
        },
        async jobQuestions(req, res) {
            const jobId = new ObjectID(req.params.id)
            const userId = new ObjectID(req.params.userId)

            const user=await db.get().collection(collection.JOBS).aggregate([
                {
                    $match: {_id: jobId}
                },
                {
                    $unwind: "$jobrequests"
                },
                {
                    $match: { "jobrequests.userId": ObjectID(userId) }
                },
            ]).toArray()
            if(user.length == 0) {
                const job = await db.get().collection(collection.JOBS).find({_id: jobId}).toArray()
                res.render('user/jobQuestions', {name: null, pic : null , job: job[0]})
            }else {
                req.flash('error', 'You Already applied for this job')
                res.redirect(`/user/jobdetails/${jobId}`)
            }

        },
        async postJobQuestions(req, res) {
            const jobquestions = req.body.questions
            const jobAnswers = req.body.userAnswers
            let questions = {}
            for(let i = 0; i < jobquestions.length; i++) {
                for(let j = 0; j < jobquestions.length; j++) {
                    if(i == j) {
                        questions[jobquestions[i]] = jobAnswers[i]
                    }
                }
            }
            const jobId = new ObjectID(req.body.id)
            const userId = new ObjectID(req.body.userId)
            // const user = await db.get().collection(collection.USERS).findOne({_id: userId})
            await db.get().collection(collection.JOBS).updateOne({_id: jobId}, {$push: {jobrequests:  {userId: ObjectID(userId), questions: questions}}})
            await db.get().collection(collection.USERS).updateOne({_id: userId}, {$push: {appliedJobs:  {jobId: ObjectID(jobId), createdAt: Date.now(), status: 'applied'}}})
            req.flash('success', 'Applied for this job')
            res.redirect(`/user/jobdetails/${jobId}`)
        },
        async appliedJobs(req, res) {
            const userId = req.params.id
            const user = await db.get().collection(collection.USERS).aggregate([
                {
                    $match: {_id: ObjectID(userId)}
                },
                
                {
                    $unwind: "$appliedJobs"
                },
                {
                    $project: {
                        name: '$name',
                        jobs: '$appliedJobs.jobId',
                        createdAt: '$appliedJobs.createdAt'

                    }
                },
                {
                    $sort : { createdAt : -1 }
                },
                {
                    $lookup: {
                        from: collection.JOBS,
                        localField: 'jobs',
                        foreignField: '_id',
                        as: 'applied'
                    }
                },
                {
                    $unwind: "$applied"
                },
                {
                    $project: {

                        jobs: '$applied',
                        
                    }
                },
            ]).toArray()
            res.render('user/appliedJobs', {jobs: user})
        }
    }
}

module.exports = jobController;