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


        	var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
			sphere.position.x += 1.1;
			sphere.position.y = 1;

			var sphereAlpha = sphere.clone("sphereAlpha");
			sphereAlpha.position.x -= 2.1;
			sphereAlpha.visibility = 0.5;
				
			// Add the highlight layer.
			var hl = new BABYLON.HighlightLayer("hl1", scene);
			hl.addMesh(sphere, BABYLON.Color3.Green());
			hl.addMesh(sphereAlpha, BABYLON.Color3.Red()); // HighlightLayer can't deal with alpha



			sphere.actionManager = new BABYLON.ActionManager(scene);

			sphere.actionManager.registerAction(
				new BABYLON.ExecuteCodeAction(
					BABYLON.ActionManager.OnPickTrigger,
					function (){
						alert(this);
					}
				)
			);

        
        	return scene;
        }