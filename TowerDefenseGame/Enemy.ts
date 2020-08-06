namespace TowerDefenseGame {
    import ƒ = FudgeCore;
    //import ƒAid = FudgeAid;

    export class Enemy extends ƒ.Node {

        //#region Attributes

        private static material: ƒ.Material = new ƒ.Material("Enemy", ƒ.ShaderFlat, new ƒ.CoatColored());
        private static mesh: ƒ.MeshCube = new ƒ.MeshCube();
        
        public name: string;
        public isDotted: boolean = false;
        
        public nextWaypoint: number = 1;
        public health: number;
        private enemyType: number;
        private speed: number;

        private moneyDrop: number;

        //#endregion
        
        constructor(_enemyType: number, _health: number, _speed: number, _name: string, _pos: ƒ.Vector3, _moneyDrop: number) {
            super(_name);

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_pos)));

            this.speed = _speed;
            this.enemyType = _enemyType;
            this.health = _health;
            this.moneyDrop = _moneyDrop;

            this.createEnemy();
        }

        public move(): void {

            // If the enemy reaches the base, the player loses X hp
            if (this.nextWaypoint == pathPos.length) {
                let index: number = enemies.indexOf(this, 0);
                enemies.splice(index, 1);
                baseHP--;
                this.destroyEnemy();
                return;
            }

            // If the player kills the enemy, he earns money and score points
            if (this.health <= 0) {
                let index: number = enemies.indexOf(this, 0);
                enemies.splice(index, 1);
                money = money + this.moneyDrop;
                score = score +  this.moneyDrop;
                this.destroyEnemy();
                return;
            }

            let distanceToTravel: number = (1 / framerate) * this.speed;    // Calculates the distance to travel each frame
            let move: ƒ.Vector3 = new ƒ.Vector3();    // Stores the move direction (should be to the next waypoint)
            
            if (distanceToTravel == null) {
                console.error("distanceToTravel is null");
                return;
            }

            if (move == null) {
                console.error("move is null");
                return;
            }

            move = ƒ.Vector3.DIFFERENCE(new ƒ.Vector3(pathPos[this.nextWaypoint].x, pathPos[this.nextWaypoint].y, 0), this.mtxWorld.translation);   // Calculates the move direction based on the next block (waypoint) and the current position of this object (enemy)

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
        public destroyEnemy(): void {
            allEnemies.removeChild(this);
        }

        // Creates an enemy based on type
        private createEnemy(): void {

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Enemy.material);
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(Enemy.mesh);

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
}