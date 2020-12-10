const db = require('../../../config/connection');
const collection = require('../../../config/collections')
var ObjectID = require('mongodb').ObjectID;

function searchController() {
    return {
        async domainSearch(req, res) {
            const allJobs = await db.get().collection(collection.JOBS).find({status: 'completed', block: false}).sort({ _id : -1 }).toArray();
            let headers = [];
            for (let i in allJobs) {
                let str = allJobs[i].header.toLowerCase().replace(/\s/g, "")
                headers = [...headers, str]
            }
            res.json(headers)
            
        },
        async postDomainIndexes(req, res){
            const allJobs = await db.get().collection(collection.JOBS).find({status: 'completed', block: false}).sort({ _id : -1 }).toArray();
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
        },
        async locationSearch(req, res) {
            const allJobs = await db.get().collection(collection.JOBS).find({status: 'completed', block: false}).sort({ _id : -1 }).toArray();
            let location = [];
            for (let i in allJobs) {
                let str = allJobs[i].location.toLowerCase().replace(/\s/g, "")
                location = [...location, str]
            }
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
              
            // usage example:
            
            var unique = location.filter(onlyUnique);
            res.json(unique)
        },
        async submitSearch(req, res) {
            console.log(req.body);
            let header = req.body.header
            let location = req.body.location
            
            console.log(header);
            if(header ==='' && location === '') {
                
                const allJobs = ''
                res.json(allJobs)
            }else if(location === '') {
                const allJobs = await db.get().collection(collection.JOBS).find({header: {$regex: `${header}`, $options: "i"}}).sort({ _id : -1 }).toArray();
                console.log(allJobs);
                res.json(allJobs)
            }else {
                const allJobs = await db.get().collection(collection.JOBS).find({header: {$regex: `${header}`, $options: "i"}, location: {$regex: `^${location}`}}).sort({ _id : -1 }).toArray();
                res.json(allJobs)
            }
        }
    }
}

module.exports = searchController;