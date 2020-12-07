const db = require('../../../config/connection');
const collection = require('../../../config/collections')
var ObjectID = require('mongodb').ObjectID;
let moment = require('moment')


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
            res.render('employer/jobrequests', { jobs, jobId })
        },
        async todayapplications(req, res) {
            const jobId = req.params.id
            const users = await db.get().collection(collection.JOBS).aggregate([
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
                        time: '$jobrequests.time',
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
                        skills: '$skills',
                        time: '$time',
                    }
                },
            ]).toArray()
            
            // {
            //     $match: {time: moment().format('DD/MM/YYYY')}
            // }
            let jobs = [];
            let time = moment().format('YYYY/MM/DD')
            for (let i = 0; i < users.length; i++) {
                if(users[i].time == time){
                    jobs = [...jobs, users[i]]
                }
                
            }
            res.json(jobs)
        },
        async lastweekapplications(req, res) {
            const jobId = req.params.id
            const users = await db.get().collection(collection.JOBS).aggregate([
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
                        time: '$jobrequests.time',
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
                        skills: '$skills',
                        time: '$time',
                    }
                },
            ]).toArray()
            
            // {
            //     $match: {time: moment().format('DD/MM/YYYY')}
            // }
            let jobs = [];
            let Stime = moment().format('YYYY/MM/DD')
            let Etime = moment().subtract(7, 'days').format('YYYY/MM/DD');

            for (let i = 0; i < users.length; i++) {
                if(users[i].time <= Stime && users[i].time >= Etime){
                    jobs = [...jobs, users[i]]
                }
                
            }
            res.json(jobs)
        },
        async lastmonthapplications(req, res) {
            const jobId = req.params.id
            const users = await db.get().collection(collection.JOBS).aggregate([
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
                        time: '$jobrequests.time',
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
                        skills: '$skills',
                        time: '$time',
                    }
                },
            ]).toArray()
            
            // {
            //     $match: {time: moment().format('DD/MM/YYYY')}
            // }
            let jobs = [];
            let Stime = moment().format('YYYY/MM/DD')
            let Etime = moment().subtract(30, 'days').format('YYYY/MM/DD');
            for (let i = 0; i < users.length; i++) {
            // console.log(moment(users[i].time).isBetween(Stime, Etime));
                if(users[i].time <= Stime && users[i].time >= Etime){
                    jobs = [...jobs, users[i]]
                }
                
            }
            console.log(jobs);
            res.json(jobs)
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
            res.render('employer/jobseekerDetails', { jobs, jobId, questions : jobs[0].questions })
        }
    }
}

module.exports = jobController;