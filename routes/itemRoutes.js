var express = require('express');
var router = express.Router();

var User = require('../models/user');
var auth = require('./auth').auth;

//For Route /items
var mainRouteUrl = "/items";


//GET inventory of user specified in token
router.get('/', auth, function(req, res) {
	console.log(req.payload);
	
	console.log("Getting inventory of " + req.payload.username);
	
	User.findOne({username: req.payload.username}, function(err, user) {
		if(err) { return done(err); }
		if(!user) { return done(null, false, {message: "username " + req.payload.username + " does not exist?"}); }
		
		console.log("sending inventory");
		console.log(user.inventory);
		res.json(user.inventory);
		return;
	});
});

//PUT new items into inventory of user specified in token
router.put('/', auth, function(req, res, next) {
	if(!req.body.updateType && (!req.body.nuItems || !req.body.indexToDelete)) {
		return res.status(400).json({message: 'no items to add to inventory'});
	}
	
	User.findOne({username: req.payload.username}, function(err, user) {
		if(err) { return done(err); }
		if(!user) { return done(null, false, {message: "username " + req.payload.username + " does not exist?"}); }
		
		if(req.body.updateType == "add") {
			console.log("adding new items to inventory");
			user.inventory = user.inventory.concat(req.body.nuItems);
		}
		else if(req.body.updateType == "delete") {
			console.log("deleting item at index " + req.body.indexToDelete);
			user.inventory.splice(req.body.indexToDelete, 1);
		}
		
		console.log(user.inventory);
		user.save(function(err) {
			res.sendStatus(200);
		});
	});
	
});


module.exports.itemsMainUrl = mainRouteUrl;
module.exports.itemsRouter = router;