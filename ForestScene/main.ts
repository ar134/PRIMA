///<reference types="../FudgeCore.js"/> //Path to FudgeCore
namespace ExampleSceneForest {
    import fudge = FudgeCore;
    window.addEventListener("DOMContentLoaded", init);
    let node: fudge.Node;
    let camera: fudge.Node;
    let viewPort: fudge.Viewport;


    function init(): void {
        fudge.RenderManager.initialize();
        createMiniForest();
        viewPort.draw();
        viewPort.showSceneGraph();
    }

    function createCompleteMeshNode(_name: string, _material: fudge.Material, _mesh: fudge.Mesh): fudge.Node {
        let node: fudge.Node = new fudge.Node(_name);

        let cmpMesh: fudge.ComponentMesh = new fudge.ComponentMesh(_mesh);
        let cmpMaterial: fudge.ComponentMaterial = new fudge.ComponentMaterial (_material);

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

        viewPort = new fudge.Viewport(); 
        camera = createCamera(); 
        viewPort.initialize("viewport", node, camera.getComponent(fudge.ComponentCamera), _canvas); 
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

    function createBroadleaf(_name: string, _clrTrunk: fudge.Color, _clrTop: fudge.Color, _pos: fudge.Vector3, _scale: fudge.Vector3): fudge.Node { 
             
       
        let tree: fudge.Node = new fudge.Node(_name); 
               
        let treeTrunk: fudge.Node = createCompleteMeshNode("TreeTrunk", new fudge.Material("TrunkTree", fudge.ShaderUniColor, new fudge.CoatColored(_clrTrunk)), new fudge.MeshCube); 
        let cmpTrunkMesh: fudge.ComponentMesh = treeTrunk.getComponent(fudge.ComponentMesh); 
            
        cmpTrunkMesh.pivot.scale(_scale); 
        cmpTrunkMesh.pivot.translateY(_scale.y / 2); 
       
        let treeTop: fudge.Node = createCompleteMeshNode("TreeTop", new fudge.Material("TreeTop", fudge.ShaderUniColor, new fudge.CoatColored(_clrTop)), new fudge.MeshCube);    
        let cmpTreeTopMesh: fudge.ComponentMesh = treeTop.getComponent(fudge.ComponentMesh); 
             
        cmpTreeTopMesh.pivot.scale(new fudge.Vector3((_scale.x * 2), (_scale.y * 3), (_scale.z * 2))); 
             
        cmpTreeTopMesh.pivot.translateY((_scale.y * 2)); 
        tree.appendChild(treeTop); 
        tree.appendChild(treeTrunk); 
        tree.addComponent(new fudge.ComponentTransform); 
        tree.cmpTransform.local.translate(_pos); 
       
        return tree; 
    }

    function createMiniForest(): void { 

        let forest: fudge.Node = new fudge.Node("Forest"); 
   
        let clrLeaves: fudge.Color = new fudge.Color(0.2, 0.6, 0.3, 1); 
        let clrNeedles: fudge.Color = new fudge.Color(0.1, 0.5, 0.3, 1); 
        let clrTrunkTree: fudge.Color = new fudge.Color(0.5, 0.3, 0, 1); 
        let clrCapMushroomBrown: fudge.Color = new fudge.Color(0.6, 0.4, 0, 1); 
        let clrCapMushroomRed: fudge.Color = new fudge.Color(0.5, 0, 0, 1); 
        let clrTrunkMushroom: fudge.Color = new fudge.Color(0.9, 0.8, 0.7, 1); 
        let clrGround: fudge.Color = new fudge.Color(0.3, 0.6, 0.5, 1); 
   
        let ground: fudge.Node = createCompleteMeshNode("Ground", new fudge.Material("Ground", fudge.ShaderUniColor, new fudge.CoatColored(clrGround)), new fudge.MeshCube()); 
        let cmpGroundMesh: fudge.ComponentMesh = ground.getComponent(fudge.ComponentMesh); 
        
        cmpGroundMesh.pivot.scale(new fudge.Vector3(6, 0.05, 6)); 
        
        node = ground; 

        createViewport(); 

        let cmpCamera: fudge.ComponentTransform = camera.getComponent (fudge.ComponentTransform); 
        cmpCamera.local.translateY(2); 
        cmpCamera.local.rotateX(-10);

        //Creates a forest of broadleaves 
        for (let i: number = 1; i <= 5; i++) {

            let plusOrMinus: number = Math.random() < 0.5 ? -1 : 1; 
            let broadleaf: fudge.Node = createBroadleaf("BroadLeaf" + i, clrTrunkTree, clrLeaves, new fudge.Vector3(Math.random() * 4 * plusOrMinus, 0, Math.random() * 4 * plusOrMinus), new fudge.Vector3(0.2, 0.5, 0.2)); 
            
            forest.appendChild(broadleaf); 
        }

        //Creates a forest of conifers 
        for (let i: number = 1; i <= 5; i++) { 

            let plusOrMinus: number = Math.random() < 0.5 ? -1 : 1; 
            let conifer: fudge.Node = createConifer("Conifer" + i, clrTrunkTree, clrNeedles, new fudge.Vector3(Math.random() * 3 * plusOrMinus, 0, Math.random() * 3 * plusOrMinus), new fudge.Vector3(0.2, 0.5, 0.2)); 
            forest.appendChild(conifer); 
            } 
   
        //Creates mushrooms 
        for (let i: number = 1; i <= 4; i++) { 

            let plusOrMinus: number = Math.random() < 0.5 ? -1 : 1; 

            let mushroomRed: fudge.Node = createMushroom("MushroomRed" + i, clrTrunkMushroom, clrCapMushroomRed, new  fudge.Vector3(Math.random() * 2 * plusOrMinus, 0, Math.random() * 2 * plusOrMinus), new fudge.Vector3(0.1, 0.2, 0.1)); 
                        
            let mushroomBrown: fudge.Node = createMushroom("MushroomBrown" + i, clrTrunkMushroom, clrCapMushroomBrown, new fudge.Vector3(Math.random() * 2 * plusOrMinus, 0, Math.random() * 2 * plusOrMinus), new fudge.Vector3(0.1, 0.2, 0.1)); 
             
            forest.appendChild(mushroomRed); 
            forest.appendChild(mushroomBrown); 
        }

        node.appendChild(forest); 
    }

    function createConifer(_name: string, _clrTrunk: fudge.Color, _clrTop: fudge.Color, _pos: fudge.Vector3, _scale: fudge.Vector3): fudge.Node { 
                
        let tree: fudge.Node = new fudge.Node(_name); 
                
        let treeTrunk: fudge.Node = createCompleteMeshNode("TreeTrunk", new fudge.Material("TrunkTree", fudge.ShaderUniColor, new fudge.CoatColored(_clrTrunk)), new fudge.MeshCube);
        let cmpTrunkMesh: fudge.ComponentMesh = treeTrunk.getComponent(fudge.ComponentMesh); 
            
        cmpTrunkMesh.pivot.scale(_scale); 
        cmpTrunkMesh.pivot.translateY(_scale.y / 2); 
    
        let treeTop: fudge.Node = createCompleteMeshNode("TreeTop", new fudge.Material("TreeTop", fudge.ShaderUniColor, new fudge.CoatColored(_clrTop)), new fudge.MeshPyramid); 
            
        let cmpTreeTopMesh: fudge.ComponentMesh = treeTop.getComponent(fudge.ComponentMesh); 
            
        cmpTreeTopMesh.pivot.scale(new fudge.Vector3((_scale.x * 2), (_scale.y * 3), (_scale.z * 2))); 
            
        cmpTreeTopMesh.pivot.translateY((_scale.y / 2)); 
    
        tree.appendChild(treeTop); 
        tree.appendChild(treeTrunk); 
    
        tree.addComponent(new fudge.ComponentTransform); 
        tree.cmpTransform.local.translate(_pos); 
    
        return tree; 
    }

    function createMushroom(_name: string, _clrTrunk: fudge.Color, _clrCap: fudge.Color, _pos: fudge.Vector3, _scale: fudge.Vector3): fudge.Node { 
                
        let mushroom: fudge.Node = new fudge.Node(_name); 
        let mushroomTrunk: fudge.Node = createCompleteMeshNode("MushroomTrunk", new fudge.Material("MushroomTrunk", fudge.ShaderUniColor, new fudge.CoatColored(_clrTrunk)), new fudge.MeshCube);
        let cmpMesh: fudge.ComponentMesh = mushroomTrunk.getComponent(fudge.ComponentMesh); 
            
        cmpMesh.pivot.scale(_scale); 
        cmpMesh.pivot.translateY(_scale.y / 2); 
        
        let mushroomCap: fudge.Node = createCompleteMeshNode("MushroomCapRed", new fudge.Material("MushroomCapRed", fudge.ShaderUniColor, new fudge.CoatColored(_clrCap)), new fudge.MeshCube); 
            
        let cmpCapMesh: fudge.ComponentMesh = mushroomCap.getComponent(fudge.ComponentMesh); 
            
        cmpCapMesh.pivot.scale(new fudge.Vector3((_scale.x * 2), (_scale.y - 0.05), (_scale.z * 2))); 
            
        cmpCapMesh.pivot.translateY((_scale.y)); 
 
        mushroom.appendChild(mushroomCap); 
        mushroom.appendChild(mushroomTrunk); 

        mushroom.addComponent(new fudge.ComponentTransform); 
        mushroom.cmpTransform.local.translate(_pos); 

        return mushroom; 
    }
}
