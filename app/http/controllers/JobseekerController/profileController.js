const db = require('../../../config/connection');
const collection = require('../../../config/collections')
var ObjectID = require('mongodb').ObjectID;

function profileController() {
    return {
        async userProfile(req, res) {
            const userId = new ObjectID(req.params.id)
            const user = await db.get().collection(collection.USERS).findOne({_id: userId})
            
        res.render('user/userProfile', {user})
        },
        editProfile(req, res) {
            res.render('user/profileEdit')
        },
        async postEditProfile(req, res) {
            const user = {
                name: req.body.fname + " " + req.body.lname,
                mobile: req.body.mobile,
                email: req.body.email,
                professionalTitle: req.body.professionalTitle,
                profilesummary: req.body.profilesummary,
                location: req.body.location,
                skills: req.body.skills,
                education: req.body.education,
                experience: req.body.experience,
                profilePic: true,
            }
            profilePic = req.files.profilePic
            const userId = new ObjectID(req.body.id)
            await db.get().collection(collection.USERS).updateOne({_id: userId}, {$set: user})
            const usersession = await db.get().collection(collection.USERS).findOne({_id: userId})
            profilePic.mv(`public/images/userProfile/${userId}.jpg`, (err) => {
                if(!err) {
                    req.session.user = usersession;
                    res.redirect(`/user/resumeupload`)
                } else {
                    console.log(err);
                }
            })
            
            
        },
        resumeUpload(req, res) {
            res.render('user/resumeupload')
        },
        async resumeAdd(req, res) {
            resume = req.files.resume
            const userId = new ObjectID(req.body.id)
            await db.get().collection(collection.USERS).updateOne({_id: userId}, {$set: {resume: true}}, () => {
                resume.mv(`public/images/userResume/${userId}.pdf`, (err) => {
                    if(!err) {
                        
                        res.redirect(`/user/profile/${userId}`)
                    } else {
                        console.log(err);
                    }
                })
            })
            
        }
    }
}

module.exports = profileController;