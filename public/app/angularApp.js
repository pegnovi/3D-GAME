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
	
	// +-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+
	// +-=-+-=-+-=-+-=-+ GAME! +-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+
	//{+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+
	$stateProvider.state('game', {
		url: '/game',
		abstract: true,
		templateUrl: 'app/views/pages/game/game.html'
	});
	$stateProvider.state('game.rooms', {
		url: '/rooms',
		views: {
			'@': {
				templateUrl: 'app/views/pages/game/rooms.html',
				controller: 'RoomsCtrl as RoomsCtrl',
				resolve: {
					roomsPromise: ['roomsFactory', function(roomsFactory) {
						return roomsFactory.getAllRooms();
					}]
				}
			}
		}
	});
	
	//read
	//https://github.com/angular-ui/ui-router/wiki
	//for various state transitioning options
	$stateProvider.state('game.roomLobby', {
		url: '/room/{id}',
		views: {
			'@': {
				templateUrl: 'app/views/pages/game/roomLobby.html',
				controller: 'RoomLobbyCtrl as RoomLobbyCtrl',
				resolve: {
					
					/*
					room: ['$stateParams', 'roomsFactory', function($stateParams, roomsFactory) {
						return roomsFactory.get($stateParams.id);
					}]
					*/
					
					
					room: ['roomsFactory', function(roomsFactory) {
						return roomsFactory.get(roomsFactory.chosenRoomID);
					}],
					
					socketConn: ['roomsFactory', function(roomsFactory) {
						socketInterface.socketConnect(io);
						socketInterface.send("serverJob", "", "joinRoom", {roomID: roomsFactory.chosenRoomID})
					}]
					
				}
			}
		}
	});
	$stateProvider.state('game.play', {
		url: '/play',
		views: {
			'@': {
				//current game.html should be play.html
				templateUrl: 'app/views/pages/game/play.html'
			}
		}
	});

	/*
	$stateProvider.state('game', {
		url: '/game',
		views: {
			'': {
				templateUrl: 'app/views/pages/game/gameOld.html',
			},
			'rooms@game': {
				templateUrl: 'app/views/pages/game/roomsOld.html',
				controller: 'RoomsCtrl'
			},
			
		}
	});
	*/
	//}+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+
	// +-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+-=-+
	
}]);

/*
app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	$state.transitionTo('home');
}]);
*/
