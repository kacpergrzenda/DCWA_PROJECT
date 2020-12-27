var mysql = require('promise-mysql')//mySql Package
var pool

//linking mySQLDAO to mysql geography DB
mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: 'kacper',
    database: 'geography'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    })

//getCountries function that calls query that display all country from DB
var getCountries = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from country')
            .then((result) => {
                resolve(result)
            })
            .catch(() => {
                reject(error)
            })
    })
}
//getCities function that calls query that display all cites from DB
var getCities = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from city')
            .then((result) => {
                resolve(result)
            })
            .catch(() => {
                reject(error)
            })
    })
}
//getCity function that calls query that display only one city that gets it by its cty_code
var getCity = function (cty_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: "select * from city where cty_code = ?",
            values: [cty_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//getCountry function that calls query that display only one country that gets it by its co_code
var getCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: "select * from country where co_code = ?",
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//deleteCountry function that calls query that delets only one country that gets it by its co_code
var deleteCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: "delete from country where co_code = ?",
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
//editCountry function that calls query that updates only one country that edits its (co_code, co_name, co_details)
var editCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: "update country set co_name=?, co_details=? where co_code=?;",
            values: [co_name, co_details, co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
//addCountry function that calls query that adds only one country that adds its (co_code, co_name, co_details)
var addCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: "insert into country value (?, ?, ?);",
            values: [co_code, co_name, co_details]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


module.exports = { getCountries, getCountry, deleteCountry, editCountry, addCountry, getCities, getCity }