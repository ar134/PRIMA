"use strict";
var TowerDefenseGame;
(function (TowerDefenseGame) {
    var ƒ = FudgeCore;
    //import ƒAid = FudgeAid;
    class Enemy extends ƒ.Node {
        //#endregion
        constructor(_enemyType, _health, _speed, _name, _pos, _moneyDrop) {
            super(_name);
            this.nextWaypoint = 1;
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos)));
            this.speed = _speed;
            this.enemyType = _enemyType;
            this.health = _health;
            this.moneyDrop = _moneyDrop;
            this.createEnemy();
            //ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }
        move() {
            //console.log("Enemy moved.");
            if (this.nextWaypoint == TowerDefenseGame.pathPos.length) {
                //console.log("Object destroyed!");
                let index = TowerDefenseGame.enemies.indexOf(this, 0);
                TowerDefenseGame.enemies.splice(index, 1);
                TowerDefenseGame.baseHP--;
                this.destroyEnemy();
                return;
            }
            if (this.health <= 0) {
                //console.log("Object destroyed!");
                let index = TowerDefenseGame.enemies.indexOf(this, 0);
                TowerDefenseGame.enemies.splice(index, 1);
                TowerDefenseGame.money = TowerDefenseGame.money + this.moneyDrop;
                this.destroyEnemy();
                return;
            }
            //let distanceToTravel: number = this.speed * ƒ.Loop.timeFrameGame;   // Calculates the distance to travel each frame
            let distanceToTravel = (1 / TowerDefenseGame.framerate) * this.speed;
            let move = new ƒ.Vector3(); // Stores the move direction
            if (distanceToTravel == null) {
                console.error("distanceToTravel is null");
                return;
            }
            if (move == null) {
                console.error("move is null");
                return;
            }
            move = ƒ.Vector3.DIFFERENCE(new ƒ.Vector3(TowerDefenseGame.pathPos[this.nextWaypoint].x, TowerDefenseGame.pathPos[this.nextWaypoint].y, 0), this.mtxWorld.translation); // Calculates the move direction based on the next block (waypoint) and the current position of this object (enemy)
            //console.log("move: " + move + " distanceToTravel: " + distanceToTravel);
            this.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(move, distanceToTravel));
            // Check if the waypoint was reached
            if (move.magnitudeSquared < distanceToTravel * distanceToTravel) {
                this.nextWaypoint = ++this.nextWaypoint;
            }
        }
        // Destroy this enemy
        destroyEnemy() {
            TowerDefenseGame.enemiesNode.removeChild(this);
            //ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }
        /*
        private update = (_event: ƒ.Eventƒ): void => {

            // Destroy this enemy if he reaches the base or has zero or lower hp
            if (this.nextWaypoint == pathPos.length || this.health <= 0) {
                this.destroyEnemy();
                return;
            }

            let distanceToTravel: number = this.speed * ƒ.Loop.timeFrameGame;   // Calculates the distance to travel each frame
            let move: ƒ.Vector3;    // Stores the move direction
            move = ƒ.Vector3.DIFFERENCE(new ƒ.Vector3(pathPos[this.nextWaypoint].x, pathPos[this.nextWaypoint].y, 0), this.mtxLocal.translation);   // Calculates the move direction based on the next block (waypoint) and the current position of this object (enemy)
            this.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(move, distanceToTravel));
            
            // Check if the waypoint was reached
            if (move.magnitudeSquared < distanceToTravel * distanceToTravel) {
                this.nextWaypoint = ++this.nextWaypoint;
            }
        }
        */
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
                    cmpMaterial.clrPrimary = ƒ.Color.CSS("crimson");
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
//# sourceMappingURL=Enemy.js.map