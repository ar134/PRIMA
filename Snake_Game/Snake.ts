namespace Snake_Game {
    import ƒ = FudgeCore;

  
    export class Snake extends ƒ.Node {
        public direction: ƒ.Vector3 = ƒ.Vector3.X();    // Create a new 1,0,0 vector

        public lastPos: ƒ.Vector3;
    
        constructor() {
            super("Snake");
            console.log("Creating Snake");
            this.createSegement(4);
        }
        
        public move(_direction: ƒ.Vector3): void {
            
            let child: ƒ.Node = this.getChildren()[0];  // Create a new node and store the information of the first child from the snake
            let cmpPrev: ƒ.ComponentTransform = child.getComponent(ƒ.ComponentTransform);  // Create a new cmp transform and store the information of the first childs transform
            let mtxHead: ƒ.Matrix4x4 = cmpPrev.local.copy;  // Create a new matrix and store the information of the child

            mtxHead.translate(_direction);  // Add a translation (the vector 1,0,0) to the matrix so it will move

            let cmpNew: ƒ.ComponentTransform = new ƒ.ComponentTransform(mtxHead);   // Create a new cmp transform and store the matrix with the added movement
            
            // Search each child object in the snake
            for (let segment of this.getChildren()) {
                cmpPrev = segment.getComponent(ƒ.ComponentTransform);   // Store the transform from the current child
                segment.removeComponent(cmpPrev);   // Remove the old component
                segment.addComponent(cmpNew);   // Add the new component which is a transform and has the added movement
                cmpNew = cmpPrev;
                this.lastPos = cmpPrev.local.translation;
            }
        }

        public grow(): void {
            //let mesh: ƒ.MeshQuad = new ƒ.MeshQuad();    // Creaty empty mesh object
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let mtrSolidWhite: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));    // Create material and give it a white color
            let segment: ƒ.Node = new ƒ.Node("Segment");
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
            segment.addComponent(cmpMesh);
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.80));
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidWhite);
            segment.addComponent(cmpMaterial);
    
            segment.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.lastPos)));
    
            this.appendChild(segment);

        }
    
        private createSegement(_segments: number): void {

            // let mesh: ƒ.MeshQuad = new ƒ.MeshQuad();    // Creaty empty mesh object
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let mtrSolidWhite: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));    // Create material and give it a white color
    
            // Create X segments - body parts for the snake
            for (let i: number = 0; i < _segments; i++) {

                let segment: ƒ.Node = new ƒ.Node("Segment");
        
                let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
                segment.addComponent(cmpMesh);
                cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.80));
        
                let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidWhite);
                segment.addComponent(cmpMaterial);
        
                segment.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-1 * i, 0, 0))));
        
                this.appendChild(segment);

            }
        }
    }
}