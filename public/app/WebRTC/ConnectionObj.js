//stores peerConnection and dataChannel
var ConnectionObj = function(targetID, commandSet, socketInterface) {
	this.targetID = targetID;
	this.commandSetDataChannel = commandSet;
	this.socketInterface = socketInterface;
	
	this.name = "";
	this.channelOpen = false;
	this.pc = null;
	this.dataChannel = null;
	
	var configuration = {
		'iceServers': [
			{'url':'stun:stun01.sipphone.com'},
			{'url':'stun:stun.ekiga.net'},
			{'url':'stun:stun.fwdnet.net'},
			{'url':'stun:stun.ideasip.com'},
			{'url':'stun:stun.iptel.org'},
			{'url':'stun:stun.rixtelecom.se'},
			{'url':'stun:stun.schlund.de'},
			{'url':'stun:stun.l.google.com:19302'},
			{'url':'stun:stun1.l.google.com:19302'},
			{'url':'stun:stun2.l.google.com:19302'},
			{'url':'stun:stun3.l.google.com:19302'},
			{'url':'stun:stun4.l.google.com:19302'},
			{'url':'stun:stunserver.org'},
			{'url':'stun:stun.softjoys.com'},
			{'url':'stun:stun.voiparound.com'},
			{'url':'stun:stun.voipbuster.com'},
			{'url':'stun:stun.voipstunt.com'},
			{'url':'stun:stun.voxgratia.org'},
			{'url':'stun:stun.xten.com'},
			{
				'url': 'turn:numb.viagenie.ca',
				'credential': 'muazkh',
				'username': 'webrtc@live.com'
			},
			{
				'url': 'turn:192.158.29.39:3478?transport=udp',
				'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
				'username': '28224511:1379330808'
			},
			{
				'url': 'turn:192.158.29.39:3478?transport=tcp',
				'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
				'username': '28224511:1379330808'
			}
		]
	};
	
	//Create own PeerConnection 
	this.pc = new PeerConnection(configuration);
	var self = this;
	
	/*
	this.pc.onicecandidate = function(event) {
		
		if(self.pc.remoteDescription == undefined || self.pc.remoteDescription == null) {
			console.log("!!!REMOTE UNDEFINED!!!");
		}
		else {
			console.log("!!!REMOTE IZ DEFINED!!!");
		}
		if(event.candidate) {
			self.socketInterface.send("re-route", targetID, "iceCandidate", {candidate: event.candidate});
		}
	};
	*/
	
	
	this.pc.onnegotiationneeded = function () {
		console.log("ON NEGOTIATION NEEDED");
		//??
		//sendOfferToGroupmates(gpsIDs);
	};
		
	this.pc.ondatachannel = function(event) {
		console.log("GOT A DATA CHANNEL!!!");
		self.dataChannel = event.channel;
		self.setChannelEvents();
	};
	
};

ConnectionObj.prototype.setOnIceCandidate = function() {
	this.pc.onicecandidate = function(event) {
		console.log("SENDING ICE CANDIDATE " + event.candidate);
		if(self.pc.remoteDescription == undefined || self.pc.remoteDescription == null) {
			console.log("!!!REMOTE UNDEFINED!!!");
		}
		else {
			console.log("!!!REMOTE IZ DEFINED!!!");
		}
		if(event.candidate) {
			self.socketInterface.send("re-route", targetID, "iceCandidate", {candidate: event.candidate});
		}
	};
};
ConnectionObj.prototype.makeOwnDataChannel = function() {
	this.dataChannel = this.pc.createDataChannel("dataChannel");
	this.setChannelEvents();
};

ConnectionObj.prototype.setChannelEvents = function() {
	var self = this;
	this.dataChannel.onmessage = function(event) {
		var data = JSON.parse(event.data);
		data["dataChannel"] = this;
		console.log("received command: " + data.command);
		console.log("received dataObj: ");
		console.log(data.dataObj);

		self.commandSetDataChannel.execute(data);
	};
	
	this.dataChannel.onopen = function() {
		console.log("channel open");
		self.channelOpen = true;
	};
	this.dataChannel.onclose = function() {
		console.log("channel close");
		self.channelOpen = false;
	};
};

ConnectionObj.prototype.setDataChannel = function(channel) {
	this.dataChannel = channel;
};

ConnectionObj.prototype.addIceCandidateToPeerConnection = function(daIceCandidate) {
	console.log("Adding Candidate: ");
	console.log(daIceCandidate);
	this.pc.addIceCandidate(new RTCIceCandidate(daIceCandidate), function() {alert("ICE success");}, function() {alert("ICE fail");});
};

//{(((((((((( Initiator ))))))))))
	
//peerID = the target groupmate's ID that the offer will be sent to
ConnectionObj.prototype.createOfferToPeerConnection = function(peerID) {
	var self = this;

	self.pc.createOffer(function(offer) {
		self.pc.setLocalDescription(new SessionDescription(offer), 
			function() {
				//send the offer to a server to be forwarded to the friend you're calling
				console.log("SENDING OFFER");
				self.socketInterface.send("re-route", peerID, "offerFromPeer", {offer: offer});
								
			}, error);
	}, error);
};
//}
//(((((((((((((((())))))))))))))))


//{)))))))))) Receivor ((((((((((
//If receiving offer, the connectionObj created must wait for a datachannel from the new groupmate
ConnectionObj.prototype.processReceivedOffer = function(offererID, offer) {
	var self = this;
	var ownPeerConnection = this.pc;
		
	ownPeerConnection.setRemoteDescription(new SessionDescription(offer), function() {
		self.createAnswer(offererID);		
	}, error);
};
	
ConnectionObj.prototype.createAnswer = function(offererID) {
	var self = this;
		
	self.pc.createAnswer(function(answer) {
			
		self.pc.setLocalDescription(new SessionDescription(answer), function() {
			
			//https://github.com/ESTOS/strophe.jingle/issues/35
			//send the answer to a server to be forwarded back to the caller
			console.log("SENDING ANSWER");
			self.socketInterface.send("re-route", offererID, "answerFromPeer", {peerName: self.name, answer: answer});
					
		}, error);
	}, error);
};
	
ConnectionObj.prototype.processAnswer = function(answer) {
	this.pc.setRemoteDescription(new SessionDescription(answer), function() {}, error);
};
//}
// )))))))))))))))(((((((((((((((

