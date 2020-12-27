const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

const dbname = 'headOfStateDB'
const collName = 'headsOfState'

var headsOfStateDB
var headsOfState

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        headsOfStateDB = client.db(dbname)
        headsOfState = headsOfStateDB.collection(collName)
    })
    .catch((error) => {
        console.log(error)
    })

//getHeadsOfState function that calls query that displays all headsOfState from DB
var getHeadsOfState = function () {
    return new Promise((resolve, reject) => {
        var cursor = headsOfState.find()
        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//addHeadOfState function that calls query that adds only one country that adds its (_id, headOfState)
var addHeadOfState = function (_id, headOfState) {
    return new Promise((resolve, reject) => {
        headsOfState.insertOne({ "_id": _id, "headOfState": headOfState })
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

module.exports = { getHeadsOfState, addHeadOfState }