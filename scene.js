        /******* Add the create scene function ******/
		
		function onError(event){
			alert(event)
		}
		
		var createScene = function (engine) {
        	var scene = new BABYLON.Scene(engine);
        
        	var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 100, BABYLON.Vector3.Zero(), scene);
			camera.attachControl(canvas, true);
		
			var baseDir = 'file:///Users/info/Documents/React/babylon/';
        
        	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
			
			var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
	light.diffuse = new BABYLON.Color3(1, 0, 0);
	
			// Skybox
			var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
			var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
			skyboxMaterial.backFaceCulling = false;
			skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay/TropicalSunnyDay", scene);
			skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
			skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
			skybox.material = skyboxMaterial;
			
			//skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/textures/TropicalSunnyDay/TropicalSunnyDay", scene);

        	// Ground
        	var groundMaterial = new BABYLON.Material("groundMaterial", scene);
			groundMaterial.diffuseTexture = new BABYLON.Texture("/textures/rustediron2_basecolor.png", scene );
        	groundMaterial.diffuseTexture.uScale = groundMaterial.diffuseTexture.vScale = 4;
        	
        	var ground = BABYLON.Mesh.CreateGround("ground", 512, 512, 32, scene, false);
        	ground.position.y = -1;
        	ground.material = groundMaterial;
        		

        
        	return scene;
        }