const db = require('../../../config/connection');
const collection = require('../../../config/collections')
var ObjectID = require('mongodb').ObjectID;

function searchController() {
    return {
        async domainSearch(req, res) {
            const allJobs = await db.get().collection(collection.JOBS).find({status: 'completed'}).sort({ _id : -1 }).toArray();
            let headers = [];
            for (let i in allJobs) {
                let str = allJobs[i].header.toLowerCase().replace(/\s/g, "")
                headers = [...headers, str]
            }
            res.json(headers)
            
        },
        async postDomainIndexes(req, res){
            const allJobs = await db.get().collection(collection.JOBS).find({status: 'completed'}).sort({ _id : -1 }).toArray();
            let headers = [];
            for (let i in allJobs) {
                let str = allJobs[i].header
                headers = [...headers, str]
            }
            let index = req.body
            let domains = [];
            for(let i in index) {
                domains = [...domains, headers[index[i]]]
            }
            res.json(domains)
        }
    }
}

module.exports = searchController;