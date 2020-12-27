var express = require('express')
var mySQLDAO = require('./mySQLDAO')//import mySQl queries from mySql File
var mongoDAO = require('./mongoDAO')//import mongoDB queries from Mongo File
var bodyParser = require('body-parser')//import body parser
const { body, validationResult, check } = require('express-validator')//import express validator

var app = express()
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({//Body Parser
    extended: false
}));

app.get('/', (req, res) => {//Root Page will match request to /
    res.send("<a href='/listCountries'>List Countries</a> </br> <a href='/listCities'>List Cities</a> </br> <a href='/listHeadsOfState'>List Heads of State</a>")
})

app.get('/listCountries', (req, res) => {//listCountries Page will match request to /listCountries
    //calls getCountries function from mySQL which then renders the listCountries.ejs FIle and sends the data to it
    mySQLDAO.getCountries()
        .then((result) => {
            res.render('listCountries', { countries: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get('/listCities', (req,res) => {//listCities Page will match request to /listCities
    //calls getCities function from mySQL which then renders the listCities.ejs FIle and sends the data to it
    mySQLDAO.getCities() 
    .then((result) => {
        res.render('listCities', { cities: result })
    })
    .catch((error) => {
        res.send(error)
    })
})

app.get('/allDetails/:cty_code', (req,res) => {//allDetails/:cty_code page will math request ro //allDetails/:cty_code (:cty_code being the code of the city clicked on)
     //calls getCity function from mySQL which then renders the allDetails.ejs FIle and sends the data of the specified co_code to it
    mySQLDAO.getCity(req.params.cty_code)
    .then((result) => {
        res.render('allDetails', { city: result })
    })
    .catch((error) => {
        res.send(error)
    })
})

app.get('/edit/:co_code', (req, res) => {//edit/:co_code page will math request ro //edit/:co_code 
    //calls getCountry function from mySQL which then renders the editCountry.ejs FIle and sends the data of the specified co_code 
    //to it which allows user to edit it
    mySQLDAO.getCountry(req.params.co_code)
        .then((result) => {
            res.render('editCountry', { country: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get('/edit', (req, res) => {//edit page will math request ro //edit
    //calls getCountry function from mySQL which then renders the editCountry.ejs FIle and sends the data of the specified co_code 
    //to it which allows user to edit it
    mySQLDAO.getCountry(req.params.co_code)
        .then((result) => {
            res.render('editCountry', { country: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get('/addCountry', (req,res) => {//addCountry page will math request ro //addCountry
    //renders the addCountry.ejs file 
    res.render('addCountry')
})

app.post('/addCountry', (req, res) => {//addCountry Post runs when Post is called
    //when the post /addCountry gets called in ejs this runs sending the data in the input boxes to 
    //the addCountry function and than if it works redirecting users to the listCountries page
    mySQLDAO.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
    .then((result) => {
        res.redirect("/listCountries")
    })
    .catch((error) => {
        if(error.errno == 1062 ){
            res.send("Error: Country : " + req.body.co_code + ": already exists!" + "</br> <a href='/'>Home</a>")
        }
        res.send(error)
    })
})

app.post('/edit', (req, res) => {//edit Post runs when Post is called
    //if not an error editConutry function getsd called in mySQL editing the specifed co_code 
    //and changing the values of the row
    var temp = req.body.co_name;
    if (temp.length <= 0) {
        error = 'Name Cannot Be Empty'
        res.send(error + "</br><a href='/'>HOME</a>")
    } else {
        mySQLDAO.editCountry(req.body.co_code, req.body.co_name, req.body.co_details)
            .then((result) => {
                res.redirect("/listCountries")
            })
            .catch((error) => {
                res.send(error)
            })
    }

})

app.get('/delete/:co_code', (req, res) => {///delete/:co_code Page will match request to //delete/:co_code
    //calls deleteCountry function in mySQL and get the specific country by its co_code and delets it
    mySQLDAO.deleteCountry(req.params.co_code)
        .then((result) => {
            if (result.affectedRows == 0) {
                res.send("<h3>Country: " + req.params.co_code + " doesnt exist</h3>" + "<a href='/'>Home</a>")
            } else {
                res.send("<h3>Country: " + req.params.co_code + " deleted</h3>" + "<a href='/'>Home</a>")
            }
        })
        .catch((error) => {
            if (error.errno == 1451) {
                res.send("<h1>Error Message</h1>" + "<h3>" + req.params.co_code + " has cities, it cannot be deleted</h3>" + "<a href='/'>Home</a>")
            } else {
                res.send("<h3>ERROR: " + error.errno + " " + error.sqlMessage + " </h3>" + "<a href='/'>Home</a>")
            }
        })
})


app.get('/listHeadsOfState', (req, res) => {//listHeadsOfState Page will match request to /listHeadsOfState
    //calls getHeadsOfState function in mongo whic runs a query that send all data to documents 
    //documents than get sent to listOfStates.ejs where they get stored under states
    mongoDAO.getHeadsOfState()
    .then((documents) => {
        res.render('listHeadOfStates', { states: documents })
    })
    .catch((error) => {
        res.send(error)
    })
})


app.get('/addHeadOfState', (req, res) =>{//addHeadOfState Page will match request to /addHeadOfState
    //renders and opends addHeadOfState.ejs
    res.render("addHeadOfState")
})

app.post('/addHeadOfState', (req,res) => {//addHeadOfState Post runs when Post is called
    //addHeadOfState function gets called in mongoDao which take to params from the input boxes 
    //the two params get stored under _id and headOfState and than get added to colection
    mongoDAO.addHeadOfState(req.body._id, req.body.headOfState)
    .then((result) => {
        res.redirect('/listHeadsOfState')
    })
    .catch((error) => {
        if(error.message.includes("11000")){
            res.send("Error: Head of State with ID: " + req.body._id + " already exists")
        }
        res.send(error)
    })
})

app.listen(3000, () => {
    console.log("Listening on Port 3000")
})



