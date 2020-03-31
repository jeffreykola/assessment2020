const fetch = require('node-fetch');
const express = require('express');
const app = express();
const Datastore = require('nedb');

const http = require('http');
//const fs = require('fs');
const bodyParser = require("body-parser");
app.use(express.static('assets'));
app.use(express.static('styles'));
app.use(express.static('./'));
//Find out what this means
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


//POST route for adding a task
app.post('/', function(req,res){
    const data = req.body;
    var database = new Datastore(`${req.body.module}_tasks.db`);
    database.loadDatabase();
    database.insert(data);
    res.sendStatus(200);
    console.log(`Added a task to the database`);
});

//GET route for getting all the tasks

app.get(`/data`, function(req,res){
    console.log("received");
    console.log(`${req.query.id}_tasks.db`)
    var database = new Datastore(`${req.query.id}_tasks.db`);
    database.loadDatabase();
    database.find({}, (error, data)=>{ 
        if (error){
            res.json({'code': 600});
            res.end();
        }
        console.log(data);
        res.send(JSON.stringify(data));
    });
});

app.listen(3000);

