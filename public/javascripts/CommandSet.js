var CommandSet = function() {
	this.commandFuncs = {};
};
CommandSet.prototype.addCommandFuncs = function(nuCommandFuncs) {
	//loop through and add to this.nuCommandFuncs
	//http://stackoverflow.com/questions/684672/loop-through-javascript-object
	for(var key in nuCommandFuncs) {
		if(nuCommandFuncs.hasOwnProperty(key)) {
			this.commandFuncs[key] = nuCommandFuncs[key];
		}
	}
};
CommandSet.prototype.addCommandFunc = function(commandName, commandFunc) {
	this.commandFuncs[commandName] = commandFunc;
};
	
CommandSet.prototype.execute = function(data) {
	if(data.command !== undefined) {
		this.commandFuncs[data.command](data);
	}
	else {
		console.log("NO COMMAND GIVEN SO DOING NOTHING...");
	}
};
