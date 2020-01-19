


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
        this.highlight.dispose();
    }

    select(){
        this.highlight = new BABYLON.HighlightLayer("hl1", this.sphere._scene);
        this.highlight.addMesh(this.sphere, BABYLON.Color3.Green()); 
    }

    userClicked(){
        this.isEnabled = !this.isEnabled;
        console.log(this.isEnabled);

        if (this.isEnabled){
            this.select();    
        }
        else
        {
            this.deSelect();
        }
    }
}