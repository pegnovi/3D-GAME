var express = require('express');
var socket = require('socket.io');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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




var server = http.createServer(app);
//server.listen(3000); //use this if running locally
//server.listen(80); //use this if uploading to nodejitsu


//=====================
//===socket.io stuff===
//=====================
socket = socket.listen(server);

server.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP); //use this if deploying to openshift

//Represents a group of clients in the same chatroom
var groups = {}; //roomID : list of client ids

socket.on("connection", function(client) {
	console.log("client connected via socket!!!");
	
	console.log("client id = " + client.id);
    client.name = "Unknown";
    client.locked = true;
     
    client.on("createid", function() {
		console.log("SERVER CREATE ROOM ID!!!");
        if(client.room) {
            client.emit("createid", JSON.stringify({
                id: client.room,
            }));
            return;
        }
        client.room = "";

		//Ensure uniqueness of UUID
        var UUID = getUUID();
        while(groups[UUID]) {
            UUID = getUUID();
        }

        client.room = UUID;
        groups[UUID] = [];
		groups[UUID].push(client);
        client.name = "Host";

        client.emit("createid", JSON.stringify({
            id: UUID,
        }));
    });

    client.on("setname", function(data) {
        data = JSON.parse(data);
        var result = false;
        var message = "";

        if(data.name.length < 3) {
            message = "Name must be at least 3 characters long.";
        } else if (data.name.length > 20) {
        	message = "Name cannot be more than 20 characters long."
        } else {
            client.name = data.name;
            result = true;
            message = "Name is good."
        }

        client.emit("setname", JSON.stringify({
			result: result,
            error: message 
        }));
    });

    client.on("togglelock", function() {
        if(client.room) {
            if(client.locked) {
                client.locked = false;
            } else
                client.locked = true;

            client.emit("toggledlock");
        }
    });

    client.on("requestCanvasData", function() {
    	socket.to(groups[client.room][0].id).emit("getCanvasData", JSON.stringify({
			requesterID: client.id
		}));
    });

	//&&!!&&
	client.on("giveCanvasData", function(data) {
		console.log("giveCanvasData");
		data = JSON.parse(data);
		socket.to(data.peerID).emit("HereIsCanvasData", JSON.stringify({
			image: data.image,
		}));
	});
	
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
	client.on("signalOffer", function(data) {
		data = JSON.parse(data);
		//console.log("!!!IN SIGNAL OFFER with target id = " + data.targetID);
		//console.log("the offer is = " + data.clientOffer);
	
		socket.to(data.targetID).emit("offerFromClient", JSON.stringify({
			offer: data.clientOffer,
			offererID: client.id
		}));
		
	});
	
	
	client.on("signalAnswer", function(data) {
		data = JSON.parse(data);
		
		//console.log("client room = " + client.room);
		socket.to(data.targetID).emit("answerToOffer", JSON.stringify({
			roomID: client.room,
			answer: data.clientAnswer,
			answererID: client.id,
			answererName: data.clientName
		}));
		
	});

	client.on("iceCandidate", function(data) {
		data = JSON.parse(data);
		
		console.log("ICE candidate from " + client.id);
		console.log("For room " + data.room);
		if(groups[data.room] != undefined) {
			for(var i=0; i<groups[data.room].length; i++) {
				if(groups[data.room][i].id != client.id) {
					console.log("Sending ICE Candidate to " + groups[data.room][i].id);
					socket.to(groups[data.room][i].id).emit("iceCandidateUpdate", JSON.stringify({
						peerID: client.id,
						iceCandidate: data.candidate
					}));
				}
			}
			console.log();
		
		}
	});
	
    client.on("disconnect", function() {
        if(client.room) {
			console.log("deleting client " + client.id + " from group");

			//delete client from group
			var index = groups[client.room].indexOf(client);
			groups[client.room].splice(index,1);
			
			//tell all other clients in the group to delete this client
			for(var i=0; i<groups[client.room].length; i++) {
				console.log("HERE with " + groups[client.room][i].id);
				socket.to(groups[client.room][i].id).emit("deleteMember", JSON.stringify({
					memberToDelete: client.id
				}));
			}
			
			if(groups[client.room].length == 0) {
				console.log("group member count == 0 so deleting entire group");
				delete groups[client.room];
			}
			delete client;
        }
    });
	
});


function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}


module.exports = app;
