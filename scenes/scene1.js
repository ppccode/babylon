


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
	light.parent = camera;

	camera.onViewMatrixChangedObservable.add(function(e) {
		//console.log(e.position.y);
		scene.mainMesh.cameraChanged(e);
	});


	// GUI
	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
	
	var panel = new BABYLON.GUI.StackPanel(); 
	panel.paddingTop = "20px";   
	panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
	panel.height = "60px";

	var button = BABYLON.GUI.Button.CreateSimpleButton("backButton", "Back");
    button.width = "100px";
	button.height = "40px";
	button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	button.color = "white";
	button.cornerRadius = 20;
	button.background = "green";
    button.onPointerDownObservable.add(function() {

	});

	//panel.addControl(button);  

	var bottomPanel = new BABYLON.GUI.StackPanel();	
	bottomPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
	bottomPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
	bottomPanel.paddingBottom = "10px";
	bottomPanel.height = "60px";
	bottomPanel.width = "100px";
	var logo = new BABYLON.GUI.Image("Galatea", "logo.png");
	bottomPanel.addControl(logo);

	
	advancedTexture.addControl(panel); 
	advancedTexture.addControl(bottomPanel); 


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
		/*if(map["a"] || map["A"]){
			dummyMain.rotateAxis(new BABYLON.Vector3(0, 1, 0));
		}
		dummyMain.beforeRender();
		*/

		//console.log(camera.beta)
	});
	
	var ease2 = new BABYLON.SineEase();
        ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
	// startup animation
	BABYLON.Animation.CreateAndStartAnimation('at6', camera, 'alpha', 20, 30, 3.0 * Math.PI / 2, 3.1 * Math.PI / 2, 0, ease2).disposeOnEnd = true;

	//createAxis(10, null);

	//createAxis(5, mainMesh);

	return scene;
}
