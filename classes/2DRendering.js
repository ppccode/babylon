
class Rendering2D{

    static view2d()
    {
        if (this.advancedTexture == null)
        {
            var frame2d = BABYLON.MeshBuilder.CreatePlane(name, {
                width: 20, height: 20, sideOrientation: BABYLON.Mesh.BILLBOARDMODE_ALL
            }, scene);
    
            frame2d.parent = scene.activeCamera;
            frame2d.isPickable = false;
            frame2d.position = new BABYLON.Vector3(0, 0, 2); 
            frame2d.scaling = new BABYLON.Vector3(0.1,0.1,0.1);
    
            this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(frame2d);
        }
    
        return this.advancedTexture;
    }

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

    static create2dprojectedText(text)
    {
        var label = new BABYLON.GUI.TextBlock();
        label.fontFamily = 'arial';
        label.text = text;    
        label.resizeToFit = true;
        label.textWrapping = true;
        label.height = 0.3;
        label.width = 0.3;
        label.color = 'white';
        label.fontSize = 18;
        label.top = 385; 

        this.label = label;
        
        this.view2d().addControl(label);
    }

    static createInfoText(text)
    {
        var rect1 = new BABYLON.GUI.Rectangle();
        rect1.height = 0.63;
        rect1.width = 0.53;
        rect1.cornerRadius = 0;
        rect1.thickness = 0;
        //rect1.background = "#000000f0";
        rect1.background = "#fffffff0";
        this.view2d().addControl(rect1);
        
        var label = new BABYLON.GUI.TextBlock();
        label.fontFamily = 'arial';
        label.text = text;
        
        //label.resizeToFit = true;
        label.textWrapping = true;
        label.height = 0.55;
        label.width = 0.49;
        label.color = 'black';
        //label.color = 'white';
        label.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        label.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        label.fontSize = 18;

        this.infoText = label;
        this.infoTextBack = rect1;
        this.view2d().addControl(label);
    }

    static removeInfoText()
    {
        if (this.infoText)
        {
            this.view2d().removeControl(this.infoText);
            this.view2d().removeControl(this.infoTextBack);
        } 
    }

    static removeFrameControls()
    {
        if (this.label)
        {
            this.view2d().removeControl(this.label);
        }
        if (this.soundButton)
        {
            this.soundButton.setEnabled(false);
            this.soundButton.dispose();
        } 
        if (this.infoButton)
        {
            this.infoButton.setEnabled(false);
            this.infoButton.dispose();
        } 
        this.removeInfoText();
    }

    static createButton(imageUrl, position, onclick)
    {
        var ball2d = this.create2dProjectedBall(imageUrl, null);
        ball2d.position = position;
        ball2d.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
        
        var materialPlane = new BABYLON.StandardMaterial(name, scene);
        var texture = new BABYLON.Texture(imageUrl, scene, false, false);
        materialPlane.diffuseTexture = texture;
        materialPlane.emissiveTexture = texture;
        materialPlane.specularColor = new BABYLON.Color3(0, 0, 0);
        ball2d.material = materialPlane;

        ball2d.isPickable = true;

        ball2d.actionManager = new BABYLON.ActionManager(scene);
        ball2d.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction( BABYLON.ActionManager.OnPickTrigger, onclick)
        );

        return ball2d;
    }

    static createSoundButton(clickhandler)
    {
        this.soundButton = this.createButton('Demo/geluid.png', new BABYLON.Vector3(-0.45, -0.75, 2), clickhandler);
    }

    static createInfoButton(clickhandler)
    {
        this.infoButton = this.createButton('Demo/info.png', new BABYLON.Vector3(0.45, -0.75, 2), clickhandler);
    }

    static addFullScreenBall(ball)
    {
        var fsBall = this.create2dProjectedBall("fsBall", ball); 
        fsBall
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
        this.backbutton = this.createButton(ball.imageName, new BABYLON.Vector3(0, -0.75, 2), function (sender) {
                scene.mainMesh.backClicked();
            }
        );
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
        /*this.screen2D = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        
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
        
        /*var logo = new BABYLON.GUI.Image("Galatea", "logo.png");
        logo.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
        bottomPanel.addControl(logo);*/

       /* this.screen2D.addControl(bottomPanel); 
        this.bottomPanel = bottomPanel;*/ 
    }
}



