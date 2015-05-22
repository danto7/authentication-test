/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/mongoose/mongoose.d.ts" />


var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var models = require('./models/')
var settings = require('./settings')
var timers = require('timers')

mongoose.connect('mongodb://ds039960.mongolab.com:39960/danto', {
	user: "danto9",
	pass: "admin123"
});

var User = mongoose.model('user', models.user);
var Session = mongoose.model('session', models.session);

var app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

app.post('/authenticate', function (req, res) {
	User.find({ //Start request to MongoDB for email password combination
		email: req.body.email,
		password: req.body.pass
	}, function (err, data) {
			if (err) { //error 
				res.send(err);
			}else if(data.length > 0){  //Found user in Database
				var s = new Session({
					userId: data[0]._id
				});
				s.save(function(err, result){
					if(!err)
						res.send(result);
					else
						res.send(err);
				});
			}else{ //Didn't found user in Database
				res.status(403).send({
					error:403, 
					msg:"No valid email password combination."
				});
			}
		});
});

app.use(express.static(__dirname + "/public"));

app.listen(3000, function () {
	console.log("App is listening on http://localhost:3000")
});

// session cleaner
// when fired cleans all expired sessions in database
setTimeout(function(){ 
	Session.find(function(err, data){
		if(!err){
			data.forEach(function(v, i, a){
				// checks if current time is bigger then last Access plus timeout
				if(Date.getTime() > v.lastAccess.getTime()+settings.session.timeout){
					Session.findByIdAndRemove(v._id)
				}
			});
		}else{
			console.error(err);
		}
	});
}, settings.session.cleaner);