const express = require('express');
const app = express();
const Datastore = require('nedb');
var escape = require('escape-html');

//const fs = require('fs');
const bodyParser = require("body-parser");
const fs = require('fs');
app.use(express.static('assets'));
app.use(express.static('styles'));
app.use(express.static('./'));
//Find out what this means
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
     
var numFiles = 0;

//POST route for adding a task

function checkIfExists(filename){
    const path = `./${filename}`;
    console.log(path);
    try {
        if (fs.existsSync(path)) {
            return true;
        }else{
            return false;
        }
    } catch(err) {
        console.error(err)
    }
}

const glob = require('glob');
let subjects = [];

glob('./**/*.db', {}, (err, files)=>{
  for(i=0;i<files.length;i++){
      subjects.push(files[i]);
      numFiles = subjects.length;
  }
});


app.get('/subjects', function(req, res){
    // jsonSubjects = JSON.stringify(subjects);
    res.json(subjects);
});


app.get('/search', function(req, res){
    if(checkIfExists(`./db_files/${req.query.search}_tasks.db`)){
        res.json({"code":"found"});
    }else{
        res.json({'code':"not found"});
    }
});
app.post('/', function(req,res){
    const data = req.body;
    var database = new Datastore(`${req.body.module}_tasks.db`);
    database.loadDatabase();
    data.taskName = escape(data.taskName);
    data.description = escape(data.description);
    database.insert(data);
    res.sendStatus(200);
});


app.post('/add', function(req, res){
    if(numFiles < 6){
    var database = new Datastore(`./db_files/${req.body.subject}_tasks.db`);
    database.loadDatabase();
    res.sendStatus(200);
    }else{
        res.sendStatus(500);
    }
});

//GET route for getting all the tasks

app.get(`/data`, function(req,res){
    //console.log("received");
    console.log(`${req.query.id}_tasks.db`)
    var database = new Datastore(`./db_files/${req.query.id}_tasks.db`);
    database.loadDatabase();
    database.find({}, (error, data)=>{ 
        if (error){
            res.json({'code': 600});
            res.end();
        }
        //console.log(data);
        res.send(JSON.stringify(data));
    });
});

app.listen(3000);

module.exports = app;