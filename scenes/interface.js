
var baseUrl = "babylon/";

var createScene = function (engine) {
	// Create the scene space
    var scene = new BABYLON.Scene(engine);

    // Add a camera to the scene and attach it to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2, 4, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

	var dummyMain = new MenuMesh(scene);


	camera.onViewMatrixChangedObservable.add(function() {
		//dummyMain.cameraChanged(camera);
	});

	scene.registerBeforeRender(function () {
		//box.lookAt(sphere.position);
	});
	

	return scene;
}