const db = require('../../../config/connection');
const collection = require('../../../config/collections')
var ObjectID = require('mongodb').ObjectID;


function employerProfileController() {
    return {
        async jobrequestsDetails(req, res) {
            const employer = req.session.employer;
            const empId = ObjectID(employer._id)
            const emp = await db.get().collection(collection.EMPLOYERS).findOne({_id: empId})
            // console.log(emp);
            res.render('employer/employerProfile', {employer: emp})
        },
        async profileEdit(req, res) {
            const employer = req.session.employer;
            const empId = ObjectID(employer._id)
            const emp = await db.get().collection(collection.EMPLOYERS).findOne({_id: empId})
            res.render('employer/profileEdit', {employer: emp})
        },
        async postProfileEdit(req, res) {
            console.log(req.body);
            console.log(req.files);
            const employer = {
                username: req.body.username,
                email: req.body.email,
                professionalTitle: req.body.professionalTitle,
                aboutCompany: req.body.aboutCompany,
                location: req.body.location,
            }
            logo = req.files.logo;
            const empId = new ObjectID(req.body.id)
            await db.get().collection(collection.EMPLOYERS).updateOne({_id: empId}, {$set: employer})
            const employersession = await db.get().collection(collection.EMPLOYERS).findOne({_id: empId})
            logo.mv('public/images/brandLogo/'+empId+'.png', (err) => {
                if(!err) {
                    req.session.employer = employersession;
                    res.redirect(`/employer/employerProfile`)
                } else {
                    console.log(err);
                }
            })
        }
    }
}

module.exports = employerProfileController;