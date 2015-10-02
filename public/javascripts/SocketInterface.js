var SocketInterface = function () {
	this.socket = null;
	this.recvCommands = new CommandSet();
};

SocketInterface.prototype.setSocket = function(socket) {
	this.socket = socket;
		
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

//Message Format:
//originatorID
//targetID
//command
//data
SocketInterface.prototype.send = function(serverAction, originatorID, targetID, command, data) {
	
	console.log("SENDING");
	
	//pack up and stringify IDs, command, and data
	data["originatorID"] = originatorID;
	data["targetID"] = targetID;			
	data["command"] = command;	//command for the server	
	
	this.socket.emit(serverAction, JSON.stringify(data));
	
};

