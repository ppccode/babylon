
class MainMesh extends BABYLON.Mesh{
    skyboxTexture;

    constructor(scene){
        super("dummy", scene);

        // Skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;

        this.skyboxTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture = this.skyboxTexture;

        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;


        var ballArray = [];

        var boxWidth = 100;
        var ballCount = 250;

        for (var i=0; i < ballCount; i++)
        {
            var x = (Math.random() * boxWidth) -(boxWidth * 0.5); 
            var y = (Math.random() * boxWidth) -(boxWidth * 0.5); 
            var z = (Math.random() * boxWidth) -(boxWidth * 0.5); 

            var ball = new Ball(this, 2, "ball" + i, x, y, z);
            ballArray.push(ball);
        }

    }

    cameraChanged(camera){
        //text1.text = camera.rotation.x + "," + camera.rotation.y + "," + camera.rotation.z;
        for (var i = 0; i < this._children.length; i++)
        {
            this._children[i].lookAt(camera.position);
            //box.lookAt(sphere.position);
        }
    }

    deselectAll()
    {
        for (var i = 0; i < this._children.length; i++)
        {
            this._children[i].metadata.deSelect();
        }
    }

}