
var CommandSet = {
	create: function() {
		var self = Object.create(this);
		
		self.commandFuncs = {};	
		
		return self;
	},
	
	addCommandFuncs: function(nuCommandFuncs) {
		//loop through and add to this.nuCommandFuncs
		//http://stackoverflow.com/questions/684672/loop-through-javascript-object
		for(var key in nuCommandFuncs) {
			if(nuCommandFuncs.hasOwnProperty(key)) {
				this.commandFuncs[key] = nuCommandFuncs[key];
			}
		}
	},
	
	execute: function(data) {
		this.commandFuncs[data.command](data);
	},
	
};