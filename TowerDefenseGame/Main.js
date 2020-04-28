"use strict";
var TowerDefenseGame;
(function (TowerDefenseGame) {
    // tslint:disable-next-line: indent
    var fudge = FudgeCore; // Core
    window.addEventListener("load", init); // Start game
    // tslint:disable-next-line: indent
    let node = new fudge.Node("Game");
    //let camera: fudge.Node;
    let viewport;
    function init() {
        fudge.RenderManager.initialize();
        SetCamera(0, -1.7, 2, 220, 0, 180); // Create and set the camera at place X Y Z with rotatio X Y Z
        createBasicGround();
        //DrawBlackBox();
        viewport.draw();
    }
    function createBasicGround() {
        let greenGround = new fudge.Node("GreenGround"); // Create node - empty gameobject
        let boxMesh = new fudge.MeshCube(); // Create an empty body - mesh object
        let cmpBoxMesh = new fudge.ComponentMesh(boxMesh); // Create an body component and add the mesh
        greenGround.addComponent(cmpBoxMesh); // Add body component to the empty gameobject
        // Create Green Mat
        let matGreen = new fudge.Material("GREEN", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("GREEN"))); // Create material with a green color
        let cmpMatGreen = new fudge.ComponentMaterial(matGreen); // Create component for the material (so it can be added to the gameobject later)
        greenGround.addComponent(cmpMatGreen); //Add material to the gameobject (now it has 2 components)
        cmpBoxMesh.pivot.scale(new fudge.Vector3(1.7, 1.4, 0.1)); // Set the size of the mesh object
        cmpBoxMesh.pivot.translate(new fudge.Vector3(0, 0, 0)); // Set the position of the mesh object
        createWall(greenGround, new fudge.Vector3(0.1, 0.5, 0.2), new fudge.Vector3(1, -1, 1));
        createWall(greenGround, new fudge.Vector3(0.5, 0.1, 0.2), new fudge.Vector3(0, -1, 1));
        node.addChild(greenGround); // Add the gameobject with the components to the main node - the current scene
    }
    function createWall(_toNode, _scale, _pos) {
        let wall = new fudge.Node("Wall");
        let wallMesh = new fudge.MeshCube();
        let cmpWallMesh = new fudge.ComponentMesh(wallMesh);
        wall.addComponent(cmpWallMesh);
        let matGrey = new fudge.Material("GREY", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("GREY")));
        let cmpMatGrey = new fudge.ComponentMaterial(matGrey);
        wall.addComponent(cmpMatGrey);
        cmpWallMesh.pivot.scale(_scale); // Set the size of the mesh object
        cmpWallMesh.pivot.translate(_pos); // Set the position of the mesh object
        wall.addComponent(cmpMatGrey);
        _toNode.addChild(wall);
    }
    /*
  
    function createMeshComponent(_name: string, _material: fudge.Material, _mesh: fudge.Mesh): fudge.Node {
  
      let node: fudge.Node = new fudge.Node(_name);
  
      let cmpMesh: fudge.ComponentMesh = new fudge.ComponentMesh(_mesh);
      let cmpMaterial: fudge.ComponentMaterial = new fudge.ComponentMaterial(_material);
  
      let cmpTransform: fudge.ComponentTransform = new fudge.ComponentTransform();
  
      node.addComponent(cmpMesh);
      node.addComponent(cmpMaterial);
      node.addComponent(cmpTransform);
  
      return node;
    }
  
    function createViewport(_canvas: HTMLCanvasElement = null): void {
      if (!_canvas) {
        _canvas = document.createElement("canvas");
        _canvas.width = 800;
        _canvas.height = 600;
        document.body.appendChild(_canvas);
      }
  
      viewport = new fudge.Viewport();
      camera = createCamera();
      viewport.initialize("viewport", node, camera.getComponent(fudge.ComponentCamera), _canvas);
    }
  
    function createCamera(_translation: fudge.Vector3 = new fudge.Vector3(1, 1, 10), _lookAt: fudge.Vector3 = new fudge.Vector3()): fudge.Node {
      let camera: fudge.Node = new fudge.Node("Camera");
      let cmpTransform: fudge.ComponentTransform = new fudge.ComponentTransform();
      cmpTransform.local.translate(_translation);
      cmpTransform.local.lookAt(_lookAt);
      camera.addComponent(cmpTransform);
      let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();
      cmpCamera.projectCentral(1, 45, fudge.FIELD_OF_VIEW.DIAGONAL);
      camera.addComponent(cmpCamera);
      return camera;
    }
  
    function createMap(): void {
      let map: fudge.Node = new fudge.Node("Map");
  
      let clrGround: fudge.Color = new fudge.Color(0.3, 0.6, 0.5, 1);
      let ground: fudge.Node = createMeshComponent("Ground", new fudge.Material("Ground", fudge.ShaderUniColor, new fudge.CoatColored(clrGround)), new fudge.MeshCube());
      let cmpGroundMesh: fudge.ComponentMesh = ground.getComponent(fudge.ComponentMesh);
  
      cmpGroundMesh.pivot.scale(new fudge.Vector3(6, 0.05, 6));
  
      createViewport();
  
      let cmpCamera: fudge.ComponentTransform = camera.getComponent (fudge.ComponentTransform);
      cmpCamera.local.translateY(2);
      cmpCamera.local.rotateX(-10);
      node.appendChild(map);
  }
  */
    function first_scene() {
        //const canvas: HTMLCanvasElement = document.querySelector("canvas");
        //fudge.RenderManager.initialize();
        //fudge.Debug.log(canvas);
        //let node: fudge.Node = new fudge.Node("Quad");
        let node = new fudge.Node("Map");
        let baseMesh = new fudge.MeshQuad();
        let baseMap = new fudge.ComponentMesh(baseMesh);
        node.addComponent(baseMap);
        let wall = new fudge.ComponentMesh(baseMesh);
        wall.pivot.scale(new fudge.Vector3((0.3), (0.3), (0.3)));
        //let mtrSolidWhite: fudge.Material = new fudge.Material("SolidWhite", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("WHITE")));
        //let cmpMaterial: fudge.ComponentMaterial = new fudge.ComponentMaterial(mtrSolidWhite);
        let matGreen = new fudge.Material("Green", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("GREEN")));
        let cmpMatGreen = new fudge.ComponentMaterial(matGreen);
        let matGrey = new fudge.Material("Grey", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("GREY")));
        let cmpMatGrey = new fudge.ComponentMaterial(matGrey);
        node.addComponent(cmpMatGrey);
        /*
        let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();
        cmpCamera.pivot.translateZ(2);
        cmpCamera.pivot.rotateY(180);
        

        viewport = new fudge.Viewport();
        viewport.initialize("Viewport", node, cmpCamera, canvas);
        fudge.Debug.log(viewport);

        */
        //viewport.draw();
    }
    function SetCamera(_xPos, _yPos, _zPos, _xRot, _yRot, _zRot) {
        const canvas = document.querySelector("canvas");
        let cmpCamera = new fudge.ComponentCamera();
        cmpCamera.pivot.translateX(_xPos);
        cmpCamera.pivot.translateY(_yPos);
        cmpCamera.pivot.translateZ(_zPos);
        cmpCamera.pivot.rotateX(_xRot);
        cmpCamera.pivot.rotateY(_yRot);
        cmpCamera.pivot.rotateZ(_zRot);
        viewport = new fudge.Viewport();
        viewport.initialize("Viewport", node, cmpCamera, canvas);
        fudge.Debug.log(viewport);
    }
    function DrawBlackBox() {
        // Create first node (Blue box)
        let boxNode = new fudge.Node("BlackBox");
        let boxMesh = new fudge.MeshQuad();
        let cmpBoxMesh = new fudge.ComponentMesh(boxMesh);
        boxNode.addComponent(cmpBoxMesh); // Add mesh to the first box
        // Create Blue Mat
        let matBlue = new fudge.Material("BLUE", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("BLUE")));
        let cmpMatBlue = new fudge.ComponentMaterial(matBlue);
        boxNode.addComponent(cmpMatBlue); //Add mat to the first box
        // Create second node (Green box)
        let boxGreenNode = new fudge.Node("GreenBox");
        let boxSmallMesh = new fudge.MeshQuad();
        let cmpBoxMeshSmall = new fudge.ComponentMesh(boxSmallMesh);
        cmpBoxMesh.pivot.scale(new fudge.Vector3(1.5, 1, 1));
        cmpBoxMesh.pivot.translate(new fudge.Vector3(0, 0, 0));
        cmpBoxMeshSmall.pivot.scale(new fudge.Vector3(0.2, 0.2, 0.2));
        cmpBoxMeshSmall.pivot.translate(new fudge.Vector3(1, 2, 1));
        let redColor = new fudge.Color(0.9, 0.8, 0.7, 1);
        let newBox = CreateBox("Box_1", redColor, new fudge.Vector3(0.5, 0, 0), new fudge.Vector3(0.2, 0.2, 0.2));
        boxGreenNode.addComponent(cmpBoxMeshSmall); // Add mesh to the second box
        boxGreenNode.appendChild(newBox);
        // Create Green Mat
        let matGreen = new fudge.Material("GREEN", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("GREEN")));
        let cmpMatGreen = new fudge.ComponentMaterial(matGreen);
        boxGreenNode.addComponent(cmpMatGreen); //Add mat to the second box
        boxNode.appendChild(boxGreenNode);
        node.appendChild(boxNode);
    }
    function CreateBox(_name, _color, _pos, _scale) {
        let box = new fudge.Node(_name);
        let boxMesh = createCompleteMeshNode("Box", new fudge.Material("Box", fudge.ShaderUniColor, new fudge.CoatColored(_color)), new fudge.MeshCube);
        let cmpBoxMesh = boxMesh.getComponent(fudge.ComponentMesh);
        cmpBoxMesh.pivot.scale(_scale);
        //cmpBoxMesh.pivot.translateY(_scale.y / 2);
        box.appendChild(boxMesh);
        box.addComponent(new fudge.ComponentTransform);
        box.cmpTransform.local.translate(_pos);
        return box;
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
})(TowerDefenseGame || (TowerDefenseGame = {}));
//# sourceMappingURL=Main.js.map