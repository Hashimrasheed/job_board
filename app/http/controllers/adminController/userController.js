const db = require('../../../config/connection');
const collection = require('../../../config/collections')
var ObjectID = require('mongodb').ObjectID;

function authController() {
    return {
        async users(req, res) {
            const users = await db.get().collection(collection.USERS).find({status: {$ne: 'blocked'}}).toArray();
            res.render('admin/users', {users})
        },
        async editUser(req, res) {
            const user = await db.get().collection(collection.USERS).find().toArray();
            res.render('admin/editUsers', {user})
        },
        async postuseredit(req, res) {
            const id = req.body.id
            let oid = new ObjectID(id)
            const user = await db.get().collection(collection.USERS).findOne({_id: oid});
            res.render('admin/editUsers', {user})
        },
        async usereditsave(req, res) {
            let oid = new ObjectID(req.body.id)
            await db.get().collection(collection.USERS).updateOne({_id: oid}, { $set: {name: req.body.name, email: req.body.email, mobile: req.body.mobile}})
            res.redirect('/admin/users')
        },
        async userblock(req, res) {
            let oid = new ObjectID(req.body.id)
            await db.get().collection(collection.USERS).updateOne({_id: oid}, { $set: {status: 'blocked'}})
            res.redirect('/admin/users')
        },
        async blockedUsers(req, res) {
            const users = await db.get().collection(collection.USERS).find({status: 'blocked'}).toArray();
            res.render('admin/blockedusers', {users})
        },
        async userUnblock(req, res) {
            let oid = new ObjectID(req.body.id)
            await db.get().collection(collection.USERS).updateOne({_id: oid}, { $set: {status: undefined}})
            res.redirect('/admin/blockedusers')
        }
    }
}

module.exports = authController;