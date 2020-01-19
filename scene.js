


/******* Add the create scene function ******/

var createScene = function (engine) {
	var scene = new BABYLON.Scene(engine);

	var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 100, BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, true);

	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	
	// Skybox
	var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
	var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.backFaceCulling = false;
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay/TropicalSunnyDay", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
	skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
	skybox.material = skyboxMaterial;

	var dummyMain = new BABYLON.Mesh("dummy", scene);

	var ball = new Ball(dummyMain, 2, "sphere1", 2, 2, 0);

	var ball2 = new Ball(dummyMain, 2, "sphere2", -2, 2, 0);
	var ball3 = new Ball(dummyMain, 2, "sphere3", 0, 0, 0);

	//var sphereAlpha = ball.sphere.clone("sphereAlpha");
	//sphereAlpha.position.x -= 2.1;
	//sphereAlpha.visibility = 0.5;
		

	return scene;
}