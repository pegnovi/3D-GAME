function Thing(loader, modelName, scene) {
	

	this.forward = new THREE.Vector3(0,0,-1);
	this.right = new THREE.Vector3(1,0,0);
	this.up = new THREE.Vector3(0,1,0);
	
	
	
	//LOAD MODEL
	var url = dir_path + "assets/models/" + modelName;
	console.log("url = " + url);
	var that = this;
	
	//For JSONLoader
	loader.load(url, function(geometry, materials) {
		for(var i=0; i<materials.length; i++) {
			materials[i].skinning = true;
		}
	
		//This function will be notified when the model is loaded
		that.model = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
		//that.model.scale.set(2, 2, 2);
		that.animations = {};
		
		console.log(that.model);
		
		
		//Create the animations
		for(var i=0; i<geometry.animations.length; ++i) {
			var animName = geometry.animations[i].name;
			console.log(animName);
			console.log(geometry.animations[i]);
			geometry.animations[i].loop = true;
			that.animations[ animName ] = new THREE.Animation( that.model, geometry.animations[i] );
		}
		
		that.currAnimName = 'Zombie';
		that.currAnim = that.animations[that.currAnimName];
		that.currAnim.play(0);
		
		scene.add(that.model);
		
		that.helper = new THREE.SkeletonHelper( that.model );
		that.helper.material.linewidth = 3;
		that.helper.visible = true;
		scene.add(that.helper);
	});
	
	//For UniversalLoader
	/*
	loader.load(url, function(object3D) {
		//This function will be notified when the model is loaded
		that.model = object3D;
		that.model.scale.set(2, 2, 2);
		scene.add(that.model);
		console.log(that.model);
	});
	*/
	
};

Thing.prototype.update = function(delta) {
	
};



Thing.prototype.updateAxes = function(rotQuat, updateUpAxis) {
	this.forward.applyQuaternion(rotQuat);
	this.forward.normalize();
	
	this.right.applyQuaternion(rotQuat);
	this.right.normalize();

	if(updateUpAxis == true) {
		this.up.applyQuaternion(rotQuat);
	}
};

Thing.prototype.rotate = function(axis, angleDegrees, updateUpAxis) {
	var rotQuat = new THREE.Quaternion();
	rotQuat.setFromAxisAngle(axis, angleDegrees * 0.01745);
	
	//Incorrect Order!!!
	//this.model.quaternion.multiply(rotQuat);
	//or
	//this.model.quaternion.multiplyQuaternions(this.model.quaternion, rotQuat);
	
	//Correct Order!!!
	this.model.quaternion.multiplyQuaternions(rotQuat, this.model.quaternion);

	
	this.updateAxes(rotQuat, updateUpAxis);

};


Thing.prototype.move = function(axis, amt) {

	var moveVec = new THREE.Vector3();
	moveVec.copy(axis);
	moveVec.multiplyScalar(amt);
	
	this.model.position.add(moveVec);
};




