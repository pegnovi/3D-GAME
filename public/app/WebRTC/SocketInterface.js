//NetworkInterface
//must implement:
//	connect(data) method
//	send(data) method

var SocketInterface = function () {
	this.socket = null;
	this.recvCommands = new CommandSet();

};

SocketInterface.prototype.connect = function(data) {
	console.log("socket connecting...");

	//this.socket = data.io.connect("p2pChatAndDraw.jit.su:80"); //use this if uploading to nodejitsu
	//this.socket = data.io.connect("http://nodejswebrtc-pegtest.rhcloud.com:8000/", {'forceNew':true, 'sync disconnect on unload': true });
	this.socket = data.io.connect("127.0.0.1:3000", {'sync disconnect on unload': true }); //use this if running locally
	
	console.log("socket connected!!!");
	
	this.setRecvProcessing();
};

SocketInterface.prototype.socketConnect = function(io) {
	
	console.log("socket connecting...");

	//this.socket = io.connect("p2pChatAndDraw.jit.su:80"); //use this if uploading to nodejitsu
	//this.socket = io.connect("http://nodejswebrtc-pegtest.rhcloud.com:8000/", {'forceNew':true, 'sync disconnect on unload': true });
	this.socket = io.connect("127.0.0.1:3000", {'sync disconnect on unload': true }); //use this if running locally
	
	console.log("socket connected!!!");
	
	this.setRecvProcessing();
};

SocketInterface.prototype.setSocket = function(socket) {
	this.socket = socket;
	
	/*
	var self = this;
	//re-route socket messages to "receive" function
	this.socket.on("serverMessage", function(data) {
		//data should contain originatorID, command, other data
		self.recvCommands.execute(JSON.parse(data));
	});
	*/
	
	this.setRecvProcessing();
};

SocketInterface.prototype.setRecvProcessing = function() {
	var self = this;
	//re-route socket messages to "receive" function
	this.socket.on("serverMessage", function(data) {
		//data should contain originatorID, command, other data
		self.recvCommands.execute(JSON.parse(data));
	});
};

//can add receive functions to recvFuncs from many different scopes
SocketInterface.prototype.addRecvFuncs = function(nuRecvFuncs) {
	this.recvCommands.addCommandFuncs(nuRecvFuncs);
};
SocketInterface.prototype.addRecvFunc = function(commandName, nuRecvFunc) {
	this.recvCommands.addCommandFunc(commandName, nuRecvFunc);
};

//Message Format:
//targetID
//command
//data
SocketInterface.prototype.send = function(serverAction, targetID, command, data) {
	
	console.log("SENDING");
	
	//pack up and stringify IDs, command, and data
	data["targetID"] = targetID;			
	data["command"] = command;	//command for the server	
	
	this.socket.emit(serverAction, JSON.stringify(data));
	
};

SocketInterface.prototype.sendI = function(data) {
	this.socket.emit(data["serverAction"], JSON.stringify(data));
};

