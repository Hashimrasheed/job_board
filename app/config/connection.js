const mongoClient = require('mongodb').MongoClient
const state = {
    db: null
}
module.exports.connect = function(done) {
    const url = 'mongodb+srv://Hashim:Hashim@30@cluster0.wysex.mongodb.net/jobBoard?retryWrites=true&w=majority'
    const dbname = 'jobBoard'
    // 'mongodb+srv://Hashim:Hashim@30@cluster0.wysex.mongodb.net/luviaka?retryWrites=true&w=majority'
    // mongodb://localhost:27017
    mongoClient.connect(url, { useUnifiedTopology: true }, (err, data) => {
        if(err) return done(err)
        state.db = data.db(dbname)
    })
    done();
}

module.exports.get = function() {
    return state.db
}