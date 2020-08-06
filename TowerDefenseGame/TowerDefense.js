"use strict";
var TowerDefenseGame;
(function (TowerDefenseGame) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Building extends ƒ.Node {
        constructor(_buildingType, _pos, _damage, _fireRate, _range) {
            super("Building");
            this.position = _pos;
            this.damage = _damage;
            this.fireRate = _fireRate;
            this.towerType = _buildingType;
            this.timer = new ƒ.Timer(ƒ.Time.game, (1000 / this.fireRate), 0, this.shoot.bind(this));
            this.range = _range;
            this.init();
        }
        createMat(_color) {
            let mtrColor = new ƒ.Material("SolidWhite", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS(_color)));
            return mtrColor;
        }
        // Searches and follows enemies that are close
        followEnemy() {
            let enemyDistance;
            let enemyBaseDistance = 0;
            let enemiesInAttackRange = 0;
            for (let enemy of TowerDefenseGame.enemies) {
                // If this is a acid tower, search only enemies that are not poisoned, since an acid tower only attacks enemies one time
                if (this.towerType == 3 && !enemy.isDotted) {
                    enemyDistance = ƒ.Vector3.DIFFERENCE(enemy.mtxWorld.translation, this.mtxWorld.translation).magnitude;
                    // Check if the enemy, which is not posioned, is in attack range
                    if (enemyDistance < this.range) {
                        enemiesInAttackRange++;
                        this.target = enemy;
                        if (this.target == null) {
                            return;
                        }
                        this.top.cmpTransform.lookAt(this.target.mtxLocal.translation);
                    }
                }
                // If its not an acid tower, search for every enemy that is close and focus him
                else {
                    enemyDistance = ƒ.Vector3.DIFFERENCE(enemy.mtxWorld.translation, this.mtxWorld.translation).magnitude;
                    if (this.range >= enemyDistance) {
                        enemiesInAttackRange++;
                        if (enemy.nextWaypoint > enemyBaseDistance) {
                            enemyBaseDistance = enemy.nextWaypoint;
                            this.target = enemy;
                            if (this.target == null) {
                                return;
                            }
                            this.top.cmpTransform.lookAt(this.target.mtxLocal.translation);
                        }
                    }
                }
            }
            if (enemiesInAttackRange == 0) {
                this.target = null;
            }
        }
        // Create a building based on the type
        init() {
            switch (this.towerType) {
                case 1:
                    this.buildTower_1();
                    break;
                case 2:
                    this.buildTower_2();
                    break;
                case 3:
                    this.buildTower_3();
                    break;
                case 4:
                    this.buildTower_4();
                    break;
                case 5:
                    this.buildResource_1();
                    break;
                case 6:
                    this.buildResource_2();
                    break;
                case 7:
                    this.buildScience_1();
                    break;
                case 8:
                    this.buildScience_2();
                    break;
                default:
                    break;
            }
            this.addComponent(new TowerDefenseGame.ComponentPicker(0.1));
        }
        buildTower_1() {
            let base = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.5, 0.5, 0.2), "Navy");
            base.cmpTransform.local.rotateZ(45);
            this.appendChild(base);
            this.top = this.createObject("Top", 2, new ƒ.Vector3(0, 0, 0.5), new ƒ.Vector3(0.4, 0.4, 0.4), "DodgerBlue");
            this.top.mtxLocal.rotateY(90);
            this.top.mtxLocal.rotateX(-45);
            base.appendChild(this.top);
            this.gun = this.createObject("Gun", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.1, 0.1, 0.4), "DarkSlateGray");
            this.top.appendChild(this.gun);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            this.addComponent(towerTransformation);
            TowerDefenseGame.towers.push(this);
        }
        buildTower_2() {
            let base = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.7, 0.7, 0.1), "Maroon");
            base.cmpTransform.local.rotateZ(45);
            this.appendChild(base);
            this.top = this.createObject("Top", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.5, 0.5, 0.5), "Crimson");
            this.top.mtxLocal.rotateY(90);
            this.top.mtxLocal.rotateX(-45);
            base.appendChild(this.top);
            this.gun = this.createObject("Gun", 1, new ƒ.Vector3(0, 0.15, 0.5), new ƒ.Vector3(0.15, 0.15, 0.4), "DarkSlateGray");
            this.top.appendChild(this.gun);
            let gun2 = this.createObject("Gun2", 1, new ƒ.Vector3(0, -0.15, 0.5), new ƒ.Vector3(0.15, 0.15, 0.4), "DarkSlateGray");
            this.top.appendChild(gun2);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            this.addComponent(towerTransformation);
            TowerDefenseGame.towers.push(this);
        }
        buildTower_3() {
            let base = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.6, 0.6, 0.2), "SeaGreen");
            base.cmpTransform.local.rotateZ(45);
            this.appendChild(base);
            this.top = this.createObject("Cannon", 2, new ƒ.Vector3(0, 0, 0.5), new ƒ.Vector3(0.5, 0.5, 0.5), "Lime");
            this.top.mtxLocal.rotateY(90);
            this.top.mtxLocal.rotateX(-45);
            base.appendChild(this.top);
            this.gun = this.createObject("Gun", 1, new ƒ.Vector3(0, 0, 0.1), new ƒ.Vector3(0.1, 0.1, 0.8), "DarkSlateGray");
            this.top.appendChild(this.gun);
            let acidTank = this.createObject("AcitTank", 2, new ƒ.Vector3(0, 0.1, -0.2), new ƒ.Vector3(0.3, 0.3, 0.3), "SeaGreen");
            this.top.appendChild(acidTank);
            let acidTank2 = this.createObject("AcitTank", 2, new ƒ.Vector3(0, -0.1, -0.2), new ƒ.Vector3(0.3, 0.3, 0.3), "SeaGreen");
            this.top.appendChild(acidTank2);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            this.addComponent(towerTransformation);
            TowerDefenseGame.towers.push(this);
        }
        buildTower_4() {
            let base = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.7, 0.7, 0.2), "DarkViolet");
            base.cmpTransform.local.rotateZ(45);
            this.appendChild(base);
            let obj1 = this.createObject("Base", 1, new ƒ.Vector3(0.3, 0, 1), new ƒ.Vector3(0.15, 0.15, 2), "Fuchsia");
            this.appendChild(obj1);
            let obj2 = this.createObject("Base", 1, new ƒ.Vector3(-0.3, 0, 1), new ƒ.Vector3(0.15, 0.15, 2), "Fuchsia");
            this.appendChild(obj2);
            let obj3 = this.createObject("Base", 1, new ƒ.Vector3(0, 0.3, 1), new ƒ.Vector3(0.15, 0.15, 2), "Fuchsia");
            this.appendChild(obj3);
            this.top = this.createObject("Cannon", 2, new ƒ.Vector3(0, 0, 2), new ƒ.Vector3(0.3, 0.3, 0.3), "Black");
            base.appendChild(this.top);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            this.addComponent(towerTransformation);
            TowerDefenseGame.towers.push(this);
        }
        buildResource_1() {
            let base = this.createObject("Base", 1, new ƒ.Vector3(0.2, 0, 0.2), new ƒ.Vector3(0.5, 0.6, 0.2), "Peru");
            this.appendChild(base);
            let obj1 = this.createObject("Base", 1, new ƒ.Vector3(-0.2, -0.1, 0.2), new ƒ.Vector3(0.2, 0.2, 0.2), "Orange");
            this.appendChild(obj1);
            let obj2 = this.createObject("Base", 1, new ƒ.Vector3(-0.2, 0.2, 0.2), new ƒ.Vector3(0.15, 0.15, 0.2), "Sienna");
            this.appendChild(obj2);
            TowerDefenseGame.nonCombatBuildings.push(this);
        }
        buildResource_2() {
            let base = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0), new ƒ.Vector3(0.8, 0.8, 0.8), "DarkGoldenRod");
            this.appendChild(base);
            let obj1 = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.5), new ƒ.Vector3(0.7, 0.7, 0.7), "DarkGoldenRod");
            this.appendChild(obj1);
            let obj2 = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 1), new ƒ.Vector3(0.6, 0.6, 0.6), "DarkGoldenRod");
            this.appendChild(obj2);
            TowerDefenseGame.nonCombatBuildings.push(this);
        }
        buildScience_1() {
            let base = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.6, 0.5, 0.5), "DarkTurquoise");
            this.appendChild(base);
            let obj1 = this.createObject("Base", 1, new ƒ.Vector3(0, 0.4, 0), new ƒ.Vector3(0.2, 0.2, 2), "DarkCyan");
            this.appendChild(obj1);
            let obj2 = this.createObject("Base", 1, new ƒ.Vector3(0.1, 0, 0.5), new ƒ.Vector3(0.15, 0.15, 0.5), "DarkCyan");
            this.appendChild(obj2);
            let obj3 = this.createObject("Base", 1, new ƒ.Vector3(-0.1, 0, 0.5), new ƒ.Vector3(0.15, 0.15, 0.5), "DarkCyan");
            this.appendChild(obj3);
            TowerDefenseGame.nonCombatBuildings.push(this);
        }
        buildScience_2() {
            let base = this.createObject("Base", 1, new ƒ.Vector3(0.25, 0, 0.5), new ƒ.Vector3(0.35, 0.35, 1), "Magenta");
            this.appendChild(base);
            let obj1 = this.createObject("Base", 1, new ƒ.Vector3(-0.25, 0, 0.5), new ƒ.Vector3(0.35, 0.35, 1), "Magenta");
            this.appendChild(obj1);
            let obj2 = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0), new ƒ.Vector3(0.35, 0.35, 0.2), "MediumVioletRed");
            this.appendChild(obj2);
            TowerDefenseGame.nonCombatBuildings.push(this);
        }
        // Create a simple object
        createObject(_nodeName, _meshType, _pos, _scale, _color) {
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
            let mtrColor = new ƒ.Material(_color, ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS(_color)));
            let object = new ƒAid.Node(_nodeName, ƒ.Matrix4x4.TRANSLATION(_pos), mtrColor, meshObject);
            let baseMeshCmp = object.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(_scale);
            return object;
        }
        // Create bullets and deal damage on enemies
        shoot() {
            // Check if a target exists
            if (!this.target) {
                return;
            }
            if (this.target.health < 0) {
                this.target = null;
                return;
            }
            // Tower type 3 is an acid tower, if this tower hits an enemy, the enemy is poisoned
            if (this.towerType == 3) {
                this.dotEnemy(this.target);
            }
            // Tower type 4 is an gravity tower, is this tower hits an enemy, the enemy is teleported back to the beginning of the path
            if (this.towerType == 4) {
                let bullet = new TowerDefenseGame.Bullet(this.top.mtxWorld.translation, this.target, this.damage);
                this.target.mtxLocal.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(TowerDefenseGame.pathPos[0].x, TowerDefenseGame.pathPos[0].y, 0)));
                this.target.nextWaypoint = 1;
            }
            // If its an normal tower, just deal damage and create a bullet
            else {
                let bullet = new TowerDefenseGame.Bullet(this.top.mtxWorld.translation, this.target, this.damage);
            }
        }
        // Poison the enemy
        dotEnemy(_enemy) {
            _enemy.isDotted = true;
            _enemy.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("Lime");
            _enemy.getComponent(ƒ.ComponentMaterial).material = new ƒ.Material("DotColor", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("Lime")));
        }
    }
    TowerDefenseGame.Building = Building;
})(TowerDefenseGame || (TowerDefenseGame = {}));
var TowerDefenseGame;
(function (TowerDefenseGame) {
    class Bullet extends ƒ.Node {
        constructor(_start, _target, _damage) {
            super("Projectile");
            this.speed = 10 / 1000;
            this.update = (_event) => {
                let position = this.mtxLocal.translation;
                let distance = ƒ.Vector3.DIFFERENCE(this.target.mtxLocal.translation, position);
                let distanceToTravel = this.speed * ƒ.Loop.timeFrameGame;
                if (distance.magnitudeSquared < distanceToTravel * distanceToTravel) {
                    this.target.health = this.target.health - this.damage;
                    TowerDefenseGame.viewport.getGraph().removeChild(this);
                    ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    //(<Enemy>this.target).hitCount++;
                    return;
                }
                let travel = ƒ.Vector3.NORMALIZATION(distance, distanceToTravel);
                this.mtxLocal.translate(travel);
            };
            this.target = _target;
            this.damage = _damage;
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_start)));
            let cmpMaterial = new ƒ.ComponentMaterial(Bullet.material);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("red");
            this.addComponent(cmpMaterial);
            let cmpMesh = new ƒ.ComponentMesh(Bullet.mesh);
            this.addComponent(cmpMesh);
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.1));
            TowerDefenseGame.viewport.getGraph().addChild(this);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
    }
    Bullet.material = new ƒ.Material("Projectile", ƒ.ShaderFlat, new ƒ.CoatColored());
    Bullet.mesh = new ƒ.MeshCube();
    TowerDefenseGame.Bullet = Bullet;
})(TowerDefenseGame || (TowerDefenseGame = {}));
var TowerDefenseGame;
(function (TowerDefenseGame) {
    // import ƒ = FudgeCore;
    // import ƒAid = FudgeAid;
    class ComponentPicker extends ƒ.Component {
        constructor(_radius = 0.01) {
            super();
            this.radius = 0.01;
            this.radius = _radius;
        }
        drawPickRadius(_viewport) {
            let pickData = this.getPickData();
            let crc2 = _viewport.getContext();
            crc2.save();
            crc2.beginPath();
            crc2.arc(pickData.canvas.x, pickData.canvas.y, pickData.radius.magnitude, 0, 2 * Math.PI);
            crc2.strokeStyle = "#000000";
            crc2.fillStyle = "#ffffff80";
            crc2.stroke();
            crc2.fill();
        }
        pick(_client) {
            let pickData = this.getPickData();
            let distance = ƒ.Vector2.DIFFERENCE(_client, pickData.canvas);
            if (distance.magnitudeSquared < pickData.radius.magnitudeSquared)
                return pickData;
            return null;
        }
        getPickData() {
            let node = this.getContainer();
            let projection = TowerDefenseGame.viewport.camera.project(node.mtxWorld.translation);
            let posClient = TowerDefenseGame.viewport.pointClipToClient(projection.toVector2());
            let projectionRadius = ƒ.Vector3.X(this.radius * node.mtxWorld.scaling.magnitude); // / 1.414);
            projectionRadius.transform(TowerDefenseGame.viewport.camera.pivot, false);
            projectionRadius = TowerDefenseGame.viewport.camera.project(ƒ.Vector3.SUM(node.mtxWorld.translation, projectionRadius));
            let posRadius = TowerDefenseGame.viewport.pointClipToClient(projectionRadius.toVector2());
            return { clip: projection, canvas: posClient, radius: ƒ.Vector2.DIFFERENCE(posRadius, posClient) };
        }
    }
    TowerDefenseGame.ComponentPicker = ComponentPicker;
})(TowerDefenseGame || (TowerDefenseGame = {}));
var TowerDefenseGame;
(function (TowerDefenseGame) {
    var ƒ = FudgeCore;
    //import ƒAid = FudgeAid;
    class Enemy extends ƒ.Node {
        //#endregion
        constructor(_enemyType, _health, _speed, _name, _pos, _moneyDrop) {
            super(_name);
            this.isDotted = false;
            this.nextWaypoint = 1;
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos)));
            this.speed = _speed;
            this.enemyType = _enemyType;
            this.health = _health;
            this.moneyDrop = _moneyDrop;
            this.createEnemy();
        }
        move() {
            // If the enemy reaches the base, the player loses X hp
            if (this.nextWaypoint == TowerDefenseGame.pathPos.length) {
                let index = TowerDefenseGame.enemies.indexOf(this, 0);
                TowerDefenseGame.enemies.splice(index, 1);
                TowerDefenseGame.baseHP--;
                this.destroyEnemy();
                return;
            }
            // If the player kills the enemy, he earns money and score points
            if (this.health <= 0) {
                let index = TowerDefenseGame.enemies.indexOf(this, 0);
                TowerDefenseGame.enemies.splice(index, 1);
                TowerDefenseGame.money = TowerDefenseGame.money + this.moneyDrop;
                TowerDefenseGame.score = TowerDefenseGame.score + this.moneyDrop;
                this.destroyEnemy();
                return;
            }
            let distanceToTravel = (1 / TowerDefenseGame.framerate) * this.speed; // Calculates the distance to travel each frame
            let move = new ƒ.Vector3(); // Stores the move direction (should be to the next waypoint)
            if (distanceToTravel == null) {
                console.error("distanceToTravel is null");
                return;
            }
            if (move == null) {
                console.error("move is null");
                return;
            }
            move = ƒ.Vector3.DIFFERENCE(new ƒ.Vector3(TowerDefenseGame.pathPos[this.nextWaypoint].x, TowerDefenseGame.pathPos[this.nextWaypoint].y, 0), this.mtxWorld.translation); // Calculates the move direction based on the next block (waypoint) and the current position of this object (enemy)
            // If the enemy is poisoned, his movement is reduced by 50%
            if (this.isDotted) {
                this.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(move, distanceToTravel / 2));
            }
            // If not, move with the normal speed
            else {
                this.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(move, distanceToTravel));
            }
            // Check if the waypoint was reached
            if (move.magnitudeSquared < distanceToTravel * distanceToTravel) {
                this.nextWaypoint = ++this.nextWaypoint;
            }
        }
        // Destroy this enemy
        destroyEnemy() {
            TowerDefenseGame.allEnemies.removeChild(this);
        }
        // Creates an enemy based on type
        createEnemy() {
            let cmpMaterial = new ƒ.ComponentMaterial(Enemy.material);
            let cmpMesh = new ƒ.ComponentMesh(Enemy.mesh);
            switch (this.enemyType) {
                case 1:
                    cmpMaterial.clrPrimary = ƒ.Color.CSS("Cyan");
                    cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.2));
                    break;
                case 2:
                    cmpMaterial.clrPrimary = ƒ.Color.CSS("DarkSeaGreen");
                    cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.4));
                    break;
                case 3:
                    cmpMaterial.clrPrimary = ƒ.Color.CSS("DarkMagenta");
                    cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.6));
                    break;
                case 4:
                    cmpMaterial.clrPrimary = ƒ.Color.CSS("Crimson");
                    cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.9));
                    break;
                default:
                    break;
            }
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
        }
    }
    //#region Attributes
    Enemy.material = new ƒ.Material("Enemy", ƒ.ShaderFlat, new ƒ.CoatColored());
    Enemy.mesh = new ƒ.MeshCube();
    TowerDefenseGame.Enemy = Enemy;
})(TowerDefenseGame || (TowerDefenseGame = {}));
var TowerDefenseGame;
(function (TowerDefenseGame) {
    let gameStartIn = 30;
    let firstEnemy = 1;
    let whenStrongerEnemiesSpawn = 30;
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    window.addEventListener("load", hndLoad);
    let towerDefenseGame = new ƒ.Node("TowerDefenseGame");
    let gameField = new ƒ.Node("GameField");
    let worldWidth;
    let worldHeight;
    TowerDefenseGame.allEnemies = new ƒ.Node("Enemies"); // Main node for all the enemies
    TowerDefenseGame.enemies = [];
    TowerDefenseGame.framerate = 30;
    TowerDefenseGame.money = 500; // Starting money
    TowerDefenseGame.towers = []; // Stores all the build towers
    TowerDefenseGame.nonCombatBuildings = []; // Stores all buildings that are not towers, like science and resource buildings
    TowerDefenseGame.baseHP = 20; // Base HP
    TowerDefenseGame.score = 0;
    let enemySpawnPeriod = 1; // Enemy spawn time in seconds
    let resourcePos = new ƒ.Vector2(); // Stores the position of the resource spot on the map
    let resourceAmount = 5000; // How much can be collected from the resource spot
    let curPathPos = new ƒ.Vector2();
    let enemyTimeout = 0;
    let currentMoneyCounterObject;
    let baseHPCounterObject;
    let resourceLeftCounterObject;
    let buildingConstructedNumber = 0;
    let depots = 0;
    let tradecenters = 0;
    let science1exists = false;
    let science2exists = false;
    let tower3field;
    let tower4field;
    let resource2field;
    let science2field;
    let restartMenu;
    let warningText;
    let scoreText;
    let lastPos;
    let curPos = new ƒ.Vector2();
    let lastBlockPos;
    let lastBlockColor;
    let currentTowerRange;
    let attackRangeObj;
    let allowdToBuildOnThisSpot;
    let increaseEnemyTimeout = 135;
    let frameCounter = 0;
    let timeCounter = 0;
    let gameStart = false;
    let obstaclePos = [];
    let enemy2Counter = 0;
    let enemy3Counter = 0;
    let enemy4Counter = 0;
    let enemy2TimeToSpawn = false;
    let enemy3TimeToSpawn = false;
    let enemy4TimeToSpawn = false;
    let warningTextAppeard = false;
    let warningTextShowTime = 3;
    let warningTextCounter = 0;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        TowerDefenseGame.viewport = new ƒ.Viewport();
        currentMoneyCounterObject = document.querySelector("#moneyValue");
        baseHPCounterObject = document.querySelector("#baseHPValue");
        resourceLeftCounterObject = document.querySelector("#resourceValue");
        let restartGame = document.getElementById("restartButton");
        let buildtower1 = document.getElementById("button_build_tower_1");
        let buildtower2 = document.getElementById("button_build_tower_2");
        let buildtower3 = document.getElementById("button_build_tower_3");
        let buildtower4 = document.getElementById("button_build_tower_4");
        let buildRessource1 = document.getElementById("button_build_ressource_1");
        let buildRessource2 = document.getElementById("button_build_ressource_2");
        let buildScience1 = document.getElementById("button_build_science_1");
        let buildScience2 = document.getElementById("button_build_science_2");
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
        towerDefenseGame.addChild(TowerDefenseGame.allEnemies);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translate(new ƒ.Vector3(worldWidth / 2, worldHeight / 2, 40));
        cmpCamera.pivot.rotateY(180);
        cmpCamera.backgroundColor = ƒ.Color.CSS("DarkSlateGray");
        TowerDefenseGame.viewport.initialize("Viewport", towerDefenseGame, cmpCamera, canvas);
        ƒAid.addStandardLightComponents(towerDefenseGame, new ƒ.Color(0.5, 0.5, 0.5));
        TowerDefenseGame.viewport.draw();
        TowerDefenseGame.viewport.addEventListener("\u0192pointermove" /* MOVE */, pointerMove);
        TowerDefenseGame.viewport.addEventListener("\u0192pointerdown" /* DOWN */, mousePressed);
        document.addEventListener("keydown", keyPressed);
        TowerDefenseGame.viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        TowerDefenseGame.viewport.activatePointerEvent("\u0192pointerdown" /* DOWN */, true);
        TowerDefenseGame.viewport.activatePointerEvent("\u0192pointerup" /* UP */, true);
        createWorld(worldWidth, worldHeight);
        showWarningText("Enemies attack base in 30 seconds.");
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, TowerDefenseGame.framerate);
    }
    function update(_event) {
        // Shows the game over menu if the player loses
        if (TowerDefenseGame.baseHP <= 0) {
            restartMenu.style.display = "flex";
            scoreText.textContent = "Score: " + TowerDefenseGame.score;
            return;
        }
        frameCounter++;
        enemyTimeout++;
        // Counts seconds + adds money + warning text
        if (frameCounter >= TowerDefenseGame.framerate) {
            timeCounter++;
            frameCounter = 0;
            // Check if depots exists which collects resources from the resource spot. Each depot collects 5 resource each second
            if (depots > 0) {
                // Check for each depot if resources are still left
                for (let i = 0; i < depots; i++) {
                    if (resourceAmount > 0) {
                        TowerDefenseGame.money = TowerDefenseGame.money + 5;
                        resourceAmount = resourceAmount - 5;
                    }
                }
            }
            // Each tradecenter generates 20 resource each second
            if (tradecenters > 0) {
                TowerDefenseGame.money = TowerDefenseGame.money + (20 * tradecenters);
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
        baseHPCounterObject.textContent = "Base HP: " + TowerDefenseGame.baseHP;
        resourceLeftCounterObject.textContent = "Resource left: " + resourceAmount;
        currentMoneyCounterObject.textContent = "Current money: " + TowerDefenseGame.money + " $";
        // Check if towes exists, if yes, check if enemies exists and follow them
        if (TowerDefenseGame.towers != null) {
            for (let tower of TowerDefenseGame.towers) {
                if (TowerDefenseGame.allEnemies != null) {
                    tower.followEnemy();
                }
            }
        }
        // Moves each enemy that exists each frame and check if the enemy is dotted / poisoned
        for (let enemy of TowerDefenseGame.enemies) {
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
        if (enemyTimeout >= (TowerDefenseGame.framerate / enemySpawnPeriod) && gameStart) {
            spawnEnemy(firstEnemy); // Spawns first the weakest enemies
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
        TowerDefenseGame.viewport.draw();
    }
    // Called each time the mouse moves
    function pointerMove(_event) {
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        if (buildingConstructedNumber == 0) {
            return;
        }
        lastPos = curPos; // Last spot stores the position from the old current spot. Necessary to compare the lastPos with the (new) current position
        // Check each field that exists on the map
        for (let fieldsX of TowerDefenseGame.fields) {
            for (let field of fieldsX) {
                let cmpPicker = field.getComponent(TowerDefenseGame.ComponentPicker);
                let pickData = cmpPicker.pick(posMouse);
                // Check if a cmp picker exists on this spot
                if (pickData) {
                    curPos = new ƒ.Vector2(field.mtxLocal.translation.x, field.mtxLocal.translation.x); // Stores the current position
                    moveNodeFromTo(attackRangeObj, field.mtxLocal.translation.x, field.mtxLocal.translation.y); // Moves the attack range object to the field position
                    attackRangeObj.mtxLocal.scale(new ƒ.Vector3(currentTowerRange, currentTowerRange, 0.1)); // Scales the attack range object depending on the current buildings attack range
                    // If the current position and the last one arent the same, the player moved his mouse from X block to Y block
                    // If this happens, change the color of the last block to the original one
                    if (curPos != lastPos) {
                        if (lastBlockPos != null) {
                            TowerDefenseGame.fields[lastBlockPos.x][lastBlockPos.y].getComponent(ƒ.ComponentMaterial).material = lastBlockColor;
                        }
                    }
                    lastBlockColor = field.getComponent(ƒ.ComponentMaterial).material; // Stores the color of his block, so in can be changed back to the original color after the player moved his mouse to another block
                    checkIfAllowedToBuildOnThisSpot(field);
                    if (allowdToBuildOnThisSpot) {
                        field.getComponent(ƒ.ComponentMaterial).material = createMat("GreenYellow");
                    }
                    else {
                        field.getComponent(ƒ.ComponentMaterial).material = createMat("red");
                    }
                    lastBlockPos = new ƒ.Vector2(field.mtxLocal.translation.x, field.mtxLocal.translation.y); // Stores the position of the last block
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
    // Restart the game by simple reloading the browser
    function restartTheGame() {
        window.location.reload();
    }
    // Core function to build / buy something, tower or non combat building. Checks if the player has enough money to build something
    // building: type of building (1 - 8) | cost: how much money need to build it
    function build(building, cost) {
        // Check if no building is waiting to be placed
        if (buildingConstructedNumber == 0) {
            TowerDefenseGame.viewport.getGraph().appendChild(attackRangeObj);
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
            if (TowerDefenseGame.money >= cost) {
                TowerDefenseGame.money = TowerDefenseGame.money - cost;
                buildingConstructedNumber = building;
            }
            else {
                showWarningText("Not enough money for this building.");
            }
        }
        else {
            showWarningText("Finished building need to be placed first before another one can be build.");
        }
    }
    function keyPressed(_event) {
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
    function spawnEnemy(_enemyType) {
        let enemy;
        // Spawns an enemy based on the type
        // Type 1 weakest but fastes ... Type 4 strongest but slowest
        switch (_enemyType) {
            case 1:
                enemy = new TowerDefenseGame.Enemy(_enemyType, 10, 5, "Enemy1", new ƒ.Vector3(TowerDefenseGame.pathPos[0].x, TowerDefenseGame.pathPos[0].y, 0), 2);
                break;
            case 2:
                enemy = new TowerDefenseGame.Enemy(_enemyType, 50, 3, "Enemy2", new ƒ.Vector3(TowerDefenseGame.pathPos[0].x, TowerDefenseGame.pathPos[0].y, 0), 5);
                break;
            case 3:
                enemy = new TowerDefenseGame.Enemy(_enemyType, 500, 2, "Enemy3", new ƒ.Vector3(TowerDefenseGame.pathPos[0].x, TowerDefenseGame.pathPos[0].y, 0), 50);
                break;
            case 4:
                enemy = new TowerDefenseGame.Enemy(_enemyType, 5000, 1, "Enemy4", new ƒ.Vector3(TowerDefenseGame.pathPos[0].x, TowerDefenseGame.pathPos[0].y, 0), 500);
                break;
            default:
                break;
        }
        TowerDefenseGame.enemies.push(enemy); // Adds the enemy to the enemies array
        TowerDefenseGame.allEnemies.appendChild(enemy); // Adds the enemy to the nodes so it can be added to the map
    }
    // Core function to place a building on the map
    function mousePressed(_event) {
        let pressedOnBuildingSpot = false; // Necessary to check if the player pressed the mouse over a building spot (on the map) or outsite the map
        let posMouse = new ƒ.Vector2(_event.canvasX, _event.canvasY);
        // Check each field in the game and place a building on the clicked spot if something is ready to be placed
        for (let fieldsX of TowerDefenseGame.fields) {
            for (let field of fieldsX) {
                let cmpPicker = field.getComponent(TowerDefenseGame.ComponentPicker);
                let pickData = cmpPicker.pick(posMouse);
                // Check if a cmp picker exists on this spot
                if (pickData) {
                    pressedOnBuildingSpot = true;
                    // Check if something is bought and can be placed on the current spot
                    if (buildingConstructedNumber != 0 && allowdToBuildOnThisSpot) {
                        // Check if a depot is bought. Calculates the distance between the building spot and the resource spot. The depot must be placed near a resource spot
                        if (buildingConstructedNumber == 5) {
                            let resourceSpotDistance;
                            resourceSpotDistance = ƒ.Vector3.DIFFERENCE(new ƒ.Vector3(field.cmpTransform.local.translation.x, field.cmpTransform.local.translation.y, 0), new ƒ.Vector3(resourcePos.x, resourcePos.y, 0)).magnitude;
                            if (resourceSpotDistance >= 2) {
                                showWarningText("Resource Spot to far away!");
                                return;
                            }
                        }
                        //createBuilding(buildingConstructedNumber, field.cmpTransform.local.translation.x, field.cmpTransform.local.translation.y);
                        createBuilding(buildingConstructedNumber, field.mtxWorld.translation.x, field.mtxWorld.translation.y);
                        obstaclePos.push(new ƒ.Vector2(field.cmpTransform.local.translation.x, field.cmpTransform.local.translation.y));
                        buildingConstructedNumber = 0; // Resets the building number to zero because a building was placed
                        allowdToBuildOnThisSpot = false;
                    }
                }
            }
        }
        // Check if a building was bought and the mouse was pressed outside the gamefield. Aborts the process and refunds the cost of the building
        if (!pressedOnBuildingSpot && buildingConstructedNumber != 0) {
            switch (buildingConstructedNumber) {
                case 1:
                    TowerDefenseGame.money = TowerDefenseGame.money + 100;
                    break;
                case 2:
                    TowerDefenseGame.money = TowerDefenseGame.money + 100;
                    break;
                case 3:
                    TowerDefenseGame.money = TowerDefenseGame.money + 500;
                    break;
                case 4:
                    TowerDefenseGame.money = TowerDefenseGame.money + 1000;
                    break;
                case 5:
                    TowerDefenseGame.money = TowerDefenseGame.money + 200;
                    break;
                case 6:
                    TowerDefenseGame.money = TowerDefenseGame.money + 1000;
                    break;
                case 7:
                    TowerDefenseGame.money = TowerDefenseGame.money + 500;
                    break;
                case 8:
                    TowerDefenseGame.money = TowerDefenseGame.money + 1000;
                    break;
                default:
                    break;
            }
            buildingConstructedNumber = 0;
            TowerDefenseGame.viewport.getGraph().removeChild(attackRangeObj);
            if (lastBlockPos != null) {
                TowerDefenseGame.fields[lastBlockPos.x][lastBlockPos.y].getComponent(ƒ.ComponentMaterial).material = lastBlockColor;
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
    }
    // Create a building on the given spot on the map
    function createBuilding(buildingType, _xPos, _yPos) {
        // Check what kind of building was given in the parameter
        switch (buildingType) {
            case 1:
                let tower1 = new TowerDefenseGame.Building(1, new ƒ.Vector3(0, 0, 0), 2, 10, 1.5);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("DodgerBlue");
                lastBlockColor = createMat("DodgerBlue");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(tower1);
                break;
            case 2:
                let tower2 = new TowerDefenseGame.Building(2, new ƒ.Vector3(0, 0, 0), 30, 0.5, 3);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("Crimson");
                lastBlockColor = createMat("Crimson");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(tower2);
                break;
            case 3:
                let tower3 = new TowerDefenseGame.Building(3, new ƒ.Vector3(0, 0, 0), 0, 1, 4);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("Lime");
                lastBlockColor = createMat("Lime");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(tower3);
                break;
            case 4:
                let tower4 = new TowerDefenseGame.Building(4, new ƒ.Vector3(0, 0, 0), 0, 1, 4);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("Fuchsia");
                lastBlockColor = createMat("Fuchsia");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(tower4);
                break;
            case 5:
                let buildRessource1 = new TowerDefenseGame.Building(5, new ƒ.Vector3(0, 0, 0), 0, 0, 0);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("GoldenRod");
                lastBlockColor = createMat("GoldenRod");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(buildRessource1);
                depots++;
                break;
            case 6:
                let buildRessource2 = new TowerDefenseGame.Building(6, new ƒ.Vector3(0, 0, 0), 0, 0, 0);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("DarkOrange");
                lastBlockColor = createMat("DarkOrange");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(buildRessource2);
                tradecenters++;
                break;
            case 7:
                let buildScience1 = new TowerDefenseGame.Building(7, new ƒ.Vector3(0, 0, 0), 0, 0, 0);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("DarkSlateGray");
                lastBlockColor = createMat("DarkSlateGray");
                TowerDefenseGame.fields[_xPos][_yPos].appendChild(buildScience1);
                science1exists = true;
                break;
            case 8:
                let buildScience2 = new TowerDefenseGame.Building(8, new ƒ.Vector3(0, 0, 0), 0, 0, 0);
                TowerDefenseGame.fields[_xPos][_yPos].getComponent(ƒ.ComponentMaterial).material = createMat("Indigo ");
                lastBlockColor = createMat("Indigo ");
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
                        TowerDefenseGame.fields[x][y] = createNodeField(x, y, "darkgreen");
                    }
                    else {
                        TowerDefenseGame.fields[x][y] = createNodeField(x, y, "green");
                    }
                }
                else {
                    if (y % 2 == 0) {
                        TowerDefenseGame.fields[x][y] = createNodeField(x, y, "green");
                    }
                    else {
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
    }
    function createMat(_color) {
        let mtrColor = new ƒ.Material(_color, ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS(_color)));
        return mtrColor;
    }
    function moveNodeFromTo(_from, _toX, _toY) {
        _from.mtxLocal.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(_toX, _toY, 0)));
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
    function hideWarningText() {
        warningText.style.visibility = "hidden";
    }
    function showWarningText(_text) {
        warningText.textContent = _text;
        warningText.style.visibility = "visible";
        warningTextCounter = 0;
        warningTextAppeard = true;
    }
})(TowerDefenseGame || (TowerDefenseGame = {}));
//# sourceMappingURL=TowerDefense.js.map