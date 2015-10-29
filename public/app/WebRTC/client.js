
$(document).ready(function() {

	//?!
	var recvFuncs = {};
	recvFuncs["id"] = function(data) {
		id = data.id;
		console.log("Your ID = " + id);
	};
	recvFuncs["roomPeers"] = function(data) {
		//Create ConnectionObj for each roomPeer
		commuTool.createConnectionObjs(data.groupmatesIDs, true);
		
		//Send offers to RoomPeers
		commuTool.sendOfferToGroupmates(data.groupmatesIDs);
	};
	socketInterface.addRecvFuncs(recvFuncs);
	//?!
	
	socketInterface.send("serverJob", "", "", "id", {});
	
	
	//-----------------------



	// SOCKET WebRTC Handshake 
	//{[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]
	
	//Initiator
	socket.on("roomExists", function(data) {
		console.log("Room Exists, Sending Offer to groupmates");
		data = JSON.parse(data);

		//Create ConnectionObj for each peer
		commuTool.createConnectionObjs(data.groupmatesIDs, true);
		
		//Send offers to groupmates
		commuTool.sendOfferToGroupmates(data.groupmatesIDs);
	});
	
	//}
	//[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]

	
	
	
	// JQuery Event handlers
	//{
	
	$("#name-button").click(function() {
		setName();
	});
	function setName() {
		socket.emit("setname", JSON.stringify({
			name: $("#name-input").val(),
		}));
		
		console.log("channelOpen = " + channelOpen);
		if(channelOpen == true) {
			console.log("SENDING A NAME");
			commuTool.sendToGroup("name", $("#name-input").val());
		}
	}


	
	$("#send").click(function() {
		sendChatMessage();
	});
	var sendChatMessage = function() {
		var msg = $("#msg").val();
		var convo = $("#convo");
		convo.append(ownName + ": " + msg + "\n");
		convo.scrollTop(convo[0].scrollHeight);
		commuTool.sendToGroup("chatMessage", msg);
		$("#msg").val("");
	};
	
	//}
	

	
});