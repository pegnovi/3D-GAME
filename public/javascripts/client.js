
$(document).ready(function() {

	var recvFuncs = {};
	recvFuncs["id"] = function(data) {
		id = data.id;
		console.log("Your ID = " + id);
	}
	socketInterface.addRecvFuncs(recvFuncs);
	
	socketInterface.send("serverJob", "", "", "id", {});
	
	
	channelOpen = false;

	//Sketchpad initialization
	canvas = document.getElementById('canvas');
	padContext = canvas.getContext('2d');
	sketchpad = new Sketchpad(padContext);
	drawingInterval = null;

	$('#size-selector').on('change', function(){
		sketchpad.setWidth($('#size-selector').val());
	});

	$('#size-selector').on('keydown', function(){
	    sketchpad.setWidth($('#size-selector').val());
	});

	$('#color-selector').on('change', function(){
	    sketchpad.setColor($('#color-selector').val());
	});

	//-----------------------

	ownName = "";
	
	//var roomId = getRoomIdFromUrl();
	roomId = getRoomIdFromUrl();
	
	console.log("Room ID = " + roomId);
	
	var commuTool = CommuTool.create(socketInterface /*, roomId*/);
	
	if(roomId) {
		showLoading();
		
		socket.emit("doesroomexist", JSON.stringify({
			room: roomId
		}));
		
	} else {
		showHome();
		socket.emit("createid");
	}

	
	socket.on("id", function(data){
		data = JSON.parse(data);
		id = data.id;
		console.log("Your ID = " + id);
	});
	
	socket.on("createid", function(data) {
		console.log("CREATEID HERE");
		data = JSON.parse(data);
		$("#input-room-id").val(document.URL + "?i=" + data.id);
		roomId = data.id;
		console.log("Room ID = " + roomId);
	});

	socket.on("setname", function(data) {
		data = JSON.parse(data);
		if(data.result) {
			ownName = $("#name-input").val();
			showChatRoom();
		} else {
			alert(data.error);
		}
	});

	//&&!!&&
	socket.on("getCanvasData", function(data) {
		console.log("getCanvasData");
		data = JSON.parse(data);
		
		var imageData = sketchpad.getImageData();
		socket.emit("giveCanvasData", JSON.stringify({
			peerID: data.requesterID,
			image: imageData,
		}));
	});
	//&&!!&&
	socket.on("HereIsCanvasData", function(data) {
		console.log("HereIsCanvasData");
		data = JSON.parse(data);
		sketchpad.setImageData(data.image);
	});
	
	

	// SOCKET WebRTC Handshake 
	//{[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]
	
	//Both
	socket.on("iceCandidateUpdate", function(data) {
		data = JSON.parse(data);
		console.log("ICE Candidate update");
		console.log("Got ICE Candidate from " + data.peerID);

		commuTool.addIceCandidateToPeer(data.peerID, data.iceCandidate);
	});
	
	//Initiator
	groupMateIDs = [];
	socket.on("roomExists", function(data) {
		console.log("Room Exists, Sending Offer to groupmates");
		data = JSON.parse(data);
		groupMateIDs = data.groupmatesIDs;
		
		//Create ConnectionObj for each groupmate
		commuTool.createConnectionObjs(data.groupmatesIDs, true);
		
		//Send offers to groupmates
		commuTool.sendOfferToGroupmates(data.groupmatesIDs);
	});
	
	socket.on("roomDoesNotExist", function() {
		alert("The room does not exist!");
		document.location.href = '../';
	});
	
	socket.on("doesroomexist", function(data) {
		data = JSON.parse(data);
		if(data.result) {
			showNameForm();
		} else {
			alert("The room does not exist!");
			document.location.href = '../';
		}
	});
	
	//Receivor
	
	socket.on("deleteMember", function(data) {
		data = JSON.parse(data);
		console.log("DELETING MEMBER " + data.memberToDelete);

		$("#convo").append(">" + commuTool.conObjs[data.memberToDelete].name + " has left!\n");
		convoHasChanged();
		
		commuTool.deletePeer(data.memberToDelete);
		
		
	});
	//}
	//[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]

	
	
	
	// JQuery Event handlers
	//{
	$("#create-button").click(function() {
		var string = "?i=".concat(roomId);
		history.replaceState(null, "", string);
		showNameForm();
		
	});
	
	$("#name-button").click(function() {
		setName();
	});
	$("#name-input").keypress(function(e) {
		if(e.which == 13) {
			setName();
		}
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
	

	$("#url-button").click(function() {
		window.prompt("Copy URL to clipboard: Ctrl+C", document.URL);
	});

	$("#convo-header").click(function() {
		if($(this).hasClass("collapsed")){
			var chevron = $("#convo-header").find("i");
			chevron.removeClass("fa-chevron-up");
			chevron.addClass("fa-chevron-down");
		} else {
			var chevron = $(this).find("i");
			chevron.removeClass("fa-chevron-down");
			chevron.addClass("fa-chevron-up");
		}
		$("#convo").scrollTop($("#convo")[0].scrollHeight);
		$(".exclamation").remove();
	});

	$("#user-list-button").click(function() {
		var list = $("#user-list");
		list.empty();
		list.append('<li><a href="#"><i class="fa fa-user" style="margin-right: 5px"></i>You</a></li>');
		console.log("CONOBJS " + commuTool.conObjs);
		for (var id in commuTool.conObjs) {
			var obj = commuTool.conObjs[id];
			if(obj.name)
				list.append('<li class="' + obj.name + '"><a href="#"><i class="fa fa-user" style="margin-right: 5px"></i>' + obj.name + '</a></li>');
		}
	});
	
	$("#send").click(function() {
		sendChatMessage();
	});
	$("#msg").keypress(function(e) {
		if(e.which == 13) {
			sendChatMessage();
		}
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
	


	drawingInterval = setInterval(function() {
		var array = sketchpad.toArray();
		if(array.length > 0)
			commuTool.sendToGroup("draw", array);
	},30);

	convoHasChanged = function() {
		var header = $("#convo-header");
		if(header.hasClass("collapsed") && $(".exclamation").length == 0) {
			header.prepend("<div class='exclamation dark-green'><i class='fa fa-exclamation fa-1x'></i></div>");
		}
	}

	function getRoomIdFromUrl() {
		var url = document.URL,
			n = url.indexOf("?i="),
			m = url.indexOf("&");

		if(n > -1 && n + 3 < url.length) {
			return url.substring(n + 3);
		}
		else
			return null;
	}

	function showChatRoom() {
		hide();
		$("#chat-room").show();
		$("#navbar").show();
		var navigation = $("#navigation");
		navigation.animate({
			height: 50,
		}, 1000);
		navigation.addClass("navbar-fixed-top");
		navigation.removeClass("navbar-static-top");
		$(".navbar-brand").css("padding", "5px");
		sketchpad.resize();
		socket.emit("requestCanvasData", null);

	}

	function showHome() {
		hide();
		$("#home").show();
	}

	showNameForm = function() {
		hide();
		$("#name-form").show();
		$("#name-input").focus();
	}

	function showLoading() {
		hide();
		$("#loading").show();
	}

	function hide() {
		$("#name-form").hide();
		$("#home").hide();
		$("#chat-room").hide();
		$("#navbar").hide();
		$("#loading").hide();
	}

	//function error(err) { console.log("ERROR OCCURRED!!!"); console.log(err); endCall(); }

	

	
});