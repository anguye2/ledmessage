var express = require("express");
var moment = require("moment");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://minh:minh12345@localhost:27017/admin";
var sinceStart = 0;
//this function runs every 5 seconds to check if a message is older than 12 hours
//if message is older than 12 hours then it gets deleted from the database
setInterval(function(){
        sinceStart += 5;
        console.log("server is running for " + sinceStart + " seconds...");
        //connection to the mongo database      
        MongoClient.connect(url, function(err,db){
           //calculate the unix time 12 hours earlier
           var cutOff = moment().unix() - 43200;
           console.log("cutoff: " + cutOff);
           if(err) throw err;
           var dbo = db.db("messagedata");
           dbo.collection("messages").find({}).toArray(function(err, result){
                if(err) throw err;
                //loops through the collection
                for(var i in result){
                        //checks to see if the message is older than 12 hours
                        if(cutOff > result[i].time){
                                dbo.collection("messages").deleteOne({time: result[i].time}, function(err, obj){
                                        if(err) throw err;
                                        console.log("1 document deleted");
                                        db.close;
                                })
                        }
                }
                db.close();
           });
   });
},5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//incloudes the image directory so node can find it
app.use('/img', express.static(__dirname + '/img'));
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");
})
//get route to request database
app.get("/get", (req,res) => {
   MongoClient.connect(url, function(err,db){
           if(err) throw err;
           var dbo = db.db("messagedata");
           dbo.collection("messages").find({}).toArray(function(err, result){
                if(err) throw err;
                for(var i in result){
                        console.log(result[i].time);
                }
                //console.log(result);
                db.close();
           });
   });
});
//message is log into database from the message field in the frontend
app.post('/messaged', (req,res) => {
    MongoClient.connect(url, function(err, db) {
            if(err) throw err;
            var dbo = db.db("messagedata");
            var currentTime = moment().unix();
            var myobj = { name: req.body, time: currentTime};
            dbo.collection("messages").insertOne(myobj, function(err, res){
                    if(err) throw err;
                    console.log("1 document inserted");
                    db.close();
            })
   })
res.send("successfully messaged");
})
app.listen(process.env.PORT || 3000);