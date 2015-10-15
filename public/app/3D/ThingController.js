//object controller interface
//must have commandFunction(data)

function ThingController(targetThing, camera) {
	
	var self = this;

	this.camOrientation = new THREE.Quaternion(0,0,0,1);
	this.camera = camera;
	
	this.boostMode = false;
	this.meleeBoostMode = false;
	this.speed = 100;
	
	this.targetThing = targetThing;

	
	this.mode = 1; //0 = space, 1 = ground
	
	
	this.prevKeyPressed = ' ';
	this.keyPressed = ' ';
	this.keyPressedTime = -1;
	
	
	this.commandFunction = function(data) {
		self.processUserInput(data.delta, data.now, 
							  data.input.mouseMovX, data.input.mouseMovY,
							  data.input.leftClick, data.input.rightClick,
							  data.input.scrollVall, data.input.keyboard);
	};
};

ThingController.prototype.setMode = function(mode) {
	if(mode >= 0 || mode <= 1) {
		this.mode = mode;	
	}
};

ThingController.prototype.rotateCam = function(axis, angleDegrees) {
	var rotQuat = new THREE.Quaternion();
	rotQuat.setFromAxisAngle(axis, angleDegrees * 0.01745);
	
	this.camOrientation.multiplyQuaternions(rotQuat, this.camOrientation);
}

ThingController.prototype.changeBoostMode = function(boostModeOn) {
	this.boostMode = boostModeOn
	
	if(this.boostMode == true) {
		this.speed = 400;
	}
	else {
		this.speed = 100;
	}
};

ThingController.prototype.checkBoostMode = function(now, userActed) {
	//console.log(this.targetThing.speed);

	if(userActed == true) {
		
		var tDiff = now - this.keyPressedTime;
		
		if(tDiff > 0.07 && tDiff < 0.16 && this.prevKeyPressed == this.keyPressed) {
			console.log("boost");
			this.targetThing.changeBoostMode(true);
		}
	
		this.prevKeyPressed = this.keyPressed;
		this.keyPressedTime = now;
	}
	else {
		this.changeBoostMode(false);
	}

	
};	

//called in the context of input class (so this won't work the way we want it to
/*
ThingController.prototype.runProcess = function(data) {

	console.log("ThingController this is");
	console.log(this);
	
	this.processUserInput(data.delta, data.now, 
						  data.input.mouseMovX, data.input.mouseMovY,
						  data.input.leftClick, data.input.rightClick,
						  data.input.scrollVall, data.input.kb);
						  
};
*/

ThingController.prototype.processUserInput = function(delta, now, mouseMovX, mouseMovY, leftClick, rightClick, scrollVal, kb) {
	
	var mouseMoved = false;
	var userActed = false;
	//this.keyPressed = ' ';
	
	//Ground
	if(this.mode == 1) {
	
		if(mouseMovX != 0) {
			//this.targetThing.rotate(this.targetThing.up, -mouseMovX*0.1, false);
			this.rotateCam(this.targetThing.up, -mouseMovX*0.1);
			mouseMoved = true;
		}
		if(mouseMovY != 0) {
			//this.targetThing.rotate(this.targetThing.right, -mouseMovY*0.1, false);
			this.rotateCam(this.targetThing.right, -mouseMovY*0.1);
			mouseMoved = true;
		}
		
	}
	//Space
	//Tweak!!!
	else if(this.mode == 0) {
		if(mouseMovX != 0) {
			this.targetThing.rotate(this.targetThing.up, -mouseMovX*0.1, false);
			this.rotateCam(this.targetThing.up, -mouseMovX*0.1);
			mouseMoved = true;
		}
		if(mouseMovY != 0) {
			this.targetThing.rotate(this.targetThing.right, -mouseMovY*0.1, false);
			this.rotateCam(this.targetThing.right, -mouseMovY*0.1);
			mouseMoved = true;
		}
	}
	
	//General
	//console.log("keyboard = "); console.log(keyboard);
	//console.log("delta = " + delta);
	if( kb.pressed('d') ) {
		this.keyPressed = 'd';
		this.targetThing.move(this.targetThing.right, this.targetThing.speed*delta);
		userActed = true;
	}
	else if( kb.pressed('a') ) {
		this.keyPressed = 'a';
		var moveVec = new THREE.Vector3();
		moveVec.copy(this.targetThing.right);
		moveVec.negate();
		this.targetThing.move(moveVec, this.targetThing.speed*delta);
		userActed = true;
	}
	
	if( kb.pressed('w') ) {
		this.keyPressed = 'w';
		this.targetThing.move(this.targetThing.forward, this.targetThing.speed*delta);
		userActed = true;
	}
	else if( kb.pressed('s') ) {
		this.keyPressed = 's';
		var moveVec = new THREE.Vector3();
		moveVec.copy(this.targetThing.forward);
		moveVec.negate();
		this.targetThing.move(moveVec, this.targetThing.speed*delta);
		userActed = true;
	}
		
	
	if( kb.pressed('space') ) {
		this.keyPressed = 'space';
		this.targetThing.move(this.targetThing.up, this.targetThing.speed*delta);
		userActed = true;
	}
	else if( kb.pressed('x') ) {
		this.keyPressed = 'x';
		var moveVec = new THREE.Vector3();
		moveVec.copy(this.targetThing.up);
		moveVec.negate();
		this.targetThing.move(moveVec, this.targetThing.speed*delta);
		userActed = true;
	}
	
	//Boosting
	//==+>==+>==+>==+>==+>==+>==+>==+>==+>==+>
	this.checkBoostMode(now, userActed);
	//==+>==+>==+>==+>==+>==+>==+>==+>==+>==+>
	
	if(userActed == true || mouseMoved == true) {
		this.updateCamera();
	}
		
};


ThingController.prototype.updateCamera = function() {
	
	//Cam position due to targetThing rotations
	var camOffset = new THREE.Vector3(0, 3, 10);
	camOffset.applyQuaternion(this.camOrientation);
	camOffset.add(this.targetThing.model.position);
	this.camera.position.copy(camOffset);
	
	/*
	//Doesn't work?
	//LookAt
	//this.camera.up.set(0,1,0);
	var lookAtTargetVec = new THREE.Vector3();
	lookAtTargetVec.copy(this.targetThing.model.position);
	//lookAtTargetVec.add(this.targetThing.forward);
	this.camera.lookAt(lookAtTargetVec);
	*/
	this.camera.quaternion.copy(this.camOrientation);
	
	//console.log(this.camera.position);
};