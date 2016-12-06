'use strict'

var sql = require('mssql')
var express = require('express')
var cors = require('cors')
var path = require('path')
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/static/public'));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function getPass() {
  var pass = 'GoHuskies!'
  if (!pass) {
    throw new Error('Missing PASSWORD environment variable')
  }
  return pass
}

function connectToDb() {
  var config = {
    user: 'Info340',
    password: getPass(),
    server: 'is-hay04.ischool.uw.edu',
    database: 'MS_DRINK_DB'
  }
  return sql.connect(config)
}

function displayAllPersons() {
  console.log("displaying top 1000 Persons");
  return new sql.Request().query('SELECT TOP 1000 * FROM dbo.PERSON ORDER BY PersonID DESC');
}

/*
Returns the top 1000 drinks in the DB
*/
function displayAllDrinks() {
  console.log("displaying top 1000 Drinks");
  return new sql.Request().query('SELECT TOP 1000 * FROM dbo.DRINK ORDER BY DrinkID DESC');
}

function displayAllEvents() {
  console.log("displaying top 1000 Events");
  return new sql.Request().query('SELECT TOP 1000 * FROM dbo.EVENT ORDER BY EventID DESC');
}

function updatePerson(PersonID, PersonFname, PersonLname, PersonDOB) {
  console.log("Updating Person");
  var query = "UPDATE dbo.PERSON SET PersonFname='" + PersonFname + "', PersonLname='"
      + PersonLname + "', PersonDOB='" + PersonDOB +  "' WHERE PersonID=" + PersonID;
  console.log(query);
  return new sql.Request().query(query);
}

function updateDrink(DrinkID, DrinkName, DrinkDesc) {
  console.log("Updating Drink");
  var query = "UPDATE dbo.DRINK SET DrinkName='" + DrinkName + "', DrinkDesc='"
      + DrinkDesc +  "' WHERE DrinkID=" + DrinkID;
  console.log(query);
  return new sql.Request().query(query);
}

function createPerson(PersonFname, PersonLname, PersonDOB) {
  console.log("Creating Person");
  return new sql.Request()
    .input('Fname', sql.VarChar(30), PersonFname)
    .input('Lname', sql.VarChar(30), PersonLname)
    .input('DOB', sql.Date(), PersonDOB)
    .execute('dbo.uspNewPerson')
}

function createDrink(DrinkName, DrinkDesc) {
  console.log("Creating Drink");
  return new sql.Request()
    .input('DrinkName', sql.VarChar(30), DrinkName)
    .input('DrinkDesc', sql.VarChar(30), DrinkDesc)
    .execute('dbo.uspNewDrink')
}

function createEvent(EventType, DrinkName, Quantity, Time, Fridge, TeamPersonID) {
  console.log("Creating Event");
  return new sql.Request()
    .input('EventTypeName', sql.VarChar(30), EventType)
    .input('Quantity', sql.Int(), Quantity)
    .input('EventTime', sql.VarChar(30), Time)
    .input('FridgeName', sql.VarChar(30),Fridge)
    .input('TeamPersonID', sql.Int(), TeamPersonID)
    .execute('dbo.uspNewEvent')
}

function deletePerson(PersonID) {
  console.log("Deleting Person");
  var query = "DELETE FROM dbo.PERSON WHERE PersonID=" + PersonID;
  console.log(query);
  return new sql.Request().query(query);
}

function getPersonObject(PersonID) {
    return new sql.Request().query('SELECT * FROM dbo.PERSON WHERE PersonID =' + PersonID);
}

function getDrinkObject(DrinkID) {
    return new sql.Request().query('SELECT * FROM dbo.DRINK WHERE DrinkID =' + DrinkID);
}

//ROUTES
function makeRouter() {
  app.use(cors())  
 
  // frames
  app.get('/', function (req, res) {
    res.sendFile('/static/views/index.html', { root: __dirname })
  })

  app.get('/Persons/all', function (req, res) {
    displayAllPersons().then(function (data) {
      return res.json(data);
    });
  })

  app.get('/Drinks/all', function (req, res) {
    displayAllDrinks().then(function (data) {
      return res.json(data);
    });
  })

  app.get('/Events/all', function (req, res) {
    displayAllEvents().then(function (data) {
      return res.json(data);
    });
  })

  app.get('/editPerson/:PersonID', function (req, res) {
    res.sendFile('/static/views/editPerson.html', { root: __dirname })
  })

  app.get('/editDrink/:DrinkID', function (req, res) {
    res.sendFile('/static/views/editDrink.html', { root: __dirname })
  })
  
  app.get("/getPerson/:PersonID", function(req, res) {
    var PersonID = req.params.PersonID;
    console.log(PersonID);
    getPersonObject(PersonID).then(function(data) {
      return res.json(data);
    })
  })

  app.get("/getDrink/:DrinkID", function(req, res) {
    var DrinkID = req.params.DrinkID;
    console.log(DrinkID);
    getDrinkObject(DrinkID).then(function(data) {
      return res.json(data);
    })
  })
  app.get("/deletePerson/:PersonID", function(req, res) {
    var PersonID = req.params.PersonID;
    deletePerson(PersonID).then(function(data) {
      res.redirect('/')
    })
  })
  
  app.get('/deletePerson', function (req, res) {
    deletePerson(PersonID).then(function () {
      console.log(req.PersonID);
      res.redirect('/')
    }).catch(function (err) {
      console.log(err);
    });
  })

  app.post('/createPerson', function (req, res) {
    connectToDb().then(function () {
      var PersonID = req.body.PersonID;
      var PersonFname = req.body.PersonFname;
      var PersonLname = req.body.PersonLname;
      var PersonDOB = req.body.PersonDOB;

      createPerson(PersonFname, PersonLname, PersonDOB).then(function () {
        res.redirect('/')
      }).catch(function (err) {
        console.log(err);
      });
    });
  })

  app.post('/createDrink', function (req, res) {
    connectToDb().then(function () {
      var DrinkID = req.body.DrinkID;
      var DrinkName = req.body.DrinkName;
      var DrinkDesc = req.body.DrinkDesc;

      createDrink(DrinkName, DrinkDesc).then(function () {
        res.redirect('/')
      }).catch(function (err) {
        console.log(err);
      });
    });
  })

    app.post('/createEvent', function (req, res) {
    connectToDb().then(function () {
      var EventType = req.body.EventType;
      var DrinkName = req.body.DrinkName;
      var Quantity = req.body.Quantity;
      var Time = req.body.Time;
      var Fridge = req.body.Fridge;
      var TeamPersonID = req.body.TeamPersonID;

      createEvent(EventType, DrinkName, Quantity, Time, Fridge, TeamPersonID).then(function () {
        res.redirect('/')
      }).catch(function (err) {
        console.log(err);
      });
    });
  })

  app.post('/PersonSubmit', function (req, res) {
    connectToDb().then(function () {
      var PersonID = req.body.PersonID;
      var PersonFname = req.body.PersonFname;
      var PersonLname = req.body.PersonLname;
      var PersonDOB = req.body.PersonDOB;
      updatePerson(PersonID, PersonFname, PersonLname, PersonDOB).then(function() {
          res.redirect('/')
      });
    }).catch(function (error) {
      console.log(error);
    });
  })

  app.post('/DrinkSubmit', function (req, res) {
    connectToDb().then(function () {
      var DrinkID = req.body.DrinkID;
      var DrinkName = req.body.DrinkName;
      var DrinkDesc = req.body.DrinkDesc;
      updateDrink(DrinkID, DrinkName, DrinkDesc).then(function() {
          res.redirect('/')
      });
    }).catch(function (error) {
      console.log(error);
    });
  })

  app.post('/submit', function (req, res) {
    connectToDb().then(function () {
      var DrinkName = req.body.DrinkName;
      var DrinkDesc = req.body.DrinkDesc;
      console.log(DrinkName);

      addCustomer(DrinkName, DrinkDesc).then(function () {
        console.log(DrinkName);
        console.log("success");
        res.redirect('/account')
      }).catch(function (err) {
        // ... execute error checks 
        console.log("failed");
      });
    }).catch(function (err) {
      console.log(err);
    });
  });
}

function startParty() {
  connectToDb().then(() => {
    makeRouter();
    app.listen(3000);
  })
}

startParty()