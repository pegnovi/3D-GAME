//stores peerConnection and dataChannel
var ConnectionObj = {
	create: function(commandFunctions, socketInterface) {
		var self = Object.create(this);
		
		self.socketInterface = socketInterface;
		self.name = "";
		self.channelOpen = false;
			
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
		self.pc = new PeerConnection(configuration);
		self.pc.onicecandidate = function(event) {
			if(self.pc.remoteDescription == undefined || self.pc.remoteDescription == null) {
				console.log("!!!REMOTE UNDEFINED!!!");
			}
			else {
				console.log("!!!REMOTE IZ DEFINED!!!");
			}
			if(event.candidate) {
				console.log("Sending new ICE Candidate");
				console.log(event.candidate);
				self.socketInterface.socket.emit("iceCandidate", JSON.stringify({
					room: roomId, //(roomId is not defined)
					candidate: event.candidate
				}));
				//????
				//self.socketInterface.send(id, , "iceCandidate", {candidate: candidate});
			}
		}
		self.pc.onnegotiationneeded = function () {
			console.log("ON NEGOTIATION NEEDED");
			//??
			//sendOfferToGroupmates(gpsIDs);
		}
		self.dataChannel = null;
		
		self.pc.ondatachannel = function(event) {
			console.log("GOT A DATA CHANNEL!!!");
			self.dataChannel = event.channel;
			self.setChannelEvents(commandFunctions);
		}
		
		self.recvFuncs = {};
		self.recvFuncs["id"] = function(data) {

		};
		
		return self;
	},
	
	makeOwnDataChannel: function(commandFunctions) {
		this.dataChannel = this.pc.createDataChannel("dataChannel");
		this.setChannelEvents(commandFunctions);
	},
	setChannelEvents: function(commandFunctions) {
		this.dataChannel.onmessage = function(event) {
			var data = JSON.parse(event.data);
			console.log("received command: " + data.command);
			console.log("received dataObj: ");
			console.log(data.dataObj);
			commandFunctions[data.command](this, data);
		};
	
		this.dataChannel.onopen = function() {
			console.log("channel open");
			this.channelOpen = true;
		}
		this.dataChannel.onclose = function() {
			console.log("channel close");
			this.channelOpen = false;
		}
	},
	
	setDataChannel : function(channel) {
		this.dataChannel = channel;
	},
	
	
	
	addIceCandidateToPeerConnection : function(daIceCandidate) {
		this.pc.addIceCandidate(new RTCIceCandidate(daIceCandidate));
	},
	
	//{(((((((((( Initiator ))))))))))
	
	//peerID = the target groupmate's ID that the offer will be sent to
	createOfferToPeerConnection : function(peerID) {
		var self = this;
		var ownPeerConnection = this.pc;
		
		ownPeerConnection.createOffer(function(offer) {
			ownPeerConnection.setLocalDescription(new SessionDescription(offer), 
				function() {
					//send the offer to a server to be forwarded to the friend you're calling
					/*
					self.socketInterface.emit("signalOffer", JSON.stringify({
						targetID: peerID,
						clientOffer: offer
					}));
					*/
					console.log("SENDING OFFER");
					self.socketInterface.send("re-route", id, peerID, "offerFromPeer", {offer: offer});
					
				}, error);
		}, error);
	},
	//}
	//(((((((((((((((())))))))))))))))
	
	//{)))))))))) Receivor ((((((((((
	//If receiving offer, the connectionObj created must wait for a datachannel from the new groupmate
	processReceivedOffer: function(offererID, offer) {
		var self = this;
		var ownPeerConnection = this.pc;
		
		ownPeerConnection.setRemoteDescription(new SessionDescription(offer), function() {
				
			self.createAnswer(offererID);
			
		}, error);
	},
	
	createAnswer: function(offererID) {
		var self = this;
		var ownPeerConnection = this.pc;
		
		ownPeerConnection.createAnswer(function(answer) {
			
			
			ownPeerConnection.setLocalDescription(new SessionDescription(answer), function() {
			
				//https://github.com/ESTOS/strophe.jingle/issues/35
				//send the answer to a server to be forwarded back to the caller
				/*
				self.socketInterface.emit("signalAnswer", JSON.stringify({
					clientName: self.name,
					clientAnswer: answer,
					targetID: offererID 
				}));
				*/
				console.log("SENDING ANSWER");
				self.socketInterface.send("re-route", id, offererID, "answerFromPeer", {peerName: self.name, answer: answer});
				
				
			}, error);
		}, error);
	},
	
	processAnswer: function(answer) {
		var ownPeerConnection = this.pc;
		ownPeerConnection.setRemoteDescription(new SessionDescription(answer), function() {}, error);
	},
	//}
	// )))))))))))))))(((((((((((((((
	
};