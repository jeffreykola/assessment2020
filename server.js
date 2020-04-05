const express = require('express')
const app = express()
const Datastore = require('nedb')
var escape = require('escape-html')

// const fs = require('fs');
const bodyParser = require('body-parser')
const fs = require('fs')
app.use(express.static('assets'))
app.use(express.static('styles'))
app.use(express.static('./'))
// Find out what this means
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

var numFiles = 0

// POST route for adding a task

function checkIfExists (filename) {
  const path = `./${filename}`
  console.log(path)
  try {
    if (fs.existsSync(path)) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.error(err)
  }
}

function deleteFile (filename) {
  fs.unlink(filename, (err) => {
    if (err) {
      console.error(err)
      return false
    }

    return true
  })
}

const glob = require('glob')
const subjects = []

glob('./**/*.db', {}, (err, files) => {
  try {
    for (let i = 0; i < files.length; i++) {
      subjects.push(files[i])
      numFiles = subjects.length
    }
  } catch (e) {
    console.log(`${err} or ${e}`)
  }
})

app.get('/subjects', function (req, res) {
  res.status(200).json(subjects)
})

app.get('/search', function (req, res) {
  if (checkIfExists(`./db_files/${req.query.search}_tasks.db`)) {
    res.json({ code: 'found' })
  } else {
    res.json({ code: 'not found' })
  }
})
app.post('/', function (req, res) {
  const data = req.body
  var database = new Datastore(`./db_files/${req.body.module}_tasks.db`)
  database.loadDatabase()
  data.taskName = escape(data.taskName)
  data.description = escape(data.description)
  database.insert(data)
  res.sendStatus(200)
})

app.post('/add', function (req, res) {
  if (numFiles <= 7) {
    var database = new Datastore(`./db_files/${req.body.subject}_tasks.db`)
    database.loadDatabase()
    res.sendStatus(200)
  } else {
    res.sendStatus(500)
  }
})

app.post('/delete', function (req, res) {
  const id = req.body.id
  const name = req.body.name
  var database = new Datastore(`./db_files/${name}_tasks.db`)
  database.loadDatabase()
  if (name && id) {
    database.remove({ _id: id }, {}, function (err, numRemoved) {
      if (numRemoved) {
        res.sendStatus(200)
      } else {
        console.log(err)
        res.sendStatus(500)
      }
    })
  } else {
    res.sendStatus(500)
  }
})

app.post('/dropmod', function (req, res) {
  const name = req.body.name
  const filename = `./db_files/${name}_tasks.db`
  if (checkIfExists(filename)) {
    deleteFile(filename)

    var database = new Datastore('./db_files/_tasks.db')
    database.loadDatabase()
    res.status(200).json({ name: '_tasks' })
  } else {
    res.sendStatus(500)
  }
})

// GET route for getting all the tasks

app.get('/data', function (req, res) {
  // console.log("received");
  console.log(`${req.query.id}_tasks.db`)
  var database = new Datastore(`./db_files/${req.query.id}_tasks.db`)
  database.loadDatabase()
  database.find({}, (error, data) => {
    if (error) {
      res.end()
    }
    res.send(JSON.stringify(data))
  })
})

const server = app.listen(3000, () => console.log('Server running on port 3000'))

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.')
  console.log('Closing server.')
  server.close(() => {
    console.log('Server is closing')
  })
  process.exit(0)
})

module.exports = app
