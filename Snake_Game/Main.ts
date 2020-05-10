namespace Snake_Game {
    import ƒ = FudgeCore;
  
    window.addEventListener("load", hndLoad);
    export let viewport: ƒ.Viewport;

    let snakeGame: ƒ.Node = new ƒ.Node("SnakeGame");

    export let snake: Snake;
    export let snakeFood: SnakeFood;

    let direction: ƒ.Vector3 = new ƒ.Vector3(1, 0, 0);

    let snakePrevSegment: ƒ.Matrix4x4;

    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();

    //let snakeGame: ƒ.Node;
    // Test

  
    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        
        snake = new Snake();
        snakeFood = new SnakeFood();

        snakeGame.appendChild(snake);
        snakeGame.appendChild(snakeFood);
        //snakePrevSegment = snake.getChildren()[0].mtxWorld;
    
        cmpCamera.pivot.translateZ(20);
        cmpCamera.pivot.translateY(-26);
        cmpCamera.pivot.rotateY(180);
        cmpCamera.pivot.rotateX(-45);

        createGround();

        document.addEventListener("keydown", keyPressed);

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", snakeGame, cmpCamera, canvas);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 1);
    }

    function update(_event: ƒ.Eventƒ): void {

        snake.move(direction);
        snakeFood.checkIfFoodWasEaten();
        viewport.draw();

        /*
        if (snake.getChildren()[0].mtxWorld.translation.x < 0) {

            //cmpCamera.pivot = ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 20, -25));
            //cmpCamera.pivot.lookAt(new ƒ.Vector3(0, 0, 0));
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, -26, 20)));
            cmpCamera.pivot.rotateX(45);
            cmpCamera.pivot.rotateY(180);
        }
        */
        
        if (snake.getChildren()[0].mtxWorld.translation.x > 0 && snake.getChildren()[0].mtxWorld.translation.y < 0) {
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(15, -15, 11)));
            cmpCamera.pivot.rotateZ(45);
            cmpCamera.pivot.rotateY(180);
            cmpCamera.pivot.rotateX(-50);
        }

        if (snake.getChildren()[0].mtxWorld.translation.x > 0 && snake.getChildren()[0].mtxWorld.translation.y > 0) {
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(15, 15, 11)));
            cmpCamera.pivot.rotateZ(135);
            cmpCamera.pivot.rotateY(180);
            cmpCamera.pivot.rotateX(-50);
        }

        if (snake.getChildren()[0].mtxWorld.translation.x < 0 && snake.getChildren()[0].mtxWorld.translation.y > 0) {
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-15, 15, 11)));
            cmpCamera.pivot.rotateZ(225);
            cmpCamera.pivot.rotateY(180);
            cmpCamera.pivot.rotateX(-50);
        }

        if (snake.getChildren()[0].mtxWorld.translation.x < 0 && snake.getChildren()[0].mtxWorld.translation.y < 0) {
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-15, -15, 11)));
            cmpCamera.pivot.rotateZ(315);
            cmpCamera.pivot.rotateY(180);
            cmpCamera.pivot.rotateX(-50);
        }
        
        /*
        if (snake.getChildren()[0].mtxWorld.translation.x < -3) {

            //cmpCamera.pivot = ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 20, -25));
            //cmpCamera.pivot.lookAt(new ƒ.Vector3(0, 0, 0));
            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-26, 0, 20)));
            //cmpCamera.pivot.rotateX(45);
            cmpCamera.pivot.rotateX(0);
            cmpCamera.pivot.rotateY(135);
            cmpCamera.pivot.rotateZ(90);
            //cmpCamera.pivot.rotateX(-5);
            //cmpCamera.pivot.rotateZ(90);
            //cmpCamera.pivot.rotateX(90);
            //cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        }

        if (snake.getChildren()[0].mtxWorld.translation.x > 3) {

            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(26, 0, 20)));
            cmpCamera.pivot.rotateX(0);
            cmpCamera.pivot.rotateY(225);
            cmpCamera.pivot.rotateZ(270);

        }

        if (snake.getChildren()[0].mtxWorld.translation.y < -3) {

            cmpCamera.pivot.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, -26, 20)));
            cmpCamera.pivot.rotateX(45);
            cmpCamera.pivot.rotateY(180);
            cmpCamera.pivot.rotateZ(0);

        }
        */
        
    }

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

    function createGround (): void {
        let ground1: ƒ.Node = new ƒ.Node("GroundCube_1");
        let ground2: ƒ.Node = new ƒ.Node("GroundCube_2");
        let ground3: ƒ.Node = new ƒ.Node("CenterCube_3");
        let ground4: ƒ.Node = new ƒ.Node("CenterCube_4");

        let ground5: ƒ.Node = new ƒ.Node("CenterCube_5");

        let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
        let mtrSolidSkyGrey: ƒ.Material = new ƒ.Material("SolidGrey", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("DIMGRAY")));
        let mtrSolidSkyGrey2: ƒ.Material = new ƒ.Material("SolidGrey", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("SLATEGRAY")));
        let mtrSolidSkyGrey3: ƒ.Material = new ƒ.Material("SolidGrey", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("midnightblue")));

        let cmpMesh1: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
        let cmpMesh2: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
        let cmpMesh3: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);
        let cmpMesh4: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);

        let cmpMesh5: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshCube);

        let cmpMaterial1: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey);
        let cmpMaterial2: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey);
        let cmpMaterial3: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey2);
        let cmpMaterial4: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey2);

        let cmpMaterial5: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(mtrSolidSkyGrey3);

        cmpMesh1.pivot.scale(new ƒ.Vector3(10.5, 10.5, 1));
        cmpMesh2.pivot.scale(new ƒ.Vector3(10.5, 10.5, 1));
        cmpMesh3.pivot.scale(new ƒ.Vector3(10.5, 10.5, 1));
        cmpMesh4.pivot.scale(new ƒ.Vector3(10.5, 10.5, 1));

        cmpMesh5.pivot.scale(new ƒ.Vector3(21, 21, 38.5));

        ground1.addComponent(cmpMaterial1);
        ground1.addComponent(cmpMesh1);
        ground2.addComponent(cmpMaterial2);
        ground2.addComponent(cmpMesh2);
        ground3.addComponent(cmpMaterial3);
        ground3.addComponent(cmpMesh3);
        ground4.addComponent(cmpMaterial4);
        ground4.addComponent(cmpMesh4);

        ground5.addComponent(cmpMaterial5);
        ground5.addComponent(cmpMesh5);

        ground1.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(5.25, 5.25, -1))));
        ground2.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-5.25, -5.25, -1))));
        ground3.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(5.25, -5.25, -1))));
        ground4.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-5.25, 5.25, -1))));

        ground5.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 0, -20.5))));

        snakeGame.appendChild(ground1);
        snakeGame.appendChild(ground2);
        snakeGame.appendChild(ground3);
        snakeGame.appendChild(ground4);

        snakeGame.appendChild(ground5);
    }
}