
class MainMesh extends BABYLON.Mesh{
    skyboxTexture;
    rotationForceVector;
    ballArray;
    ballArraySub;
    dimension;

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
        this.dimension = 1;

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
            var imageName = 'Demo/Scene_1_2 [Bollen]/Bol_' + name + '.jpg';

            this.ballArray.push(new Ball(this, 1, name, x, y, z, imageName, this.dimension, new BABYLON.Vector3.Zero()));
        }
    }

    openChildren(node)
    {
        this.dimension +=1;

        var ballCount = 5;
        var offset =  3;
        var sphereRadius = 1;
        var subNames = ['Small Work', 'Early Work', 'Late Work', 'Drawings', 'Main Body'];

        // create sub children
        for (var i=1; i <= ballCount; i++)
        {
            var phi = Math.acos(-1 + (2*i) / ballCount);
            var theta = Math.sqrt( ballCount * Math.PI ) * phi;
        
            var x = (sphereRadius + offset) * Math.cos( theta ) * Math.sin( phi );
            var y = (sphereRadius + offset) * Math.sin( theta ) * Math.sin( phi );
            var z = (sphereRadius + offset) * Math.cos( phi );

            var name = subNames[i-1];
            var imageName = 'Demo/Scene_3_4 [Bollen]/Bol_' + name + '.jpg';
            var newBall = new Ball(this, 1, name, x, y, z, imageName, this.dimension,
                //new BABYLON.Vector3.Zero() 
                 node.position.add(new BABYLON.Vector3(x, y, z))
                 );

            this.ballArray.push(newBall);
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

    moveAllToPosition()
    {

    }

    fadeAll(inOut, dimension)
    {
        for (var i = 0; i < this.ballArray.length; i++)
        {
            if (this.ballArray[i] != scene.selectedBall && dimension == this.ballArray[i].dimension)
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

    deleteAll(dimension)
    {
        for (var i = 0; i < this.ballArray.length; i++)
        {
            if (dimension == this.ballArray[i].dimension)
            {
                this.ballArray[i].setEnabled(false);
                this.ballArray[i].dispose();
                this.ballArray.splice(i, 1);
            }
        }
    }

    zoomBack()
    {
        this.dimension -= 1;
        console.log('zoomback dimension ' + this.dimension );

        Animations.BallToPosition(scene.selectedBall, scene.selectedBall.defaultPos);

        this.deselectAll();
        this.fadeAll(true, this.dimension);
        this.fadeAll(false, this.dimension +1);

        setTimeout( () => {
            this.deleteAll(this.dimension +1)    
        }, 500);

        Animations.CameraTargetToPosition(scene.activeCamera, this, 20, null);

        Animations.CameraToStartPosition(scene.activeCamera, 20, 20, function(){
            // open new scene
        });
    }
}