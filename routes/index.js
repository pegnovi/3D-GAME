var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Room = require('../models/room');

var superSecret = 'blahThisblahIsblahSuperblahSecretblah';

var path = require('path');

var mongoose = require('mongoose');

var Expressjwt = require('express-jwt');
var auth = Expressjwt({secret: "SECRET", userProperty: 'payload'});
//(userProperty: payload) So req.payload will contain the token data (It's req.user contains it by default)

var passport = require('passport');
require('../config/passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//GET all the rooms from the db
// or
//GET room with specified id 
//(Depends on params provided)
router.get('/rooms', function(req, res, next) {
	Room.find(function(err, rooms) {
		if(err) { return next(err); }
		
		res.json(rooms);
	});
});

/*
router.post('/room', function(req, res, next) {
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
	
	console.log("id = ");
	console.log(id);
	
	var query = Room.findById(id);
	
	query.exec(function(err, room) {
		if(err) { return next(err); }
		if(!room) { return next(new Error('cannot find room')); }
		
		console.log("found room");
		
		req.room = room;
		return next();
	});
	
});

router.get('/room/:id', function(req, res) {
	//param middleware will be executed before 
	//and we can expect req object to already have needed info
	
	console.log("sending room");
	res.json(req.room);
});

router.post('/register', function(req, res, next) {
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

router.post('/login', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({message: 'please fill out all fields'});
	}
	
	console.log("Logging User In");
	
	passport.authenticate('local', function(err, user, info) {
		if(err) { return next(err); }
		
		if(user) {
			console.log("User found, returning token");
			return res.json({token: user.generateJWT()});
		}
		else {
			return res.status(401).json(info);
		}
	})(req, res, next);
});

router.post('/room', auth, function(req, res, next) {
	var room = new Room(req.body);
	
	room.save(function(err, room) {
		if(err) { return next(err); }
		
		res.json(room);
	});
});


// ROUTES FOR API
// ==============================
var apiRouter = express.Router();

apiRouter.get('/try', function(req, res, next) {
	console.log("HELLO TRY");
	res.status(200);
});




/*
// ROUTES FOR API
// ==============================

var apiRouter = express.Router();

//route for authenticating users
apiRouter.post('/authenticate', function(req, res) {
	//find the user
	//select the name username and password explicitly
	User.findOne({ username: req.body.username })
	.select('name username password')
	.exec(function(err, user) {
		if(err) throw err;
		
		//no user with that username was found
		if(!user) {
			res.json({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		}
		else if(user) {
			//check if password matches
			var validPassword = user.comparePassword(req.body.password);
			if(!validPassword) {
				res.json({
					success: false,
					message: 'Authentication failed. Wrong password.'
				});
			}
			else {
				//if user is found and password is right
				//create a token
				var token = jwt.sign({ name: user.name, username: user.username },
									 superSecret, 
									 { expiresInMinutes: 1440 }//expires in 24 hours
									);
									
				//return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
		
	});

});

//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
//middleware to use for all requests
//route middleware to verify a token
apiRouter.use(function(req, res, next) {
	console.log('Somebody just came to our app');

	//we'll add more to the middleware later
	//this is where we will authenticate users
	
	//check header or url parameters or post parameters for token
	var token = req.body.token || req.params.token || req.query.token || req.headers['x-access-token'];
	
	console.log("TOKEN IS");
	console.log(token);
	
	//decode token
	if(token) {
		//verifies secret and checks exp
		jwt.verify(token, superSecret, function(err, decoded) {
			if(err) {
				return res.status(403).send({
					success: false,
					message: 'Failed to authenticate token.'
				});
			}
			else {
				//if everything is good, save to request for use in other routes
				req.decoded = decoded;
				
				next();
			}
		});
	}
	else {
		//if there is no token
		//return an HTTP response of 403 (access forbidden) and an error message
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
	
	//next(); //make sure to go to the next routes and don't stop here
});

//test route to make sure it works
apiRouter.get('/', function(req, res) {
	res.json({ message: 'horray! welcome to api' });
});

//api endpoint to get user information
apiRouter.get('/me', function(req, res) {
	res.send(req.decoded);
});

//on routes that end in /users
apiRouter.route('/users')

	//create a user (accessed at POST http://localhost:3000/api/users)
	.post(function(req, res) {
		//create a new instance of the User model
		var user = new User();
		
		//set the users information (comes from the request)
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;
		
		//save the user and check for errors
		user.save(function(err) {
			if(err) {
				//duplicate entry
				if(err.code == 11000) {
					return res.json({ success: false, message: 'A user with that username already exists. ' });
				}
				else {
					return res.send(err);
				}
			}
			
			res.json({ message: 'User created!' });
		});
		
	})
	

	//get all the users (accessed at GET http://localhost:3000/api/users)
	.get(function(req, res) {
		User.find(function(err, users) {
			if(err) res.send(err);
			
			//return the users
			res.json(users);
		});
	});


//on routes that end in /users/:user_id
apiRouter.route('/users/:user_id')
	//get the user with that id
	//(accessed at GET http://localhost:3000/api/users/:user_id)
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if(err) res.send(err);
			
			//return that user
			res.json(user);
		});
	})
	
	//update the user with this id
	//(accessed at PUT http://localhost:3000/api/users/:user_id)
	.put(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if(err) res.send(err);
			
			//update the users info only if its new
			if(req.body.name) user.name = req.body.name;
			if(req.body.username) user.username = req.body.username;
			if(req.body.password) user.password = req.body.password;
			
			//save the user
			user.save(function(err) {
				if(err) res.send(err);
				
				//return a message
				res.json({ message: 'User updated!' });
			});
			
		});
	})
	
	//delete the user with this id
	//(accessed at DELETE http://localhost:3000/api/users/:user_id)
	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if(err) return res.send(err);
			
			res.json({ message: 'Successfully deleted' });
		});
	});

*/


module.exports.router = router;
module.exports.apiRouter = apiRouter;