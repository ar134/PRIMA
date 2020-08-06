"use strict";
var TowerDefenseGame;
(function (TowerDefenseGame) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("load", hndLoad);
    let towerDefenseGame = new ƒ.Node("TowerDefenseGame");
    let gameField = new ƒ.Node("GameField");
    TowerDefenseGame.enemiesNode = new ƒ.Node("Enemies");
    let worldWidth;
    let worldHeight;
    TowerDefenseGame.framerate = 30;
    let enemySpawnTime = 1; // Enemy spawn time in seconds
    let moneyPeriod = 1; // How many times money is earned per second
    let moneyTimeout = 0;
    let resourcePos = new ƒ.Vector2();
    let resourceAmount = 50;
    let curPathPos = new ƒ.Vector2();
    TowerDefenseGame.money = 5000;
    let enemyTimeout = 0;
    let moneyCounterObject;
    let baseHPCounterObject;
    let buildingConstructedNumber = 0;
    let moneyBuildings = 0;
    let science1exists = false;
    let science2exists = false;
    let tower3field;
    let tower4field;
    let resource2field;
    let science2field;
    let restartMenu;
    let lastPos;
    let curPos = new ƒ.Vector2();
    let lastBlockPos;
    let tmpMatColor;
    let sameBlock = true;
    let currentTowerRange;
    let attackRangeObj;
    let allowdToBuildOnThisSpot;
    TowerDefenseGame.baseHP = 3000;
    //let tower3field: HTMLElement = document.getElementById("tower_3");
    TowerDefenseGame.towers = [];
    //export let enemies: Enemy[] = [];
    TowerDefenseGame.enemies = [];
    let obstaclePos;
    obstaclePos = [];
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        moneyCounterObject = document.querySelector("#moneyValue");
        baseHPCounterObject = document.querySelector("#baseHPValue");
        TowerDefenseGame.viewport = new ƒ.Viewport();
        //let tower3field = document.getElementsByClassName("tower_3") as HTMLCollectionOf<HTMLElement>;
        let restartGame = document.getElementById("restartButton");
        let buildtower1 = document.getElementById("button_build_tower_1");
        let buildtower2 = document.getElementById("button_build_tower_2");
        let buildtower3 = document.getElementById("button_build_tower_3");
        let buildtower4 = document.getElementById("button_build_tower_4");
        restartMenu = document.getElementById("gameOverMenu");
        tower3field = document.getElementById("tower_3");
        tower4field = document.getElementById("tower_4");
        resource2field = document.getElementById("resource_2");
        science2field = document.getElementById("science_2");
        let buildRessource1 = document.getElementById("button_build_ressource_1");
        let buildRessource2 = document.getElementById("button_build_ressource_2");
        let buildScience1 = document.getElementById("button_build_science_1");
        let buildScience2 = document.getElementById("button_build_science_2");
        restartGame.addEventListener("click", () => restartTheGame());
        buildtower1.addEventListener("click", () => build(1, 100));
        buildtower2.addEventListener("click", () => build(2, 100));
        buildtower3.addEventListener("click", () => build(3, 250));
        buildtower4.addEventListener("click", () => build(4, 500));
        buildRessource1.addEventListener("click", () => build(5, 100));
        buildRessource2.addEventListener("click", () => build(6, 500));
        buildScience1.addEventListener("click", () => build(7, 200));
        buildScience2.addEventListener("click", () => build(8, 1000));
        worldWidth = Math.floor(Math.random() * 12) + 8;
        worldHeight = Math.floor(Math.random() * 12) + 8;
        towerDefenseGame.addChild(gameField);
        towerDefenseGame.addChild(TowerDefenseGame.enemiesNode);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(worldWidth / 2, worldHeight / 2, 40));
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = ƒ.Color.CSS("DarkSlateGray");
        TowerDefenseGame.viewport.initialize("Viewport", towerDefenseGame, cmpCamera, canvas);
        ƒAid.addStandardLightComponents(towerDefenseGame, new ƒ.Color(0.5, 0.5, 0.5));
        TowerDefenseGame.viewport.draw();
        //mousePos = new ƒ.EventPointer(ƒ.EVENT_POINTER.MOVE, moveMove());
        TowerDefenseGame.viewport.addEventListener("\u0192pointermove" /* MOVE */, pointerMove);
        TowerDefenseGame.viewport.addEventListener("\u0192pointerdown" /* DOWN */, mousePressed);
        TowerDefenseGame.viewport.addEventListener("\u0192pointerenter" /* ENTER */, mouseEnter);
        TowerDefenseGame.viewport.addEventListener("\u0192pointerleave" /* LEAVE */, mouseLeave);
        document.addEventListener("keydown", keyPressed);
        TowerDefenseGame.viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        TowerDefenseGame.viewport.activatePointerEvent("\u0192pointerdown" /* DOWN */, true);
        TowerDefenseGame.viewport.activatePointerEvent("\u0192pointerup" /* UP */, true);
        createWorld(worldWidth, worldHeight);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, TowerDefenseGame.framerate);
    }
    function update(_event) {
        baseHPCounterObject.textContent = "Base HP: " + TowerDefenseGame.baseHP;
        if (TowerDefenseGame.baseHP <= 0) {
            console.log("Game Lost!");
            restartMenu.style.display = "flex";
            return;
        }
        // Moves each enemy that exists
        for (let enemy of TowerDefenseGame.enemies) {
            enemy.move();
        }
        if (TowerDefenseGame.towers != null) {
            for (let tower of TowerDefenseGame.towers) {
                if (TowerDefenseGame.enemiesNode != null) {
                    tower.followEnemy();
                }
            }
        }
        if (science1exists) {
            tower3field.style.opacity = "1";
            science2field.style.opacity = "1";
        }
        if (science2exists) {
            tower4field.style.opacity = "1";
            resource2field.style.opacity = "1";
        }
        if (moneyBuildings > 0) {
            moneyTimeout++;
            if (moneyTimeout > (TowerDefenseGame.framerate / moneyPeriod)) {
                for (let i = 0; i < moneyBuildings; i++) {
                    if (resourceAmount > 0) {
                        TowerDefenseGame.money = TowerDefenseGame.money + 5;
                        console.log(resourceAmount);
                        resourceAmount = resourceAmount - 5;
                    }
                }
                moneyTimeout = 0;
            }
        }
        enemyTimeout++;
        if (enemyTimeout == TowerDefenseGame.framerate * enemySpawnTime) {
            //destroyEnemy(enemies.getChild(0));
            //enemies.removeChild(enemies.getChild(0));
            spawnEnemy(1);
            enemyTimeout = 0;
        }
        moneyCounterObject.textContent = "$ " + TowerDefenseGame.money;
        TowerDefenseGame.viewport.draw();
    }
    function pointerMove(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        if (buildingConstructedNumber == 0) {
            return;
        }
        lastPos = curPos;
        //let rayEnd: ƒ.Vector3 = convertClientToRay(posMouse);
        //console.log(viewport.getGraph);
        /*
        let lastPickData: PickData;
        let lastPickedNode: ƒ.Node;
        let lastPickedMat: ƒ.ComponentMaterial = new ƒ.ComponentMaterial;
        */
        /*
        let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
        let markNode: ƒAid.Node = new ƒAid.Node("Mark Node", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.2)), createMat("Red"), meshCube);
        let baseMeshCmp: ƒ.ComponentMesh = markNode.getComponent(ƒ.ComponentMesh);
        baseMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 0.1));

        viewport.getGraph().addChild(markNode);
        */
        // Check each field in the game and place a building on the clicked spot if something is ready to be placed
        for (let fieldsX of TowerDefenseGame.fields) {
            for (let field of fieldsX) {
                let cmpPicker = field.getComponent(TowerDefenseGame.ComponentPicker);
                let pickData = cmpPicker.pick(posMouse);
                // Check if a cmp picker exists on this spot
                if (pickData) {
                    curPos = new ƒ.Vector2(field.mtxLocal.translation.x, field.mtxLocal.translation.x);
                    moveNodeFromTo(attackRangeObj, field.mtxLocal.translation.x, field.mtxLocal.translation.y);
                    attackRangeObj.mtxLocal.scale(new ƒ.Vector3(currentTowerRange, currentTowerRange, 0.1));
                    if (curPos != lastPos) {
                        sameBlock = false;
                    }
                    else {
                        sameBlock = true;
                    }
                    if (!sameBlock) {
                        if (lastBlockPos != null) {
                            TowerDefenseGame.fields[lastBlockPos.x][lastBlockPos.y].getComponent(ƒ.ComponentMaterial).material = tmpMatColor;
                        }
                    }
                    tmpMatColor = field.getComponent(ƒ.ComponentMaterial).material;
                    // Check if build spot is a path
                    checkIfAllowedToBuildOnThisSpot(field);
                    if (allowdToBuildOnThisSpot) {
                        field.getComponent(ƒ.ComponentMaterial).material = createMat("GreenYellow");
                    }
                    else {
                        field.getComponent(ƒ.ComponentMaterial).material = createMat("red");
                    }
                    //console.log(tmpMatColor.name);
                    //let markNode: ƒ.Node = new ƒ.Node("markNode");
                    //let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(_xPos, _yPos, 0)));
                    //markNode.getComponent(ƒ.ComponentTransform).transform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(field.mtxWorld.translation.x, field.mtxWorld.translation.y, 0)));
                    //moveNodeFromTo(markNode, new ƒ.Vector3(field.mtxWorld.translation.x, field.mtxWorld.translation.y, 0));
                    //markNode.addComponent(new ComponentPicker(0.29));
                    /*
                    if (lastPickedNode != null) {
                        if (lastPickedNode.mtxLocal != field.mtxLocal) {
                            lastPickedNode.getComponent(ƒ.ComponentMaterial).material = createMat("blue");
                        }
                    }


                    //lastPickData = cmpPicker.pick(posMouse);
                    lastPickedNode = field;
                    lastPickedMat = field.getComponent(ƒ.ComponentMaterial);
                    field.getComponent(ƒ.ComponentMaterial).material = createMat("red");
                    */
                    lastBlockPos = new ƒ.Vector2(field.mtxLocal.translation.x, field.mtxLocal.translation.y);
                }
            }
        }
    }
    function checkIfAllowedToBuildOnThisSpot(_field) {
        for (let obstacle of obstaclePos) {
            if (obstacle.x == _field.cmpTransform.local.translation.x && obstacle.y == _field.cmpTransform.local.translation.y) {
                allowdToBuildOnThisSpot = false;
                return;
            }
            else {
                allowdToBuildOnThisSpot = true;
            }
        }
    }
    function mouseEnter(_event) {
        console.log("Mouse enter");
    }
    function mouseLeave(_event) {
        console.log("Test");
    }
    function restartTheGame() {
        window.location.reload();
        console.log("Restart Game");
    }
    // Core function to build something, tower or non combat building. Checks if the player has enough money to build something
    // building: type of building (1 - 8) | cost: how much money need to build it
    function build(building, cost) {
        // Check if no building is waiting to be placed
        if (buildingConstructedNumber == 0) {
            TowerDefenseGame.viewport.getGraph().appendChild(attackRangeObj);
            attackRangeObj.mtxLocal.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 0, -10)));
            switch (building) {
                case 1:
                    currentTowerRange = 5;
                    break;
                case 1:
                    currentTowerRange = 3;
                    break;
                case 1:
                    currentTowerRange = 4;
                    break;
                case 1:
                    currentTowerRange = 4;
                    break;
                default:
                    break;
            }
            // Check if player wants to build a science building he already has
            if (science1exists == true && building == 7) {
                console.log("Sciencebuilding 1 exists!");
                return;
            }
            if (science2exists == true && building == 8) {
                console.log("Sciencebuilding 2 exists!");
                return;
            }
            // Check if player is allowed to build this type of building
            if ((building == 8 || building == 3) && !science1exists) {
                console.log("Need first science building 1 to build this building!");
                return;
            }
            if ((building == 4 || building == 6) && !science2exists) {
                console.log("Need first science building 2 to build this building!");
                return;
            }
            // Check if the player can cover the cost with his current money
            if (TowerDefenseGame.money >= cost) {
                TowerDefenseGame.money = TowerDefenseGame.money - cost;
                buildingConstructedNumber = building;
                console.log("Bought " + building + " and is now ready to be placed.");
            }
            else {
                console.log("Not enough money for this building.");
            }
        }
        else {
            console.log("Finished building need to be placed first before another one can be build.");
        }
    }
    function keyPressed(_event) {
        if (_event.code == ƒ.KEYBOARD_CODE.Q) {
            console.log("Key Q pressed");
        }
        if (_event.code == ƒ.KEYBOARD_CODE.E) {
            console.log("Key E pressed");
        }
        if (_event.code == ƒ.KEYBOARD_CODE.OS_LEFT) {
            console.log("Key LEFT pressed");
        }
    }
    /*
    function createEnemies(): void {
        enemies.appendChild(new Enemy(10, "Enemy1", new ƒ.Vector3(pathPos[0].x, pathPos[0].y, 0)));
    }
    */
    function spawnEnemy(_enemyType) {
        //enemiesNode.appendChild(new Enemy(2, 10, 10, "Enemy1", new ƒ.Vector3(pathPos[0].x, pathPos[0].y, 0)));
        let enemy;
        switch (_enemyType) {
            case 1:
                enemy = new TowerDefenseGame.Enemy(_enemyType, 10, 3, "Enemy1", new ƒ.Vector3(TowerDefenseGame.pathPos[0].x, TowerDefenseGame.pathPos[0].y, 0), 2);
                break;
            case 2:
                enemy = new TowerDefenseGame.Enemy(_enemyType, 50, 1.5, "Enemy2", new ƒ.Vector3(TowerDefenseGame.pathPos[0].x, TowerDefenseGame.pathPos[0].y, 0), 5);
                break;
            case 3:
                enemy = new TowerDefenseGame.Enemy(_enemyType, 500, 0.5, "Enemy3", new ƒ.Vector3(TowerDefenseGame.pathPos[0].x, TowerDefenseGame.pathPos[0].y, 0), 10);
                break;
            case 4:
                enemy = new TowerDefenseGame.Enemy(_enemyType, 5000, 0.2, "Enemy4", new ƒ.Vector3(TowerDefenseGame.pathPos[0].x, TowerDefenseGame.pathPos[0].y, 0), 100);
                break;
            default:
                break;
        }
        TowerDefenseGame.enemies.push(enemy);
        TowerDefenseGame.enemiesNode.appendChild(enemy);
    }
    /*
    function destroyEnemy(_enemy: ƒ.Node): void {
        //_enemy.name = null;
        //ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, _enemy.update);
        //_enemy.getComponent(ƒ.ComponentTransform).local = null;
        //enemies.removeChild(this);
    }
    */
    // Core function to place a building on the map
    function mousePressed(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        // Check each field in the game and place a building on the clicked spot if something is ready to be placed
        for (let fieldsX of TowerDefenseGame.fields) {
            for (let field of fieldsX) {
                let cmpPicker = field.getComponent(TowerDefenseGame.ComponentPicker);
                let pickData = cmpPicker.pick(posMouse);
                // Check if a cmp picker exists on this spot
                if (pickData) {
                    // Check if a building was build
                    if (buildingConstructedNumber != 0 && allowdToBuildOnThisSpot) {
                        /*
                        // Check if build spot is a path
                        for (let path of pathPos) {
                            
                            if (path.x == field.cmpTransform.local.translation.x && path.y == field.cmpTransform.local.translation.y) {
                                console.log("On the same spot as a path!");
                                return;
                            }
                        }
                        */
                        if (buildingConstructedNumber == 5) {
                            let resourceSpotDistance;
                            resourceSpotDistance = ƒ.Vector3.DIFFERENCE(new ƒ.Vector3(field.cmpTransform.local.translation.x, field.cmpTransform.local.translation.y, 0), new ƒ.Vector3(resourcePos.x, resourcePos.y, 0)).magnitude;
                            if (resourceSpotDistance >= 2) {
                                console.log("Resource Spot to far away!");
                                return;
                            }
                        }
                        createBuilding(buildingConstructedNumber, field.cmpTransform.local.translation.x, field.cmpTransform.local.translation.y);
                        obstaclePos.push(new ƒ.Vector2(field.cmpTransform.local.translation.x, field.cmpTransform.local.translation.y));
                        buildingConstructedNumber = 0; // Resets the building number to zero because a building was placed
                    }
                }
            }
        }
    }
    // Creates the whole game world for the player
    function createWorld(_width, _height) {
        createGamefield(_width, _height); // Create basic game field with blocks
        createPath("LightGrey");
        createResourceSpot("Gold");
        createBase("MidnightBlue");
        attackRangeObj = createObject("AttackRange", 2, new ƒ.Vector3(0, 0, 0), new ƒ.Vector3(1, 1, 1), "red");
        attackRangeObj.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(1, 1, 1, 0.1);
        TowerDefenseGame.viewport.getGraph().appendChild(attackRangeObj);
        //spawnEnemy(1);
    }
    // Create a building on the given spot on the map
    function createBuilding(buildingType, _xPos, _yPos) {
        // Check what kind of building was given in the parameter
        switch (buildingType) {
            case 1:
                let tower1 = new TowerDefenseGame.Tower(1, new ƒ.Vector3(0, 0, 0), 2, 10, "LawnGreen", 2.5);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("MediumSpringGreen");
                tmpMatColor = createMat("MediumSpringGreen");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(tower1);
                break;
            case 2:
                let tower2 = new TowerDefenseGame.Tower(2, new ƒ.Vector3(0, 0, 0), 20, 2, "red", 3);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("green");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(tower2);
                break;
            case 3:
                let tower3 = new TowerDefenseGame.Tower(3, new ƒ.Vector3(0, 0, 0), 0, 1, "blue", 4);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("green");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(tower3);
                break;
            case 4:
                let tower4 = new TowerDefenseGame.Tower(4, new ƒ.Vector3(0, 0, 0), 0, 1, "violett", 4);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("green");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(tower4);
                break;
            case 5:
                let buildRessource1 = new TowerDefenseGame.Tower(5, new ƒ.Vector3(0, 0, 0), 0, 0, "gold", 0);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("green");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(buildRessource1);
                moneyBuildings++;
                break;
            case 6:
                let buildRessource2 = new TowerDefenseGame.Tower(6, new ƒ.Vector3(0, 0, 0), 0, 0, "gold", 0);
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(buildRessource2);
                moneyBuildings++;
                break;
            case 7:
                let buildScience1 = new TowerDefenseGame.Tower(7, new ƒ.Vector3(0, 0, 0), 0, 0, "gold", 0);
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(buildScience1);
                science1exists = true;
                break;
            case 8:
                let buildScience2 = new TowerDefenseGame.Tower(8, new ƒ.Vector3(0, 0, 0), 0, 0, "gold", 0);
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(buildScience2);
                science2exists = true;
                break;
            default:
                break;
        }
        TowerDefenseGame.viewport.getGraph().removeChild(attackRangeObj);
    }
    function createGamefield(_width, _height) {
        TowerDefenseGame.fields = [];
        for (let x = 0; x < _width; x++) {
            TowerDefenseGame.fields[x] = [];
            for (let y = 0; y < _height; y++) {
                if (x % 2 == 0) {
                    if (y % 2 == 0) {
                        //createField(x, y, "darkgreen");
                        TowerDefenseGame.fields[x][y] = createNodeField(x, y, "darkgreen");
                    }
                    else {
                        //createField(x, y, "green");
                        TowerDefenseGame.fields[x][y] = createNodeField(x, y, "green");
                    }
                }
                else {
                    if (y % 2 == 0) {
                        //createField(x, y, "green");
                        TowerDefenseGame.fields[x][y] = createNodeField(x, y, "green");
                    }
                    else {
                        //createField(x, y, "darkgreen");
                        TowerDefenseGame.fields[x][y] = createNodeField(x, y, "darkgreen");
                    }
                }
            }
        }
    }
    // Creates a random path way based on the random map size
    function createPath(_color) {
        TowerDefenseGame.pathPos = [];
        let randomStartFieldNumber = Math.floor(Math.random() * ((worldWidth - 1) - 1)) + 1; // Create start position for the field. Start at the top
        curPathPos = new ƒ.Vector2(randomStartFieldNumber, worldHeight - 1);
        TowerDefenseGame.fields[curPathPos.x][curPathPos.y].getComponent(ƒ.ComponentMaterial).material = createMat(_color);
        TowerDefenseGame.pathPos.push(curPathPos); // Store the start pos of the path
        obstaclePos.push(curPathPos);
        curPathPos = new ƒ.Vector2(curPathPos.x, curPathPos.y - 1);
        TowerDefenseGame.fields[curPathPos.x][curPathPos.y].getComponent(ƒ.ComponentMaterial).material = createMat(_color);
        TowerDefenseGame.pathPos.push(new ƒ.Vector2(curPathPos.x, curPathPos.y));
        obstaclePos.push(new ƒ.Vector2(curPathPos.x, curPathPos.y));
        let moveRightOrLeft;
        let randomWay;
        let randomSideLength;
        for (let x = 0; x < 13; x++) {
            randomWay = Math.floor(Math.random() * (4 - 1)) + 1;
            switch (randomWay) {
                case 1:
                    // Check if near world bottom
                    if (curPathPos.y > 2) {
                        createPathBlock(_color, 0, -1); // Move path downward
                    }
                    // Check if near world bottom
                    if (curPathPos.y > 2) {
                        createPathBlock(_color, 0, -1); // Move path downward
                    }
                    break;
                case 2:
                    // Check if near left world border AND left is no path
                    if (curPathPos.x > 1 && (TowerDefenseGame.pathPos[TowerDefenseGame.pathPos.length - 2].x != (curPathPos.x - 1))) {
                        randomSideLength = Math.floor(Math.random() * (curPathPos.x - 2)) + 1;
                        for (let x = 0; x < randomSideLength; x++) {
                            createPathBlock(_color, -1, 0); // Move path to the left
                        }
                    }
                    // Check if near world bottom AND right is no path AND not near right world border
                    else if (curPathPos.y > 2 && (TowerDefenseGame.pathPos[TowerDefenseGame.pathPos.length - 2].x != (curPathPos.x + 1)) && curPathPos.x < (worldWidth - 2)) {
                        moveRightOrLeft = Math.floor(Math.random() * (3 - 1)) + 1;
                        switch (moveRightOrLeft) {
                            case 1:
                                // Check if near world bottom
                                if (curPathPos.y > 2) {
                                    createPathBlock(_color, 0, -1); // Move path downward
                                }
                                // Check if near world bottom
                                if (curPathPos.y > 2) {
                                    createPathBlock(_color, 0, -1); // Move path downward
                                }
                                break;
                            case 2:
                                randomSideLength = Math.floor(Math.random() * ((worldWidth - 2) - curPathPos.x)) + 1;
                                for (let x = 0; x < randomSideLength; x++) {
                                    createPathBlock(_color, 1, 0); // Move path to the right
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    else {
                        // Check if near world bottom
                        if (curPathPos.y > 2) {
                            createPathBlock(_color, 0, -1); // Move path downward
                        }
                        // Check if near world bottom
                        if (curPathPos.y > 2) {
                            createPathBlock(_color, 0, -1); // Move path downward
                        }
                    }
                    break;
                case 3:
                    // Check if near right world border AND right is no path
                    if (curPathPos.x < (worldWidth - 2) && (TowerDefenseGame.pathPos[TowerDefenseGame.pathPos.length - 2].x != (curPathPos.x + 1))) {
                        createPathBlock(_color, 1, 0); // Move path to the right
                    }
                    // Check if near world bottom AND left is no path AND not near left world border
                    else if (curPathPos.y > 2 && (TowerDefenseGame.pathPos[TowerDefenseGame.pathPos.length - 2].x != (curPathPos.x - 1)) && curPathPos.x > 1) {
                        moveRightOrLeft = Math.floor(Math.random() * (3 - 1)) + 1;
                        switch (moveRightOrLeft) {
                            case 1:
                                // Check if near world bottom
                                if (curPathPos.y > 2) {
                                    createPathBlock(_color, 0, -1); // Move path downward
                                }
                                // Check if near world bottom
                                if (curPathPos.y > 2) {
                                    createPathBlock(_color, 0, -1); // Move path downward
                                }
                                break;
                            case 2:
                                createPathBlock(_color, -1, 0); // Move path to the left
                                break;
                            default:
                                break;
                        }
                    }
                    else {
                        // Check if near world bottom
                        if (curPathPos.y > 2) {
                            createPathBlock(_color, 0, -1); // Move path downward
                        }
                        // Check if near world bottom
                        if (curPathPos.y > 2) {
                            createPathBlock(_color, 0, -1); // Move path downward
                        }
                    }
                default:
                    break;
            }
        }
    }
    // Creates a single path block
    function createPathBlock(_color, _xOffSet, _yOffSet) {
        curPathPos = new ƒ.Vector2(curPathPos.x + _xOffSet, curPathPos.y + _yOffSet);
        TowerDefenseGame.fields[curPathPos.x][curPathPos.y].getComponent(ƒ.ComponentMaterial).material = createMat(_color);
        TowerDefenseGame.fields[curPathPos.x][curPathPos.y].cmpTransform.local.scale(new ƒ.Vector3(1, 1, 1));
        TowerDefenseGame.pathPos.push(new ƒ.Vector2(curPathPos.x, curPathPos.y));
        obstaclePos.push(new ƒ.Vector2(curPathPos.x, curPathPos.y));
    }
    // Creates a resource spot
    function createResourceSpot(_color) {
        let resourceSpot = Math.floor(Math.random() * ((worldWidth - 2) - 1)) + 1;
        TowerDefenseGame.fields[resourceSpot][0].getComponent(ƒ.ComponentMaterial).material = createMat(_color);
        resourcePos = new ƒ.Vector2(resourceSpot, 0);
        obstaclePos.push(new ƒ.Vector2(resourceSpot, 0));
    }
    // Creates the base at the end of the path
    function createBase(_color) {
        TowerDefenseGame.fields[TowerDefenseGame.pathPos[(TowerDefenseGame.pathPos.length - 1)].x][TowerDefenseGame.pathPos[(TowerDefenseGame.pathPos.length - 1)].y].getComponent(ƒ.ComponentMaterial).material = createMat(_color);
        obstaclePos.push(new ƒ.Vector2(TowerDefenseGame.pathPos[TowerDefenseGame.pathPos.length - 1].x, TowerDefenseGame.pathPos[TowerDefenseGame.pathPos.length - 1].y));
    }
    // Creates a single field on which a building, path, tower or enemy can stand / move
    function createNodeField(_xPos, _yPos, _color) {
        let field = createObject("Field", 3, new ƒ.Vector3(_xPos, _yPos, 0), ƒ.Vector3.ONE(1), _color);
        field.addComponent(new TowerDefenseGame.ComponentPicker(0.29));
        gameField.appendChild(field);
        return field;
        /*
        let field: ƒ.Node = new ƒ.Node("Field");

        let meshObject: ƒ.MeshQuad = new ƒ.MeshQuad();
        let meshComponent: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshObject);
        let matColor: ƒ.Material = createMat(_color);
        let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(matColor);
        

        let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(_xPos, _yPos, 0)));
        cmpTransform.local.scale(ƒ.Vector3.ONE(1));

        field.addComponent(new ComponentPicker(0.29));
        
        field.addComponent(cmpTransform);
        field.addComponent(meshComponent);
        field.addComponent(cmpMaterial);
        
        gameField.appendChild(field);
        return field;
        */
    }
    function createMat(_color) {
        let mtrColor = new ƒ.Material(_color, ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS(_color)));
        return mtrColor;
    }
    function moveNodeFromTo(_from, _toX, _toY) {
        //_from.getComponent(ƒ.ComponentTransform).transform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(_toX, _toY, 0)));
        //_from.getComponent(ƒ.ComponentTransform).local.translation.set(_toX, _toY, 0);
        //_from.mtxLocal.translation.transform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(_toX, _toY, 0)));
        _from.mtxLocal.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(_toX, _toY, 0)));
        //_from.mtxLocal.translation.y = _toY; 
        //_from.getComponent(ƒ.ComponentTransform)
        //_from.getComponent(ƒ.ComponentTransform).set .set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-50, 0, 0)));
        //_from.getComponent(ƒ.ComponentTransform).local.translate(new ƒ.Vector3(_toX, _toY, 0));
        //translate(new ƒ.Vector3(0, -1, 0));
    }
    function createObject(_nodeName, _meshType, _pos, _scale, _color) {
        let meshObject;
        switch (_meshType) {
            case 1:
                meshObject = new ƒ.MeshCube();
                break;
            case 2:
                meshObject = new ƒ.MeshSphere();
                break;
            case 3:
                meshObject = new ƒ.MeshQuad();
                break;
            default:
                break;
        }
        let object = new ƒAid.Node(_nodeName, ƒ.Matrix4x4.TRANSLATION(_pos), createMat(_color), meshObject);
        let baseMeshCmp = object.getComponent(ƒ.ComponentMesh);
        baseMeshCmp.pivot.scale(_scale);
        return object;
    }
})(TowerDefenseGame || (TowerDefenseGame = {}));
//# sourceMappingURL=Main.js.map