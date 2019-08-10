var express = require("express");
var moment = require("moment");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/img', express.static(__dirname + '/img'));
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");
})
app.get("/get", (req,res) => {
   MongoClient.connect(url, function(err,db){
           if(err) throw err;
           var dbo = db.db("messagedata");
           dbo.collection("UserMessage").find({}).toArray(function(err, result){
                if(err) throw err;
                for(var i in result){
                        console.log(result[i].time);
                }
                //console.log(result);
                db.close();
           });
   });
});
app.post('/messaged', (req,res) => {
    MongoClient.connect(url, function(err, db) {
            if(err) throw err;
            var dbo = db.db("messagedata");
            var currentTime = moment().unix();
            var myobj = { name: req.body, time: currentTime};
            dbo.collection("UserMessage").insertOne(myobj, function(err, res){
                    if(err) throw err;
                    console.log("1 document inserted");
                    db.close();
            })
   })
})
app.listen(process.env.PORT || 3000);