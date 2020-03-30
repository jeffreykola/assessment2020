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

const database = new Datastore('taskDatabase.db');
database.loadDatabase();

var numberOfTasks = 0;
//POST route for adding a task
app.post('/', (req,res)=>{
    const data = req.body;
    database.insert(data);
    res.sendStatus(200);
    console.log(`Added a task to the database`);
});

//GET route for getting all the tasks

app.get('/data', (req, res)=> {  
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


