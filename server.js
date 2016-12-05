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
  console.log("display Persons");
  return new sql.Request().query('SELECT * FROM dbo.PERSON');
}

function updatePerson(PersonID, PersonFname, PersonLname, PersonDOB) {
  console.log("Updating Person");
  var query = "UPDATE dbo.PERSON SET PersonFname='" + PersonFname + "', PersonLname="
      + PersonLname + ", PersonDOB=" + PersonDOB +  "' WHERE PersonID=" + PersonID;
  console.log(query);
  return new sql.Request().query(query);
}

function createPerson(PersonFname, PersonLname, PersonDOB) {
  console.log("Creating Person");
  return new sql.Request()
    .input('PersonFname', sql.VarChar(30), PersonFname)
    .input('PersonLname', sql.VarChar(30), PersonLname)
    .input('PersonDOB', sql.Date(), PersonDOB)
    .execute('dbo.uspNewPerson')
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

  app.get('/edit/:PersonID', function (req, res) {
    res.sendFile('/static/views/edit.html', { root: __dirname })
  })
  
  app.get("/getPerson/:PersonID", function(req, res) {
    var PersonID = req.params.PersonID;
    console.log(PersonID);
    getPersonObject(PersonID).then(function(data) {
      return res.json(data);
    })
  })

  app.get("/delete/:PersonID", function(req, res) {
    var PersonID = req.params.PersonID;
    deletePerson(PersonID).then(function(data) {
      res.redirect('/')
    })
  })
  
  app.get('/delete', function (req, res) {
    deletePerson(PersonID).then(function () {
      console.log(req.PersonID);
      res.redirect('/')
    }).catch(function (err) {
      console.log(err);
    });
  })

  app.post('/create', function (req, res) {
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