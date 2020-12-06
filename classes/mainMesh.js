
class MainMesh extends BABYLON.Mesh{

    constructor(scene){
        super("dummy", scene);

        // Skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;

        this.skyboxTexture = new BABYLON.CubeTexture("textures/skybox/skybox", scene);
        skyboxMaterial.reflectionTexture = this.skyboxTexture;

        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;


        this.rotationForceVector = BABYLON.Vector3.Zero();
        this.ballArray = [];
        this.artArray = [];
        this.dimension = 0;
        this.explodeVector = new BABYLON.Vector3(1.6, 1.6, 1.6);
        this.cameraRadius = [10, 20, 7, 90, 10, null];
        this.selectedInDimension = [null, null, null, null];
        this.alphaRotationInDimension = [null, null, null, null];
        this.autoRotate = true;

        this.createfirstBall();

    }

    beforeRender(){
        if (this.dimension == 1 && this.autoRotate)
        {
            // soft rotation
           // scene.activeCamera.alpha = scene.activeCamera.alpha + 0.01;
        }
    }

    cameraChanged(){
        for (var i = 0; i < this.ballArray.length; i++)
        {
            this.ballArray[i].lookAtCamera()
        }
        for (var i = 0; i < this.artArray.length; i++)
        {
            this.artArray[i].lookAtCamera()
        }

        //console.log(scene.activeCamera.alpha);

    }

    createfirstBall(){
        var imageName = 'Demo/first_dimension.jpg';
        var newBall = new Ball(this, 3, 'Galatea', 0, 0, 0, imageName, 0, new BABYLON.Vector3.Zero());
        this.ballArray.push(newBall);
        newBall.scaleIn();
        newBall.fadeIn();
    }

    createParent()
    {
        var ballCount = 7;
        var offset =  2.8;
        var sphereRadius = 1;
        var names = ['August Macke', 'Franz Marc', 'Jawlensky', 'Julien Dinou', 'Otto Nebel', 'Paul Klee', 'Van Doesburg'];

        for (var i=1; i <= ballCount; i++)
        {
            var pos = getBallPosition(ballCount, i, sphereRadius, offset);
            var name = names[i-1];
            var imageName = 'Demo/Scene_1_2 [Bollen]/Bol_' + name + '.jpg';
            var newBall = new Ball(this, sphereRadius, name, pos.x, pos.y, pos.z, imageName, this.dimension, new BABYLON.Vector3.Zero());
            this.ballArray.push(newBall);

            newBall.scaleIn();
        }
    }

    createChildren(node){
        this.dimension +=1;

        var ballCount = 5;
        var offset =  1;
        var sphereRadius = 0.5;
        var subNames = ['Pastel', 'Early Work', 'Late Work', 'Drawings', 'Main Body'];

        // create sub children
        for (var i=0; i < ballCount; i++)
        {
            var pos = getBallPosition(ballCount, i, sphereRadius, offset);
            var name = subNames[i];
            var imageName = 'Demo/Scene_3_4 [Bollen]/Bol_' + name + '.jpg';
            var childPos = node.position.multiply(scene.mainMesh.explodeVector).add(new BABYLON.Vector3(pos.x, pos.y, pos.z));
            var newBall = new Ball(node, sphereRadius, name, childPos.x, childPos.y, childPos.z, imageName, 
                this.dimension, node.position );
            this.ballArray.push(newBall);

            Animations.Scale(newBall,  BABYLON.Vector3.Zero(), new BABYLON.Vector3(1,1,1));
            Animations.BallToPosition(newBall, childPos);
        }
    }

    ballClicked(ball)
    {
        this.alphaRotationInDimension[this.dimension] = scene.activeCamera.alpha;
        console.log('ballClicked dimension ' + this.dimension + ' alpha ' + scene.activeCamera.alpha);
        
        if (ball.dimension == 0)
        {
            Animations.FadeOut(ball.face, function(sender){}, 15, 1, 0, BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            ball.scaleTo(3.0);     
            Animations.CameraToRotation(scene.activeCamera, Math.PI, 1.637, 20, null);
            this.dimension +=1;
            this.createParent();

            setTimeout(() => { 
                this.deleteAll(0)
              }, 1000);

            return;
        }

        if (ball.dimension == 1)
        {
            this.createChildren(ball); 
            Animations.CameraTargetToPosition(scene.activeCamera, ball.defaultPos.multiply(this.explodeVector), 15, null);
            Animations.CameraToRadius(scene.activeCamera, this.cameraRadius[this.dimension], 15, null);
            this.fadeAll(false, ball.dimension);
            this.expandAll(1, false);
            
            //Animations.FadeFromTo(ball.face, function(sender){}, 15, 1, 0.3);
            this.fadeAll(true, ball.dimension+1);

            setTimeout(() => { 
                ball.scaleTo(0.3, 7);
                 
              }, 1000/2);

            setTimeout(() => { 
               // ball.deSelect(); 
                //Animations.CameraToRotation(scene.activeCamera, 0.394, 1.611, 15, null);
                
             }, 1000/2);
        }
    
        if (ball.dimension == 2)
        { 
            Animations.CameraTargetToPosition(scene.activeCamera, ball.position, 15, null);
            Animations.CameraToRadius(scene.activeCamera, 2, 15, null);
            this.fadeAll(false, ball.dimension);

            setTimeout(() => { 
                var fsBall = Rendering2D.addFullScreenBall(ball);
                Animations.FadeOut(fsBall, function(sender){}, 15, 1, 0, BABYLON.EasingFunction.EASINGMODE_EASEOUT);
                scene.activeCamera.radius = 200;
                this.openArtwork(ball.ballParent);
                Animations.CameraToRadius(scene.activeCamera, 90, 15, null);
                Animations.BallToPosition(fsBall, new BABYLON.Vector3(0,0,2), 15);
                Rendering2D.addBackButton(ball.ballParent);
            }, 800);
        }
    }

    openArtwork(node)
    { 
        var selectedWork = scene.selectedBall.name;
        var selectedData = null;
        if (demoData.hasOwnProperty(selectedWork)) {
            selectedData = demoData[selectedWork];
        }
        else{
            this.backClicked();
            return;
        }
        
        this.setEnabledAll(this.dimension, false);
        this.setEnabledAll(this.dimension-1, false);

        this.dimension +=1;
        var ballCount = selectedData.length;
        var offset =  14;
        var sphereRadius = 4;


        for (var i=0; i < ballCount; i++)
        {
            var pos = getBallPosition(ballCount, i, sphereRadius, offset);
            var imageName = 'Demo/Julien Dinou/' + selectedWork + '/' + selectedData[i];
            var childPos = node.position.add(new BABYLON.Vector3(pos.x, pos.y, pos.z));

             var newFrame = new Frame(node, sphereRadius, name, childPos, imageName, this.dimension, node.position );
             this.artArray.push(newFrame);
        }

        this.artArray[0].load(0);

        //Animations.CameraToRotation(scene.activeCamera, scene.activeCamera.alpha + 0.5, null, 15, null);
    }

    backClicked()
    {
        var alpha = this.alphaRotationInDimension[this.dimension-1];
        console.log('backClicked dimension ' + this.dimension + ' alpha ' + alpha);
        
        if (this.dimension == 2)
        {
            this.zoomBack();
        }
        if (this.dimension == 3)
        {
            // remove art
            for (var i=0; i < this.artArray.length; i++)
            {
                this.artArray[i].setEnabled(false);
                this.artArray[i].dispose();                          
            }
            this.artArray = [];
            scene.activeCamera.radius = 2; 

            Rendering2D.removeBackButton();

            // fly back 
            this.dimension -=1;
            
            this.setEnabledAll(this.dimension, true);      
            this.fadeAll(true, this.dimension);
            this.selectedInDimension[this.dimension-1].setEnabled(true);
            this.selectedInDimension[this.dimension-1].fadeIn();

            Animations.CameraTargetToPosition(scene.activeCamera, this.selectedInDimension[this.dimension-1].position, 15, null);
            Animations.CameraToRadius(scene.activeCamera, this.cameraRadius[this.dimension], 15, null);
            //Animations.CameraToRotation(scene.activeCamera, 0.394, 1.611, 15, null);
        }
        if (this.dimension == 4)
        {            
            Rendering2D.removeFrameControls();
            this.artArray[0].fadeAll(true);
            Animations.CameraTargetToPosition(scene.activeCamera, scene.selectedBall.position, 15, null);
            this.dimension -=1;
            Animations.CameraToRadius(scene.activeCamera, scene.mainMesh.cameraRadius[scene.mainMesh.dimension], 15, null);
        }

        Animations.CameraToRotation(scene.activeCamera, null, 1.7, 15, null);
    }

    

    zoomBack()
    {
        console.log('zoomback dimension ' + this.dimension ); 
        scene.mainMesh.selectedInDimension[1].scaleTo(1);
        //Animations.FadeFromTo(scene.mainMesh.selectedInDimension[1].face, function(sender){}, 15, 0.3, 1);
        this.setEnabledAll(this.dimension-1, true);
        this.deselectAll(this.dimension-1);
        this.scaleAll(false, this.dimension);
        this.fadeAll(false, this.dimension);

        this.dimension -= 1;

        this.expandAll(1, true);
        this.fadeAll(true, this.dimension);
    
        Animations.CameraTargetToPosition(scene.activeCamera, this.position, 20, null);
        Animations.CameraToStartPosition(scene.activeCamera, scene.mainMesh.cameraRadius[scene.mainMesh.dimension], 15, null);

        setTimeout(() => { 
            this.deleteAll(this.dimension+1);

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