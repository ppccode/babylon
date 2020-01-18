


class Ball {
    //scene; 
    diameter;
    name;
    sphere;
    isEnabled;
    highlight;

    constructor(scene, diameter, name, x, y, z){

        //this.scene = scene;
        this.diameter = diameter;
        this.name = name;
        this.isEnabled = false;

        this.sphere = BABYLON.Mesh.CreateSphere(name, 16, diameter, scene);
	    this.sphere.position.x = x;
        this.sphere.position.y = y;
        this.sphere.position.z = z;
        this.sphere.metadata = this;

        this.sphere.actionManager = new BABYLON.ActionManager(scene);
	    this.sphere.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger, function(sender) {
                    console.log(sender.source.name);

                    sender.source.metadata.addRemoveHighLight();   
                }
            )
        );
    }

    addRemoveHighLight()
    {
        this.isEnabled = !this.isEnabled;
        console.log(this.isEnabled);

        if (this.isEnabled){
            this.highlight = new BABYLON.HighlightLayer("hl1", scene);
            this.highlight.addMesh(this.sphere, BABYLON.Color3.Green());        
        }
        else
        {
            this.highlight.dispose();
        }
    }
}