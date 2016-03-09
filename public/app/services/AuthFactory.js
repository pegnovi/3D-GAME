app.factory('auth', ['$http', '$window', '$cookies', function($http, $window, $cookies) {
	var auth = {};
	
	//should save in https cookie to be safer
	//(Token is already in cookie when the server sends the cookie, it puts the token inside of it)
	/*
	auth.saveToken = function(token) {
		console.log("Find token!!!");
		console.log($cookies.getAll());
		console.log($cookies.get("authToken"));
		console.log(token);
		$window.localStorage['session-token'] = token;
	};
	*/
	
	auth.getToken = function() {
		//return $window.localStorage['session-token'];
		return $cookies.get("authToken");
	};
	
	auth.isLoggedIn = function() {
		var token = auth.getToken();
		
		if(token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			
			//console.log("returning " + (payload.exp > Date.now() / 1000));
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
			//auth.saveToken(data.token);
			console.log("Done Registering and Logged In");
		});
	};
	auth.logIn = function(user){
		return $http.post('/login', user).success(function(data){
			//auth.saveToken(data.token);
			console.log("Logged In");
		});
	};
	auth.logOut = function() {
		//$window.localStorage.removeItem('session-token');
		$cookies.remove('authToken');
	};
	
	
	return auth;
}]);