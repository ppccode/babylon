


class Disk {
    diameter;
    name;
    isEnabled;
    highlight;
    face;
    material;

    constructor(parent, diameter, name, x, y, z) {

        this.diameter = diameter;
        this.name = name;
        this.isEnabled = false;

         // create face
         var materialPlane = new BABYLON.StandardMaterial("", parent._scene);
         materialPlane.diffuseTexture = new BABYLON.Texture("textures/obama-face-png-3.png", parent._scene);
         materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
         materialPlane.invertY = false;
 
         //Creation of a plane
         //this.face = BABYLON.Mesh.CreatePlane("face" + name, 1.6, parent._scene);
         //plane.rotation.x = Math.PI / 2;

         //Creation of a plane
        this.face = BABYLON.MeshBuilder.CreateDisc("face" + name, {
            radius: 1, arc: 1, tessellation: 20, sideOrientation: BABYLON.Mesh.DEFAULTSIDE
        }, parent._scene);

         this.face.material = materialPlane;
         this.face.position.x = x;
         this.face.position.y = y;
         this.face.position.z = z;
         this.face.parent = parent;
         this.face.metadata = this;


        this.face.actionManager = new BABYLON.ActionManager(parent._scene);
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

        //this.sphere.disableEdgesRendering();
    }

    select() {
        this.face.parent.deselectAll();

        // not working with opacity
        this.highlight = new BABYLON.HighlightLayer("hl1", this.face.scene);
        this.highlight.addMesh(this.face, BABYLON.Color3.Green()); 


       /* this.face.enableEdgesRendering();
        this.face.edgesColor = new BABYLON.Color4(0, 1, 1, 1)
        this.face.edgesWidth = 13.0;
        */

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