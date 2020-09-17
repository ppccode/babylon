

class Ball extends BABYLON.Mesh{
    //iameter;
    //name;
    //sphere;
    //isSelected;
    //highlight;
    //face;
    //material;
    //label;
    //defaultPos;
    //startPos;
    //dimension;

    constructor(parent, diameter, name, x, y, z, image, dimension, startPos) {

        super("dummy", scene);

        this.parent = parent;
        this.diameter = diameter;
        this.name = name;
        this.isSelected = false;
        this.dimension = dimension;
        this.defaultPos = new BABYLON.Vector3(x, y, z);
        this.startPos = startPos;

        // create face
        var materialPlane = new BABYLON.StandardMaterial("texturePlane", parent._scene);
        var texture = new BABYLON.Texture(image, parent._scene, false, false);
        materialPlane.diffuseTexture = texture;
       // materialPlane.opacityTexture = new BABYLON.Texture(textureName, parent._scene);
        materialPlane.emissiveTexture = texture;
        //materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
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
        this.face.alpha = 0.9;
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

        this.scaleIn();
    }

    scaleIn()
    {
        Animations.Scale(this, this.scaling, new BABYLON.Vector3(1,1,1), 15 );
        Animations.BallToPosition(this, this.defaultPos, 15);
    }

    scaleOut()
    {
        Animations.Scale(this, this.scaling, new BABYLON.Vector3.Zero(), 15 );
        Animations.BallToPosition(this, this.startPos, 15);
    }

    lookAtCamera(){
        this.lookAt(this.position.multiply(new BABYLON.Vector3(2, 2, 2)).subtract(scene.activeCamera.position));
    }

    deSelect() {
        //console.log('deSelect ' + this.name  + ' enabled ' + this.isSelected);

        this.isSelected = false;

        if (this.highlight) {
            this.highlight.dispose();
        }
    }

    fadeOut(){
        Animations.FadeOut(this.face, function(node){
            //node.setEnabled(false);
        });
        this.label.alpha = 0;
    }

    fadeIn(){
        //this.setEnabled(true);
        Animations.FadeIn(this.face, function(node){

        });
        this.label.alpha = 1;
    }

    select() {
        this.isSelected = true;

        //console.log('select ' + this.name  + ' enabled ' + this.isSelected);

        scene.selectedBall = this;

        // not working with opacity
        this.highlight = new BABYLON.HighlightLayer("hl1", this.face._scene);
        this.highlight.addMesh(this.face, BABYLON.Color3.Yellow());

        //Animations.BallSelect(this.face);
        Animations.CameraTargetToPosition(scene.activeCamera, this, 10, null);
        Animations.CameraToRadius(scene.activeCamera, 7, 10, null);

       // this.parent.moveAllToPosition(true, this.dimension);
        
        this.parent.fadeAll(false, this.dimension);

        scene.mainMesh.openChildren(this);

        setTimeout(() => {
            //BABYLON.Animation.CreateAndStartAnimation('at6', camera, 'alpha', 20, 30, 3.0 * Math.PI / 2, 3.1 * Math.PI / 2, 0).disposeOnEnd = true;

            //Animations.CameraToRadius(scene.activeCamera, 12, 10, null);
        }, 500);
    }

    userClicked() {
        console.log('userClicked ' + this.name  + ' enabled ' + this.isSelected);
        
        if (this.isSelected){
            this.isSelected = false;
            this.parent.zoomBack();
            return;
        }  

        //console.log(this.isEnabled);
        this.parent.deselectAll();
        this.select();
    }
}