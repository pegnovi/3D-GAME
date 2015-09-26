var SocketInterface = {
	create: function() {
		var self = Object.create(this);
		self.socket = null;
		self.recvFuncs = null;
		return self;
	},
	
	setSocket: function(socket) {
		var self = this;		
		this.socket = socket;

		//re-route socket messages to "receive" function
		this.socket.on("re-route", function(data) {
			self.receive(JSON.parse(data));
		});
	},
	setRecvFuncs: function(recvFuncs) {
		self.recvFuncs = recvFuncs;
	},
	
	//Message Format:
	//originatorID
	//targetID
	//command
	//data
	send: function(originatorID, targetID, command, data) {
		
		//pack up and stringify IDs, command, and data
		data["originatorID"] = originatorID;
		data["targetID"] = targetID;			
		data["command"] = command;	//command for the server	
		
		this.socket.emit("re-route", JSON.stringify(data));

	},

	//data contains originatorID, command, other data
	receive: function(data) {
		
	},

	
	
};
