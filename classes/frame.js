class Frame extends BABYLON.Mesh {

    constructor(parent, diameter, name, position, image, dimension, startPos) {

        super(name, scene);

        this.parent = scene.mainMesh;
        this.ballParent = parent;
        this.diameter = diameter;
        this.name = name;
        this.isSelected = false;
        this.dimension = dimension;
        this.defaultPos = position;
        this.startPos = startPos;
        

        //Creation of a repeated textured material
        var materialPlane = new BABYLON.StandardMaterial("texturePlane", scene);
        materialPlane.diffuseTexture = new BABYLON.Texture(image, scene);
        materialPlane.emissiveTexture = materialPlane.diffuseTexture;
        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
        materialPlane.backFaceCulling = false;//Allways show the front and the back of an element

        //Creation of a plane
        this.face = BABYLON.Mesh.CreatePlane("plane", diameter, scene);
        //this.face.rotation.x = Math.PI / 2;
        this.face.material = materialPlane;
        this.face.parent = this;

        this.position = position;

        this.face.actionManager = new BABYLON.ActionManager(scene);
        this.face.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickDownTrigger, function (sender) {
                    sender.source.parent.userClicked();
                }
            )
        );

    }

    userClicked() {
       Animations.CameraTargetToPosition(scene.activeCamera, this.defaultPos, 15, null);
       Animations.CameraToRadius(scene.activeCamera, 7, 15, null);

       scene.mainMesh.dimension = 4;
    }

    lookAtCamera(){
        this.lookAt(this.position.multiply(new BABYLON.Vector3(2, 2, 2)).subtract(scene.activeCamera.position));
    }
}