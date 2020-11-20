const db = require('../../../config/connection');
const collection = require('../../../config/collections')
var ObjectID = require('mongodb').ObjectID;


function jobController() {
    return {
        async jobrequests(req, res) {
            const jobId = req.params.id

            const jobs = await db.get().collection(collection.JOBS).aggregate([
                {
                    $match: { _id: ObjectID(jobId) }
                },
                {
                    $unwind: "$jobrequests"
                },
                {
                    $project: {
                        header: '$header',
                        companyName: '$companyName',
                        workTime: '$workTime',
                        skills: '$skills',
                        hiresNum: '$hiresNum',
                        userId: '$jobrequests.userId',
                        profilePic: '$profilePic',
                        professionalTitle: '$professionalTitle',
                        skills: '$skills'
                    }
                },
                {
                    $lookup: {
                        from: collection.USERS,
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userRequests'
                        
                    }
                },
                {
                    $unwind: "$userRequests"
                },
                {
                    $project: {
                        header: '$header',
                        hiresNum: '$hiresNum',
                        userRequests: 1,
                        companyName: '$companyName',
                        workTime: '$workTime',
                        skills: '$skills',
                        profilePic: '$profilePic',
                        professionalTitle: '$professionalTitle',
                        skills: '$skills'
                    }
                },
               
            ]).toArray()
            console.log(jobs);
            res.render('employer/jobrequests', { jobs })
        },
        async jobrequestsDetails(req, res) {
            const jobId = req.params.jobId
            const userId = req.params.userId

            const jobs = await db.get().collection(collection.JOBS).aggregate([
                {
                    $match: { _id: ObjectID(jobId) }
                },
                {
                    $unwind: "$jobrequests"
                },
                {
                    $project: {
                        header: '$header',
                        companyName: '$companyName',
                        workTime: '$workTime',
                        skills: '$skills',
                        hiresNum: '$hiresNum',
                        userId: '$jobrequests.userId',
                        questions: '$jobrequests.questions',
                        profilePic: '$profilePic',
                        professionalTitle: '$professionalTitle',
                        skills: '$skills'
                    }
                },
                {
                    $lookup: {
                        from: collection.USERS,
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userRequests'
                        
                    }
                },
                {
                    $unwind: "$userRequests"
                },
                {
                    $match: { "userRequests._id": ObjectID(userId) }
                },
                {
                    $project: {
                        header: '$header',
                        hiresNum: '$hiresNum',
                        userRequests: 1,
                        questions: '$questions',
                        companyName: '$companyName',
                        workTime: '$workTime',
                        skills: '$skills',
                        profilePic: '$profilePic',
                        professionalTitle: '$professionalTitle',
                    }
                },
               
            ]).toArray()
            console.log(jobs[0].questions);
            res.render('employer/jobseekerDetails', { jobs, questions : jobs[0].questions })
        }
    }
}

module.exports = jobController;