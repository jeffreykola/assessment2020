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
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())
app.disable('etag');

// Boolean function to check if a file exists
function checkIfExists (filename) {
  const path = `./${filename}`
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

// Boolean function to delete a file
function deleteFile (filename) {
  fs.unlink(filename, (err) => {
    if (err) {
      console.error(err)
      return false
    }

    return true
  })
}

function renameFile (filename, newfilename) {
  if (checkIfExists(filename)) {
    fs.renameSync(filename, newfilename)
  } else {
    return false
  }
}

// All the files with the .db extention and adds to an array

var getAllFilesFromFolder = function (dir) {
  var results = []

  fs.readdirSync(dir).forEach(function (file) {
    file = dir + '/' + file
    var stat = fs.statSync(file)

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFilesFromFolder(file))
    } else results.push(file)
  })

  return results
}

// GET REQUESTS


// console.log(subjects)
const MAX_FILES = 6
// Get all modules
app.get('/subjects', function (req, res) {
  const subjects = getAllFilesFromFolder('./db_files')
  res.status(200).json(subjects)
})

// Search
app.get('/search', function (req, res) {
  if (checkIfExists(`./db_files/${escape(req.query.search)}_tasks.db`)) {
    res.status(409).json({ status: 'found' })
  } else {
    res.status(200).json({ status: 'not found' })
  }
})

// Get data for a specific subject
// Individual details
app.get('/data', function (req, res) {
  var database = new Datastore(`./db_files/${req.query.id}_tasks.db`)
  database.loadDatabase()
  database.find({}, (error, data) => {
    if (error) {
      res.end()
    }
    res.status(200).send(JSON.stringify(data))
  })
})

// POST REQUESTS
// Create a task
app.post('/', function (req, res) {
  const data = req.body
  var database = new Datastore(`./db_files/${req.body.module}_tasks.db`)
  database.loadDatabase()
  data.taskName = escape(data.taskName)
  data.description = escape(data.description)
  database.insert(data, function (err) {
    if (err) {
      res.json({ error: err })
    }
    res.sendStatus(200)
  })
})

// Add a module
app.post('/add', async function (req, res) {
  const subs = getAllFilesFromFolder('./db_files')
  console.log(`./db_files/${req.body.module}_tasks.db`)
  if (subs.length <= MAX_FILES) {
    const database = new Datastore(`./db_files/${req.body.module}_tasks.db`)
    database.loadDatabase(function (err) {
      res.sendStatus(200)
      if (err) {
        res.sendStatus(500)
      }
    })
  }
})

// Delete a task
app.post('/delete', function (req, res) {
  const id = req.body.id
  const name = req.body.name
  var database = new Datastore(`./db_files/${name}_tasks.db`)
  database.loadDatabase()
  if (name && id) {
    console.log(id)
    database.remove({ _id: id }, {}, function (err, numRemoved) {
      if (numRemoved) {
        res.sendStatus(200)
      } else {
        console.log(err)
        res.sendStatus(500)
      }
    })
  } else {
    res.sendStatus(400)
  }
})

// Delete a module
app.post('/dropmod', function (req, res) {
  const name = req.body.name
  const filename = `./db_files/${name}_tasks.db`
  if (checkIfExists(filename)) {
    deleteFile(filename)
    // Used to restart the database
    var database = new Datastore('./db_files/_tasks.db')
    database.loadDatabase()
    res.status(200).json({ name: '_tasks' })
  } else {
    res.sendStatus(404)
  }
})

// UPDATE request

app.post('/updatemod', function (req, res) {
  const filename = `./db_files/${req.body.originalName}_tasks.db`
  const newFileName = `./db_files/${req.body.newFileName}_tasks.db`
  renameFile(filename, newFileName)
  res.status(200).json({"newFileName":req.body.newFileName});
})

app.post('/update', function (req, res) {
  const module = req.body.module
  const database = new Datastore(`./db_files/${module}_tasks.db`)
  const id = req.body.id
  database.loadDatabase()

  // console.log(req.body.properties);

  const getPropVal = (propertyName) => {
    if (req.body[`${propertyName}`] || req.body[`${propertyName}`] === 0) {
      return [propertyName, req.body[`${propertyName}`]]
    } else {
      return false
    }
  }
  // console.log(getPropVal(req.body.properties));
  if (req.body.properties.length >= 1) {
    for (let i = 0; i < req.body.properties.length; ++i) {
      const propertyData = getPropVal(req.body.properties[i])
      let pData
      let moduleName = null;
      [moduleName, pData] = propertyData
      const updateQuery = {}
      updateQuery[`${moduleName}`] = pData
      database.update({ _id: id }, { $set: updateQuery }, {}, function (
        err,
        numReplaced
      ) {
        if (numReplaced) {
          res.sendStatus(200)
        } else {
          res.json({ error: err }).status(500)
        }
      })
    }
  } else {
    res.sendStatus(500)
  }
})

const server = app.listen(3000, () =>
  console.log('Server running on port 3000')
)

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.')
  console.log('Closing server.')
  server.close(() => {
    console.log('Server is closing')
  })
  process.exit(0)
})

module.exports = app
