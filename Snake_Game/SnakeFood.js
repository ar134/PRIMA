"use strict";
var Snake_Game;
(function (Snake_Game) {
    var ƒ = FudgeCore;
    class SnakeFood extends ƒ.Node {
        constructor() {
            super("SnakeFood");
            console.log("Creating Snakefood");
            this.createSnakeFood();
        }
        checkIfFoodWasEaten() {
            if (Snake_Game.snakeFood.cmpTransform.local.translation.x == Snake_Game.snake.getChildren()[0].cmpTransform.local.translation.x && Snake_Game.snakeFood.cmpTransform.local.translation.y == Snake_Game.snake.getChildren()[0].cmpTransform.local.translation.y) {
                Snake_Game.snake.grow();
                let max = 10;
                let min = -10;
                let randomXPos = Math.floor(Math.random() * (max - min + 1)) + min;
                let randomYPos = Math.floor(Math.random() * (max - min + 1)) + min;
                let sameSpot = true;
                while (sameSpot) {
                    console.log("While started.");
                    randomXPos = Math.floor(Math.random() * (max - min + 1)) + min;
                    randomYPos = Math.floor(Math.random() * (max - min + 1)) + min;
                    for (let segment of Snake_Game.snake.getChildren()) {
                        if (randomXPos == segment.cmpTransform.local.translation.x && randomYPos == segment.cmpTransform.local.translation.y) {
                            console.log("SAME SPOT");
                            sameSpot = true;
                            break;
                        }
                        else {
                            sameSpot = false;
                        }
                    }
                }
                console.log(randomXPos);
                console.log(randomYPos);
                /*
                for (let segment of snake.getChildren()) {
                    
                    if (randomXPos == segment.cmpTransform.local.translation.x || randomYPos == segment.cmpTransform.local.translation.y) {
                        
                        sameSpot = true;

                        while (sameSpot) {

                            randomXPos = Math.floor(Math.random() * (max - min + 1)) + min;
                            randomYPos = Math.floor(Math.random() * (max - min + 1)) + min;
                            
                            if (randomXPos == segment.cmpTransform.local.translation.x || randomYPos == segment.cmpTransform.local.translation.y) {
                                sameSpot = true;
                            } else {
                                sameSpot = false;
                            }

                        }
                        
                    }
                }
                */
                let cmpPrevTransform = this.getComponent(ƒ.ComponentTransform);
                let cmpNewTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(randomXPos, randomYPos, 0)));
                //this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(randomXPos, randomYPos, 0))));
                this.removeComponent(cmpPrevTransform);
                this.addComponent(cmpNewTransform);
                //ƒ.ComponentTransform()
                //snakeFood.cmpTransform.local.translation.x = randomXPos;
                //snakeFood.cmpTransform.local.translation.y = randomYPos;
            }
        }
        createSnakeFood() {
            //let mesh: ƒ.MeshQuad = new ƒ.MeshQuad();    // Creaty empty mesh object
            let meshCube = new ƒ.MeshCube();
            let mtrSolidSkyBlue = new ƒ.Material("SolidSkyBlue", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("DEEPSKYBLUE"))); // Create material and give it a white color
            let cmpMesh = new ƒ.ComponentMesh(meshCube);
            this.addComponent(cmpMesh);
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.80));
            let cmpMaterial = new ƒ.ComponentMaterial(mtrSolidSkyBlue);
            this.addComponent(cmpMaterial);
            let sameSpot;
            let max = 10;
            let min = -10;
            let randomXPos = Math.floor(Math.random() * (max - min + 1)) + min;
            let randomYPos = Math.floor(Math.random() * (max - min + 1)) + min;
            console.log(Snake_Game.snake.getChildren()[1].cmpTransform.local.translation.x);
            for (let segment of Snake_Game.snake.getChildren()) {
                if (randomXPos == segment.cmpTransform.local.translation.x && randomYPos == segment.cmpTransform.local.translation.y) {
                    sameSpot = true;
                    while (sameSpot) {
                        randomXPos = Math.floor(Math.random() * (max - min + 1)) + min;
                        randomYPos = Math.floor(Math.random() * (max - min + 1)) + min;
                        if (randomXPos == segment.cmpTransform.local.translation.x && randomYPos == segment.cmpTransform.local.translation.y) {
                            sameSpot = true;
                        }
                        else {
                            sameSpot = false;
                        }
                    }
                }
                else {
                    sameSpot = false;
                }
            }
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(randomXPos, randomYPos, 0))));
        }
    }
    Snake_Game.SnakeFood = SnakeFood;
})(Snake_Game || (Snake_Game = {}));
//# sourceMappingURL=SnakeFood.js.map