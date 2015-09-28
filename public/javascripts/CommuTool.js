//Communication Tool assuming Mesh Network between peers
var CommuTool = {

	//socket is some messaging interface
	create: function(socketInterface) {
		var self = Object.create(this);
			
		self.socketInterface = socketInterface;
		self.conObjs = {}; //clientID : connectionObj
		
		//Move this to client.js??
		//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>	
		//{ =>=>=>=>=> Command Functions =>=>=>=>=>
		//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>
		self.commandFunctions = {};
		self.commandFunctions["name"] = function(data) {
			var theConObj = self.findConObj(data.dataChannel);
			if(theConObj != null) {
				theConObj.name = data.dataObj;
				console.log("received name = " + theConObj.name);
				$("#convo").append(">" + theConObj.name + " has joined!\n")
				//??
				convoHasChanged();
			}
		};

		self.commandFunctions["chatMessage"] = function(data) {
			var theConObj = self.findConObj(data.dataChannel);
			if(theConObj != null) {
				var convo = $("#convo");
				convo.append(theConObj.name + ": " + data.dataObj + "\n");
				convo.scrollTop(convo[0].scrollHeight);
				//?? globalized for now
				convoHasChanged();
			}
		};

		self.commandFunctions["draw"] = function(data) {
			var theConObj = self.findConObj(data.dataChannel);
			if(theConObj != null) {
				//?? globalized for now
				sketchpad.drawFromArray(data.dataObj);
			}
		}
		
		/*
		self.commandFunctions[" <YOUR COMMAND> "] = function(dataChannel, data) {
			var theConObj = this.findConObj(dataChannel);
			if(theConObj != null) {
				//YOUR STUFF TO DO
				
				//
			}
		};
		*/
		
		//}
		//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>	

		//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>	
		//{ =>=>=>=>=> Receive Functions =>=>=>=>=>
		//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>
		self.recvFuncs = {};
		self.recvFuncs["offerFromPeer"] = function(data) {
			console.log("!!!OFFER RECEIVED");
			console.log(data.offer);
			console.log("Offer from peer: " + data.originatorID);
			self.processReceivedOffer(data.originatorID, data.offer);
		};
		self.recvFuncs["answerFromPeer"] = function(data) {
			console.log("!!!ANSWER RECEIVED");
			console.log(data.answer);
			console.log("Answer from peer: " + data.originatorID);
			self.processReceivedAnswer(data.originatorID, data.answer, data.peerName);
			showNameForm();
		};
		
		/*
		self.recvFuncs[" <YOUR COMMAND> "] = function(data) {
		};
		*/
		
		self.socketInterface.addRecvFuncs(self.recvFuncs);

		//}
		//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>
		
		self.onIceCandidateHandler = function(candidate) {
			for(var peerID in self.conObjs) {
				if(self.conObjs.hasOwnProperty(peerID)) {
					self.socketInterface.send("re-route", id, peerID, "iceCandidate", {candidate: candidate});
				}
			}
		};
		
		
		return self;
	},
	
	//Both
	addIceCandidateToPeer: function(peerID, iceCandidate) {
		if(this.conObjs[peerID] != undefined) {
			this.conObjs[peerID].addIceCandidateToPeerConnection(iceCandidate);
		}
	},
	
	//{(((((((((( Initiator ))))))))))
	
	//Create a single ConnectionObj for a groupmate
	createConnectionObj: function(peerID, hasOwnDataChannel) {
		this.conObjs[peerID] = ConnectionObj.create(this.commandFunctions, this.socketInterface);
		
		if(hasOwnDataChannel == true) {
			this.conObjs[peerID].makeOwnDataChannel(this.commandFunctions);
		}
	},
	//Create ConnectionObj for each groupmate
	createConnectionObjs: function(peerIDs, hasOwnDataChannels) {
		for(var i=0; i<peerIDs.length; i++) {
			this.createConnectionObj(peerIDs[i], hasOwnDataChannels);
		}
	},
	//If sending offer, the connectionObj created for each groupmate must already have a datachannel
	sendOfferToPeer: function(peerID) {
		if(this.conObjs[peerID] != undefined) {
			this.conObjs[peerID].createOfferToPeerConnection(peerID);
		}
	},	
	sendOfferToGroupmates: function(peerIDs) {
		for(var i=0; i<peerIDs.length; i++) {
			this.sendOfferToPeer(peerIDs[i]);
		}
	},
	//}
	//(((((((((((((((())))))))))))))))
	
	//{)))))))))) Receivor ((((((((((
	//If receiving offer, the connectionObj created must wait for a datachannel from the new groupmate
	processReceivedOffer: function(offererID, offer) {

		//Create connectionObj for the offering peer
		this.createConnectionObj(offererID, false);
		
		this.conObjs[offererID].processReceivedOffer(offererID, offer)
		
	},
	
	//Peer's answer to your offer
	processReceivedAnswer: function(answererID, answer, answererName) {
		console.log("ANSWER RECEIVED!!!");
	
		this.conObjs[answererID].processAnswer(answer);
		
		this.conObjs[answererID].name = answererName;

	},
	
	//Delete a peer (peer has left)
	deletePeer: function(peerID) {
		delete this.conObjs[peerID];
	},
	//}
	// )))))))))))))))(((((((((((((((
	

	sendToGroup: function(theCommand, theData) {
		for(var id in this.conObjs) {
			//console.log(conObjs[id]);
			this.conObjs[id].dataChannel.send(JSON.stringify({
				command: theCommand,
				dataObj: theData
			}));
		}
	},
		
	findConObj: function(dataChannel) {
		for(var id in this.conObjs) {
			if(this.conObjs[id].dataChannel == dataChannel) {
				return this.conObjs[id];
			}
		}
		return null;
	},


	
};


