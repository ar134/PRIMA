namespace Snake_Game {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Snake extends ƒ.Node {

        private static mesh: ƒ.MeshCube = new ƒ.MeshCube();
        public head: ƒ.Node;

        protected color: ƒ.Color;
        protected readonly dirCurrent: ƒ.Vector3 = ƒ.Vector3.X();
        //private dirCurrent: ƒ.Vector3 = ƒ.Vector3.X();
        private turn: boolean = false;

        private dirNew: ƒ.Vector3;

        
        //public direction: ƒ.Vector3 = ƒ.VectBor3.X();    // Create a new 1,0,0 vector

        public lastPos: ƒ.Vector3;
        
    
        constructor(_name: string = "Snake", _color: ƒ.Color = ƒ.Color.CSS("yellow")) {
            super(_name);
            this.color = _color;

            //console.log("Creating Snake");
            //this.createSegement(4);

            this.grow(4);
            this.head = this.getChild(0);

            let cosys: ƒAid.NodeCoordinateSystem = new ƒAid.NodeCoordinateSystem("ControlSystem");
            cosys.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(2))));
            this.head.addChild(cosys);
        }
        
        public move(): void {

            this.turn = false;
            
            //this.dirCurrent = this.dirNew || this.dirCurrent;
            let child: ƒ.Node = this.head;
            let cmpPrev: ƒ.ComponentTransform = child.getComponent(ƒ.ComponentTransform);  // Create a new cmp transform and store the information of the first childs transform
            let mtxHead: ƒ.Matrix4x4;  // Create a new matrix and store the information of the child

            while (true) {
                mtxHead = cmpPrev.local.copy;
                mtxHead.translate(this.dirCurrent);
                let cubeCorner: ƒ.Vector3 = ƒ.Vector3.ONE(size);
                if (mtxHead.translation.isInsideCube(cubeCorner, ƒ.Vector3.SCALE(cubeCorner, -1)))
                    // if (Math.abs(mtxHead.translation.x) < 6 && Math.abs(mtxHead.translation.y) < 6 && Math.abs(mtxHead.translation.z) < 6)
                    break;
                this.rotate(ƒ.Vector3.Z(-90));
            }

            //mtxHead.translate(_direction);  // Add a translation (the vector 1,0,0) to the matrix so it will move

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

        /*
        public grow(): void {
            //let mesh: ƒ.MeshQuad = new ƒ.MeshQuad();    // Creaty empty mesh object
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let mtrSnakeColor: ƒ.Material = new ƒ.Material("SnakeColor", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("Red")));    // Create material and give it a white color
            let segment: ƒ.Node = new ƒ.Node("Segment");
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
            segment.addComponent(cmpMesh);
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.80));
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSnakeColor);
            segment.addComponent(cmpMaterial);
    
            segment.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.lastPos)));
    
            this.appendChild(segment);

        }
        */

        /*
        public set direction(_new: ƒ.Vector3) {

            if (this.dirCurrent.equals(ƒ.Vector3.SCALE(_new, -1))) {
                return;
            }

            this.dirNew = _new;
        }
        */
      
        public rotate(_rotation: ƒ.Vector3): void {

            if (this.turn) // turn has already been requested for next move
                return;

            this.turn = true;
            this.head.mtxLocal.rotate(_rotation);
        }

        public eat(): void {
            let posHead: ƒ.Vector3 = this.head.mtxLocal.translation;

            for (let item of items.getChildren()) {
                if (posHead.isInsideSphere(item.mtxLocal.translation, 0.5)) {
                    items.removeChild(item);
                    this.grow(1);
                }
            }
        }
    
        /*
        private createSegement(_segments: number): void {

            // let mesh: ƒ.MeshQuad = new ƒ.MeshQuad();    // Creaty empty mesh object
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let mtrSnakeColor: ƒ.Material = new ƒ.Material("SnakeColor", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("Red")));    // Create material and give it a white color
    
            // Create X segments - body parts for the snake
            for (let i: number = 0; i < _segments; i++) {

                let segment: ƒ.Node = new ƒ.Node("Segment");
        
                let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
                segment.addComponent(cmpMesh);
                cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.80));
        
                let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSnakeColor);
                segment.addComponent(cmpMaterial);
        
                segment.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-1 * i, 0, 0))));
        
                this.appendChild(segment);

            }

            this.head = this.getChildren()[0];
            let cosys: ƒAid.NodeCoordinateSystem = new ƒAid.NodeCoordinateSystem("ControlSystem");
            cosys.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(2))));
            this.head.addChild(cosys);
        }
        */

        private createSegment(_color: ƒ.Color = this.color): ƒ.Node {
            let segment: ƒ.Node = new ƒ.Node("Segment");

            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(Snake.mesh);
            segment.addComponent(cmpMesh);
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.8));

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrStandard);
            segment.addComponent(cmpMaterial);
            cmpMaterial.clrPrimary = _color;

            let mtxSegment: ƒ.Matrix4x4 = new ƒ.Matrix4x4();
            if (this.nChildren)
                mtxSegment = this.getChild(this.nChildren - 1).mtxLocal.copy;
            segment.addComponent(new ƒ.ComponentTransform(mtxSegment));

            return segment;
        }

        private grow(_nSegments: number, _color: ƒ.Color = this.color): void {
            // TODO: implement shrinking
            if (_nSegments < 0)
                return;

            for (let i: number = 0; i < _nSegments; i++) {
                let segment: ƒ.Node = this.createSegment(_color);
                this.appendChild(segment);
            }
        }
    }
}