//NetworkInterface
//must implement:
//	connect(data) method
//  checkParamsOK(data) method
//	sendI(data) method


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
//call once we have socket connection
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
//targetID - who the message is for (can be "" if it's for the server)
//command - a string representing a command
//otherData - an object with other key-value pairs

//argument "data" must contain the above key-value pairs
SocketInterface.prototype.sendI = function(data) {
	console.log("Socket SENDING");
	
	//pack up and stringify IDs, command, and data
	data["otherData"]["targetID"] = data["targetID"];			
	data["otherData"]["command"] = data["command"];	//command for the server	
	
	this.socket.emit(data["serverAction"], JSON.stringify(data["otherData"]));
};

SocketInterface.prototype.checkParamsOK = function(data) {
	if(typeof data["serverAction"] === 'undefined') {
		console.log("No serverAction specified");
		return false;
	}
	if(typeof data["targetID"] === 'undefined') {	
		data["targetID"] = "";
	}
	if(typeof data["command"] === 'undefined') {
		console.log("No command specified");
		return false;
	}
	if(typeof data["otherData"] === 'undefined') {
		console.log("No otherData found");
		return false;
	}
	
	return true;
};
