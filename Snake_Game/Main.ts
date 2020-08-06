namespace Snake_Game {

    //#region Import Fudge
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    //#endregion

    window.addEventListener("load", hndLoad);

    //#region Export Attributes
    export let size: number = 7;
    export let viewport: ƒ.Viewport;
    export let mtrStandard: ƒ.Material = new ƒ.Material("Cube", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("white")));
    export let items: ƒ.Node;
    //#endregion

    //#region Attributes
    let snake: Snake;
    let enemy: Enemy;
    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    let backgroundColor: string = "lightblue";
    let mainCubeColor: string = "lightgreen";
    let snakeFoodColor: string = "cyan";
    //#endregion

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        //#region Create Basic Objects for the Game
        let graph: ƒ.Node = new ƒ.Node("Game"); // Create main node

        snake = new Snake();    // Player
        graph.addChild(snake);

        enemy = new Enemy();
        graph.addChild(enemy);

        items = new ƒ.Node("Items");
        graph.addChild(items);

        // Place everywhere food for the snake
        for (let i: number = 0; i < 20; i++) {
            placeFood();
        }
        //#endregion

        let cube: ƒAid.Node = new ƒAid.Node(
            "Cube", ƒ.Matrix4x4.SCALING(ƒ.Vector3.ONE(2 * size - 1)),
            mtrStandard,
            new ƒ.MeshCube()
        );

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
        
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        ƒ.Debug.log(viewport);

        document.addEventListener("keydown", control);

        //createGround();

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 2);
    }

    function update(_event: ƒ.Eventƒ): void {
        
        console.log("X: " + snake.head.mtxWorld.translation.x);
        console.log("Y: " + snake.head.mtxWorld.translation.y);
        console.log("Z: " + snake.head.mtxWorld.translation.z);
        

        snake.move();
        snake.eat();
        
        enemy.move();
        enemy.eat();
        
        //moveCamera();
        //snakeFood.checkIfFoodWasEaten();
        viewport.draw();

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

    function moveCamera(): void {

        let mtxHead: ƒ.Matrix4x4 = snake.head.mtxLocal;
        let posCamera: ƒ.Vector3 = mtxHead.translation;
        posCamera.normalize(30);
        viewport.camera.pivot.translation = posCamera;
        let up: ƒ.Vector3 = ƒ.Vector3.X();
        up.transform(mtxHead, false);
        viewport.camera.pivot.lookAt(ƒ.Vector3.ZERO());
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

    function control(_event: KeyboardEvent): void {

        let rotation: ƒ.Vector3 = ƒ.Vector3.ZERO();

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

    function placeFood(): void {

        let position: ƒ.Vector3 = new ƒ.Vector3(
            ƒ.Random.default.getRangeFloored(-size, size),
            ƒ.Random.default.getRangeFloored(-size, size),
            ƒ.Random.default.getSign() * size
        );

        position.shuffle();
        let food: ƒAid.Node = new ƒAid.Node("Food", ƒ.Matrix4x4.TRANSLATION(position), mtrStandard, new ƒ.MeshCube());
        food.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS(snakeFoodColor);
        items.addChild(food);
    }

    
    function createGround (): void {
        /*
        let ground1: ƒ.Node = new ƒ.Node("GroundCube_1");
        let ground2: ƒ.Node = new ƒ.Node("GroundCube_2");
        let ground3: ƒ.Node = new ƒ.Node("CenterCube_3");
        let ground4: ƒ.Node = new ƒ.Node("CenterCube_4");
        */

        let mainGround: ƒ.Node = new ƒ.Node("MainGround");

        let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
        let mtrColor: ƒ.Material = new ƒ.Material("GroundColor", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("Cyan")));
        //let mtrSolidSkyGrey2: ƒ.Material = new ƒ.Material("SolidGrey", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("SLATEGRAY")));
        //let mtrSolidSkyGrey3: ƒ.Material = new ƒ.Material("SolidGrey", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("midnightblue")));

        let cmpMesh1: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
        let cmpMesh2: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
        let cmpMesh3: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
        let cmpMesh4: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);

        let cmpMesh5: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);

        /*
        let cmpMaterial1: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey);
        let cmpMaterial2: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey);
        let cmpMaterial3: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey2);
        let cmpMaterial4: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey2);
        */

        let cmpMaterialMainGround: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrColor);

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
}