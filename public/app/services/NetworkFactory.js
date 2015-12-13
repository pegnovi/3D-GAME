//Create the 'network' factory
app.factory('networkFactory', ['$http', function($http) {

	var obj = {};

	obj.networkInterface = networkInterface;
	obj.peersGameState = peersGameState;
	
	return obj;
	
}]);