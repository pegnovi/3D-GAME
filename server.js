//{ Semi-BoilerPlate Code

var express = require('express');
var socket = require('socket.io');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser'); //lets us pull POST content from HTTP request for processing
var morgan = require('morgan'); //used to see requests
var passport = require('passport');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

//var easyrtc = require("easyrtc"); // EasyRTC external module

var routes = require('./routes/index').router;
var apiRoutes = require('./routes/index').apiRouter;

var app = express(); //define our app using express

app.use(passport.initialize());

// APP CONFIG
// --------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
//use body parser so we can get info from POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');
	next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', apiRoutes);

//Main CatchAll Route
//send users to frontend (angular app)
//has to be registered after API routes
/*
app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});	
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//}




var server = http.createServer(app);

//=====================
//===socket.io stuff===
//=====================
socket = socket.listen(server);

// Start EasyRTC server
//var easyrtcServer = easyrtc.listen(app, socket);

server.listen(3000); //use this if running locally
//server.listen(80); //use this if uploading to nodejitsu
//server.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP); //use this if deploying to openshift



//Represents a group of clients in the same room
var groups = {}; //roomID : list of client ids
//roomID: {{peerID: {readyState}}, ...}

socket.on("connection", function(client) {

	console.log("client connected via socket!!!");
	console.log("client id = " + client.id);
    
	var serverSend = function(originatorID, targetID, data) {
		data["originatorID"] = originatorID;
		socket.to(targetID).emit("serverMessage", JSON.stringify(data));
	};
	
	//?!
	client.on("re-route", function(data) {
		console.log("RE-ROUTING");
		var parsedData = JSON.parse(data);
		
		parsedData["originatorID"] = client.id;
		
		//socket.to(parsedData["targetID"]).emit("serverMessage", JSON.stringify(parsedData));
		serverSend(client.id, parsedData["targetID"], parsedData);

	});
	
	
	
	var serverJobFuncs = {};
	
	serverJobFuncs["joinRoom"] = function(data) {
		client.room = data.roomID;
	
		if(groups[data.roomID] == undefined) {
			//create new room
			groups[data.roomID] = {};
			
		}
		else {

			//Send peer IDs
			var peerIDs = [];
			//key is the peer's id
			for(var key in groups[data.roomID]) {
				if(groups[data.roomID].hasOwnProperty(key)) {
					peerIDs.push(key);
				}
			}
			serverSend("server", client.id, {
				command: "roomPeers",
				groupmatesIDs: peerIDs
			});
			
			
			//Send peer ready states
			var peerRdyStts = {};
			for(var key in groups[data.roomID]) {
				if(groups[data.roomID].hasOwnProperty(key)) {
					peerRdyStts[key] = groups[data.roomID][key];
				}
			}
			serverSend("server", client.id, {
				command: "peerReadyStates",
				peerReadyStates: peerRdyStts
			});
		}
		
		//push this client's id into room
		groups[data.roomID][client.id] = {readyState: false};
	};
	serverJobFuncs["updateReadyState"] = function(data) {

		//update server on client readyState
		groups[data.roomID][client.id].readyState = data.readyState;
		
		//broadcast readyState to group
		for(var peer in groups[data.roomID]) {
			if(groups[data.roomID].hasOwnProperty(peer)) {
				if(peer != client.id) {
					serverSend("server", peer, {
						command: "updatePeerReadyState",
						peerID: client.id,
						readyState: data.readyState
					});
				}
			}
		}
		
		//check if all members are ready (send countdown signal)
		if(allReady(groups[data.roomID])) {
			actionToGroup(groups[data.roomID], function(peer, peerData) {
				serverSend("server", peer, {command: "countdown"});
			});
		}
	};
	client.on("serverJob", function(data) {
		data = JSON.parse(data);
		serverJobFuncs[data.command](data);
	});
	//?!

	var actionToGroup = function(group, action) {
		for(var peer in group) {
			if(group.hasOwnProperty(peer)) {
				action(peer, group[peer]);
			}
		}
	};
	var allReady = function(group) {
		for(var peer in group) {
			if(group.hasOwnProperty(peer)) {
				if(group[peer].readyState == false) {
					return false;
				}
			}
		}
		return true;
	};
	var groupCount = function(group) {
		var count = 0;
		for(var peer in group) {
			if(group.hasOwnProperty(peer)) {
				count += 1;
			}
		}
		return count;
	};
	
	
    client.on("doesroomexist", function(data) {
        data = JSON.parse(data);
		
        var result = groups[data.room] ? true: false;
		if(result) {
			
			//group exists
			//send number of ppl there and their clientIDs
			var otherClientsIDs = [];
			console.log("Other Client IDs");
			for(var i=0; i<groups[data.room].length; i++) {
				otherClientsIDs.push(groups[data.room][i].id);
				console.log(groups[data.room][i].id);
			}
			
			//This is where it begins
			client.emit("roomExists", JSON.stringify({
				groupmatesIDs: otherClientsIDs
			}));
			
			//add to group
			var found = false;
			if(groups[data.room] != undefined) {
				for(var i=0; i<groups[data.room].length; i++) {
					if(groups[data.room][i].id == client.id) {
						found = true;
					}
				}
				if(!found) {
					console.log("added " + client.id + " to group");
					groups[data.room].push(client);
					client.room = data.room;
				}
				
				console.log("GROUP SO FAR:");
				for(var i=0; i<groups[data.room].length; i++) {
					console.log(groups[data.room][i].id);
				}
				console.log("+++++++++++++++++++++++++++");
			}
		
		}
		else {
			client.emit("roomDoesNotExist");
		}
		/*
        socket.emit("doesroomexist", JSON.stringify({
            result: hosts[data.room] ? true : false,
        }));
		*/
    });
	

    client.on("disconnect", function() {
        if(client.room) {
			console.log("deleting client " + client.id + " from group");

			//delete client from group
			delete groups[client.room][client.id]
			
			//tell all other clients in the group to delete this client
			for(var peerID in groups[client.room]) {
				if(groups[client.room].hasOwnProperty(peerID)) {
				
					console.log("HERE with " + peerID);
					
					serverSend("server", peerID, {
						command: "deletePeer",
						peerToDelete: client.id
					});
				}
			}
			
			if(isEmpty(groups[client.room])) {
				console.log("group member count == 0 so deleting entire group");
				delete groups[client.room];
			}
			
			delete client;
        }
    });
	
	//http://stackoverflow.com/questions/3426979/javascript-checking-if-an-object-has-no-properties-or-if-a-map-associative-arra
	function isEmpty(map) {
		for(var key in map) {
			if (map.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	}
	
});


function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}


module.exports = app;
