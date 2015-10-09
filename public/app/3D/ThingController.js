function ThingController(targetThing, camera) {
	this.targetThing = targetThing;
	this.camera = camera;
	
	this.mode = 1; //0 = space, 1 = ground
	
	this.wKeyPressTime = -1;
	
	this.prevKeyPressed = ' ';
	this.keyPressed = ' ';
	this.keyPressedTime = -1;
	
	console.log("=== TEST ===");
	console.log(this.prevKeyPressed != ' ');
};

ThingController.prototype.setMode = function(mode) {
	if(mode >= 0 || mode <= 1) {
		this.mode = mode;	
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
		this.targetThing.changeBoostMode(false);
	}

	
};	

ThingController.prototype.processUserInput = function(delta, now, mouseMovX, mouseMovY, leftClick, rightClick, scrollVal, kb) {
	
	var mouseMoved = false;
	var userActed = false;
	//this.keyPressed = ' ';
	
	//Ground
	if(this.mode == 1) {
	
		if(mouseMovX != 0) {
			//this.targetThing.rotate(this.targetThing.up, -mouseMovX*0.1, false);
			this.targetThing.rotateCam(this.targetThing.up, -mouseMovX*0.1);
			mouseMoved = true;
		}
		if(mouseMovY != 0) {
			//this.targetThing.rotate(this.targetThing.right, -mouseMovY*0.1, false);
			this.targetThing.rotateCam(this.targetThing.right, -mouseMovY*0.1);
			mouseMoved = true;
		}
		
	}
	//Space
	//Tweak!!!
	else if(this.mode == 0) {
		if(mouseMovX != 0) {
			this.targetThing.rotate(this.targetThing.up, -mouseMovX*0.1, false);
			this.targetThing.rotateCam(this.targetThing.up, -mouseMovX*0.1);
			mouseMoved = true;
		}
		if(mouseMovY != 0) {
			this.targetThing.rotate(this.targetThing.right, -mouseMovY*0.1, false);
			this.targetThing.rotateCam(this.targetThing.right, -mouseMovY*0.1);
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
	camOffset.applyQuaternion(this.targetThing.camOrientation);
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
	this.camera.quaternion.copy(this.targetThing.camOrientation);
	
	//console.log(this.camera.position);
};