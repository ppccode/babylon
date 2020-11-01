class Frame extends BABYLON.Mesh {

    constructor(parent, diameter, name, position, image, dimension, startPos) {

        super(name, scene);

        this.parent = scene.mainMesh;
        this.ballParent = parent;
        this.diameter = diameter;
        this.name = name;
        this.isSelected = false;
        this.image = image;
        this.dimension = dimension;
        this.defaultPos = position;
        this.startPos = startPos;
        this.position = position;

        var thumbFilePath = image.split('/');
        var fileName = thumbFilePath[thumbFilePath.length-1];
        this.thumbFileName = image.replace(fileName, 'thumb_' + fileName);
        this.thumbFactor = 0.2;
    }

    load(num){
        //Creation of a repeated textured material
        this.texture = new BABYLON.Texture(this.thumbFileName, scene, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE, ()=>{
            // texture is loaded
            var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
            materialPlane.diffuseTexture = this.texture;
            materialPlane.emissiveTexture = this.texture;
            materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
            materialPlane.backFaceCulling = false;//Allways show the front and the back of an element
            
            this.materialPlane = materialPlane;
            
            this.sizearray = this.texture.getSize();
            var divideFac = 130 * this.thumbFactor;

            //Creation of a plane
            this.face = BABYLON.Mesh.CreateGround("plane", this.sizearray.width/divideFac, this.sizearray.height/divideFac, 1, scene);
            this.face.rotation.x = Math.PI / 2;
            this.face.material = materialPlane;
            this.face.parent = this;

            this.face.actionManager = new BABYLON.ActionManager(scene);
            this.face.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    BABYLON.ActionManager.OnPickTrigger, function (sender) {
                        sender.source.parent.userClicked();
                    }
                )
            );

            //scene.render();
            //this.fadeIn();

            // load next
            num += 1;
            if (num < scene.mainMesh.artArray.length)
            {
                scene.mainMesh.artArray[num].load(num);      
            }        
            
        } );
    }

    fadeAll(fadeIn){
        for (var i = 0; i < scene.mainMesh.artArray.length; i++)
        {          
            if (fadeIn){
                if (!scene.mainMesh.artArray[i].isSelected){
                    scene.mainMesh.artArray[i].fadeIn();
                }
                scene.mainMesh.artArray[i].isSelected = false;
            }
            else
            {
                if (scene.mainMesh.artArray[i].isSelected)
                {
                    continue;
                }
                scene.mainMesh.artArray[i].fadeOut();
            } 
        }
    }

    fadeOut(){
        Animations.FadeOut(this.face, function(sender){}, 10, 1, 0.1);
        this.face.isPickable = false;
    }

    fadeIn(){
        Animations.FadeIn(this.face, function(sender){}, 20, 0.1, 1);
        this.face.isPickable = true;
    }

    userClicked() {
        if (this.isSelected)
        {
            Rendering2D.setBackButtonEnabled(true);
            scene.mainMesh.backClicked();
            return;
        }

        Rendering2D.setBackButtonEnabled(false);
        
        this.isSelected = true;

        this.highlight = new BABYLON.HighlightLayer("hl1", scene);
        this.highlight.addMesh(this.face, BABYLON.Color3.Yellow());

        setTimeout(() => { 
            if (this.highlight) {
                this.highlight.dispose();
            }
         }, 700);

        // load full resolution
        this.bigTexture = new BABYLON.Texture(this.image, scene, false, false, BABYLON.Texture.NEAREST_SAMPLINGMODE, ()=>{
            this.materialPlane.diffuseTexture = this.bigTexture;
            this.materialPlane.emissiveTexture = this.bigTexture;
        });

        this.fadeAll();

        // calculate zoompos on frame width
        var radius = this.sizearray.width / 13;

        Animations.CameraTargetToPosition(scene.activeCamera, this.defaultPos, 15, null);
        Animations.CameraToRadius(scene.activeCamera, radius, 15, null);

        scene.mainMesh.dimension = 4;
    }

    lookAtCamera(){
        this.lookAt(this.position.multiply(new BABYLON.Vector3(2, 2, 2)).subtract(scene.activeCamera.position));
    }
}