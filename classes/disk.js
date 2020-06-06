

class Disk extends BABYLON.Mesh {
    highlight;
    face;
    plane;
    isSelected;
    isExpanded;
    label;

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

        // this plane will hold labels and controls
        this.plane = BABYLON.Mesh.CreatePlane("plane", 2);
        this.plane.parent = this;
        this.plane.position = new BABYLON.Vector3(0, 0.5, -0.25);
        this.plane.isPickable = false;

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(this.plane);

        var rect1 = new BABYLON.GUI.Rectangle();
        rect1.height = 0.15;
        rect1.width = 1;
        rect1.cornerRadius = 20;
        rect1.thickness = 0;
        rect1.background = "#00ff0088";

        advancedTexture.addControl(rect1);
        

        var label = new BABYLON.GUI.TextBlock();
        label.fontFamily = 'arial';
        label.text = "Dit is een tekst !S";
        label.height = 0.25;
        label.width = 1;
        label.color = 'white';
        //label.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        label.fontSize = 100;

        advancedTexture.addControl(label);
    }

    userClicked() 
    {
        this.select();
    }



    select() {
        this.bounceEffect();

        if (this.isExpanded)
        {
            // return to parent
            this.deleteChildren();
            var newPos = getGlobalPosition(this.parent);
            Animations.CameraTargetToPosition(camera, newPos, 20, null);
            var newCameraPos = newPos.add(new BABYLON.Vector3(0, 0, -4));
            Animations.CameraToPosition(camera, newCameraPos, 40, function(){
                
            });
            return;
        }
        
        if (this.isSelected)
        {
            this.deSelect();
            var newPos = getGlobalPosition(this);
            Animations.CameraTargetToPosition(camera, newPos, 10, null);
            var newCameraPos = newPos.add(new BABYLON.Vector3(0, 0, -4));
            Animations.CameraToPosition(camera, newCameraPos, 35, this.createChildren());   
        }
        else
        {
            this.deselectSiblings(); 
            this.isSelected = true;              
            this.highlight = new BABYLON.HighlightLayer(); // not working with opacity
            this.highlight.addMesh(this.face, BABYLON.Color3.Green()); 
        }
    }



    deSelect() {
        this.isSelected = false;

        if (this.highlight) {
            this.highlight.dispose();
        }
    }

    deselectSiblings()
    {
        this.parent.getChildMeshes(true, m => m.name == "disk").forEach(element => {
            if (element.deSelect)	
            {
                element.deSelect(); 
            }
        });
    }

    deleteChildren()
    {
        this.isExpanded = false;
        this.getChildMeshes(true, m => m.name == "disk").forEach(element => {
            // delete all child components
            element.getChildren().forEach(c => {
                c.dispose();
            });
            element.dispose();
        });
    }

    createChildren()
    {
        this.isExpanded = true;

        // TODO: get data !
        var count = Math.floor(Math.random() * 8) + 2; // max 10

        this.createChild(0, count);
    }

    createChild(count, max){
        // get vectors 
        var radians = (360 / max) * (Math.PI / 180) * count;
        var factor = 4;
        var x = Math.cos(radians) * factor;
        var y = Math.sin(radians) * factor; 

        var ball = new Disk(this, "disk", new BABYLON.Vector3(x, y, factor*2));
        var parent = this; 
        var ease = new BABYLON.SineEase();
        var aable2 = BABYLON.Animation.CreateAndStartAnimation('show' + count, ball, 'position', 20, 10, 
          ball.position.add(new BABYLON.Vector3(0, 0, 20)), ball.position, 0, ease, function(){
            
          });
          
        aable2.disposeOnEnd = true;
        
        if (count+1 < max)
        {
            setTimeout(() => {
                parent.createChild(count+1, max);
            }, 100, parent, count, max);
        }
    }

    bounceEffect()
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