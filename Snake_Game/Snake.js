"use strict";
var Snake_Game;
(function (Snake_Game) {
    var ƒ = FudgeCore;
    class Snake extends ƒ.Node {
        constructor() {
            super("Snake");
            this.direction = ƒ.Vector3.X(); // Create a new 1,0,0 vector
            console.log("Creating Snake");
            this.createSegement(4);
        }
        move(_direction) {
            let child = this.getChildren()[0]; // Create a new node and store the information of the first child from the snake
            let cmpPrev = child.getComponent(ƒ.ComponentTransform); // Create a new cmp transform and store the information of the first childs transform
            let mtxHead = cmpPrev.local.copy; // Create a new matrix and store the information of the child
            mtxHead.translate(_direction); // Add a translation (the vector 1,0,0) to the matrix so it will move
            let cmpNew = new ƒ.ComponentTransform(mtxHead); // Create a new cmp transform and store the matrix with the added movement
            // Search each child object in the snake
            for (let segment of this.getChildren()) {
                cmpPrev = segment.getComponent(ƒ.ComponentTransform); // Store the transform from the current child
                segment.removeComponent(cmpPrev); // Remove the old component
                segment.addComponent(cmpNew); // Add the new component which is a transform and has the added movement
                cmpNew = cmpPrev;
                this.lastPos = cmpPrev.local.translation;
            }
        }
        grow() {
            //let mesh: ƒ.MeshQuad = new ƒ.MeshQuad();    // Creaty empty mesh object
            let meshCube = new ƒ.MeshCube();
            let mtrSolidWhite = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE"))); // Create material and give it a white color
            let segment = new ƒ.Node("Segment");
            let cmpMesh = new ƒ.ComponentMesh(meshCube);
            segment.addComponent(cmpMesh);
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.80));
            let cmpMaterial = new ƒ.ComponentMaterial(mtrSolidWhite);
            segment.addComponent(cmpMaterial);
            segment.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.lastPos)));
            this.appendChild(segment);
        }
        createSegement(_segments) {
            // let mesh: ƒ.MeshQuad = new ƒ.MeshQuad();    // Creaty empty mesh object
            let meshCube = new ƒ.MeshCube();
            let mtrSolidWhite = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE"))); // Create material and give it a white color
            // Create X segments - body parts for the snake
            for (let i = 0; i < _segments; i++) {
                let segment = new ƒ.Node("Segment");
                let cmpMesh = new ƒ.ComponentMesh(meshCube);
                segment.addComponent(cmpMesh);
                cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.80));
                let cmpMaterial = new ƒ.ComponentMaterial(mtrSolidWhite);
                segment.addComponent(cmpMaterial);
                segment.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-1 * i, 0, 0))));
                this.appendChild(segment);
            }
        }
    }
    Snake_Game.Snake = Snake;
})(Snake_Game || (Snake_Game = {}));
//# sourceMappingURL=Snake.js.map