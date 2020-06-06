
var camera;
var dummyMain;
var fullscreenUI;

var getGlobalPosition = function(mesh){
	mesh.computeWorldMatrix();
    var matrix = mesh.getWorldMatrix(true);
    var local_position = new BABYLON.Vector3(0,0,0);
    return BABYLON.Vector3.TransformCoordinates(local_position, matrix);
}

var createScene = function (engine) {
	// Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
	 
	camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 4, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

	//fullscreenUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

	dummyMain = new MenuMesh(scene);


	camera.onViewMatrixChangedObservable.add(function() {
		dummyMain.cameraChanged(camera);
	});

	scene.registerBeforeRender(function () {
		//box.S;
	});
	
	

	return scene;
}