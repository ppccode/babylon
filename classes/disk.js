

class Disk extends BABYLON.Mesh {
    highlight;
    face;
    isSelected;

    constructor(parent, name, position) {
        // construct Mesh
        super(name, scene, parent);

        this.setPositionWithLocalVector(position);
        this.parent = parent;

         // create face
         var material = new BABYLON.StandardMaterial();
         material.diffuseTexture = new BABYLON.Texture("textures/obama-face-png-3.png");
         material.backFaceCulling = false;//Allways show the front and the back of an element

         //Creation of a disk
        this.face = BABYLON.MeshBuilder.CreateDisc(name + "face", {
            radius: 1, arc: 1, tessellation: 40
        }, scene);

        this.face.material = material;
        this.face.addRotation(0,Math.PI,Math.PI);
        this.face.parent = this;
        this.face.metadata = this;

        this.face.actionManager = new BABYLON.ActionManager(parent._scene);
        this.face.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger, function (sender) {
                    sender.source.metadata.userClicked();
                }
            )
        );
    }

    userClicked() 
    {
        if (this.isSelected) {
            return;
        }
        this.select();
    }

    select() {
        this.deselectSiblings();
        this.isSelected = true;
        // not working with opacity
        this.highlight = new BABYLON.HighlightLayer();
        this.highlight.addMesh(this.face, BABYLON.Color3.Green()); 

        /*this.face.enableEdgesRendering();
        this.face.edgesColor = new BABYLON.Color4(0, 1, 1, 1)
        this.face.edgesWidth = 13.0;
        */

       this.animate();

       this.createChildren();

       this.deSelect();

       var animation = new BABYLON.Animation("cameraSwoop",	"position", 30,
				BABYLON.Animation.ANIMATIONTYPE_VECTOR3)
        var keyFrames = []
        keyFrames.push({
                            frame: 0,
                            value: camera.position.clone()
                        })
        for(var i=1; i<=path.length; i++){
                        var ap = path[i-1]
                        keyFrames.push({
                            frame: step*i,
                            value: ap
                        })
                    }
        animation.setKeys(keyFrames)
        camera.animations = [animation]
        animation = scene.beginAnimation(camera, 0, step*path.length, false, 1)
    }

    deSelect() {
        this.isSelected = false;

        if (this.highlight) {
            this.highlight.dispose();
        }
        //this.face.disableEdgesRendering();
    }

    deselectSiblings()
    {
        var siblings = this.parent.getChildMeshes(true, m => m.name == "disk");
        for (var i = 0; i < siblings.length; i++){
            if (siblings[i].deSelect)	
            {
                siblings[i].deSelect(); 
            }		 
        }
    }

    createChildren()
    {
        for (var i=0;i<5;i++)
        {
            // get vectors 
            var radians = (360 / 5) * (Math.PI / 180) * i;
            var factor = 3;
            var x = Math.cos(radians) * factor;
            var y = Math.sin(radians) * factor; 

            var ball = new Disk(this, "disk", new BABYLON.Vector3(x, y, factor));
        }
    }


    animate()
    {
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

    
}