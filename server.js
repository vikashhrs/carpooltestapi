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


var app = express();

mongoose.connect("mongodb://wisecomm:wisecomm@ds139619.mlab.com:39619/wisecomm");
//mongoose.connect("mongodb://localhost:27017/carpool");

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get("/",function (req,res) {
    res.send("The apis are running");
})

app.put('/users/signin', function (req, res) {
    if (!req.body) {
        console.log("parameters received");
    }
    console.log(req.body);
    console.log(req.body.email);
    User.findOne({email: req.body.email}, function (err, user) {
        console.log(err);
        console.log(user);
        if (err)
            throw err;
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                var token = jwt.encode(user, JWT_SECRET);
                res.status(200).send({token: token, name: user.name});
            } else {
                res.status(400).send("Incorrect password");
            }
        }
        if (!user) {
            res.status(400).send("No user found");
        }
    });
});


app.post('/users', function (req, res) {
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
            throw err;
        }

    })
    res.status(200);
    res.send('Saved');
});



app.post('/check/users', function (req, res) {
    console.log(req.body);
    User.findOne({email : req.body.email},function (err,user) {
        if(err)
            throw err;
        if(user){
            res.status(400).send({status : "present"});
        }
        if(!user){
            res.status(200).send({status : "notpresent"})
        }

    })
});

app.listen(PORT,function () {
    console.log("Server running on port 3000");
})