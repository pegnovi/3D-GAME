app.controller('AuthCtrl', ['$scope', '$state', 'auth', function($scope, $state, auth) {

	// === AuthController vars === 
	$scope.user = {};
	$scope.loginMode = true;
	
	// === AuthController functions === 
	$scope.isLoggedIn = auth.isLoggedIn;
	
	$scope.register = function() {
		logger.log("USER REGISTERS");
		logger.log($scope.user);
	
		auth.register($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('home');
			$scope.loginMode = false;
		});
	};
	$scope.logIn = function() {
		auth.logIn($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('home');
			$scope.loginMode = false;
		});
	};
	$scope.logOut = function() {
		auth.logOut();
		$scope.loginMode = true;
	}
	
}]);