class Animations{
    
    static ease1;
    static ease2;
    static animationCam;
    static animationTarget;
    
    static CameraTargetToPosition(cam, newPos, frameCount, onFinish)
    {
        scene.stopAnimation(cam);
        
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

    static CameraToStartPosition(cam, radius, frameCount, onFinish) {
        this.ease2 = new BABYLON.SineEase();
        this.ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        this.animationCam = BABYLON.Animation.CreateAndStartAnimation('at6', cam, 'radius', 20, frameCount, cam.radius, radius, 0, this.ease2, onFinish);
        this.animationCam.disposeOnEnd = true;

        var anim = BABYLON.Animation.CreateAndStartAnimation('at7', cam, 'beta', 20, frameCount, cam.beta, scene.cameraBeta, 0, this.ease2, null);
        anim.disposeOnEnd = true;
    }

    static FadeIn(node)
    {
        var ease2 = new BABYLON.SineEase();
        ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        var anim = BABYLON.Animation.CreateAndStartAnimation('at8', node.material, 'alpha', 20, 14, 0, 1, 0, ease2, null);
        anim.disposeOnEnd = true;
    }

    static FadeOut(node)
    {
        var ease2 = new BABYLON.SineEase();
        ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        var anim = BABYLON.Animation.CreateAndStartAnimation('at8', node.material, 'alpha', 20, 14, 1, 0, 0, ease2, null);
        anim.disposeOnEnd = true;
    }

}
