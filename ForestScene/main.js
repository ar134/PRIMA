"use strict";
///<reference types="../FudgeCore.js"/> //Path to FudgeCore
var ExampleSceneForest;
///<reference types="../FudgeCore.js"/> //Path to FudgeCore
(function (ExampleSceneForest) {
    var fudge = FudgeCore;
    window.addEventListener("DOMContentLoaded", init);
    let node;
    let camera;
    let viewPort;
    function init() {
        fudge.RenderManager.initialize();
        createMiniForest();
        viewPort.draw();
        viewPort.showSceneGraph();
    }
    function createCompleteMeshNode(_name, _material, _mesh) {
        let node = new fudge.Node(_name);
        let cmpMesh = new fudge.ComponentMesh(_mesh);
        let cmpMaterial = new fudge.ComponentMaterial(_material);
        let cmpTransform = new fudge.ComponentTransform();
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        node.addComponent(cmpTransform);
        return node;
    }
    function createViewport(_canvas = null) {
        if (!_canvas) {
            _canvas = document.createElement("canvas");
            _canvas.width = 800;
            _canvas.height = 600;
            document.body.appendChild(_canvas);
        }
        viewPort = new fudge.Viewport();
        camera = createCamera();
        viewPort.initialize("viewport", node, camera.getComponent(fudge.ComponentCamera), _canvas);
    }
    function createCamera(_translation = new fudge.Vector3(1, 1, 10), _lookAt = new fudge.Vector3()) {
        let camera = new fudge.Node("Camera");
        let cmpTransform = new fudge.ComponentTransform();
        cmpTransform.local.translate(_translation);
        cmpTransform.local.lookAt(_lookAt);
        camera.addComponent(cmpTransform);
        let cmpCamera = new fudge.ComponentCamera();
        cmpCamera.projectCentral(1, 45, fudge.FIELD_OF_VIEW.DIAGONAL);
        camera.addComponent(cmpCamera);
        return camera;
    }
    function createBroadleaf(_name, _clrTrunk, _clrTop, _pos, _scale) {
        let tree = new fudge.Node(_name);
        let treeTrunk = createCompleteMeshNode("TreeTrunk", new fudge.Material("TrunkTree", fudge.ShaderUniColor, new fudge.CoatColored(_clrTrunk)), new fudge.MeshCube);
        let cmpTrunkMesh = treeTrunk.getComponent(fudge.ComponentMesh);
        cmpTrunkMesh.pivot.scale(_scale);
        cmpTrunkMesh.pivot.translateY(_scale.y / 2);
        let treeTop = createCompleteMeshNode("TreeTop", new fudge.Material("TreeTop", fudge.ShaderUniColor, new fudge.CoatColored(_clrTop)), new fudge.MeshCube);
        let cmpTreeTopMesh = treeTop.getComponent(fudge.ComponentMesh);
        cmpTreeTopMesh.pivot.scale(new fudge.Vector3((_scale.x * 2), (_scale.y * 3), (_scale.z * 2)));
        cmpTreeTopMesh.pivot.translateY((_scale.y * 2));
        tree.appendChild(treeTop);
        tree.appendChild(treeTrunk);
        tree.addComponent(new fudge.ComponentTransform);
        tree.cmpTransform.local.translate(_pos);
        return tree;
    }
    function createMiniForest() {
        let forest = new fudge.Node("Forest");
        let clrLeaves = new fudge.Color(0.2, 0.6, 0.3, 1);
        let clrNeedles = new fudge.Color(0.1, 0.5, 0.3, 1);
        let clrTrunkTree = new fudge.Color(0.5, 0.3, 0, 1);
        let clrCapMushroomBrown = new fudge.Color(0.6, 0.4, 0, 1);
        let clrCapMushroomRed = new fudge.Color(0.5, 0, 0, 1);
        let clrTrunkMushroom = new fudge.Color(0.9, 0.8, 0.7, 1);
        let clrGround = new fudge.Color(0.3, 0.6, 0.5, 1);
        let ground = createCompleteMeshNode("Ground", new fudge.Material("Ground", fudge.ShaderUniColor, new fudge.CoatColored(clrGround)), new fudge.MeshCube());
        let cmpGroundMesh = ground.getComponent(fudge.ComponentMesh);
        cmpGroundMesh.pivot.scale(new fudge.Vector3(6, 0.05, 6));
        node = ground;
        createViewport();
        let cmpCamera = camera.getComponent(fudge.ComponentTransform);
        cmpCamera.local.translateY(2);
        cmpCamera.local.rotateX(-10);
        //Creates a forest of broadleaves 
        for (let i = 1; i <= 5; i++) {
            let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            let broadleaf = createBroadleaf("BroadLeaf" + i, clrTrunkTree, clrLeaves, new fudge.Vector3(Math.random() * 4 * plusOrMinus, 0, Math.random() * 4 * plusOrMinus), new fudge.Vector3(0.2, 0.5, 0.2));
            forest.appendChild(broadleaf);
        }
        //Creates a forest of conifers 
        for (let i = 1; i <= 5; i++) {
            let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            let conifer = createConifer("Conifer" + i, clrTrunkTree, clrNeedles, new fudge.Vector3(Math.random() * 3 * plusOrMinus, 0, Math.random() * 3 * plusOrMinus), new fudge.Vector3(0.2, 0.5, 0.2));
            forest.appendChild(conifer);
        }
        //Creates mushrooms 
        for (let i = 1; i <= 4; i++) {
            let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            let mushroomRed = createMushroom("MushroomRed" + i, clrTrunkMushroom, clrCapMushroomRed, new fudge.Vector3(Math.random() * 2 * plusOrMinus, 0, Math.random() * 2 * plusOrMinus), new fudge.Vector3(0.1, 0.2, 0.1));
            let mushroomBrown = createMushroom("MushroomBrown" + i, clrTrunkMushroom, clrCapMushroomBrown, new fudge.Vector3(Math.random() * 2 * plusOrMinus, 0, Math.random() * 2 * plusOrMinus), new fudge.Vector3(0.1, 0.2, 0.1));
            forest.appendChild(mushroomRed);
            forest.appendChild(mushroomBrown);
        }
        node.appendChild(forest);
    }
    function createConifer(_name, _clrTrunk, _clrTop, _pos, _scale) {
        let tree = new fudge.Node(_name);
        let treeTrunk = createCompleteMeshNode("TreeTrunk", new fudge.Material("TrunkTree", fudge.ShaderUniColor, new fudge.CoatColored(_clrTrunk)), new fudge.MeshCube);
        let cmpTrunkMesh = treeTrunk.getComponent(fudge.ComponentMesh);
        cmpTrunkMesh.pivot.scale(_scale);
        cmpTrunkMesh.pivot.translateY(_scale.y / 2);
        let treeTop = createCompleteMeshNode("TreeTop", new fudge.Material("TreeTop", fudge.ShaderUniColor, new fudge.CoatColored(_clrTop)), new fudge.MeshPyramid);
        let cmpTreeTopMesh = treeTop.getComponent(fudge.ComponentMesh);
        cmpTreeTopMesh.pivot.scale(new fudge.Vector3((_scale.x * 2), (_scale.y * 3), (_scale.z * 2)));
        cmpTreeTopMesh.pivot.translateY((_scale.y / 2));
        tree.appendChild(treeTop);
        tree.appendChild(treeTrunk);
        tree.addComponent(new fudge.ComponentTransform);
        tree.cmpTransform.local.translate(_pos);
        return tree;
    }
    function createMushroom(_name, _clrTrunk, _clrCap, _pos, _scale) {
        let mushroom = new fudge.Node(_name);
        let mushroomTrunk = createCompleteMeshNode("MushroomTrunk", new fudge.Material("MushroomTrunk", fudge.ShaderUniColor, new fudge.CoatColored(_clrTrunk)), new fudge.MeshCube);
        let cmpMesh = mushroomTrunk.getComponent(fudge.ComponentMesh);
        cmpMesh.pivot.scale(_scale);
        cmpMesh.pivot.translateY(_scale.y / 2);
        let mushroomCap = createCompleteMeshNode("MushroomCapRed", new fudge.Material("MushroomCapRed", fudge.ShaderUniColor, new fudge.CoatColored(_clrCap)), new fudge.MeshCube);
        let cmpCapMesh = mushroomCap.getComponent(fudge.ComponentMesh);
        cmpCapMesh.pivot.scale(new fudge.Vector3((_scale.x * 2), (_scale.y - 0.05), (_scale.z * 2)));
        cmpCapMesh.pivot.translateY((_scale.y));
        mushroom.appendChild(mushroomCap);
        mushroom.appendChild(mushroomTrunk);
        mushroom.addComponent(new fudge.ComponentTransform);
        mushroom.cmpTransform.local.translate(_pos);
        return mushroom;
    }
})(ExampleSceneForest || (ExampleSceneForest = {}));
//# sourceMappingURL=main.js.map