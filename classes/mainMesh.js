
class MainMesh extends BABYLON.Mesh{
    skyboxTexture;
    rotationForceVector;
    ballArray;

    constructor(scene){
        super("dummy", scene);

        // Skybox
        /*var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;

        this.skyboxTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture = this.skyboxTexture;

        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
*/

        this.rotationForceVector = BABYLON.Vector3.Zero();

        this.ballArray = [];

        var ballCount = 7;
        var offset =  3;
        var sphereRadius = 1;

        var names = ['August Macke', 'Franz Marc', 'Jawlensky', 'Julien Dinou', 'Otto Nebel', 'Paul Klee', 'Van Doesburg'];

        for (var i=1; i <= ballCount; i++)
        {
            var phi = Math.acos(-1 + (2*i) / ballCount);
            var theta = Math.sqrt( ballCount * Math.PI ) * phi;
        
            var x = (sphereRadius + offset) * Math.cos( theta ) * Math.sin( phi );
            var y = (sphereRadius + offset) * Math.sin( theta ) * Math.sin( phi );
            var z = (sphereRadius + offset) * Math.cos( phi );

            var name = names[i-1];
            var imageName = 'Bol_' + name + '.jpg';

            this.ballArray.push(new Ball(this, 1, name, x, y, z, imageName));
        }
    }

    rotateAxis(vector){
        //this.rotationForceVector = this.rotationForceVector.add(vector);
        //this.rotateAround(BABYLON.Vector3.Zero(), this.rotationForceVector, 0.1);
    }

    beforeRender(){

    }

    cameraChanged(){
        for (var i = 0; i < this.ballArray.length; i++)
        {
            this.ballArray[i].lookAtCamera()
        }
    }

    deselectAll()
    {
        for (var i = 0; i < this.ballArray.length; i++)
        {
            this.ballArray[i].deSelect();
        }
    }

    fadeAll(inOut)
    {
        for (var i = 0; i < this.ballArray.length; i++)
        {
            if (this.ballArray[i] != scene.selectedBall)
            {
                if (inOut){
                    this.ballArray[i].fadeIn();
                }
                else
                {
                    this.ballArray[i].fadeOut();
                }
            }
        }
    }

    zoomBack()
    {
        this.deselectAll();

        this.fadeAll(true);

        scene.backButton.alpha = 0;

        Animations.CameraTargetToPosition(scene.activeCamera, this.position, 10, null);
        Animations.CameraToStartPosition(scene.activeCamera, 20, 10, function(){
            // open new scene
        }); 
    }

}