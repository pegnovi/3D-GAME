var SocketInterface = {
	create: function() {
		var self = Object.create(this);
		self.socket = null;
		self.recvFuncs = {};
		return self;
	},
	
	setSocket: function(socket) {	
		this.socket = socket;
		
		var self = this;
		//re-route socket messages to "receive" function
		this.socket.on("serverMessage", function(data) {
			self.receive(JSON.parse(data));
		});
	
	},
	//can add receive functions to recvFuncs from many different scopes
	addRecvFuncs: function(nuRecvFuncs) {
		//loop through and add to this.recvFuncs
		//http://stackoverflow.com/questions/684672/loop-through-javascript-object
		for(var key in nuRecvFuncs) {
			if(nuRecvFuncs.hasOwnProperty(key)) {
				this.recvFuncs[key] = nuRecvFuncs[key];
			}
		}
	},

	
	//Message Format:
	//originatorID
	//targetID
	//command
	//data
	send: function(serverAction, originatorID, targetID, command, data) {
		
		console.log("SENDING");
		
		//pack up and stringify IDs, command, and data
		data["originatorID"] = originatorID;
		data["targetID"] = targetID;			
		data["command"] = command;	//command for the server	
		
		this.socket.emit(serverAction, JSON.stringify(data));

	},

	//data contains originatorID, command, other data
	receive: function(data) {
		this.recvFuncs[data.command](data);
	},

	
	
};
