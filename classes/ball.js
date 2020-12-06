

class Ball extends BABYLON.Mesh{

    constructor(parent, diameter, name, x, y, z, image, dimension, startPos) {

        super("ball", scene);

        this.parent = scene.mainMesh;
        this.ballParent = parent;
        this.diameter = diameter;
        this.name = name;
        this.isSelected = false;
        this.dimension = dimension;
        this.defaultPos = new BABYLON.Vector3(x, y, z);
        this.startPos = startPos;
        this.imageName = image;

        // create face
        var materialPlane = new BABYLON.StandardMaterial("texturePlane", parent._scene);
        var texture = new BABYLON.Texture(image, parent._scene, false, false);
        materialPlane.diffuseTexture = texture;
       // materialPlane.opacityTexture = new BABYLON.Texture(textureName, parent._scene);
        materialPlane.emissiveTexture = texture;
        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
        //materialPlane.backFaceCulling = true;//Allways show the front and the back of an element
        //materialPlane.wa

        //Creation of a plane
        //this.face = BABYLON.Mesh.CreatePlane ("face" + name, 2, parent._scene);
        this.face = BABYLON.MeshBuilder.CreateDisc(name + "face", {
            radius: diameter, arc: 1, tessellation: 40, sideOrientation: 3
        }, scene);
        this.face.parent = this;
        //this.face.rotation.y = Math.PI / 2;
        this.face.material = materialPlane;
        //this.face.alpha = 0.9;
        //this.face.metadata = this;

        var labelFace = BABYLON.Mesh.CreatePlane("labelFace" + name, 2.5 * diameter, parent._scene);
        labelFace.position.y = -1.3 * diameter;
        labelFace.isPickable = false;

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
        label.width = 4;
        label.color = 'white';
        //label.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        label.fontSize = 150;

        this.label = label;
        
        advancedTexture.addControl(label);


        this.face.actionManager = new BABYLON.ActionManager(this.face._scene);
        this.face.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickDownTrigger, function (sender) {
                    sender.source.parent.userClicked();
                }
            )
        );

        this.scaling = new BABYLON.Vector3.Zero();
        this.position = startPos;
    }

    scaleIn()
    {
        this.scaleTo(1);
        Animations.BallToPosition(this, this.defaultPos, 20);
    }

    scaleTo(amount, frames = 15)
    {
        Animations.Scale(this, this.scaling, new BABYLON.Vector3(amount, amount, amount), frames );
    }

    scaleOut()
    {
        this.scaleTo(0);
        Animations.BallToPosition(this, this.startPos, 20);
    }

    lookAtCamera(){
        this.lookAt(this.position.multiply(new BABYLON.Vector3(2, 2, 2)).subtract(scene.activeCamera.position));
    }

    deSelect() {
        this.isSelected = false;
        if (this.highlight) {
            this.highlight.dispose();
        }
    }

    fadeOut(){
        Animations.FadeOut(this.face, function(sender){}, 10);
        this.label.alpha = 0;
    }

    fadeIn(){
        //this.setEnabled(true);
        Animations.FadeIn(this.face, function(sender){}, 20);
        this.label.alpha = 1;
    }

    select() {
        this.isSelected = true;
        scene.mainMesh.selectedInDimension[this.dimension] = this;
        scene.selectedBall = this;

        // not working with opacity
        this.highlight = new BABYLON.HighlightLayer("hl1", this.face._scene);
        this.highlight.addMesh(this.face, BABYLON.Color3.Yellow());

        setTimeout(() => { 
            scene.mainMesh.ballClicked(this);
            if (this.highlight) {
                this.highlight.dispose();
            }
         }, 10);
    }

    userClicked() {
        console.log('userClicked ' + this.name  + ', isSelected ' + this.isSelected + ', dimension ' + this.dimension);

        if (this.dimension < scene.mainMesh.dimension)
        {
            scene.mainMesh.backClicked();
            return;
        }

        if (this.dimension == 1)
        {
            if (this.name != "Julien Dinou")
            {
                return;
            }
        }
     
        if (this.isSelected){
          // this.isSelected = false;
        }  

        //console.log(this.isEnabled);
        scene.mainMesh.deselectAll(this.dimension);
        this.select();
    }
}