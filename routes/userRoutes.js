var express = require('express');
var router = express.Router();

var Compartment = require('../models/compartment');
var User = require('../models/user');
var auth = require('./auth').auth;


router.post('/user', function(req, res, next) {
	if(!req.body.username || !req.body.password || !req.body.email) {
		return res.status(400).json({message: 'please fill out all fields'});
	}
	
	console.log("Creating new User");
	var user = new User();
	user.username = req.body.username;
	user.email = req.body.email;
	user.setPassword(req.body.password);
	
	var compartment = new Compartment();
	compartment.save(function(err) {
		if(err) { next(err); }
		console.log("new compartment saved");
		console.log("compartment id = " + compartment.id);
	}); 
	user.compartment = compartment.id;
	user.inventory = [];
	
	user.save(function(err) { 
		if(err) { next(err); }
		
		console.log("New User Created. Returning token");
		console.log(user);
		return res.json({token: user.generateJWT()});
	});
});