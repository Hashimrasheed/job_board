const db = require('../../../config/connection');
const collection = require('../../../config/collections')

function jobController() {
    return {
        async displayJobs(req, res) {
            const jobs = await db.get().collection(collection.JOBS).find().toArray()
            if(req.user) {
                req.session.user = req.user.id
            }
            if(req.session.user) {
                if(!req.user) {
                    if(req.session.user.mobile == Number) {
                        console.log('ho');
                        res.render('user/alljobs', {name: 'Hi..',pic:'/assets/images/avatars/guest-user.jpg', user: true, jobs})
                    } else {
                        console.log('hi');
                        res.render('user/alljobs', {name: req.session.user.name,pic:'/assets/images/avatars/guest-user.jpg', user: true, jobs})
                    }
                }else {
                    if(req.user.provider == 'facebook') {
                        res.render('user/alljobs', {name:req.user.displayName,pic:req.user.photos[0].value, user: true, jobs});
                    } else if(req.user.provider == 'google') {
                        res.render('user/alljobs', {name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value, user: true, jobs})
                    }
                }
            } else {
                res.render('home', {name: null, pic : null , user: true, jobs})
            }
        },
        jobDetails(req, res) {
            res.render('user/jobDetails', {name: null, pic : null , user: true})
        }
        
    }
}

module.exports = jobController;