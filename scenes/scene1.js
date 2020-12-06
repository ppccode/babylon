


/******* Add the create scene function ******/
var scene;

var createScene = function (engine) {

	scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(9/255, 2/255, 35/255);// new BABYLON.Color3(0.9, 0.9, 0.9);
	scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
	scene.cameraAlpha = -Math.PI/2;
	scene.cameraBeta = Math.PI/2;
	scene.cameraRadius = 20;

	scene.mainMesh = new MainMesh(scene);
	//mainMesh.position.y += 2;

	// background sphere
	//var bgSphere = new BABYLON.Mesh.CreateSphere("bgSphere", 16, 100, scene);

	// Parameters: alpha, beta, radius, target position, scene
	// alpha = longitude = y axis
	// beta  = latitude  = z axis
	var camera = new BABYLON.ArcRotateCamera("Camera", scene.cameraAlpha,  scene.cameraBeta, scene.cameraRadius, new BABYLON.Vector3(0, 0, 0), scene);
	//camera = new BABYLON.UniversalCamera("sceneCamera",new BABYLON.Vector3(0, 0, -15),scene);
	camera.setTarget(new BABYLON.Vector3.Zero()) ;
	//camera.lowerAlphaLimit = 1;  // y as
	camera.lowerBetaLimit = 0.7;
	camera.upperBetaLimit = 2.7;


	//camera.inputs.clear();
	camera.attachControl(canvas, true);
	scene.cameraPosition = camera.position;
	

	// lights
	var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
	//light.groundColor = new BABYLON.Color3(0.4, 0.4, 0.5);
	light.intensity = 1;
	//light.parent = camera;

	camera.onViewMatrixChangedObservable.add(function(e) {
		//console.log(e.position.y);
		scene.mainMesh.cameraChanged(e);
	});

	Rendering2D.createGUI();

	/****************************Key Controls************************************************/

	/*var map = {}; //object for multiple key presses
	scene.actionManager = new BABYLON.ActionManager(scene);
	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {								
			map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
			
		}));
		
	scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {								
			map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
		}));	
		*/
	/****************************End Key Controls************************************************/
	
	scene.registerBeforeRender( function(){

		// wsad
		/*if(map["a"] || map["A"]){
			dummyMain.rotateAxis(new BABYLON.Vector3(0, 1, 0));
		}
		dummyMain.beforeRender();
		*/

		if (camera.alpha > 2 * Math.PI)
		{
			camera.alpha = camera.alpha - 2 * Math.PI;
		}

		if (camera.alpha < 0)
		{
			camera.alpha = camera.alpha + 2 * Math.PI;
		}

		scene.mainMesh.beforeRender();

		//console.log('beta ' + camera.beta + ', alpha ' + camera.alpha);
	});
	
	

	//createAxis(10, null);

	//createAxis(5, mainMesh);

	return scene;
}
