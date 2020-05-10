namespace Snake_Game {
    import ƒ = FudgeCore;

    export class SnakeFood extends ƒ.Node {

        constructor() {
            super("SnakeFood");
            console.log("Creating Snakefood");
            this.createSnakeFood();
        }

        public checkIfFoodWasEaten(): void {

            if (snakeFood.cmpTransform.local.translation.x  == snake.getChildren()[0].cmpTransform.local.translation.x && snakeFood.cmpTransform.local.translation.y == snake.getChildren()[0].cmpTransform.local.translation.y) {
                
                snake.grow();
                
                let max: number = 10;
                let min: number = -10;

                let randomXPos: number = Math.floor(Math.random() * (max - min + 1)) + min;
                let randomYPos: number = Math.floor(Math.random() * (max - min + 1)) + min;

                let sameSpot: boolean = true;
                
                while (sameSpot) {
                    console.log("While started.");
                    
                    randomXPos = Math.floor(Math.random() * (max - min + 1)) + min;
                    randomYPos = Math.floor(Math.random() * (max - min + 1)) + min;
                    
                    for (let segment of snake.getChildren()) {
                        
                        if (randomXPos == segment.cmpTransform.local.translation.x && randomYPos == segment.cmpTransform.local.translation.y) {
                            console.log("SAME SPOT");
                            sameSpot = true;
                            break;
                        } else {
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

                let cmpPrevTransform: ƒ.ComponentTransform = this.getComponent(ƒ.ComponentTransform);
                let cmpNewTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(randomXPos, randomYPos, 0)));

                //this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(randomXPos, randomYPos, 0))));
                this.removeComponent(cmpPrevTransform);
                this.addComponent(cmpNewTransform);
                //ƒ.ComponentTransform()
                //snakeFood.cmpTransform.local.translation.x = randomXPos;
                //snakeFood.cmpTransform.local.translation.y = randomYPos;
            }
        }

        private createSnakeFood(): void {

            //let mesh: ƒ.MeshQuad = new ƒ.MeshQuad();    // Creaty empty mesh object
            let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let mtrSolidSkyBlue: ƒ.Material = new ƒ.Material("SolidSkyBlue", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("DEEPSKYBLUE")));    // Create material and give it a white color

    
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
            this.addComponent(cmpMesh);

            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.80));
    
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyBlue);
            this.addComponent(cmpMaterial);

            let sameSpot: boolean;

            let max: number = 10;
            let min: number = -10;

            let randomXPos: number = Math.floor(Math.random() * (max - min + 1)) + min;
            let randomYPos: number = Math.floor(Math.random() * (max - min + 1)) + min;

            console.log(snake.getChildren()[1].cmpTransform.local.translation.x);
            

            for (let segment of snake.getChildren()) {
                if (randomXPos == segment.cmpTransform.local.translation.x && randomYPos == segment.cmpTransform.local.translation.y) {
                    
                    sameSpot = true;

                    while (sameSpot) {

                        randomXPos = Math.floor(Math.random() * (max - min + 1)) + min;
                        randomYPos = Math.floor(Math.random() * (max - min + 1)) + min;
                        
                        if (randomXPos == segment.cmpTransform.local.translation.x && randomYPos == segment.cmpTransform.local.translation.y) {
                            sameSpot = true;
                        } else {
                            sameSpot = false;
                        }

                    }
                    
                } else {
                    sameSpot = false;
                }
            }
    
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(randomXPos, randomYPos, 0))));
        }
    }
}