const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://godsplan:MiltonMass2018@ds039195.mlab.com:39195/to-do', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('What It Look Like?!')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('jetlife').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {
      messages: result
    })
  })
})

app.post('/messages', (req, res) => {
  db.collection('jetlife').save({
    name: req.body.name,
    msg: req.body.msg,
    thumbUp: 0,
    thumbDown: 0
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/thumbUp', (req, res) => {
  db.collection('jetlife')
    .findOneAndUpdate({
      name: req.body.name,
      msg: req.body.msg
    }, {
      $inc: {
        thumbUp: 1
      }
    }, {
      sort: {
        _id: -1
      },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send("thumbsUp" + req.body.thumb + 1)
    })
})

app.put('/thumbDown', (req, res) => {
  db.collection('jetlife')
    .findOneAndUpdate({
      name: req.body.name,
      msg: req.body.msg
    }, {
      $inc: {
        thumbDown: 1
      }
    }, {
      sort: {
        _id: -1
      },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send("thumbsDown" + req.body.thumb + 1)
    })
})

app.delete('/messages', (req, res) => {
  db.collection('jetlife').findOneAndDelete({
    name: req.body.name,
    msg: req.body.msg
  }, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})