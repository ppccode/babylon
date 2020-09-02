


/******* Add the create scene function ******/
var camera;

var createScene = function (engine) {

	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.9);

	var dummyMain = new MainMesh(scene);
	//dummyMain.position.y += 2;

	// background sphere
	//var bgSphere = new BABYLON.Mesh.CreateSphere("bgSphere", 16, 100, scene);

	// Parameters: alpha, beta, radius, target position, scene
	// alpha = longitude = y axis
	// beta  = latitude  = z axis
	//camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2,  Math.PI/2, 10, new BABYLON.Vector3(0, 0, 0), scene);
	camera = new BABYLON.UniversalCamera(
		"sceneCamera",
		new BABYLON.Vector3(0, 0, -15),
		scene
	  );
	camera.setTarget(new BABYLON.Vector3.Zero()) ;
	camera.inputs.clear();
    camera.attachControl(canvas, true);


	// lights
	var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
	light.groundColor = new BABYLON.Color3(0.4, 0.4, 0.5);
	light.intensity = 1;
	light.parent = camera;

	camera.onViewMatrixChangedObservable.add(function(e) {
		//console.log(e.position.y);
		dummyMain.cameraChanged(e);
	});

	
	/****************************Key Controls************************************************/

	var map = {}; //object for multiple key presses
	scene.actionManager = new BABYLON.ActionManager(scene);
	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {								
			map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
			
		}));
		
	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {								
			map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
		}));	
		
	/****************************End Key Controls************************************************/
	
	scene.registerBeforeRender( function(){

		// wsad
		if(map["a"] || map["A"]){
			dummyMain.rotateAxis(new BABYLON.Vector3(0, 1, 0));
		}
		if(map["d"] || map["D"]){
			dummyMain.rotateAxis(new BABYLON.Vector3(0, -1, 0));
		}
		if(map["w"] || map["W"]){
			dummyMain.rotateAxis(new BABYLON.Vector3(1, 0, 0));
		}
		if(map["s"] || map["S"]){
			dummyMain.rotateAxis(new BABYLON.Vector3(-1, 0, 0));
		}

		dummyMain.beforeRender();
	});
	
	
	// startup animation
	var ease1 = new BABYLON.SineEase();
	ease1.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);

	//BABYLON.Animation.CreateAndStartAnimation('at5', camera, 'radius', 20, 40, 25, 20, 0, ease1).disposeOnEnd = true;
	//BABYLON.Animation.CreateAndStartAnimation('at6', camera, 'alpha', 20, 40, 3.0 * Math.PI / 2, 3.2 * Math.PI / 2, 0, ease1).disposeOnEnd = true;

	createAxis(10, null);

	createAxis(5, dummyMain);

	return scene;
}

function createAxis(size, parent) {
    var makeTextPlane = function(text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
        var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
		plane.material.diffuseTexture = dynamicTexture;
		plane.parent = parent;
    return plane;
     };
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
	  ], scene);
	axisX.parent = parent;
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
		], scene);
	axisY.parent = parent;
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
		], scene);
	axisZ.parent = parent;
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};