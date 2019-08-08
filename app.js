var express = require("express");
var app = express();
var port = 3000;
var mongoose = require("mongoose");
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/messagedata");

var db = mongoose.connection;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var nameSchema = new mongoose.Schema({
    message: String
})

var UserMessage = mongoose.model("UserMessage", nameSchema);

// app.use(express.static(__dirname + '/public'));
app.use('/img', express.static(__dirname + '/img'));
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");
})

app.get("/retreive", (req,res) => {
    
})

app.post('/messaged', (req,res) => {
    var myData = new UserMessage(req.body);
    myData.save()
    .then(item => {
        res.send("item saved to database");
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    })
})

app.listen(process.env.PORT || 3000);