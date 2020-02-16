


class Ball {
    diameter;
    name;
    sphere;
    isEnabled;
    highlight;
    face;
    material;

    constructor(parent, diameter, name, x, y, z) {

        //this.scene = scene;
        this.diameter = diameter;
        this.name = name;
        this.isEnabled = false;


        // create face
        var materialPlane = new BABYLON.StandardMaterial("texturePlane", parent._scene);
        materialPlane.diffuseTexture = new BABYLON.Texture("textures/obama-face-png-3", parent._scene);
        materialPlane.opacityTexture = new BABYLON.Texture("textures/obama-face-png-3", parent._scene);
        materialPlane.emissiveTexture = new BABYLON.Texture("textures/obama-face-png-3", scene);
        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
        materialPlane.backFaceCulling = false;//Allways show the front and the back of an element

        //Creation of a plane
        this.face = BABYLON.Mesh.CreatePlane("face" + name, 1.6, parent._scene);
        //plane.rotation.x = Math.PI / 2;
        this.face.material = materialPlane;
        this.face.position.x = x;
        this.face.position.y = y;
        this.face.position.z = z;
        this.face.parent = parent;
        this.face.metadata = this;


        this.sphere = BABYLON.Mesh.CreateSphere("ball" + name, 16, diameter, parent._scene);
        this.sphere.parent = this.face; //parent;
        this.sphere.metadata = this;

        // TODO : use same material??
        this.material = new BABYLON.StandardMaterial("mat", parent._scene);
        // shapeMaterial.backFaceCulling = true;
        this.material.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay/TropicalSunnyDay", parent._scene);
        // shapeMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
        this.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        this.material.specularColor = new BABYLON.Color3(0, 0, 0);
        //this.material.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        this.material.alpha = 0.2;
        this.material.specularPower = 16;

        this.sphere.material = this.material;

        // Fresnel
        this.material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
        this.material.reflectionFresnelParameters.bias = 0.1;

        /* this.material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
         this.material.emissiveFresnelParameters.bias = 0.6;
         this.material.emissiveFresnelParameters.power = 4;
         this.material.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
         this.material.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();
         */
        this.material.opacityFresnelParameters = new BABYLON.FresnelParameters();
        this.material.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
        this.material.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();


        this.sphere.actionManager = new BABYLON.ActionManager(this.sphere._scene);
        this.sphere.actionManager.registerAction(
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

        this.sphere.disableEdgesRendering();
    }

    select() {
        this.face.parent.deselectAll();

        // not working with opacity
        //this.highlight = new BABYLON.HighlightLayer("hl1", this.sphere._scene);
        //this.highlight.addMesh(this.sphere, BABYLON.Color3.Green()); 


        this.sphere.enableEdgesRendering();
        this.sphere.edgesColor = new BABYLON.Color4(0, 1, 1, 1)
        this.sphere.edgesWidth = 13.0;

        
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