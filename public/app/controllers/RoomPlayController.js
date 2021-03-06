app.controller('RoomPlayCtrl', ['$scope', '$state', 'roomsFactory', 'networkFactory',
function($scope, $state, roomsFactory, networkFactory) {
	
	console.log("In Room Play Controller");
	console.log(networkFactory.peersGameState.readyStates);
	
	$scope.gameRoomTimer = new Tock({
		countdown: true,
		complete: function() {
			console.log("Finished");
			$state.transitionTo('game.roomLobby');
		}
	});
	$scope.gameRoomTimer.start(5000);
	/*
	$scope.rdyStates = networkFactory.peersGameState.readyStates;
	
	$scope.msgs = "";
	$scope.msg = "";
	
	$scope.readyState = false;
	$scope.readyStateColor;
	
	$scope.countdownTime = 0;
	
	networkFactory.commuTool.commandSetDataChannels.addCommandFunc("msg", function(data) {
		$scope.appendMessageWithApply(data.dataObj.chatMessage);
	});
	
	
	var recvFuncs = {};
	recvFuncs["updatePeerReadyState"] = function(data) {
		peersGameState.setReadyState(data.peerID, data.readyState);
		$scope.$apply();
	};
	recvFuncs["peerReadyStates"] = function(data) {
		console.log("PEER READY STATES");
		console.log(data.peerReadyStates);
		for(var key in data.peerReadyStates) {
			if (data.peerReadyStates.hasOwnProperty(key)) {
				console.log("peerID: " + key + " is READY: " + data.peerReadyStates[key].readyState);
				networkFactory.peersGameState.addPeer(key, data.peerReadyStates[key].readyState);
			}
		}
		$scope.$apply();
	};
	recvFuncs["countdown"] = function(data) {
		console.log("In Countdown");
		var clock = new FlipClock($('#countdown'), 10, {
			// ... your options here
			clockFace: 'MinuteCounter',
		    countdown: true,
		    autoStart: false,
		    callbacks: {
		      	start: function() {
		      		//$('.message').html('The clock has started!');
		       	},
				stop: function() {
					//move to play page
					//http://joelhooks.com/blog/2013/07/22/the-basics-of-using-ui-router-with-angularjs/
					$state.transitionTo('game.play');
				}
		    }
		});
		
		clock.start();
	};
	networkFactory.socketInterface.addRecvFuncs(recvFuncs);
	

	$scope.sendMessage = function() {
		console.log("sending = " + $scope.msg);
		
		console.log(networkFactory.commuTool.conObjs);
		
		networkFactory.commuTool.sendToGroup("msg", {chatMessage: $scope.msg});
		
		$scope.appendMessage($scope.msg);
		
		$scope.msg = "";
		
	};
	
	$scope.appendMessage = function(theMessage) {
		$scope.msgs = $scope.msgs + "\n" + theMessage;
	};
	
	//http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
	$scope.appendMessageWithApply = function(theMessage) {
		$scope.$apply(function() {
			$scope.appendMessage(theMessage);
		});
	};
	
	$scope.getRoomID = function() {
		console.log(roomsFactory.chosenRoomID);
	};
	
	$scope.toggleReadyState = function() {
		$scope.readyState = !$scope.readyState;
		
		if($scope.readyState) {
			$scope.readyStateColor = 'green';
		}
		else {
			$scope.readyStateColor = 'red';
		}
		
		networkFactory.peersGameState.setReadyState("own", $scope.readyState);
		
		networkFactory.socketInterface.send("serverJob", "", "updateReadyState", {roomID: roomsFactory.chosenRoomID, readyState: $scope.readyState});
	};
	*/
	
	
}]);