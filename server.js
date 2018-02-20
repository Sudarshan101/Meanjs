var express  = require('express');
var app      = express();                        
var morgan = require('morgan');    
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var multer  =   require('multer');
var fs = require("fs");

//allow cross origin requests

app.use(function(req, res, next) { 
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

// configuration
app.use(express.static(__dirname + '/app'));                 // set the static files location /app/img will be /img for users
app.use('/app/uploads',express.static(__dirname + '/app/uploads'));
app.use(morgan('dev'));               
app.use(bodyParser.json({limit: '50mb'}));                          // log every request to the console
app.use(bodyParser.urlencoded({limit: '50mb','extended':'true'}));            // parse application/x-www-form-urlencoded                                // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
 // connect to mongoDB database
mongoose.connect('mongodb://localhost/meanjs');    
var Schema = mongoose.Schema;

// user schema
var userSchema = new Schema({
    user_name: String,
    password: String,
    first_name: String,
    last_name: String,
    user_email:String,
    phone: Number,
    status: String,
    date: { type: Date, default: Date.now }
});

var User = mongoose.model('User', userSchema);

module.exports = User;


// create user
app.post('/api/createUser', function(req, res) {

   User.findOne({ 'user_email' :  req.body.user_email }, function(err, user) {
           // if there are any errors, return the error
           if (err){
               return res.send(err);
           }
           // check to see if there already a user with that email
           if (user) {
               return res.json({"message":"Email already exist"});
           } else {
            User.create(userobj, function(err, user) {
                if (err){
                   res.send(err);
                }
                if(user) {
                   res.json(user);
                }
            });
        }
    });
});





// update user
app.put('/api/updateUser', function(req, res) {
    User.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, user) {
        if (err){
            res.send(err);
        }

        res.json(user);
    });
});

// delete user
app.delete('/api/removeUser', function(req, res) {
    User.remove({
        _id : req.body._id
    }, function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
});

// get users
app.post('/api/getUsers', function(req, res) {
    User.find(req.body,function(err, users) {
        if (err)
            res.send(err)
        res.json(users);
    });
});


app.listen(process.env.PORT || 9000, function(){console.log("App listening on port 9000");});