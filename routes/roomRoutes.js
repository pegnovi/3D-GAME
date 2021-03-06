var express = require('express');
var router = express.Router();

var Room = require('../models/room');

//For Route /rooms
var mainRouteUrl = "/rooms";

//GET all the rooms from the db
router.get('/', function(req, res, next) {
	Room.find(function(err, rooms) {
		if(err) { return next(err); }
		
		res.json(rooms);
	});
});

//Create a room
/*
router.post('/', function(req, res, next) {
	var room = new Room(req.body);
	
	room.save(function(err, room) {
		if(err) { return next(err); }
		
		res.json(room);
	});
});
*/

//http://webapplog.com/intro-to-express-js-parameters-error-handling-and-other-middleware/
router.param('id', function(req, res, next, id) {
	//do something with id
	//store id or other info in req object
	//call next when done
	
	console.log("desired room id = " + id);
	
	var query = Room.findById(id);
	
	query.exec(function(err, room) {
		if(err) { return next(err); }
		if(!room) { return next(new Error('cannot find room')); }
		
		console.log("found room");
		
		req.room = room;
		return next();
	});
	
});

//GET room with specified id 
router.get('/:id', function(req, res) {
	//param middleware will be executed before 
	//and we can expect req object to already have needed info
	
	console.log("sending room");
	res.json(req.room);
});

module.exports.roomsMainUrl = mainRouteUrl;
module.exports.roomsRouter = router;