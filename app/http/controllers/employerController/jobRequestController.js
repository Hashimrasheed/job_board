const db = require('../../../config/connection');
const collection = require('../../../config/collections')
var ObjectID = require('mongodb').ObjectID;


function jobrequestController() {
    return {
        async rejectRequest(req, res) {
            const jobId = req.params.jobId
            const userId = req.params.userId
            
            await db.get().collection(collection.USERS).updateOne({_id: ObjectID(userId)}, {$set: {appliedJobs: [{jobId: jobId, status: 'rejected'}]}})
            res.redirect('/employer/jobs')
        },
        async approveRequest(req, res) {
            const jobId = req.params.jobId
            const userId = req.params.userId
            await db.get().collection(collection.USERS).updateOne({_id: ObjectID(userId)}, {$set: {appliedJobs: [{jobId: jobId, status: 'approved'}]}})
            res.redirect('/employer/jobs')
        },
        async rejectedJobs(req, res) {
            let users = await db.get().collection(collection.USERS).aggregate([
                {
                    $unwind: "$appliedJobs"
                },
                {
                    $match: {"appliedJobs.status": "rejected"}
                }
            ]).toArray()
            res.render('employer/rejectedJobs', {jobs: users})
            console.log(users);
        },
        async approvedJobs(req, res) {
            let users = await db.get().collection(collection.USERS).aggregate([
                {
                    $unwind: "$appliedJobs"
                },
                {
                    $match: {"appliedJobs.status": "approved"}
                }
            ]).toArray()
            res.render('employer/approvedJobs', {jobs: users})
        }
    }
}

module.exports = jobrequestController;