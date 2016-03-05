var NetworkInterface = function () {

	this.networks = {};
	this.networks["webSocket"] = new SocketInterface();
	
	this.networks["webRTC"] = new CommuTool(this.networks["webSocket"]);
	
	this.recvCommands = new CommandSet();
};


NetworkInterface.prototype.connect = function(networkType, data) {
	logger.log("Connecting " + networkType);
	this.networks[networkType].connect(data);
};

NetworkInterface.prototype.send = function(networkType, data) {
	logger.log("Sending via " + networkType);
	if(this.checkParamsOK(networkType, data)) {
		this.networks[networkType].sendI(data);
	}
	else {
		logger.log("Some Networking Params Were Missing");
	}
	
};

NetworkInterface.prototype.checkParamsOK = function(networkType, data) {
	logger.log("Checking Networking Params");
	return this.networks[networkType].checkParamsOK(data);
};


//can add receive functions to recvFuncs from many different scopes
NetworkInterface.prototype.addRecvFuncs = function(networkType, nuRecvFuncs) {
	this.networks[networkType].addRecvFuncs(nuRecvFuncs);
};
NetworkInterface.prototype.addRecvFunc = function(networkType, commandName, nuRecvFunc) {
	this.networks[networkType].addRecvFunc(commandName, nuRecvFunc);
};


////!!! FIX !!!
//Message Format:
//targetID
//command
//otherData..
/*
NetworkInterface.prototype.send = function(networkType, data) {
	this.networks[networkType].sendI(data);
};
*/