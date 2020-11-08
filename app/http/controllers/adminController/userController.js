const db = require('../../../config/connection');
const collection = require('../../../config/collections')

function authController() {
    return {
        async users(req, res) {
            const users = await db.get().collection(collection.USERS).find().toArray();
            console.log(users);
            res.render('admin/users', {users})
        }
    }
}

module.exports = authController;