var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.post('/user', function(req, res, next) {
	if(!req.body.username || !req.body.password || !req.body.email) {
		return res.status(400).json({message: 'please fill out all fields'});
	}
	
	console.log("Creating new User");
	var user = new User();
	user.username = req.body.username;
	user.email = req.body.email;
	user.setPassword(req.body.password);
	
	user.save(function(err) { 
		if(err) { next(err); }
		
		console.log("New User Created. Returning token");
		return res.json({token: user.generateJWT()});
	});
});