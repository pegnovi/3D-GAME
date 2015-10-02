//Communication Tool assuming Mesh Network between peers
var CommuTool = function(socketInterface) {
	this.socketInterface = socketInterface;
	this.conObjs = {}; //clientID : connectionObj
	
	this.commandSetDataChannels = null;
	this.recvFuncs = null;
	
	var self = this;
	//Move this to client.js??
	//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>	
	//{ =>=>=>=>=> Command Functions For DataChannel =>=>=>=>=>
	//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>
	this.commandSetDataChannels = new CommandSet();
	this.commandSetDataChannels.addCommandFunc("name", function(data) {

		var theConObj = self.findConObj(data.dataChannel);
		if(theConObj != null) {
			theConObj.name = data.dataObj;
			console.log("received name = " + theConObj.name);
			$("#convo").append(">" + theConObj.name + " has joined!\n")
			//??
			convoHasChanged();
		}
	});
	this.commandSetDataChannels.addCommandFunc("chatMessage", function(data) {
		var theConObj = self.findConObj(data.dataChannel);
		if(theConObj != null) {
			var convo = $("#convo");
			convo.append(theConObj.name + ": " + data.dataObj + "\n");
			convo.scrollTop(convo[0].scrollHeight);
			//?? globalized for now
			convoHasChanged();
		}
	});
	this.commandSetDataChannels.addCommandFunc("draw", function(data) {
		var theConObj = self.findConObj(data.dataChannel);
		if(theConObj != null) {
			//?? globalized for now
			sketchpad.drawFromArray(data.dataObj);
		}
	});
	//}
	//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>
	
	//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>	
	//{ =>=>=>=>=> Receive Functions =>=>=>=>=>
	//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>
	this.recvFuncs = {};
	this.recvFuncs["offerFromPeer"] = function(data) {
		console.log("!!!OFFER RECEIVED");
		console.log(data.offer);
		console.log("Offer from peer: " + data.originatorID);
		self.processReceivedOffer(data.originatorID, data.offer);
	};
	this.recvFuncs["answerFromPeer"] = function(data) {
		console.log("!!!ANSWER RECEIVED");
		console.log(data.answer);
		console.log("Answer from peer: " + data.originatorID);
		self.processReceivedAnswer(data.originatorID, data.answer, data.peerName);
		showNameForm();
	};
	this.recvFuncs["iceCandidate"] = function(data) {
		console.log("ICE Candidate update");
		console.log("Got ICE Candidate from " + data.originatorID);
		self.addIceCandidateToPeer(data.originatorID, data.candidate);
	};
	this.recvFuncs["deletePeer"] = function(data) {
		console.log("DELETING MEMBER " + data.peerToDelete);
			$("#convo").append(">" + self.conObjs[data.peerToDelete].name + " has left!\n");
		convoHasChanged();
		
		self.deletePeer(data.peerToDelete);
	};
		
	this.socketInterface.addRecvFuncs(self.recvFuncs);

	//}
	//   =>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>
	
};

//Both
CommuTool.prototype.addIceCandidateToPeer = function(peerID, iceCandidate) {
	if(this.conObjs[peerID] != undefined) {
		this.conObjs[peerID].addIceCandidateToPeerConnection(iceCandidate);
	}
};

//{(((((((((( Initiator ))))))))))
	
//Create a single ConnectionObj for a groupmate
CommuTool.prototype.createConnectionObj = function(peerID, hasOwnDataChannel) {
	this.conObjs[peerID] = new ConnectionObj(peerID, this.commandSetDataChannels, this.socketInterface);
	
	if(hasOwnDataChannel == true) {
		this.conObjs[peerID].makeOwnDataChannel();
	}
};
//Create ConnectionObj for each groupmate
CommuTool.prototype.createConnectionObjs = function(peerIDs, hasOwnDataChannels) {
	for(var i=0; i<peerIDs.length; i++) {
		this.createConnectionObj(peerIDs[i], hasOwnDataChannels);
	}
};
//If sending offer, the connectionObj created for each groupmate must already have a datachannel
CommuTool.prototype.sendOfferToPeer = function(peerID) {
	if(this.conObjs[peerID] != undefined) {
		this.conObjs[peerID].createOfferToPeerConnection(peerID);
	}
};
CommuTool.prototype.sendOfferToGroupmates = function(peerIDs) {
	for(var i=0; i<peerIDs.length; i++) {
		this.sendOfferToPeer(peerIDs[i]);
	}
};
//}
//(((((((((((((((())))))))))))))))
	
//{)))))))))) Receivor ((((((((((
//If receiving offer, the connectionObj created must wait for a datachannel from the new groupmate
CommuTool.prototype.processReceivedOffer = function(offererID, offer) {
	//Create connectionObj for the offering peer
	this.createConnectionObj(offererID, false);
	
	this.conObjs[offererID].processReceivedOffer(offererID, offer)
		
};
	
//Peer's answer to your offer
CommuTool.prototype.processReceivedAnswer = function(answererID, answer, answererName) {
	console.log("ANSWER RECEIVED!!!");

	this.conObjs[answererID].processAnswer(answer);
	
	this.conObjs[answererID].name = answererName;
};
	
//Delete a peer (peer has left)
CommuTool.prototype.deletePeer = function(peerID) {
	this.conObjs[peerID].pc.close();
	delete this.conObjs[peerID];
};
//}
// )))))))))))))))(((((((((((((((
	
//via dataChannel
CommuTool.prototype.sendToGroup = function(theCommand, theData) {
	for(var id in this.conObjs) {
		//console.log(conObjs[id]);
		this.conObjs[id].dataChannel.send(JSON.stringify({
			command: theCommand,
			dataObj: theData
		}));
	}
};
		
CommuTool.prototype.findConObj = function(dataChannel) {
	for(var id in this.conObjs) {
		if(this.conObjs[id].dataChannel == dataChannel) {
			return this.conObjs[id];
		}
	}
	return null;
};



