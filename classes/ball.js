


class Ball {
    diameter;
    name;
    sphere;
    isEnabled;
    highlight;

    constructor(parent, diameter, name, x, y, z){

        //this.scene = scene;
        this.diameter = diameter;
        this.name = name;
        this.isEnabled = false;

        this.sphere = BABYLON.Mesh.CreateSphere(name, 16, diameter, parent._scene);
        this.sphere.parent = parent;
	    this.sphere.position.x = x;
        this.sphere.position.y = y;
        this.sphere.position.z = z;
        this.sphere.metadata = this;

    // TODO : use same material??
        var shapeMaterial = new BABYLON.StandardMaterial("mat", scene);
        shapeMaterial.backFaceCulling = true;
        shapeMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay/TropicalSunnyDay", scene);
        shapeMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.CUBIC_MODE;
        shapeMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        shapeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.sphere.material = shapeMaterial;	


        this.sphere.actionManager = new BABYLON.ActionManager(this.sphere._scene);
	    this.sphere.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger, function(sender) {
                    console.log(sender.source.name);

                    sender.source.metadata.userClicked();   
                }
            )
        );
    }

    deSelect()
    {
        this.isEnabled = false;
        
        if (this.highlight){
            this.highlight.dispose();
        }
    }

    select(){
        this.sphere.parent.deselectAll();

        this.highlight = new BABYLON.HighlightLayer("hl1", this.sphere._scene);
        this.highlight.addMesh(this.sphere, BABYLON.Color3.Green()); 
    }

    userClicked(){
        if (this.isEnabled)
        {
            return;
        }
        
        this.isEnabled = true;
        console.log(this.isEnabled);

        this.select(); 
    }
}