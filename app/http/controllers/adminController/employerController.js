const db = require('../../../config/connection');
const collection = require('../../../config/collections')
var ObjectID = require('mongodb').ObjectID;


function authController() {
    return {
        async employers(req, res) {
            const employer = await db.get().collection(collection.EMPLOYERS).find({status: {$ne: 'blocked'}}).toArray()
            res.render('admin/employers', {employer})
        },
        async editEmployer(req, res) {
            const employer = await db.get().collection(collection.EMPLOYERS).find().toArray();
            res.render('admin/editEmployers', {employer})
        },
        async postEmployeredit(req, res) {
            const id = req.body.id
            let oid = new ObjectID(id)
            const employer = await db.get().collection(collection.EMPLOYERS).findOne({_id: oid});
            res.render('admin/editEmployers', {employer})
        },
        async employereditsave(req, res) {
            let oid = new ObjectID(req.body.id)
            await db.get().collection(collection.EMPLOYERS).updateOne({_id: oid}, { $set: {username: req.body.username, email: req.body.email, mobile: req.body.mobile}})
            res.redirect('/admin/employers')
        },
        async employerblock(req, res) {
            let oid = new ObjectID(req.body.id)
            let emps = await db.get().collection(collection.EMPLOYERS).aggregate([
                {
                    $match: {_id: oid}
                }
            ]).toArray()
            let empEmail = emps[0].email;
            await db.get().collection(collection.EMPLOYERS).updateOne({_id: oid}, { $set: {status: 'blocked'}})
            let jobs = await db.get().collection(collection.JOBS).aggregate([
                {
                    $match: {companyEmail: empEmail}
                }
            ]).toArray()
            await db.get().collection(collection.JOBS).updateMany({companyEmail: empEmail}, { $set: {block: true}})
            res.redirect('/admin/employers')
        },
        async blockedEmployers(req, res) {
            const employer = await db.get().collection(collection.EMPLOYERS).find({status: 'blocked'}).toArray();
            res.render('admin/blockedemployers', {employer})
        },
        async employerUnblock(req, res) {
            let oid = new ObjectID(req.body.id)
            let emps = await db.get().collection(collection.EMPLOYERS).aggregate([
                {
                    $match: {_id: oid}
                }
            ]).toArray()
            let empEmail = emps[0].email;
            await db.get().collection(collection.EMPLOYERS).updateOne({_id: oid}, { $set: {status: undefined}})
            let jobs = await db.get().collection(collection.JOBS).aggregate([
                {
                    $match: {companyEmail: empEmail}
                }
            ]).toArray()
            await db.get().collection(collection.JOBS).updateMany({companyEmail: empEmail}, { $set: {block: false}})
            res.redirect('/admin/blockedemployers')
        },
        async employerDelete(req, res) {
            let oid = req.body.id
            console.log(oid);
            await db.get().collection(collection.EMPLOYERS).find({_id: ObjectID(oid)}).toArray().then(async (data)=>{
                await db.get().collection(collection.EMPLOYERS).deleteOne({_id: ObjectID(oid)})
                await db.get().collection(collection.JOBS).deleteMany({companyEmail: data[0].email})
            })
            res.redirect('/admin/employers')
        }
    }
}

module.exports = authController;