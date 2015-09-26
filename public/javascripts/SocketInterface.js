var SocketInterface = {
	create: function() {
		var self = Object.create(this);
		self.socket = null;
		self.recvFuncs = null;
		return self;
	},
	
	setSocket: function(socket) {		
		this.socket = socket;
	},
	setRecvFuncs: function(recvFuncs) {
		this.recvFuncs = recvFuncs;
	},
	//This must only be called once setSocket and setRecvFuncs has been called
	setReRouteRecv: function() {
		var self = this;
		//re-route socket messages to "receive" function
		this.socket.on("re-route", function(data) {
			self.receive(JSON.parse(data));
		});
	},
	
	//Message Format:
	//originatorID
	//targetID
	//command
	//data
	send: function(originatorID, targetID, command, data) {
		
		console.log("SENDING");
		
		//pack up and stringify IDs, command, and data
		data["originatorID"] = originatorID;
		data["targetID"] = targetID;			
		data["command"] = command;	//command for the server	
		
		this.socket.emit("re-route", JSON.stringify(data));

	},

	//data contains originatorID, command, other data
	receive: function(data) {
		this.recvFuncs[data.command](data);
	},

	
	
};
