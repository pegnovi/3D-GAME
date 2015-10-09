function Skybox(skyname) {
	var urlPrefix = dir_path + "assets/skyboxes/" + skyname + "/";
	var urls = [ urlPrefix + "posX.png", urlPrefix + "negX.png",
    urlPrefix + "posY.png", urlPrefix + "negY.png",
    urlPrefix + "posZ.png", urlPrefix + "negZ.png" ];
	this.cubeMap = THREE.ImageUtils.loadTextureCube(urls);
	this.cubeMap.format = THREE.RGBFormat;
	
	
	//Init Shader
	this.shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
	//var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
	this.shader.uniforms['tCube'].value = this.cubeMap; // apply textures to shader
	
	var daShader = this.shader;
	this.material = new THREE.ShaderMaterial({
		fragmentShader: daShader.fragmentShader,
		vertexShader: daShader.vertexShader,
		uniforms: daShader.uniforms,
		depthWrite: false,
		side: THREE.BackSide,
	});
	
	
	//Create Cube Itself
	this.skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 800, 800, 800, 1, 1, 1, null, true ), this.material );

};