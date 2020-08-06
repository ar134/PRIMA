"use strict";
var Snake_Game;
(function (Snake_Game) {
    //#region Import Fudge
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    //#endregion
    window.addEventListener("load", hndLoad);
    //#region Export Attributes
    Snake_Game.size = 7;
    Snake_Game.mtrStandard = new ƒ.Material("Cube", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("white")));
    //#endregion
    //#region Attributes
    let snake;
    let enemy;
    let cmpCamera = new ƒ.ComponentCamera();
    let backgroundColor = "lightblue";
    let mainCubeColor = "lightgreen";
    let snakeFoodColor = "cyan";
    //#endregion
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        //#region Create Basic Objects for the Game
        let graph = new ƒ.Node("Game"); // Create main node
        snake = new Snake_Game.Snake(); // Player
        graph.addChild(snake);
        enemy = new Snake_Game.Enemy();
        graph.addChild(enemy);
        Snake_Game.items = new ƒ.Node("Items");
        graph.addChild(Snake_Game.items);
        // Place everywhere food for the snake
        for (let i = 0; i < 20; i++) {
            placeFood();
        }
        //#endregion
        let cube = new ƒAid.Node("Cube", ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(2 * Snake_Game.size - 1)), Snake_Game.mtrStandard, new ƒ.MeshCube());
        cube.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS(mainCubeColor);
        graph.addChild(cube);
        ƒAid.addStandardLightComponents(graph, new ƒ.Color(0.5, 0.5, 0.5));
        cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(50, 0, 0)));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        cmpCamera.backgroundColor = ƒ.Color.CSS(backgroundColor);
        //snakeFood = new SnakeFood();
        //snakeGame.appendChild(snake);
        //snakeGame.appendChild(snakeFood);
        //snakePrevSegment = snake.getChildren()[0].mtxWorld;
        /*
        cmpCamera.pivot.translateZ(20);
        cmpCamera.pivot.translateY(-26);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.pivot.rotateX(-45);
        */
        Snake_Game.viewport = new ƒ.Viewport();
        Snake_Game.viewport.initialize("Viewport", graph, cmpCamera, canvas);
        ƒ.Debug.log(Snake_Game.viewport);
        document.addEventListener("keydown", control);
        //createGround();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 2);
    }
    function update(_event) {
        console.log("X: " + snake.head.mtxWorld.translation.x);
        console.log("Y: " + snake.head.mtxWorld.translation.y);
        console.log("Z: " + snake.head.mtxWorld.translation.z);
        snake.move();
        snake.eat();
        enemy.move();
        enemy.eat();
        //moveCamera();
        //snakeFood.checkIfFoodWasEaten();
        Snake_Game.viewport.draw();
        /*
    if (snake.head.mtxWorld.translation.x == 7 && (snake.head.mtxWorld.translation.y < 7 || snake.head.mtxWorld.translation.y > -7) && (snake.head.mtxWorld.translation.z < 7 || snake.head.mtxWorld.translation.z > -7)) {
        cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(50, 0, 0)));
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
    }*/
        if (snake.head.mtxWorld.translation.x == 7) {
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(50, 0, 0)));
            cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        }
        if (snake.head.mtxWorld.translation.x == -7) {
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-50, 0, 0)));
            cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        }
        if (snake.head.mtxWorld.translation.z == 7) {
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 0, 50)));
            cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        }
        if (snake.head.mtxWorld.translation.z == -7) {
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 0, -50)));
            cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        }
        if (snake.head.mtxWorld.translation.y == 7) {
            console.log("Is at 7 Y");
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 50, 0)));
            cmpCamera.pivot.rotateX(90);
        }
        if (snake.head.mtxWorld.translation.y == -7) {
            console.log("Is at -7 Y");
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, -50, 0)));
            cmpCamera.pivot.rotateX(-90);
        }
    }
    function moveCamera() {
        let mtxHead = snake.head.mtxLocal;
        let posCamera = mtxHead.translation;
        posCamera.normalize(30);
        Snake_Game.viewport.camera.pivot.translation = posCamera;
        let up = ƒ.Vector3.X();
        up.transform(mtxHead, false);
        Snake_Game.viewport.camera.pivot.lookAt(ƒ.Vector3.ZERO());
    }
    /*
    function keyPressed(_event: KeyboardEvent): void {
        snakePrevSegment = snake.getChildren()[0].mtxWorld;

        switch (_event.code) {
            case ƒ.KEYBOARD_CODE.W:
                snakePrevSegment.translate(new ƒ.Vector3(0, 1, 0));
                if (snakePrevSegment.translation.y == snake.getChildren()[1].mtxWorld.translation.y) {
                    break;
                }
                direction = new ƒ.Vector3(0, 1, 0);
                break;
            case ƒ.KEYBOARD_CODE.S:
                snakePrevSegment.translate(new ƒ.Vector3(0, -1, 0));
                if (snakePrevSegment.translation.y == snake.getChildren()[1].mtxWorld.translation.y) {
                    break;
                }
                direction = new ƒ.Vector3(0, -1, 0);
                break;
            case ƒ.KEYBOARD_CODE.A:
                snakePrevSegment.translate(new ƒ.Vector3(-1, 0, 0));
                if (snakePrevSegment.translation.x == snake.getChildren()[1].mtxWorld.translation.x) {
                    break;
                }
                direction = new ƒ.Vector3(-1, 0, 0);
                break;
            case ƒ.KEYBOARD_CODE.D:
                snakePrevSegment.translate(new ƒ.Vector3(1, 0, 0));
                if (snakePrevSegment.translation.x == snake.getChildren()[1].mtxWorld.translation.x) {
                    break;
                }
                direction = new ƒ.Vector3(1, 0, 0);
                break;
        }
    }
    */
    function control(_event) {
        let rotation = ƒ.Vector3.ZERO();
        switch (_event.code) {
            case ƒ.KEYBOARD_CODE.ARROW_RIGHT:
                rotation = ƒ.Vector3.Y(-90);
                break;
            case ƒ.KEYBOARD_CODE.ARROW_LEFT:
                rotation = ƒ.Vector3.Y(90);
                break;
            case ƒ.KEYBOARD_CODE.SPACE:
                rotation = ƒ.Vector3.Z(-90);
                break;
            default:
                return;
        }
        snake.rotate(rotation);
    }
    function placeFood() {
        let position = new ƒ.Vector3(ƒ.Random.default.getRangeFloored(-Snake_Game.size, Snake_Game.size), ƒ.Random.default.getRangeFloored(-Snake_Game.size, Snake_Game.size), ƒ.Random.default.getSign() * Snake_Game.size);
        position.shuffle();
        let food = new ƒAid.Node("Food", ƒ.Matrix4x4.TRANSLATION(position), Snake_Game.mtrStandard, new ƒ.MeshCube());
        food.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS(snakeFoodColor);
        Snake_Game.items.addChild(food);
    }
    function createGround() {
        /*
        let ground1: ƒ.Node = new ƒ.Node("GroundCube_1");
        let ground2: ƒ.Node = new ƒ.Node("GroundCube_2");
        let ground3: ƒ.Node = new ƒ.Node("CenterCube_3");
        let ground4: ƒ.Node = new ƒ.Node("CenterCube_4");
        */
        let mainGround = new ƒ.Node("MainGround");
        let meshCube = new ƒ.MeshCube();
        let mtrColor = new ƒ.Material("GroundColor", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("Cyan")));
        //let mtrSolidSkyGrey2: ƒ.Material = new ƒ.Material("SolidGrey", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("SLATEGRAY")));
        //let mtrSolidSkyGrey3: ƒ.Material = new ƒ.Material("SolidGrey", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("midnightblue")));
        let cmpMesh1 = new ƒ.ComponentMesh(meshCube);
        let cmpMesh2 = new ƒ.ComponentMesh(meshCube);
        let cmpMesh3 = new ƒ.ComponentMesh(meshCube);
        let cmpMesh4 = new ƒ.ComponentMesh(meshCube);
        let cmpMesh5 = new ƒ.ComponentMesh(meshCube);
        /*
        let cmpMaterial1: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey);
        let cmpMaterial2: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey);
        let cmpMaterial3: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey2);
        let cmpMaterial4: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey2);
        */
        let cmpMaterialMainGround = new ƒ.ComponentMaterial(mtrColor);
        cmpMesh1.pivot.scale(new ƒ.Vector3(10.5, 10.5, 1));
        cmpMesh2.pivot.scale(new ƒ.Vector3(10.5, 10.5, 1));
        cmpMesh3.pivot.scale(new ƒ.Vector3(10.5, 10.5, 1));
        cmpMesh4.pivot.scale(new ƒ.Vector3(10.5, 10.5, 1));
        cmpMesh5.pivot.scale(new ƒ.Vector3(21, 21, 38.5));
        /*
        ground1.addComponent(cmpMaterial1);
        ground1.addComponent(cmpMesh1);
        ground2.addComponent(cmpMaterial2);
        ground2.addComponent(cmpMesh2);
        ground3.addComponent(cmpMaterial3);
        ground3.addComponent(cmpMesh3);
        ground4.addComponent(cmpMaterial4);
        ground4.addComponent(cmpMesh4);
        */
        mainGround.addComponent(cmpMaterialMainGround);
        mainGround.addComponent(cmpMesh5);
        /*
        ground1.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(5.25, 5.25, -1))));
        ground2.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-5.25, -5.25, -1))));
        ground3.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(5.25, -5.25, -1))));
        ground4.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-5.25, 5.25, -1))));
        */
        mainGround.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 0, -20.5))));
        /*
        snakeGame.appendChild(ground1);
        snakeGame.appendChild(ground2);
        snakeGame.appendChild(ground3);
        snakeGame.appendChild(ground4);
        */
        //snakeGame.appendChild(mainGround);
    }
})(Snake_Game || (Snake_Game = {}));
//# sourceMappingURL=Main.js.map