
class MainMesh extends BABYLON.Mesh{

    constructor(scene){
        super("dummy", scene);

    }

    deselectAll()
    {
        for (var i = 0; i < this._children.length; i++)
        {
            this._children[i].metadata.deSelect();
        }
    }

}