
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');
var items = ["buy food"];

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/",function(req,res){

    var day = date();

    res.render('list', {Day : day, newItems : items});
});

app.post("/",function(req,res){
    var newItem = req.body.newItem;
    items.push(newItem);

    res.redirect("/");
});

app.listen(4000, function(req,res){
    console.log("Server starting on port 4000...");
});
