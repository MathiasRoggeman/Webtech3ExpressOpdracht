const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;

var db;
MongoClient.connect("mongodb://localhost:27017/examen", { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err);
  db = database.db("examen");
  app.listen(process.env.PORT || 4000, () => {
    console.log("Listening on port 4000");
  });
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

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

      res.render("overtreding.ejs", { overtredingen: result });
    });
});
// Show the search form
app.get("/search", (req, res) => {
  res.render("search.ejs", {});
});

// Find all comments for a post
app.post("/search", (req, res) => {
  var opnameplaats_straat = req.body.opnameplaats_straat;
  console.log(opnameplaats_straat);
  db.collection("overtredingen")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      var stringified = JSON.stringify(result);
      var Overtredinglist = JSON.parse(stringified);

      //console.log("TCL: Overtredinglist", Overtredinglist);
      //console.log("TCL: result", result);

      var list = [];

      for (var i = 0; i < Overtredinglist.length; i++) {
        //  console.log("TCL: Overtredinglist[i]", Overtredinglist[i].opnameplaats_straat);
        if (Overtredinglist[i].opnameplaats_straat == opnameplaats_straat) {
          list.push(Overtredinglist[i]);
        }
      }
      console.log(list);
      res.render("search_result.ejs", { list });
    });
});
