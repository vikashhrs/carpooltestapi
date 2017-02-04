/**
 * Created by vikash on 01-Feb-17.
 */
var express = require('express');
var mongoose = require('mongoose');
var PORT = process.env.PORT || 3000;
var morgan = require('morgan');
var jwt = require('jwt-simple');
var JWT_SECRET = "24446666688888889";
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var User = require("./models/users");
var CheckPoint  = require("./models/checkpoints");
var LiveRide = require("./models/liveride");


var app = express();

mongoose.connect("mongodb://wisecomm:wisecomm@ds139619.mlab.com:39619/wisecomm");
//mongoose.connect("mongodb://localhost:27017/carpool");

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get("/",function (req,res) {
    res.send("The apis are running");
})

app.put('/users/signin', function (req, res) {
    /*
    Api for login functinality
     */
    if (!req.body) {
        console.log("parameters received");
    }
    console.log(req.body);
    console.log(req.body.empID);
    User.findOne({empID: req.body.empID}, function (err, user) {
        console.log(err);
        console.log(user);
        if (err)
            throw err;
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                var token = jwt.encode(user, JWT_SECRET);
                res.status(200).send({token: token, name: user.name});
            } else {
                res.status(400).send({status :"Incorrect password"});
            }
        }
        if (!user) {
            res.status(400).send({status : "No user found"});
        }
    });
});


app.post('/users', function (req, res) {
    /*
    Api for new user registration
     */
    console.log(req.body.user);
    req.body.user.password = bcrypt.hashSync(req.body.user.password, bcrypt.genSaltSync(9));
    //console.log(req.body);
    var user = new User(req.body.user);
    console.log(user);
    /*var newUser = req.body.user
     newUser.password = bcrypt.hashSync(req.body.user.password,bcrypt.genSaltSync(9));
     var user = new User(newUser);*/
   user.save(function (err) {
        if (err) {
            //throw err;
            res.status(500).send({status : "Unable To Register"});
        }else {
            res.status(200);
            res.send({status : "Registered"});
        }

    })

});



app.post('/check/users', function (req, res) {
    /*
    Api for checking if a user already exists
     */
    console.log(req.body);
    User.findOne({empID : req.body.empID},function (err,user) {
        if(err)
            res.status(500).send({status : "Server error"});
        if(user){
            res.status(400).send({status : "present"});
        }
        if(!user){
            res.status(200).send({status : "notpresent"})
        }

    })
});


app.post("/users/checkpoints",function (req,res) {
    /*
    Api for adding checkpoints for a coresspondimg user
     */
    console.log(req.body);
    console.log(req.headers.authorization);
    var user = jwt.decode(req.headers.authorization, JWT_SECRET);
    console.log(user);
    //console.log(contact);
    User.findOne({empID : user.empID},function (err,user) {
        if(err){
            res.status(500).send({status : "Server error"});
        }
        if(user){
            //user.checkpoints.push(req.body.checkpoint);
            for( var i = 0;i<Object.keys(req.body.checkpoints).length;i++){
                user.checkpoints.push(req.body.checkpoints[i]);
            }
            user.save(function (err) {
                if(err)
                    res.status(500).send({status : "Server error"});
                else
                    res.send({message: "Data Added"})
            })
        }
        if(!user){
            res.status(400).send({status : "No user found"});
        }
    });

    //res.send({message: "Data Added"})
});

app.post("/add/checkpoints",function (req,res) {
    /*
    sample data
    "checkPoint" : {
         "checkPointName" : "kondapur",
         "latLng" : {
         "lat" : "123",
         "lng" : "321"
          }

     }

     */
    console.log(req.body);
    var checkPoint = new CheckPoint(req.body.checkPoint);
    checkPoint.save(function (err) {
        if(err)
            res.status(500).send({status : err});
        else
            res.status(200).send(req.body);
    })

});


app.post("/set/liveride",function(req,res){
    console.log(req.body);
    req.body.startTime  = new Date(req.body.startTime);
    //console.log(req.headers.authorization);
    var user = jwt.decode(req.headers.authorization, JWT_SECRET);
    console.log(user);
    User.findOne({empID : user.empID},function (err,user) {
        if(err){
            res.status(500).send({status : "Server error"});
        }
        if(user){
            //user.checkpoints.push(req.body.checkpoint);
            var liveRide = new LiveRide(req.body);
            liveRide.save(function(err){
                if(err)
                    res.status(500).send({status :err});
                else
                    res.status(200).send({status :"liveride"});


            })
        }
        if(!user){
            res.status(405).send({status : "No user found"});
        }
    });
    //res.send("liveride");
});

app.listen(PORT,function () {
    console.log("Server running on port 3000");
})