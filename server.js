const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

var db;
MongoClient.connect("mongodb://localhost:27017/examen", { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err);
  db = database.db("overtredingen");
  app.listen(process.env.PORT || 4000, () => {
    console.log("Listening on port 4000");
  });
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// To resolve CORS error :
// https://medium.com/@ahsan.ayaz/how-to-handle-cors-in-an-angular2-and-node-express-applications-eb3de412abef
var originsWhitelist = ["http://localhost:4200"];

var corsOptions = {
  origin: function(origin, callback) {
    var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
};
app.use(cors(corsOptions));

// Redirect to list
app.get("/", (req, res) => {
  res.redirect("/list");
});

// list all products
app.get("/list", (req, res) => {
  db.collection("overtredingen")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    });
});
