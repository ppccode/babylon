class Animations{
    
    static ease1;
    static ease2;
    static animationCam;
    static animationTarget;
    
    static CameraTargetToPosition(cam, node, frameCount, onFinish)
    {
        scene.stopAnimation(cam);
        var newPos = node.position;
        this.ease1 = new BABYLON.SineEase();
        this.ease1.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        this.animationTarget = BABYLON.Animation.CreateAndStartAnimation('at5', cam, 'target', 20, frameCount, cam.target, newPos, 0, this.ease1, onFinish);
        this.animationTarget.disposeOnEnd = true;
    }

    static CameraToPosition(cam, newPos, frameCount, onFinish) {
        this.ease2 = new BABYLON.SineEase();
        this.ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
        this.animationCam = BABYLON.Animation.CreateAndStartAnimation('at4', cam, 'position', 20, frameCount, cam.position, newPos, 0, this.ease2, onFinish);
        this.animationCam.disposeOnEnd = true;
    }

    static CameraToRadius(cam, radius, frameCount, onFinish) {
        this.ease2 = new BABYLON.SineEase();
        this.ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        this.animationCam = BABYLON.Animation.CreateAndStartAnimation('at1', cam, 'radius', 20, frameCount, cam.radius, radius, 0, this.ease2, onFinish);
        this.animationCam.disposeOnEnd = true;
    }

    static CameraToStartPosition(cam, radius, frameCount, onFinish) {
        this.ease2 = new BABYLON.SineEase();
        this.ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        this.animationCam = BABYLON.Animation.CreateAndStartAnimation('at6', cam, 'radius', 20, frameCount, cam.radius, radius, 0, this.ease2, onFinish);
        this.animationCam.disposeOnEnd = true;

        var anim = BABYLON.Animation.CreateAndStartAnimation('at7', cam, 'beta', 20, frameCount, cam.beta, scene.cameraBeta, 0, this.ease2, null);
        anim.disposeOnEnd = true;
    }

    static BallToPosition(node, newPos, frames = 11){
        var ease2 = new BABYLON.SineEase();
        ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        BABYLON.Animation.CreateAndStartAnimation('at9', node, 'position', 20, frames, node.position, 
          newPos, 0, ease2).disposeOnEnd = true;
    }

    static Scale(node, start, end, frames = 11)
    {
        var ease2 = new BABYLON.SineEase();
        ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        var anim = BABYLON.Animation.CreateAndStartAnimation('at12', node, 'scaling', 20, frames, start, end, 0, ease2);
        anim.disposeOnEnd = true;
    }

    static FadeIn(node, onEnd)
    {
        var ease2 = new BABYLON.SineEase();
        ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        var anim = BABYLON.Animation.CreateAndStartAnimation('at10', node.material, 'alpha', 20, 11, 0, 0.9, 0, ease2, 
            onEnd(node)
        );
        anim.disposeOnEnd = true;
    }

    static FadeOut(node, onEnd)
    {
        var ease2 = new BABYLON.SineEase();
        ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        var anim = BABYLON.Animation.CreateAndStartAnimation('at11', node.material, 'alpha', 20, 11, 1, 0, 0, ease2, 
            onEnd(node)    
        );
        anim.disposeOnEnd = true;
    }

    static BallSelect(node)
    {
        var animationBox = new BABYLON.Animation("myAnimation", "scaling", 10,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        var keys = [];

        keys.push({
            frame: 0,
            value: new BABYLON.Vector3(1, 1, 1)
        });

        keys.push({
            frame: 5,
            value: new BABYLON.Vector3(0.9, 0.9, 0.9)
        });

        keys.push({
            frame: 10,
            value: new BABYLON.Vector3(1, 1, 1)
        });

        animationBox.setKeys(keys);


        var easingFunction = new BABYLON.QuadraticEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        // Adding the easing function to the animation
        animationBox.setEasingFunction(easingFunction);

        node.animations = [];
        node.animations.push(animationBox);

        scene.beginAnimation(node, 0, 20, false, 4);
    }

}
