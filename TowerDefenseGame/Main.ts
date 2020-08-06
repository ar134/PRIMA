namespace TowerDefenseGame {

    let gameStartIn: number = 30;
    let firstEnemy: number = 1;
    let whenStrongerEnemiesSpawn: number = 30;

    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    window.addEventListener("load", hndLoad);

    let towerDefenseGame: ƒ.Node = new ƒ.Node("TowerDefenseGame");
    let gameField: ƒ.Node = new ƒ.Node("GameField");

    let worldWidth: number;
    let worldHeight: number;

    export let allEnemies: ƒ.Node = new ƒ.Node("Enemies");  // Main node for all the enemies
    export let enemies: Enemy[] = [];
    export let framerate: number = 30;
    export let fields: ƒ.Node[][];  // Stores all the fields
    export let pathPos: ƒ.Vector2[];    // Stores each path position
    export let money: number = 500; // Starting money
    export let viewport: ƒ.Viewport;
    export let towers: Building[] = [];    // Stores all the build towers
    export let nonCombatBuildings: Building[] = [];    // Stores all buildings that are not towers, like science and resource buildings
    export let baseHP: number = 20; // Base HP
    export let score: number = 0;

    let enemySpawnPeriod: number = 1; // Enemy spawn time in seconds
    let resourcePos: ƒ.Vector2 = new ƒ.Vector2();   // Stores the position of the resource spot on the map
    let resourceAmount: number = 5000;  // How much can be collected from the resource spot

    let curPathPos: ƒ.Vector2 = new ƒ.Vector2();
    let enemyTimeout: number = 0;

    let currentMoneyCounterObject: HTMLElement;
    let baseHPCounterObject: HTMLElement;
    let resourceLeftCounterObject: HTMLElement;

    let buildingConstructedNumber: number = 0;

    let depots: number = 0;
    let tradecenters: number = 0;

    let science1exists: boolean = false;
    let science2exists: boolean = false;

    let tower3field: HTMLElement;
    let tower4field: HTMLElement;
    let resource2field: HTMLElement;
    let science2field: HTMLElement;
    let restartMenu: HTMLElement;
    let warningText: HTMLElement;
    let scoreText: HTMLElement;

    let lastPos: ƒ.Vector2;
    let curPos: ƒ.Vector2 = new ƒ.Vector2();
    let lastBlockPos: ƒ.Vector2;
    let lastBlockColor: ƒ.Material;

    let currentTowerRange: number;
    let attackRangeObj: ƒ.Node;

    let allowdToBuildOnThisSpot: boolean;

    let increaseEnemyTimeout: number = 135;
    let frameCounter: number = 0;
    let timeCounter: number = 0;

    let gameStart: boolean = false;

    let obstaclePos: ƒ.Vector2[] = [];

    let enemy2Counter: number = 0;
    let enemy3Counter: number = 0;
    let enemy4Counter: number = 0;

    let enemy2TimeToSpawn: boolean = false;
    let enemy3TimeToSpawn: boolean = false;
    let enemy4TimeToSpawn: boolean = false;

    let warningTextAppeard: boolean = false;
    let warningTextShowTime: number = 3;
    let warningTextCounter: number = 0;

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        viewport = new ƒ.Viewport();

        currentMoneyCounterObject = document.querySelector("#moneyValue");
        baseHPCounterObject = document.querySelector("#baseHPValue");
        resourceLeftCounterObject = document.querySelector("#resourceValue");

        let restartGame: HTMLElement = document.getElementById("restartButton");
        let buildtower1: HTMLElement = document.getElementById("button_build_tower_1");
        let buildtower2: HTMLElement = document.getElementById("button_build_tower_2");
        let buildtower3: HTMLElement = document.getElementById("button_build_tower_3");
        let buildtower4: HTMLElement = document.getElementById("button_build_tower_4");
        
        let buildRessource1: HTMLElement = document.getElementById("button_build_ressource_1");
        let buildRessource2: HTMLElement = document.getElementById("button_build_ressource_2");
        
        let buildScience1: HTMLElement = document.getElementById("button_build_science_1");
        let buildScience2: HTMLElement = document.getElementById("button_build_science_2");

        scoreText = document.getElementById("score");
        restartMenu = document.getElementById("gameOverMenu");
        warningText = document.getElementById("warningText");
        tower3field = document.getElementById("tower_3");
        tower4field = document.getElementById("tower_4");
        resource2field = document.getElementById("resource_2");
        science2field = document.getElementById("science_2");

        restartGame.addEventListener("click", () => restartTheGame());

        buildtower1.addEventListener("click", () => build(1, 100));
        buildtower2.addEventListener("click", () => build(2, 100));
        buildtower3.addEventListener("click", () => build(3, 500));
        buildtower4.addEventListener("click", () => build(4, 1000));

        buildRessource1.addEventListener("click", () => build(5, 200));
        buildRessource2.addEventListener("click", () => build(6, 1000));
        
        buildScience1.addEventListener("click", () => build(7, 500));
        buildScience2.addEventListener("click", () => build(8, 1000));
        
        worldWidth = Math.floor(Math.random() * 12) + 8;
        worldHeight = Math.floor(Math.random() * 12) + 8;
        
        towerDefenseGame.addChild(gameField);
        towerDefenseGame.addChild(allEnemies);
        
        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(worldWidth / 2, worldHeight / 2, 40));
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = ƒ.Color.CSS("DarkSlateGray");
        
        viewport.initialize("Viewport", towerDefenseGame, cmpCamera, canvas);

        ƒAid.addStandardLightComponents(towerDefenseGame, new ƒ.Color(0.5, 0.5, 0.5));

        viewport.draw();

        viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, pointerMove);
        viewport.addEventListener(ƒ.EVENT_POINTER.DOWN, mousePressed);
        document.addEventListener("keydown", keyPressed);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.DOWN, true);
        viewport.activatePointerEvent(ƒ.EVENT_POINTER.UP, true);

        createWorld(worldWidth, worldHeight);

        showWarningText("Enemies attack base in 30 seconds.");

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, framerate);
    }
    
    function update(_event: ƒ.Eventƒ): void {

        // Shows the game over menu if the player loses
        if (baseHP <= 0) {
            restartMenu.style.display = "flex";
            scoreText.textContent = "Score: " + score;
            return;
        }

        frameCounter++;
        enemyTimeout++;      

        // Counts seconds + adds money + warning text
        if (frameCounter >= framerate) {

            timeCounter++;
            frameCounter = 0;

            // Check if depots exists which collects resources from the resource spot. Each depot collects 5 resource each second
            if (depots > 0) {

                // Check for each depot if resources are still left
                for (let i: number = 0; i < depots; i++) {
                    
                    if (resourceAmount > 0) {
                        money = money + 5;
                        resourceAmount = resourceAmount - 5;
                    }
                }
            }

            // Each tradecenter generates 20 resource each second
            if (tradecenters > 0) {
                money = money + (20 * tradecenters);
            }

            // Check if a warning text appeard, if yes, start to count
            // A warning text disappears after X amount of seconds
            if (warningTextAppeard) {

                warningTextCounter++;

                if (warningTextCounter > warningTextShowTime) {

                    hideWarningText();
                    warningTextAppeard = false;
                    warningTextCounter = 0;
                }
            }
        }

        baseHPCounterObject.textContent = "Base HP: " + baseHP;
        resourceLeftCounterObject.textContent = "Resource left: " + resourceAmount;
        currentMoneyCounterObject.textContent = "Current money: " + money + " $";

        // Check if towes exists, if yes, check if enemies exists and follow them
        if (towers != null) {

            for (let tower of towers) {

                if (allEnemies != null) {

                    tower.followEnemy();
                }
            }
        }

        // Moves each enemy that exists each frame and check if the enemy is dotted / poisoned
        for (let enemy of enemies) {

            enemy.move();

            // Each enemy that is poisoned loses HP each frame
            if (enemy.isDotted) {
                enemy.health = enemy.health - 0.5;

                // Check if enemy has no HP left after the damage
                if (enemy.health <= 0) {
                    enemy.destroyEnemy();
                }
            }
        }

        // Changes the opacity of the unlocked building icons
        if (science1exists) {
            tower3field.style.opacity = "1";
            science2field.style.opacity = "1";
        }
        if (science2exists) {
            tower4field.style.opacity = "1";
            resource2field.style.opacity = "1";
        }      
        
        // Increase the amount of enemies that spawns each second + check if its allowed to increase the waves > gives player time to build his base
        if (timeCounter > increaseEnemyTimeout) {
            enemySpawnPeriod = enemySpawnPeriod * 1.5;
            increaseEnemyTimeout = increaseEnemyTimeout + 30;
        }

        // Start the game after X seconds
        if (timeCounter > gameStartIn) {
            gameStart = true;
        }
        
        if (timeCounter > whenStrongerEnemiesSpawn * 2) {
            enemy2TimeToSpawn = true;
        }

        if (timeCounter > whenStrongerEnemiesSpawn * 3) {
            enemy3TimeToSpawn = true;
        }

        if (timeCounter > whenStrongerEnemiesSpawn * 4) {
            enemy4TimeToSpawn = true;
        }

        // Spawns enemies each second depending on the spawn period + check if game started
        if (enemyTimeout >= (framerate / enemySpawnPeriod) && gameStart) {

            spawnEnemy(firstEnemy);  // Spawns first the weakest enemies
            enemy2Counter++;
            enemyTimeout = 0;

            // After each X weak enemies, spawn a stronger one + check if its time so spawn stronger enemies > necessary to give the player time to build his base
            if (enemy2Counter > 2 && enemy2TimeToSpawn) {

                spawnEnemy(2);
                enemy2Counter = 0;
                enemy3Counter++;

                if (enemy3Counter > 3 && enemy3TimeToSpawn) {

                    spawnEnemy(3);
                    enemy3Counter = 0;
                    enemy4Counter++;

                    if (enemy4Counter > 4 && enemy4TimeToSpawn) {

                        spawnEnemy(4);
                        enemy4Counter = 0;
                    }
                }
            }
        }
        
        viewport.draw();
    }

    // Called each time the mouse moves
    function pointerMove(_event: ƒ.EventPointer): void {
        let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);

        if (buildingConstructedNumber == 0) {
            return;
        }

        lastPos = curPos;   // Last spot stores the position from the old current spot. Necessary to compare the lastPos with the (new) current position
                
        // Check each field that exists on the map
        for (let fieldsX of fields) {

            for (let field of fieldsX) {

                let cmpPicker: ComponentPicker = field.getComponent(ComponentPicker);
                let pickData: PickData = cmpPicker.pick(posMouse);

                // Check if a cmp picker exists on this spot
                if (pickData) {

                    curPos = new ƒ.Vector2(field.mtxLocal.translation.x, field.mtxLocal.translation.x); // Stores the current position
                    
                    moveNodeFromTo(attackRangeObj, field.mtxLocal.translation.x, field.mtxLocal.translation.y); // Moves the attack range object to the field position
                    attackRangeObj.mtxLocal.scale(new ƒ.Vector3(currentTowerRange, currentTowerRange, 0.1));    // Scales the attack range object depending on the current buildings attack range
                    
                    // If the current position and the last one arent the same, the player moved his mouse from X block to Y block
                    // If this happens, change the color of the last block to the original one
                    if (curPos != lastPos) {
                        if (lastBlockPos != null) {
                            fields[lastBlockPos.x][lastBlockPos.y].getComponent(ƒ.ComponentMaterial).material = lastBlockColor;
                        }
                    }
                    
                    lastBlockColor = field.getComponent(ƒ.ComponentMaterial).material;  // Stores the color of his block, so in can be changed back to the original color after the player moved his mouse to another block
                    
                    checkIfAllowedToBuildOnThisSpot(field);

                    if (allowdToBuildOnThisSpot) {
                        field.getComponent(ƒ.ComponentMaterial).material = createMat("GreenYellow");
                    } else {
                        field.getComponent(ƒ.ComponentMaterial).material = createMat("red");
                    }

                    lastBlockPos = new ƒ.Vector2(field.mtxLocal.translation.x, field.mtxLocal.translation.y);   // Stores the position of the last block
                }
            }
        }
    }

    function checkIfAllowedToBuildOnThisSpot(_field: ƒ.Node): void {

        for (let obstacle of obstaclePos) {
                                        
            if (obstacle.x == _field.cmpTransform.local.translation.x && obstacle.y == _field.cmpTransform.local.translation.y) {
                allowdToBuildOnThisSpot = false;
                return;
            } else {
                allowdToBuildOnThisSpot = true;
            }
        }
    }

    // Restart the game by simple reloading the browser
    function restartTheGame(): void {
        window.location.reload();
    }
    
    // Core function to build / buy something, tower or non combat building. Checks if the player has enough money to build something
    // building: type of building (1 - 8) | cost: how much money need to build it
    function build(building: number, cost: number): void {

        // Check if no building is waiting to be placed
        if (buildingConstructedNumber == 0) {

            viewport.getGraph().appendChild(attackRangeObj);
            attackRangeObj.mtxLocal.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 0, -10)));

            // Defines the attack range based on the building that was bought (not constructed on the map)
            // Necessary so the player can adjust the building spot based on the attack range
            switch (building) {
                case 1:
                    currentTowerRange = 3;
                    break;
                case 2:
                    currentTowerRange = 6;
                    break;
                case 3:
                    currentTowerRange = 8;
                    break;
                case 4:
                    currentTowerRange = 8;
                    break;
                case 5:
                    currentTowerRange = 3;
                    break;
                case 6:
                    currentTowerRange = 0;
                    break;
                case 7:
                    currentTowerRange = 0;
                    break;
                case 8:
                    currentTowerRange = 0;
                    break;
                default:
                    break;
            }

            // Check if player wants to build a science building he already has
            if (science1exists == true && building == 7) {
                showWarningText("Research Center already exists. You can't build more than one.");
                return;
            }

            if (science2exists == true && building == 8) {
                showWarningText("Future Tech Center already exists. You can't build more than one.");
                return;
            }

            // Check if player is allowed to build this type of building
            if ((building == 8 || building == 3) && !science1exists) {
                showWarningText("Need first Research Center to build this building.");
                return;
            }

            if ((building == 4 || building == 6) && !science2exists) {
                showWarningText("Need first Future Tech Center to build this building.");
                return;
            }

            // Check if the player can cover the cost with his current money
            if (money >= cost) {

                money = money - cost;
                buildingConstructedNumber = building;

            } else {
                showWarningText("Not enough money for this building.");
            }
        } 
        
        else {
            showWarningText("Finished building need to be placed first before another one can be build.");
        }
    }

    function keyPressed(_event: KeyboardEvent): void {

        if (_event.code == ƒ.KEYBOARD_CODE.Q) {
            build(1, 100);
        }

        if (_event.code == ƒ.KEYBOARD_CODE.W) {
            build(2, 100);
        }

        if (_event.code == ƒ.KEYBOARD_CODE.E) {
            build(3, 500);
        }

        if (_event.code == ƒ.KEYBOARD_CODE.R) {
            build(4, 1000);
        }

        if (_event.code == ƒ.KEYBOARD_CODE.A) {
            build(5, 200);
        }

        if (_event.code == ƒ.KEYBOARD_CODE.S) {
            build(6, 1000);
        }

        if (_event.code == ƒ.KEYBOARD_CODE.D) {
            build(7, 500);
        }

        if (_event.code == ƒ.KEYBOARD_CODE.F) {
            build(8, 1000);
        }
    }

    function spawnEnemy(_enemyType: number): void {

        let enemy: Enemy;

        // Spawns an enemy based on the type
        // Type 1 weakest but fastes ... Type 4 strongest but slowest
        switch (_enemyType) {

            case 1:
                enemy = new Enemy(_enemyType, 10, 5, "Enemy1", new ƒ.Vector3(pathPos[0].x, pathPos[0].y, 0), 2);
                break;

            case 2:
                enemy = new Enemy(_enemyType, 50, 3, "Enemy2", new ƒ.Vector3(pathPos[0].x, pathPos[0].y, 0), 5);
                break;

            case 3:
                enemy = new Enemy(_enemyType, 500, 2, "Enemy3", new ƒ.Vector3(pathPos[0].x, pathPos[0].y, 0), 50);
                break;

            case 4:
                enemy = new Enemy(_enemyType, 5000, 1, "Enemy4", new ƒ.Vector3(pathPos[0].x, pathPos[0].y, 0), 500);
                break;
        
            default:
                break;
        }

        enemies.push(enemy);    // Adds the enemy to the enemies array
        allEnemies.appendChild(enemy);  // Adds the enemy to the nodes so it can be added to the map
    }

    // Core function to place a building on the map
    function mousePressed(_event: ƒ.EventPointer): void {

        let pressedOnBuildingSpot: boolean = false; // Necessary to check if the player pressed the mouse over a building spot (on the map) or outsite the map

        let posMouse: ƒ.Vector2 = new ƒ.Vector2(_event.canvasX, _event.canvasY);

        // Check each field in the game and place a building on the clicked spot if something is ready to be placed
        for (let fieldsX of fields) {

            for (let field of fieldsX) {

                let cmpPicker: ComponentPicker = field.getComponent(ComponentPicker);
                let pickData: PickData = cmpPicker.pick(posMouse);

                // Check if a cmp picker exists on this spot
                if (pickData) {

                    pressedOnBuildingSpot = true;   

                    // Check if something is bought and can be placed on the current spot
                    if (buildingConstructedNumber != 0 && allowdToBuildOnThisSpot) {

                        // Check if a depot is bought. Calculates the distance between the building spot and the resource spot. The depot must be placed near a resource spot
                        if (buildingConstructedNumber == 5) {

                            let resourceSpotDistance: number;
                            resourceSpotDistance = ƒ.Vector3.DIFFERENCE(new ƒ.Vector3(field.cmpTransform.local.translation.x, field.cmpTransform.local.translation.y, 0), new ƒ.Vector3(resourcePos.x, resourcePos.y, 0)).magnitude;

                            if (resourceSpotDistance >= 2) {
                                showWarningText("Resource Spot to far away!");
                                return;
                            }
                        }

                        //createBuilding(buildingConstructedNumber, field.cmpTransform.local.translation.x, field.cmpTransform.local.translation.y);
                        createBuilding(buildingConstructedNumber, field.mtxWorld.translation.x, field.mtxWorld.translation.y);
                        obstaclePos.push(new ƒ.Vector2(field.cmpTransform.local.translation.x, field.cmpTransform.local.translation.y));
                        buildingConstructedNumber = 0;  // Resets the building number to zero because a building was placed
                        allowdToBuildOnThisSpot = false;                             
                    }
                }
            }
        }

        // Check if a building was bought and the mouse was pressed outside the gamefield. Aborts the process and refunds the cost of the building
        if (!pressedOnBuildingSpot && buildingConstructedNumber != 0) {

            switch (buildingConstructedNumber) {
                case 1:
                    money = money + 100;
                    break;

                case 2:
                    money = money + 100;
                    break;

                case 3:
                    money = money + 500;
                    break;
            
                case 4:
                    money = money + 1000;
                    break;

                case 5:
                    money = money + 200;
                    break;

                case 6:
                    money = money + 1000;
                    break;

                case 7:
                    money = money + 500;
                    break;

                case 8:
                    money = money + 1000;
                    break;

                default:
                    break;
            }

            buildingConstructedNumber = 0;
            viewport.getGraph().removeChild(attackRangeObj);

            if (lastBlockPos != null) {
                fields[lastBlockPos.x][lastBlockPos.y].getComponent(ƒ.ComponentMaterial).material = lastBlockColor;
            }
        }
    }

    // Creates the whole game world for the player
    function createWorld(_width: number, _height: number): void {

        createGamefield(_width, _height);   // Create basic game field with blocks

        createPath("LightGrey");

        createResourceSpot("Gold");

        createBase("MidnightBlue");

        attackRangeObj = createObject("AttackRange", 2, new ƒ.Vector3(0, 0, 0), new ƒ.Vector3(1, 1, 1) , "red");
        attackRangeObj.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(1, 1, 1, 0.1);
        viewport.getGraph().appendChild(attackRangeObj);
    }

    // Create a building on the given spot on the map
    function createBuilding(buildingType: number, _xPos: number, _yPos: number): void {

        // Check what kind of building was given in the parameter
        switch (buildingType) {

            case 1:
                let tower1: Building = new Building(1, new ƒ.Vector3(0, 0, 0), 2, 10, 1.5);
                fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("DodgerBlue");
                lastBlockColor = createMat("DodgerBlue");
                fields[_xPos][_yPos].appendChild(tower1);
                break;

            case 2:
                let tower2: Building = new Building(2, new ƒ.Vector3(0, 0, 0), 30, 0.5, 3);
                fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("Crimson");
                lastBlockColor = createMat("Crimson");
                fields[_xPos][_yPos].appendChild(tower2);
                break;

            case 3:
                let tower3: Building = new Building(3, new ƒ.Vector3(0, 0, 0), 0, 1, 4);
                fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("Lime");
                lastBlockColor = createMat("Lime");
                fields[_xPos][_yPos].appendChild(tower3);
                break;

            case 4:
                let tower4: Building = new Building(4, new ƒ.Vector3(0, 0, 0), 0, 1, 4);
                fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("Fuchsia");
                lastBlockColor = createMat("Fuchsia");
                fields[_xPos][_yPos].appendChild(tower4);
                break;

            case 5:
                let buildRessource1: Building = new Building(5, new ƒ.Vector3(0, 0, 0), 0, 0, 0);
                fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("GoldenRod");
                lastBlockColor = createMat("GoldenRod");
                fields[_xPos][_yPos].appendChild(buildRessource1);
                depots++;
                break;

            case 6:
                let buildRessource2: Building = new Building(6, new ƒ.Vector3(0, 0, 0), 0, 0, 0);
                fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("DarkOrange");
                lastBlockColor = createMat("DarkOrange");
                fields[_xPos][_yPos].appendChild(buildRessource2);
                tradecenters++;
                break;

            case 7:
                let buildScience1: Building = new Building(7, new ƒ.Vector3(0, 0, 0), 0, 0, 0);
                fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("DarkSlateGray");
                lastBlockColor = createMat("DarkSlateGray");
                fields[_xPos][_yPos].appendChild(buildScience1);
                science1exists = true;
                break;

            case 8:
                let buildScience2: Building = new Building(8, new ƒ.Vector3(0, 0, 0), 0, 0, 0);
                fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("Indigo ");
                lastBlockColor = createMat("Indigo ");
                fields[_xPos][_yPos].appendChild(buildScience2);
                science2exists = true;
                break;
        
            default:
                break;
        }

        viewport.getGraph().removeChild(attackRangeObj);
    }

    function createGamefield(_width: number, _height: number): void {

        fields = [];

        for (let x: number = 0; x < _width; x++) {
            fields[x] = [];
            
            for (let y: number = 0; y < _height; y++) {

                if (x % 2 == 0) {

                    if (y % 2 == 0) {
                        fields[x][y] = createNodeField(x, y, "darkgreen");
                    } else {
                        fields[x][y] = createNodeField(x, y, "green");
                    }

                } else {

                    if (y % 2 == 0) {
                        fields[x][y] = createNodeField(x, y, "green");
                    } else {
                        fields[x][y] = createNodeField(x, y, "darkgreen");
                    }
                }
            }
        }
    }

    // Creates a random path way based on the random map size
    function createPath(_color: string): void {

        pathPos = [];

        let randomStartFieldNumber: number = Math.floor(Math.random() * ((worldWidth - 1) - 1)) + 1;    // Create start position for the field. Start at the top

        curPathPos = new ƒ.Vector2(randomStartFieldNumber, worldHeight - 1);
        fields[curPathPos.x][curPathPos.y].getComponent(ƒ.ComponentMaterial).material = createMat(_color);
        pathPos.push(curPathPos);    // Store the start pos of the path
        obstaclePos.push(curPathPos); 

        curPathPos = new ƒ.Vector2(curPathPos.x, curPathPos.y - 1);
        fields[curPathPos.x][curPathPos.y].getComponent(ƒ.ComponentMaterial).material = createMat(_color);
        pathPos.push(new ƒ.Vector2(curPathPos.x, curPathPos.y));
        obstaclePos.push(new ƒ.Vector2(curPathPos.x, curPathPos.y));
        
        let moveRightOrLeft: number;
        let randomWay: number;
        let randomSideLength: number;
        
        for (let x: number = 0; x < 13; x++) {
            
            randomWay = Math.floor(Math.random() * (4 - 1)) + 1;   
            
            switch (randomWay) {

                case 1:

                    // Check if near world bottom
                    if (curPathPos.y > 2) {
                        createPathBlock(_color, 0, -1);   // Move path downward
                    }

                    // Check if near world bottom
                    if (curPathPos.y > 2) {
                        createPathBlock(_color, 0, -1);   // Move path downward
                    }

                    break;
    
                case 2:
    
                    // Check if near left world border AND left is no path
                    if (curPathPos.x > 1 && (pathPos[pathPos.length - 2].x != (curPathPos.x - 1))) {
    
                        randomSideLength = Math.floor(Math.random() * (curPathPos.x - 2)) + 1;

                        for (let x: number = 0; x < randomSideLength; x++) {
                            createPathBlock(_color, -1, 0);   // Move path to the left
                        }
                    } 
    
                    // Check if near world bottom AND right is no path AND not near right world border
                    else if (curPathPos.y > 2 && (pathPos[pathPos.length - 2].x != (curPathPos.x + 1)) && curPathPos.x < (worldWidth - 2)) {
    
                        moveRightOrLeft = Math.floor(Math.random() * (3 - 1)) + 1;
    
                        switch (moveRightOrLeft) {
    
                            case 1:
                                // Check if near world bottom
                                if (curPathPos.y > 2) {
                                    createPathBlock(_color, 0, -1);   // Move path downward
                                }

                                // Check if near world bottom
                                if (curPathPos.y > 2) {
                                    createPathBlock(_color, 0, -1);   // Move path downward
                                }

                                break;
    
                            case 2:

                                randomSideLength = Math.floor(Math.random() * ((worldWidth - 2) - curPathPos.x)) + 1;

                                for (let x: number = 0; x < randomSideLength; x++) {
                                    createPathBlock(_color, 1, 0);    // Move path to the right
                                }

                                break;
                        
                            default:
                                break;
                        }
                    } 
                    
                    else {

                        // Check if near world bottom
                        if (curPathPos.y > 2) {
                            createPathBlock(_color, 0, -1);   // Move path downward
                        }

                        // Check if near world bottom
                        if (curPathPos.y > 2) {
                            createPathBlock(_color, 0, -1);   // Move path downward
                        }
                    }
    
                    break;
    
                case 3:
    
                    // Check if near right world border AND right is no path
                    if (curPathPos.x < (worldWidth - 2) && (pathPos[pathPos.length - 2].x != (curPathPos.x + 1))) {
                        createPathBlock(_color, 1, 0);    // Move path to the right
                    } 
    
                    // Check if near world bottom AND left is no path AND not near left world border
                    else if (curPathPos.y > 2 && (pathPos[pathPos.length - 2].x != (curPathPos.x - 1)) && curPathPos.x > 1) {
    
                        moveRightOrLeft = Math.floor(Math.random() * (3 - 1)) + 1;
    
                        switch (moveRightOrLeft) {
    
                            case 1:
                                // Check if near world bottom
                                if (curPathPos.y > 2) {
                                    createPathBlock(_color, 0, -1);   // Move path downward
                                }

                                // Check if near world bottom
                                if (curPathPos.y > 2) {
                                    createPathBlock(_color, 0, -1);   // Move path downward
                                }

                                break;
    
                            case 2:
                                createPathBlock(_color, -1, 0);   // Move path to the left
                                break;
                        
                            default:
                                break;
                        }
    
                    } else {

                        // Check if near world bottom
                        if (curPathPos.y > 2) {
                            createPathBlock(_color, 0, -1);   // Move path downward
                        }

                        // Check if near world bottom
                        if (curPathPos.y > 2) {
                            createPathBlock(_color, 0, -1);   // Move path downward
                        }
                    }
            
                default:
                    break;
            }
        }
    }

    // Creates a single path block
    function createPathBlock(_color: string, _xOffSet: number, _yOffSet: number): void {
        curPathPos = new ƒ.Vector2(curPathPos.x + _xOffSet, curPathPos.y + _yOffSet);
        fields[curPathPos.x][curPathPos.y].getComponent(ƒ.ComponentMaterial).material = createMat(_color);
        fields[curPathPos.x][curPathPos.y].cmpTransform.local.scale(new ƒ.Vector3(1, 1, 1));
        pathPos.push(new ƒ.Vector2(curPathPos.x, curPathPos.y));
        obstaclePos.push(new ƒ.Vector2(curPathPos.x, curPathPos.y));
    }

    // Creates a resource spot
    function createResourceSpot(_color: string): void {

        let resourceSpot: number = Math.floor(Math.random() * ((worldWidth - 2) - 1)) + 1;
        fields[resourceSpot][0].getComponent(ƒ.ComponentMaterial).material = createMat(_color);
        resourcePos = new ƒ.Vector2(resourceSpot, 0);
        obstaclePos.push(new ƒ.Vector2(resourceSpot, 0));
    }

    // Creates the base at the end of the path
    function createBase(_color: string): void {
        fields[pathPos[(pathPos.length - 1)].x][pathPos[(pathPos.length - 1)].y].getComponent(ƒ.ComponentMaterial).material = createMat(_color);
        obstaclePos.push(new ƒ.Vector2(pathPos[pathPos.length - 1].x, pathPos[pathPos.length - 1].y));
    }

    // Creates a single field on which a building, path, tower or enemy can stand / move
    function createNodeField(_xPos: number, _yPos: number, _color: string): ƒ.Node {

        let field: ƒ.Node = createObject("Field", 3, new ƒ.Vector3(_xPos, _yPos, 0), ƒ.Vector3.ONE(1), _color);
        field.addComponent(new ComponentPicker(0.29));
        
        gameField.appendChild(field);
        return field;
    }

    function createMat(_color: string): ƒ.Material {

        let mtrColor: ƒ.Material = new ƒ.Material(_color, ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS(_color)));
        return mtrColor;
    }

    function moveNodeFromTo(_from: ƒ.Node, _toX: number, _toY: number): void {
        _from.mtxLocal.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(_toX, _toY, 0)));
    }

    function createObject(_nodeName: string, _meshType: number, _pos: ƒ.Vector3, _scale: ƒ.Vector3, _color: string): ƒ.Node {

        let meshObject: ƒ.Mesh;

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

        let object: ƒAid.Node = new ƒAid.Node(_nodeName, ƒ.Matrix4x4.TRANSLATION(_pos), createMat(_color), meshObject);
        let baseMeshCmp: ƒ.ComponentMesh = object.getComponent(ƒ.ComponentMesh);
        baseMeshCmp.pivot.scale(_scale);

        return object;
    }

    function hideWarningText(): void {
        warningText.style.visibility = "hidden";
    }

    function showWarningText(_text: string): void {
        warningText.textContent = _text;
        warningText.style.visibility = "visible";
        warningTextCounter = 0;
        warningTextAppeard = true;
    }
}