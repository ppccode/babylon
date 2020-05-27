
var baseUrl = "babylon/";

var createScene = function (engine) {
	var scene = new BABYLON.Scene(engine);

	//var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);

	var camera = new BABYLON.FreeCamera("sceneCamera", new BABYLON.Vector3(0, 1, -15), scene);
	camera.attachControl(canvas, true);
	camera.keysUp.push(87);    //W
    camera.keysDown.push(83)   //D
    camera.keysLeft.push(65);  //A
    camera.keysRight.push(68); //S

	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

	var dummyMain = new MenuMesh(scene);


	camera.onViewMatrixChangedObservable.add(function() {
		dummyMain.cameraChanged(camera);
	});

	scene.registerBeforeRender(function () {
		//box.lookAt(sphere.position);
	});
	

	return scene;
}