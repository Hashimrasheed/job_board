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
            res.render('user/jobDetails', {name: null, pic : null , user: true, job: job[0]})
        },
        async jobQuestions(req, res) {
            const jobId = new ObjectID(req.params.id)
            const job = await db.get().collection(collection.JOBS).find({_id: jobId}).toArray()
            
            res.render('user/jobQuestions', {name: null, pic : null , job: job[0]})
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
            console.log('ho');
            const jobId = new ObjectID(req.body.id)
            // const userId = new ObjectID(req.body.userId)
            console.log(req.body.userId);
            const user = await db.get().collection(collection.USERS).findOne({_id: req.body.userId})
            console.log(user);
            
            // db.get().collection(collection.JOBS).updateOne({_id: jobId}, {$set: {Questions: [questions]}}, () => {
            //     // res.redirect(`/user/jobdetails/${jobId}`)
            // })
        }
    }
}

module.exports = jobController;