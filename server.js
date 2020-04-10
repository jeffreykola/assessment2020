const express = require("express");
const app = express();
const Datastore = require("nedb");
var escape = require("escape-html");

// const fs = require('fs');
const bodyParser = require("body-parser");
const fs = require("fs");
app.use(express.static("assets"));
app.use(express.static("styles"));
app.use(express.static("./"));
// Find out what this means
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
const glob = require("glob");
var numFiles = 0;
const subjects = [];

//Boolean function to check if a file exists
function checkIfExists(filename) {
  const path = `./${filename}`;
  console.log(path);
  try {
    if (fs.existsSync(path)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
  }
}

//Boolean function to delete a file
function deleteFile(filename) {
  fs.unlink(filename, (err) => {
    if (err) {
      console.error(err);
      return false;
    }

    return true;
  });
}

function renameFile(filename, newfilename) {
  if (checkIfExists(filename)) {
    fs.renameSync(filename, newfilename);
  } else {
    return false;
  }
}

//All the files with the .db extention and adds to an array
glob("./**/*.db", {}, (err, files) => {
  try {
    for (let i = 0; i < files.length; i++) {
      subjects.push(files[i]);
      numFiles = subjects.length;
    }
  } catch (e) {
    console.log(`${err} or ${e}`);
  }
});

//GET REQUESTS
const MAX_FILES = 6;

//Get all modules
app.get("/subjects", function (req, res) {
  res.status(200).json(subjects);
});

//Search
app.get("/search", function (req, res) {
  if (checkIfExists(`./db_files/${escape(req.query.search)}_tasks.db`)) {
    res.status(409).json({ status: "found" });
  } else {
    res.status(200).json({ status: "not found" });
  }
});

//Get data for a specific subject
//Individual details
app.get("/data", function (req, res) {
  console.log(`${req.query.id}_tasks.db`);
  var database = new Datastore(`./db_files/${req.query.id}_tasks.db`);
  database.loadDatabase();
  database.find({}, (error, data) => {
    if (error) {
      res.end();
    }
    res.status(200).send(JSON.stringify(data));
  });
});

//POST REQUESTS
//Create a task
app.post("/", function (req, res) {
  const data = req.body;
  var database = new Datastore(`./db_files/${req.body.module}_tasks.db`);
  database.loadDatabase();
  data.taskName = escape(data.taskName);
  console.log(data.taskName)
  data.description = escape(data.description);
  database.insert(data, function (err) {
    res.status(500).json({ error: err });
  });
  res.sendStatus(200);
});

//Add a module
app.post("/add", function (req, res) {
  if (numFiles <= MAX_FILES) {
    var database = new Datastore(`./db_files/${req.body.module}_tasks.db`);
    database.loadDatabase();
    res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

//Delete a task
app.post("/delete", function (req, res) {
  const id = req.body.id;
  const name = req.body.name;
  var database = new Datastore(`./db_files/${name}_tasks.db`);
  database.loadDatabase();
  if (name && id) {
    database.remove({ _id: id }, {}, function (err, numRemoved) {
      if (numRemoved) {
        res.sendStatus(200);
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

//Delete a module
app.post("/dropmod", function (req, res) {
  const name = req.body.name;
  const filename = `./db_files/${name}_tasks.db`;
  if (checkIfExists(filename)) {
    deleteFile(filename);
    //Used to restart the database
    var database = new Datastore("./db_files/_tasks.db");
    database.loadDatabase();
    res.status(200).json({ name: "_tasks" });
  } else {
    res.sendStatus(404);
  }
});

//UPDATE request

app.post("/updatemod", function (req, res) {
  const filename = `./db_files/${req.body.originalName}_tasks.db`;
  const newFileName = `./db_files/${req.body.newFileName}_tasks.db`;
  renameFile(filename, newFileName);
  res.status(200);
});

const server = app.listen(3000, () =>
  console.log("Server running on port 3000")
);

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  console.log("Closing server.");
  server.close(() => {
    console.log("Server is closing");
  });
  process.exit(0);
});

module.exports = app;
