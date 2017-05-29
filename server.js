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
    user: 'Info445',
    password: getPass(),
    server: 'is-hay04.ischool.uw.edu',
    //need to put in the database! 
    database: 'WeedWorld'
  }
  return sql.connect(config)
}

function displayAllPersons() {
  console.log("displaying top 1000 Customer");
  return new sql.Request().query('SELECT TOP 1000 * FROM dbo.Customer ORDER BY CustomerID DESC');
}

/*
Returns the top 1000 Weeds in the DB
*/
function displayAllWeeds() {
  console.log("displaying top 1000 Product");
  return new sql.Request().query('SELECT TOP 1000 * FROM dbo.Product ORDER BY ProductID DESC');
}

function displayAllEvents() {
  console.log("displaying top 1000 Events");
  return new sql.Request().query('SELECT TOP 1000 * FROM dbo.EVENT ORDER BY EventID DESC');
}

function updatePerson(PersonID, PersonFname, PersonLname, PersonDOB) {
  console.log("Updating Customer");
  var query = "UPDATE dbo.Customer SET Fname='" + PersonFname + "', Lname='"
      + PersonLname + "', DOB='" + PersonDOB +  "' WHERE PersonID=" + PersonID;
  console.log(query);
  return new sql.Request().query(query);
}

function updateWeed(WeedID, WeedName, WeedDesc) {
  console.log("Updating Weed");
  var query = "UPDATE dbo.Weed SET WeedName='" + WeedName + "', WeedDesc='"
      + WeedDesc +  "' WHERE WeedID=" + WeedID;
  console.log(query);
  return new sql.Request().query(query);
}

function createPerson(PersonFname, PersonLname, PersonDOB) {
  console.log("Creating Person");
  return new sql.Request()
    .input('Fname', sql.VarChar(30), PersonFname)
    .input('Lname', sql.VarChar(30), PersonLname)
    .input('DOB', sql.Date(), PersonDOB)
    .execute('dbo.up_PopulateCustomers')
}

function createWeed(WeedName, WeedDesc) {
  console.log("Creating Weed");
  return new sql.Request()
    .input('WeedName', sql.VarChar(30), WeedName)
    .input('WeedDesc', sql.VarChar(30), WeedDesc)
    .execute('dbo.us_PoplateEmployees')
}

function createEvent(EventType, WeedName, Quantity, Time, Fridge, TeamPersonID) {
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

function deleteWeed(WeedID) {
  console.log("Deleting Weed");
  var query = "DELETE FROM dbo.Weed WHERE WeedID=" + WeedID;
  console.log(query);
  return new sql.Request().query(query);
}

function getPersonObject(PersonID) {
    return new sql.Request().query('SELECT * FROM dbo.PERSON WHERE PersonID =' + PersonID);
}

function getWeedObject(WeedID) {
    return new sql.Request().query('SELECT * FROM dbo.Weed WHERE WeedID =' + WeedID);
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

  app.get('/Weeds/all', function (req, res) {
    displayAllWeeds().then(function (data) {
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

  app.get('/editWeed/:WeedID', function (req, res) {
    res.sendFile('/static/views/editWeed.html', { root: __dirname })
  })
  
  app.get("/getPerson/:PersonID", function(req, res) {
    var PersonID = req.params.PersonID;
    console.log(PersonID);
    getPersonObject(PersonID).then(function(data) {
      return res.json(data);
    })
  })

  app.get("/getWeed/:WeedID", function(req, res) {
    var WeedID = req.params.WeedID;
    console.log(WeedID);
    getWeedObject(WeedID).then(function(data) {
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

  app.get("/deleteWeed/:WeedID", function(req, res) {
    var WeedID = req.params.WeedID;
    deleteWeed(WeedID).then(function(data) {
      res.redirect('/')
    })
  })
  
  app.get('/deleteWeed', function (req, res) {
    deleteWeed(WeedID).then(function () {
      console.log(req.WeedID);
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

  app.post('/createWeed', function (req, res) {
    connectToDb().then(function () {
      var WeedID = req.body.WeedID;
      var WeedName = req.body.WeedName;
      var WeedDesc = req.body.WeedDesc;

      createWeed(WeedName, WeedDesc).then(function () {
        res.redirect('/')
      }).catch(function (err) {
        console.log(err);
      });
    });
  })

    app.post('/createEvent', function (req, res) {
    connectToDb().then(function () {
      var EventType = req.body.EventType;
      var WeedName = req.body.WeedName;
      var Quantity = req.body.Quantity;
      var Time = req.body.Time;
      var Fridge = req.body.Fridge;
      var TeamPersonID = req.body.TeamPersonID;

      createEvent(EventType, WeedName, Quantity, Time, Fridge, TeamPersonID).then(function () {
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

  app.post('/WeedSubmit', function (req, res) {
    connectToDb().then(function () {
      var WeedID = req.body.WeedID;
      var WeedName = req.body.WeedName;
      var WeedDesc = req.body.WeedDesc;
      updateWeed(WeedID, WeedName, WeedDesc).then(function() {
          res.redirect('/')
      });
    }).catch(function (error) {
      console.log(error);
    });
  })

  app.post('/submit', function (req, res) {
    connectToDb().then(function () {
      var WeedName = req.body.WeedName;
      var WeedDesc = req.body.WeedDesc;
      console.log(WeedName);

      addCustomer(WeedName, DrinkDesc).then(function () {
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
    app.listen(process.env.PORT || 3000);
  })
}

startParty()