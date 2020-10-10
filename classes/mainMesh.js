
class MainMesh extends BABYLON.Mesh{

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
        this.artArray = [];
        this.dimension = 1;
        this.explodeVector = new BABYLON.Vector3(1.6, 1.6, 1.6);

        var ballCount = 7;
        var offset =  2.8;
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
            var newBall = new Ball(this, sphereRadius, name, x, y, z, imageName, this.dimension, new BABYLON.Vector3.Zero());
            this.ballArray.push(newBall);

            newBall.scaleIn();
        }
    }

    createChildren(node){
        this.dimension +=1;

        var ballCount = 5;
        var offset =  1;
        var sphereRadius = 0.3;
        var subNames = ['Small Work', 'Early Work', 'Late Work', 'Drawings', 'Main Body'];

        // create sub children
        for (var i=0; i < ballCount; i++)
        {
            var grad = ((360 / ballCount) * i)  +20; // small offset
            var rad = grad * (Math.PI / 180);
            var x = Math.cos(rad) * offset;
            var y = Math.sin(rad) * offset;
            var z = 0;

            var name = subNames[i];
            var imageName = 'Demo/Scene_3_4 [Bollen]/Bol_' + name + '.jpg';
            var childPos = node.position.add(new BABYLON.Vector3(x, y, z));
            var newBall = new Ball(node, sphereRadius, name, childPos.x, childPos.y, childPos.z, imageName, 
                this.dimension, node.position );
            this.ballArray.push(newBall);

            Animations.Scale(newBall,  BABYLON.Vector3.Zero(), new BABYLON.Vector3(1,1,1));
            Animations.BallToPosition(newBall, childPos);
        }
    }

    openArtwork(node)
    {
        this.setEnabledAll(this.dimension, false);
        this.setEnabledAll(this.dimension-1, false);

        this.dimension +=1;
        var ballCount = demoData.length;
        var offset =  14;
        var sphereRadius = 4;

        for (var i=0; i < ballCount; i++)
        {
             //console.log(demoData[i]);   
             var phi = Math.acos(-1 + (2*i) / ballCount);
             var theta = Math.sqrt( ballCount * Math.PI ) * phi;
         
             var x = (sphereRadius + offset) * Math.cos( theta ) * Math.sin( phi );
             var y = (sphereRadius + offset) * Math.sin( theta ) * Math.sin( phi );
             var z = (sphereRadius + offset) * Math.cos( phi );
 
             var imageName = 'Demo/Scene_5_6 [Plaatjes]/' + demoData[i];
             var childPos = node.position.add(new BABYLON.Vector3(x, y, z));

             var newFrame = new Frame(node, sphereRadius, name, childPos, imageName, this.dimension, node.position );
             this.artArray.push(newFrame);
        }

        this.artArray[0].load(0);
    }

    backClicked()
    {
        console.log('backClicked dimension ' + this.dimension );
        
        if (this.dimension == 2)
        {
            this.zoomBack();
        }

        if (this.dimension == 3)
        {
            for (var i=0; i < this.artArray.length; i++)
            {
                this.artArray[i].setEnabled(false);
                this.artArray[i].dispose();
                //this.artArray.splice(i, 1);

                scene.render();
            }

            this.dimension -=1;
            this.setEnabledAll(this.dimension, true);
            this.setEnabledAll(this.dimension-1, true);
            this.fadeAll(true, this.dimension-1, true);
            this.fadeAll(true, this.dimension);
            Animations.CameraToRadius(scene.activeCamera, 7, 15, null);

        }
        if (this.dimension == 4)
        {            
            Animations.CameraTargetToPosition(scene.activeCamera, scene.selectedBall.position, 15, null);
            Animations.CameraToRadius(scene.activeCamera, 90, 15, null);
            this.dimension -=1;
        }
    }

    zoomBack()
    {
        console.log('zoomback dimension ' + this.dimension );

        scene.selectedBall.scaleTo(1);

        this.deselectAll(this.dimension-1);
        this.scaleAll(false, this.dimension);
        this.fadeAll(false, this.dimension);

        setTimeout(() => { 
            this.deleteAll(this.dimension);

            this.dimension -= 1;

            this.expandAll(1, true);
            this.fadeAll(true, this.dimension);
            Animations.CameraTargetToPosition(scene.activeCamera, this.position, 20, null);
            Animations.CameraToStartPosition(scene.activeCamera, 20, 15, null);

        }, 1500/2);
    }

    expandAll(dimension, reverse)
    {
        for (var i = 0; i < this.ballArray.length; i++)
        {
            if (dimension == this.ballArray[i].dimension)
            {
                if (reverse){
                    Animations.BallToPosition(this.ballArray[i], this.ballArray[i].defaultPos);
                }
                else
                {
                    Animations.BallToPosition(this.ballArray[i], this.ballArray[i].defaultPos.multiply(this.explodeVector));
                }
            }
        }
    }

    beforeRender(){

    }

    cameraChanged(){

        //return;
        //if (this.dimension < 3)
        //{
            for (var i = 0; i < this.ballArray.length; i++)
            {
                this.ballArray[i].lookAtCamera()
            }
      //  }
        
       // if (this.dimension = 3)
      //  {
            for (var i = 0; i < this.artArray.length; i++)
            {
                this.artArray[i].lookAtCamera()
            }
       // }
    }

    deselectAll(dimension)
    {
        for (var i = 0; i < this.ballArray.length; i++)
        {
            if (dimension == this.ballArray[i].dimension)
            {
                this.ballArray[i].deSelect();
            }
        }
    }

    fadeAll(inOut, dimension, onlySelected = false)
    {
        for (var i = 0; i < this.ballArray.length; i++)
        {
            if (onlySelected && !this.ballArray[i].isSelected)
            {
                continue;
            }
            
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

    scaleAll(inOut, dimension)
    {
        for (var i = 0; i < this.ballArray.length; i++)
        {
            if (this.ballArray[i] != scene.selectedBall && dimension == this.ballArray[i].dimension)
            {
                if (inOut){
                    this.ballArray[i].scaleIn();
                }
                else
                {
                    this.ballArray[i].scaleOut();
                }
            }
        }
    }

    setEnabledAll(dimension, enable)
    {
        for (var i = 0; i < this.ballArray.length; i++)
        {
            if (dimension == this.ballArray[i].dimension)
            {
                this.ballArray[i].setEnabled(enable);
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

    
}