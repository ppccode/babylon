

class Disk extends BABYLON.Mesh {
    highlight;
    face;
    isSelected;

    constructor(parent, name, position) {
        // construct Mesh
        super(name, scene, dummyMain);

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
        this.face.addRotation(0, Math.PI, Math.PI);
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
        this.highlight = new BABYLON.HighlightLayer(); // not working with opacity
        this.highlight.addMesh(this.face, BABYLON.Color3.Green()); 

        this.animate();

        this.deSelect();

    
        var newPos = getGlobalPosition(this);
        animateCameraTargetToPosition(camera, newPos, 10, null);
        var newCameraPos = newPos.add(new BABYLON.Vector3(0, 0, -4));
        animateCameraToPosition(camera, newCameraPos, 35, this.onMoveCameraToTargetFinish());
        
    }

    onMoveCameraToTargetFinish(e){
        console.log("targAnimEnded:");
        this.createChildren();
    }

    deSelect() {
        this.isSelected = false;

        if (this.highlight) {
            this.highlight.dispose();
        }
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
        this.createChild(0, 5);
    }

    createChild(count, max){
        // get vectors 
        var radians = (360 / 5) * (Math.PI / 180) * count;
        var factor = 4;
        var x = Math.cos(radians) * factor;
        var y = Math.sin(radians) * factor; 

        var ball = new Disk(this, "disk", new BABYLON.Vector3(x, y, factor*2));
        var parent = this; 
        var ease = new BABYLON.SineEase();
        var aable2 = BABYLON.Animation.CreateAndStartAnimation('show', ball, 'position', 20, 10, 
          ball.position.add(new BABYLON.Vector3(0, 0, 20)), ball.position, 0, ease, function(){
            
          });
          
        aable2.disposeOnEnd = true;
        
        if (count+1 < max)
            {
                parent.createChild(count+1, max);
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