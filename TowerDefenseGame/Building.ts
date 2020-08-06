namespace TowerDefenseGame {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Building extends ƒ.Node {

        public top: ƒ.Node;
        
        protected position: ƒ.Vector3;
        protected damage: number;

        private fireRate: number;
        private target: Enemy;
        private gun: ƒ.Node;
        private towerType: number;
        private timer: ƒ.Timer;
        private range: number;

        constructor(_buildingType: number, _pos: ƒ.Vector3, _damage: number, _fireRate: number, _range: number) {
            super("Building");
            this.position = _pos;
            this.damage = _damage;
            this.fireRate = _fireRate;
            this.towerType = _buildingType;
            this.timer = new ƒ.Timer(ƒ.Time.game, (1000 / this.fireRate), 0, this.shoot.bind(this));
            this.range = _range;
            this.init();

        }

        public createMat(_color: string): ƒ.Material {

            let mtrColor: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS(_color)));
            return mtrColor;
        }

        // Searches and follows enemies that are close
        public followEnemy(): void {

            let enemyDistance: number;
            let enemyBaseDistance: number = 0;
            let enemiesInAttackRange: number = 0;

            for (let enemy of enemies) {

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
        protected init(): void {

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

            this.addComponent(new ComponentPicker(0.1));
        }

        protected buildTower_1(): void {

            let base: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.5, 0.5, 0.2), "Navy");
            base.cmpTransform.local.rotateZ(45);
            this.appendChild(base);

            this.top = this.createObject("Top", 2, new ƒ.Vector3(0, 0, 0.5), new ƒ.Vector3(0.4, 0.4, 0.4), "DodgerBlue");
            this.top.mtxLocal.rotateY(90);
            this.top.mtxLocal.rotateX(-45);
            base.appendChild(this.top);
            
            this.gun = this.createObject("Gun", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.1, 0.1, 0.4), "DarkSlateGray");
            this.top.appendChild(this.gun);

            let towerTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            this.addComponent(towerTransformation);

            towers.push(this);
        }

        protected buildTower_2(): void {

            let base: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.7, 0.7, 0.1), "Maroon");
            base.cmpTransform.local.rotateZ(45);
            this.appendChild(base);

            this.top = this.createObject("Top", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.5, 0.5, 0.5), "Crimson");
            this.top.mtxLocal.rotateY(90);
            this.top.mtxLocal.rotateX(-45);
            base.appendChild(this.top);

            this.gun = this.createObject("Gun", 1, new ƒ.Vector3(0, 0.15, 0.5), new ƒ.Vector3(0.15, 0.15, 0.4), "DarkSlateGray");
            this.top.appendChild(this.gun);

            let gun2: ƒ.Node = this.createObject("Gun2", 1, new ƒ.Vector3(0, -0.15, 0.5), new ƒ.Vector3(0.15, 0.15, 0.4), "DarkSlateGray");
            this.top.appendChild(gun2);

            let towerTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            this.addComponent(towerTransformation);

            towers.push(this);
        }

        protected buildTower_3(): void {
            
            let base: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.6, 0.6, 0.2), "SeaGreen");
            base.cmpTransform.local.rotateZ(45);
            this.appendChild(base);

            this.top = this.createObject("Cannon", 2, new ƒ.Vector3(0, 0, 0.5), new ƒ.Vector3(0.5, 0.5, 0.5), "Lime");
            this.top.mtxLocal.rotateY(90);
            this.top.mtxLocal.rotateX(-45);
            base.appendChild(this.top);

            
            this.gun = this.createObject("Gun", 1, new ƒ.Vector3(0, 0, 0.1), new ƒ.Vector3(0.1, 0.1, 0.8), "DarkSlateGray");
            this.top.appendChild(this.gun);

            let acidTank: ƒ.Node = this.createObject("AcitTank", 2, new ƒ.Vector3(0, 0.1, -0.2), new ƒ.Vector3(0.3, 0.3, 0.3), "SeaGreen");
            this.top.appendChild(acidTank);

            let acidTank2: ƒ.Node = this.createObject("AcitTank", 2, new ƒ.Vector3(0, -0.1, -0.2), new ƒ.Vector3(0.3, 0.3, 0.3), "SeaGreen");
            this.top.appendChild(acidTank2);

            let towerTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            this.addComponent(towerTransformation);

            towers.push(this);
        }

        protected buildTower_4(): void {
            
            let base: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.7, 0.7, 0.2), "DarkViolet");
            base.cmpTransform.local.rotateZ(45);
            this.appendChild(base);

            let obj1: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0.3, 0, 1), new ƒ.Vector3(0.15, 0.15, 2), "Fuchsia");
            this.appendChild(obj1);

            let obj2: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(-0.3, 0, 1), new ƒ.Vector3(0.15, 0.15, 2), "Fuchsia");
            this.appendChild(obj2);

            let obj3: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0, 0.3, 1), new ƒ.Vector3(0.15, 0.15, 2), "Fuchsia");
            this.appendChild(obj3); 

            this.top = this.createObject("Cannon", 2, new ƒ.Vector3(0, 0, 2), new ƒ.Vector3(0.3, 0.3, 0.3), "Black");
            base.appendChild(this.top);
            
            let towerTransformation: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            this.addComponent(towerTransformation);

            towers.push(this);
        }

        protected buildResource_1(): void {
            
            let base: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0.2, 0, 0.2), new ƒ.Vector3(0.5, 0.6, 0.2), "Peru");
            this.appendChild(base);

            let obj1: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(-0.2, -0.1, 0.2), new ƒ.Vector3(0.2, 0.2, 0.2), "Orange");
            this.appendChild(obj1);

            let obj2: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(-0.2, 0.2, 0.2), new ƒ.Vector3(0.15, 0.15, 0.2), "Sienna");
            this.appendChild(obj2);

            nonCombatBuildings.push(this);
        }

        protected buildResource_2(): void {
            
            let base: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0), new ƒ.Vector3(0.8, 0.8, 0.8), "DarkGoldenRod");
            this.appendChild(base);

            let obj1: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.5), new ƒ.Vector3(0.7, 0.7, 0.7), "DarkGoldenRod");
            this.appendChild(obj1);

            let obj2: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 1), new ƒ.Vector3(0.6, 0.6, 0.6), "DarkGoldenRod");
            this.appendChild(obj2);

            nonCombatBuildings.push(this);
        }

        protected buildScience_1(): void {
            
            let base: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0.2), new ƒ.Vector3(0.6, 0.5, 0.5), "DarkTurquoise");
            this.appendChild(base);

            let obj1: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0, 0.4, 0), new ƒ.Vector3(0.2, 0.2, 2), "DarkCyan");
            this.appendChild(obj1);

            let obj2: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0.1, 0, 0.5), new ƒ.Vector3(0.15, 0.15, 0.5), "DarkCyan");
            this.appendChild(obj2);

            let obj3: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(-0.1, 0, 0.5), new ƒ.Vector3(0.15, 0.15, 0.5), "DarkCyan");
            this.appendChild(obj3);

            nonCombatBuildings.push(this);
        }

        protected buildScience_2(): void {
            
            let base: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0.25, 0, 0.5), new ƒ.Vector3(0.35, 0.35, 1), "Magenta");
            this.appendChild(base);

            let obj1: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(-0.25, 0, 0.5), new ƒ.Vector3(0.35, 0.35, 1), "Magenta");
            this.appendChild(obj1);

            let obj2: ƒ.Node = this.createObject("Base", 1, new ƒ.Vector3(0, 0, 0), new ƒ.Vector3(0.35, 0.35, 0.2), "MediumVioletRed");
            this.appendChild(obj2);

            nonCombatBuildings.push(this);
        }

        // Create a simple object
        protected createObject(_nodeName: string, _meshType: number, _pos: ƒ.Vector3, _scale: ƒ.Vector3, _color: string): ƒ.Node {

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
    
            let mtrColor: ƒ.Material = new ƒ.Material(_color, ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS(_color)));
            let object: ƒAid.Node = new ƒAid.Node(_nodeName, ƒ.Matrix4x4.TRANSLATION(_pos), mtrColor, meshObject);
            let baseMeshCmp: ƒ.ComponentMesh = object.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(_scale);
    
            return object;
        }

        // Create bullets and deal damage on enemies
        private shoot(): void {

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
                let bullet: Bullet = new Bullet(this.top.mtxWorld.translation, this.target, this.damage);
                this.target.mtxLocal.set(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(pathPos[0].x, pathPos[0].y, 0)));
                this.target.nextWaypoint = 1;
            } 
            
            // If its an normal tower, just deal damage and create a bullet
            else {
                let bullet: Bullet = new Bullet(this.top.mtxWorld.translation, this.target, this.damage);
            }
        }

        // Poison the enemy
        private dotEnemy(_enemy: Enemy): void {
            _enemy.isDotted = true;
            _enemy.getComponent(ƒ.ComponentMaterial).clrPrimary = ƒ.Color.CSS("Lime");
            _enemy.getComponent(ƒ.ComponentMaterial).material = new ƒ.Material("DotColor", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS("Lime")));
        }
    }
}