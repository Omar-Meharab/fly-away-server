const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u9zre.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());


const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send("Fly away")
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const destinationsCollection = client.db("flyAway").collection("destinations");
  const bookingsCollection = client.db("flyAway").collection("bookings");

  app.get('/destinations', (req, res) => {
    destinationsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/bookings', (req, res) => {
    bookingsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/destinations/:id', (req, res) => {
    destinationsCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    bookingsCollection.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.post('/addDestinations', (req, res) => {
    const destination = req.body;
    destinationsCollection.insertOne(destination)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.delete('/deleteBooking/:id', (req, res) => {
    bookingsCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

});


app.listen(port)