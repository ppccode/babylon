class Animations{
    
    static ease1;
    static ease2;
    static animationCam;
    static animationTarget;
    
    static CameraTargetToPosition(cam, newPos, frameCount, onFinish)
    {
        scene.stopAnimation(cam);
        
        this.ease1 = new BABYLON.SineEase();
        this.ease1.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
        this.animationTarget = BABYLON.Animation.CreateAndStartAnimation('at5', cam, 'target', 20, frameCount, cam.target, newPos, 0, this.ease1, onFinish);
        this.animationTarget.disposeOnEnd = true;
    }

    static CameraToPosition(cam, newPos, frameCount, onFinish) {
        this.ease2 = new BABYLON.SineEase();
        this.ease2.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);
        this.animationCam = BABYLON.Animation.CreateAndStartAnimation('at4', cam, 'position', 20, frameCount, cam.position, newPos, 0, this.ease2, onFinish);
        this.animationCam.disposeOnEnd = true;
    }
}