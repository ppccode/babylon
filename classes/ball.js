


class Ball {
    diameter;
    name;
    sphere;
    isEnabled;
    highlight;
    face;
    material;

    constructor(parent, diameter, name, x, y, z, image) {

        //this.parent = parent;
        this.diameter = diameter;
        this.name = name;
        this.isEnabled = false;

        var textureName = "Demo/Scene_1_2 [Bollen]/" + image;

        // create face
        var materialPlane = new BABYLON.StandardMaterial("texturePlane", parent._scene);
        var texture = new BABYLON.Texture(textureName, parent._scene, false, false);
        materialPlane.diffuseTexture = texture;
       // materialPlane.opacityTexture = new BABYLON.Texture(textureName, parent._scene);
        materialPlane.emissiveTexture = texture;
        //materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
        //materialPlane.backFaceCulling = true;//Allways show the front and the back of an element
        //materialPlane.wa

        //Creation of a plane
        //this.face = BABYLON.Mesh.CreatePlane ("face" + name, 2, parent._scene);
        this.face = BABYLON.MeshBuilder.CreateDisc(name + "face", {
            radius: 1, arc: 1, tessellation: 40, sideOrientation: 3
        }, scene);
        this.face.parent = parent;
        //this.face.rotation.y = Math.PI / 2;
        this.face.material = materialPlane;
        this.face.position.x = x;
        this.face.position.y = y;
        this.face.position.z = z;
        
        this.face.metadata = this;

        var labelFace = BABYLON.Mesh.CreatePlane ("labelFace" + name, 2, parent._scene);
        labelFace.position.y = -1.2;
        labelFace.parent = this.face;
        

       /* this.sphere = BABYLON.Mesh.CreateSphere("ball" + name, 16, diameter, parent._scene);
        this.sphere.parent = this.face; //parent;
        this.sphere.metadata = this;

        this.material = new BABYLON.StandardMaterial("mat", parent._scene);
        // shapeMaterial.backFaceCulling = true;
        this.material.reflectionTexture = parent.skyboxTexture; 
        // shapeMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
        this.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        this.material.specularColor = new BABYLON.Color3(0, 0, 0);
        //this.material.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        this.material.alpha = 0.1;
        this.material.specularPower = 16;

        this.sphere.material = this.material;
        this.sphere.rotation.z = 3.14;//Math.PI / 180;

        // Fresnel
        this.material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
        this.material.reflectionFresnelParameters.bias = 0.1;

         this.material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
         this.material.emissiveFresnelParameters.bias = 0.6;
         this.material.emissiveFresnelParameters.power = 4;
         this.material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
         this.material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();
         
        this.material.opacityFresnelParameters = new BABYLON.FresnelParameters();
        this.material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
        this.material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

*/

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(labelFace);

        var rect1 = new BABYLON.GUI.Rectangle();
        rect1.height = 0.15;
        rect1.width = 1;
        rect1.cornerRadius = 0;
        rect1.thickness = 0;
        //rect1.background = "#ffffffff";

        advancedTexture.addControl(rect1);
        
        var label = new BABYLON.GUI.TextBlock();
        label.fontFamily = 'arial';
        label.text = this.name;
        label.height = 0.3;
        label.width = 2;
        label.color = 'black';
        //label.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        label.fontSize = 120;

        
        advancedTexture.addControl(label);


        this.face.actionManager = new BABYLON.ActionManager(this.face._scene);
        this.face.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger, function (sender) {
                    //console.log(sender.source.name);

                    sender.source.metadata.userClicked();
                }
            )
        );
        
    }


    deSelect() {
        this.isEnabled = false;

        if (this.highlight) {
            this.highlight.dispose();
        }

       // this.face.disableEdgesRendering();
    }

    select() {
        this.face.parent.deselectAll();

        // not working with opacity
        this.highlight = new BABYLON.HighlightLayer("hl1", this.face._scene);
        this.highlight.addMesh(this.face, BABYLON.Color3.Green());

        
        var animationBox = new BABYLON.Animation("myAnimation", "scaling", 10,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        var keys = [];

        keys.push({
            frame: 0,
            value: new BABYLON.Vector3(1, 1, 1)
        });

        keys.push({
            frame: 5,
            value: new BABYLON.Vector3(0.9, 0.9, 0.9)
        });

        keys.push({
            frame: 10,
            value: new BABYLON.Vector3(1, 1, 1)
        });

        animationBox.setKeys(keys);


        var easingFunction = new BABYLON.QuadraticEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        // Adding the easing function to the animation
        animationBox.setEasingFunction(easingFunction);

        this.face.animations = [];
        this.face.animations.push(animationBox);

        scene.beginAnimation(this.face, 0, 20, false, 4);


        Animations.CameraTargetToPosition(camera, this.face.position, 10, null);
        var newCameraPos = this.face.position.add(new BABYLON.Vector3(0, 4, 0));
        Animations.CameraToPosition(camera, newCameraPos, 35, function(){
            // open new scene
            
        }); 

    }

    userClicked() {
        if (this.isEnabled) {
            return;
        }

        this.isEnabled = true;
        //console.log(this.isEnabled);

        this.select();
    }
}