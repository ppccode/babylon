
class MenuMesh extends BABYLON.Mesh{
    skyboxTexture;
    selectedDisk;
    disk;

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

        this.disk = new Disk(this, "disk", new BABYLON.Vector3(0,0,0));
        this.disk.createChildren();
    }

    cameraChanged(camera){
      //  this.disk.getChildMeshes(true, m => m.name == "disk").forEach(element => {
      //      element.lookAt(camera.position);
      //  });
    
    }

}