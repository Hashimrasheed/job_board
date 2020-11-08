const db = require('../../../config/connection');
const collection = require('../../../config/collections')

function authController() {
    return {
        async employers(req, res) {
            const employer = await db.get().collection(collection.EMPLOYERS).find().toArray()
            console.log(employer);
            res.render('admin/employers', {employer})
        }
    }
}

module.exports = authController;