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
            await db.get().collection(collection.EMPLOYERS).updateOne({_id: oid}, { $set: {status: 'blocked'}})
            res.redirect('/admin/employers')
        },
        async blockedEmployers(req, res) {
            const employer = await db.get().collection(collection.EMPLOYERS).find({status: 'blocked'}).toArray();
            res.render('admin/blockedemployers', {employer})
        },
        async employerUnblock(req, res) {
            let oid = new ObjectID(req.body.id)
            await db.get().collection(collection.EMPLOYERS).updateOne({_id: oid}, { $set: {status: undefined}})
            res.redirect('/admin/blockedemployers')
        }
    }
}

module.exports = authController;