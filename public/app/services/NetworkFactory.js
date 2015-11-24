//Create the 'network' factory
app.factory('networkFactory', ['$http', function($http) {

	var obj = {};
	obj.socketInterface = socketInterface;
	obj.commuTool = commuTool;
	obj.peersGameState = peersGameState;
	
	return obj;
	
}]);