app.factory('auth', ['$http', '$window', function($http, $window) {
	var auth = {};
	
	//should save in https cookie to be safer
	auth.saveToken = function(token) {
		console.log("Find token!!!");
		
		console.log(document);
		console.log(token);
		$window.localStorage['session-token'] = token;
	};
	
	auth.getToken = function() {
		return $window.localStorage['session-token'];
	};
	
	auth.isLoggedIn = function() {
		var token = auth.getToken();
		
		if(token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			
			console.log("returning " + (payload.exp > Date.now() / 1000));
			return payload.exp > Date.now() / 1000;
		}
		
		return false;
	};
	
	auth.currentUser = function() {
		if(auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};
	
	auth.register = function(user) {
		return $http.post('/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};
	auth.logIn = function(user){
		return $http.post('/login', user).success(function(data){
			auth.saveToken(data.token);
		});
	};
	auth.logOut = function() {
		$window.localStorage.removeItem('session-token');
	};
	
	
	return auth;
}]);