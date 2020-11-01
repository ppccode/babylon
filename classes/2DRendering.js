
class Rendering2D{

    //static screen2D;
    //static backbutton;

    static create2dProjectedBall(name, ball)
    {
        var fsBall = BABYLON.MeshBuilder.CreateDisc(name, {
            radius: 1.25, arc: 1, tessellation: 40, sideOrientation: BABYLON.Mesh.BILLBOARDMODE_ALL
        }, scene);

        fsBall.parent = scene.activeCamera;
        fsBall.position = new BABYLON.Vector3(0,0,5);
        fsBall.isPickable = false;

        if (ball)
        {
            var materialPlane = new BABYLON.StandardMaterial(name, scene);
            var texture = new BABYLON.Texture(ball.imageName, scene, false, false);
            materialPlane.diffuseTexture = texture;
            materialPlane.emissiveTexture = texture;
            materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
    
            fsBall.material = materialPlane;
        }

        return fsBall;
    }

    static addFullScreenBall(ball)
    {
        var fsBall = this.create2dProjectedBall("fsBall", ball); 
        return fsBall;
    }

    static setBackButtonEnabled(enabled)
    {
        if (this.backbutton)
        {
            this.backbutton.setEnabled(enabled);
        }
    }

    static addBackButton(ball)
    {
        this.removeBackButton();

        var fsBall = this.create2dProjectedBall("bbBall", ball);
        fsBall.radius = 0.1; 
        fsBall.position = new BABYLON.Vector3(-9, 17, 45);
        fsBall.isPickable = true;

        fsBall.actionManager = new BABYLON.ActionManager(scene);
        fsBall.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickDownTrigger, function (sender) {
                    scene.mainMesh.backClicked();
                }
            )
        );

        this.backbutton = fsBall;
        return fsBall;
    }

    static removeBackButton(){
        if (this.backbutton)
        {
            this.backbutton.setEnabled(false);
            this.backbutton.dispose();
        }
    }
    
    static createGUI()
    {
        // GUI
        this.screen2D = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
        var panel = new BABYLON.GUI.StackPanel(); 
        panel.paddingTop = "0.1";   
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        panel.height = "0.5";
        this.screen2D.addControl(panel); 
    
        var bottomPanel = new BABYLON.GUI.StackPanel();	
        bottomPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        bottomPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        bottomPanel.height = "0.06";
        bottomPanel.width = "0.3";
        var logo = new BABYLON.GUI.Image("Galatea", "logo.png");
        logo.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
        bottomPanel.addControl(logo);

        this.screen2D.addControl(bottomPanel); 
    }
}



