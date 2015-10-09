var app = angular.module('app', ['ui.router']);

console.log("ANGULAR APP");

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	// HOME STATES AND NESTED VIEWS ==============================
	$stateProvider.state('home', {
		url: '/',
		views: {
			'@': {
				controller: 'RoomsCtrl',
				templateUrl: 'app/views/pages/home/home.html',
			}
		}
		
	});
	
	$stateProvider.state('about', {
		url: '/about',
		abstract: true,
		templateUrl: 'app/views/pages/about/about.html'
	});

	$stateProvider.state('about.world', {
		url: '/world',
		views: {
			'@': {
				templateUrl: 'app/views/pages/about/world.html'
			}
		}
	});
	
	$stateProvider.state('about.characters', {
		url: '/characters',
		views: {
			'@': {
				templateUrl: 'app/views/pages/about/characters.html'
			}
		}
	});
	
	$stateProvider.state('about.gameplay', {
		url: '/about/gameplay',
		views: {
			'@': {
				templateUrl: 'app/views/pages/about/gameplay.html'
			}
		}
	});
	
	$stateProvider.state('game', {
		url: '/game',
		views: {
			'': {
				templateUrl: 'app/views/pages/game/game.html',
			},
			'rooms@game': {
				templateUrl: 'app/views/pages/game/rooms.html',
				controller: 'RoomsCtrl'
			},
			
		}
	});
	
}]);

/*
app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	$state.transitionTo('home');
}]);
*/

//Create the 'rooms' factory
app.factory('rooms', [function() {
	return {
		currentRooms: [
			{roomName: 'ABS'},
			{roomName: 'CBN'},
			{roomName: 'GMA'},
		]
	};
}]);

//Create the RoomsCtrl injecting the 'rooms' factory in it
app.controller('RoomsCtrl', [
'$scope',
'rooms',
function($scope, rooms) {
	var vm = this;
	$scope.theRooms = rooms.currentRooms;

}]);
