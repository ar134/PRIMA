"use strict";
var TowerDefenseGame;
(function (TowerDefenseGame) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Tower extends ƒ.Node {
        constructor(_towerType, _pos, _damage, _fireRate, _color, _range) {
            super("Tower");
            this.enemySpotted = false;
            this.position = _pos;
            this.damage = _damage;
            this.fireRate = _fireRate;
            this.color = _color;
            this.towerType = _towerType;
            this.timer = new ƒ.Timer(ƒ.Time.game, (1000 / this.fireRate), 0, this.shoot.bind(this));
            this.range = _range;
            this.init();
            //ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
        }
        /*
        public update(): void {
            console.log("Tower placed!");
            this.getEnemy();
            //this.follow();
        }
        */
        createMat(_color) {
            let mtrColor = new ƒ.Material("SolidWhite", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS(_color)));
            return mtrColor;
        }
        resetMaterialColor() {
            let newcmpMaterial = new ƒ.ComponentMaterial(this.createMat(this.color));
            let cmpMaterial = this.getChildrenByName("Tower Base")[0].getComponent(ƒ.ComponentMaterial);
            this.getChildrenByName("Tower Base")[0].removeComponent(cmpMaterial);
            this.getChildrenByName("Tower Base")[0].addComponent(newcmpMaterial);
            //cmpMaterial.clrPrimary= this.color;
        }
        setMaterialColor(_color) {
            let cmpMaterial = this.getChildrenByName("Tower Base")[0].getComponent(ƒ.ComponentMaterial);
            cmpMaterial.clrPrimary = _color;
        }
        getEnemy() {
            if (this.enemySpotted == false) {
                for (let enemy of TowerDefenseGame.enemies) {
                    let enemyDistance = ƒ.Vector3.DIFFERENCE(enemy.mtxWorld.translation, this.mtxWorld.translation).magnitude;
                    if (enemyDistance < this.range) {
                        this.target = enemy;
                        this.follow();
                        this.enemySpotted = true;
                    }
                    else {
                        this.enemySpotted = false;
                    }
                }
            }
        }
        followEnemy() {
            let enemyDistance;
            let enemyBaseDistance = 0;
            for (let enemy of TowerDefenseGame.enemies) {
                enemyDistance = ƒ.Vector3.DIFFERENCE(enemy.mtxWorld.translation, this.mtxWorld.translation).magnitude;
                if (enemyDistance < this.range) {
                    if (enemy.nextWaypoint > enemyBaseDistance) {
                        enemyBaseDistance = enemy.nextWaypoint;
                        this.target = enemy;
                        this.top.cmpTransform.lookAt(this.target.mtxWorld.translation);
                    }
                }
            }
        }
        follow() {
            this.top.cmpTransform.lookAt(this.target.mtxWorld.translation);
        }
        shoot() {
            if (!this.target) {
                return;
            }
            if (this.target.health < 0) {
                this.target = null;
                return;
            }
            let bullet = new TowerDefenseGame.Bullet(this.top.mtxWorld.translation, this.target, this.damage);
        }
        init() {
            //this.mtr = new ƒ.Material("SolidWhite", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS(this.color)));
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
            //ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update.bind(this));
            this.addComponent(new TowerDefenseGame.ComponentPicker(0.1));
        }
        buildTower_1() {
            let meshCube = new ƒ.MeshCube();
            /*
            let towerGround: ƒAid.Node = new ƒAid.Node("Tower Ground", ƒ.Matrix4x4.IDENTITY(), this.createMat("Lime"), meshCube);
            let towerGroundMeshCmp: ƒ.ComponentMesh = towerGround.getComponent(ƒ.ComponentMesh);
            towerGroundMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 0.1));
            this.appendChild(towerGround);
            */
            /*
            let meshComponent: ƒ.ComponentMesh = new ƒ.ComponentMesh(meshObject);
            let matColor: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderFlat, new ƒ.CoatColored(ƒ.Color.CSS(this.color)));
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(matColor);

            let base: ƒAid.Node = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.IDENTITY(), this.mtr, meshObject);
            this.appendChild(base);
            */
            //let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere = new ƒ.MeshSphere();
            //let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.2)), this.createMat("Maroon"), meshCube);
            let baseMeshCmp = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 0.2));
            baseMeshCmp.pivot.rotateZ(45);
            this.appendChild(base);
            /*
            let body: ƒAid.Node = new ƒAid.Node("Tower Body", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(0.5)), this.mtr, meshCube);
            let bodyMeshCmp: ƒ.ComponentMesh = body.getComponent(ƒ.ComponentMesh);
            bodyMeshCmp.pivot.scale(new ƒ.Vector3(1.5, 4, 1.5));
            this.appendChild(body);
            */
            let cannon = new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.3)), this.createMat("DarkGreen"), meshSphere);
            let cannonMeshCmp = cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(0.5));
            this.top = cannon;
            //let mtxTop: ƒ.Matrix4x4 = this.top.getComponent(ƒ.ComponentMesh).pivot;
            //mtxTop.rotateY(150);
            this.appendChild(this.top);
            //let cannonBarrel: ƒAid.Node = new ƒAid.Node("Canon Barrel 1", ƒ.Matrix4x4.IDENTITY(), this.createMat("DarkSlateGrey"), meshCube);
            //let mtxCannonBarrel: ƒ.Matrix4x4 = this.gun.getComponent(ƒ.ComponentMesh).pivot;
            this.gun = new ƒAid.Node("Base", ƒ.Matrix4x4.IDENTITY(), Tower.material, Tower.meshGun);
            let mtxGun = this.gun.getComponent(ƒ.ComponentMesh).pivot;
            mtxGun.scale(new ƒ.Vector3(0.1, 0.1, 0.4));
            mtxGun.translateZ(0.5);
            //mtxCannonBarrel.translateZ(0.5);
            //let cannonBarrelMeshCmp: ƒ.ComponentMesh = cannonBarrel.getComponent(ƒ.ComponentMesh);
            //cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.1, 0.5, 0.2));
            cannon.appendChild(this.gun);
            /*
            let cannonBarrel: ƒAid.Node = new ƒAid.Node("Canon Barrel 1", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-0.1, 0.2, 0)), this.createMat("DarkSlateGrey"), meshCube);
            let cannonBarrelMeshCmp: ƒ.ComponentMesh = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.1, 0.5, 0.2));
            cannon.appendChild(cannonBarrel);

            let cannonBarrel2: ƒAid.Node = new ƒAid.Node("Canon Barrel 2", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0.1, 0.2, 0)), this.createMat("DarkSlateGrey"), meshCube);
            let cannonBarrelMeshCmp2: ƒ.ComponentMesh = cannonBarrel2.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp2.pivot.scale(new ƒ.Vector3(0.1, 0.5, 0.2));
            cannon.appendChild(cannonBarrel2);
            */
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            //let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(this.position.x, this.position.y, 0)));
            this.addComponent(towerTransformation);
            TowerDefenseGame.towers.push(this);
        }
        buildTower_2() {
            let meshCube = new ƒ.MeshCube();
            let towerGround = new ƒAid.Node("Tower Ground", ƒ.Matrix4x4.IDENTITY(), this.createMat("Red"), meshCube);
            let towerGroundMeshCmp = towerGround.getComponent(ƒ.ComponentMesh);
            towerGroundMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 0.1));
            this.appendChild(towerGround);
            //let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere = new ƒ.MeshSphere();
            //let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.2)), this.createMat("Maroon"), meshCube);
            let baseMeshCmp = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 0.2));
            baseMeshCmp.pivot.rotateZ(45);
            this.appendChild(base);
            let cannon = new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.3)), this.createMat("DarkGreen"), meshSphere);
            let cannonMeshCmp = cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(0.5));
            this.appendChild(cannon);
            let cannonBarrel = new ƒAid.Node("Canon Barrel 1", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(-0.1, 0.2, 0)), this.createMat("DarkSlateGrey"), meshCube);
            let cannonBarrelMeshCmp = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.1, 0.5, 0.2));
            cannon.appendChild(cannonBarrel);
            let cannonBarrel2 = new ƒAid.Node("Canon Barrel 2", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0.1, 0.2, 0)), this.createMat("DarkSlateGrey"), meshCube);
            let cannonBarrelMeshCmp2 = cannonBarrel2.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp2.pivot.scale(new ƒ.Vector3(0.1, 0.5, 0.2));
            cannon.appendChild(cannonBarrel2);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            //let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(this.position.x, this.position.y, 0)));
            this.addComponent(towerTransformation);
        }
        buildTower_3() {
            let meshCube = new ƒ.MeshCube();
            let towerGround = new ƒAid.Node("Tower Ground", ƒ.Matrix4x4.IDENTITY(), this.createMat("Blue"), meshCube);
            let towerGroundMeshCmp = towerGround.getComponent(ƒ.ComponentMesh);
            towerGroundMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 0.1));
            this.appendChild(towerGround);
            //let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere = new ƒ.MeshSphere();
            //let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.2)), this.createMat("Maroon"), meshCube);
            let baseMeshCmp = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 0.2));
            baseMeshCmp.pivot.rotateZ(45);
            this.appendChild(base);
            let cannon = new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.3)), this.createMat("DarkGreen"), meshSphere);
            let cannonMeshCmp = cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(0.5));
            this.appendChild(cannon);
            let cannonBarrel = new ƒAid.Node("Canon Barrel 1", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 0.2, 0)), this.createMat("DarkSlateGrey"), meshCube);
            let cannonBarrelMeshCmp = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.1, 0.5, 0.2));
            cannon.appendChild(cannonBarrel);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            //let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(this.position.x, this.position.y, 0)));
            this.addComponent(towerTransformation);
        }
        buildTower_4() {
            let meshCube = new ƒ.MeshCube();
            let towerGround = new ƒAid.Node("Tower Ground", ƒ.Matrix4x4.IDENTITY(), this.createMat("Pink"), meshCube);
            let towerGroundMeshCmp = towerGround.getComponent(ƒ.ComponentMesh);
            towerGroundMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 0.1));
            this.appendChild(towerGround);
            //let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere = new ƒ.MeshSphere();
            //let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.2)), this.createMat("Maroon"), meshCube);
            let baseMeshCmp = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 0.2));
            baseMeshCmp.pivot.rotateZ(45);
            this.appendChild(base);
            let cannon = new ƒAid.Node("Tower Cannon", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.3)), this.createMat("DarkGreen"), meshSphere);
            let cannonMeshCmp = cannon.getComponent(ƒ.ComponentMesh);
            cannonMeshCmp.pivot.scale(ƒ.Vector3.ONE(0.5));
            this.appendChild(cannon);
            let cannonBarrel = new ƒAid.Node("Canon Barrel 1", ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(0, 0.2, 0)), this.createMat("DarkSlateGrey"), meshCube);
            let cannonBarrelMeshCmp = cannonBarrel.getComponent(ƒ.ComponentMesh);
            cannonBarrelMeshCmp.pivot.scale(new ƒ.Vector3(0.1, 0.5, 0.2));
            cannon.appendChild(cannonBarrel);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            //let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(this.position.x, this.position.y, 0)));
            this.addComponent(towerTransformation);
        }
        buildResource_1() {
            let meshCube = new ƒ.MeshCube();
            let towerGround = new ƒAid.Node("Tower Ground", ƒ.Matrix4x4.IDENTITY(), this.createMat("Gold"), meshCube);
            let towerGroundMeshCmp = towerGround.getComponent(ƒ.ComponentMesh);
            towerGroundMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 0.1));
            this.appendChild(towerGround);
            //let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere = new ƒ.MeshSphere();
            //let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.2)), this.createMat("Yellow"), meshCube);
            let baseMeshCmp = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 0.2));
            baseMeshCmp.pivot.rotateZ(45);
            this.appendChild(base);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            //let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(this.position.x, this.position.y, 0)));
            this.addComponent(towerTransformation);
        }
        buildResource_2() {
            let meshCube = new ƒ.MeshCube();
            let towerGround = new ƒAid.Node("Tower Ground", ƒ.Matrix4x4.IDENTITY(), this.createMat("Gold"), meshCube);
            let towerGroundMeshCmp = towerGround.getComponent(ƒ.ComponentMesh);
            towerGroundMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 0.1));
            this.appendChild(towerGround);
            //let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere = new ƒ.MeshSphere();
            //let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.2)), this.createMat("Yellow"), meshCube);
            let baseMeshCmp = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 0.2));
            baseMeshCmp.pivot.rotateZ(45);
            this.appendChild(base);
            let pointer = new ƒAid.Node("Pointer", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.4)), this.createMat("Grey"), meshCube);
            let pointerMeshCmp = pointer.getComponent(ƒ.ComponentMesh);
            pointerMeshCmp.pivot.scale(new ƒ.Vector3(0.3, 0.3, 0.4));
            pointerMeshCmp.pivot.rotateZ(45);
            this.appendChild(pointer);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            //let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(this.position.x, this.position.y, 0)));
            this.addComponent(towerTransformation);
        }
        buildScience_1() {
            let meshCube = new ƒ.MeshCube();
            let towerGround = new ƒAid.Node("Tower Ground", ƒ.Matrix4x4.IDENTITY(), this.createMat("Lightblue"), meshCube);
            let towerGroundMeshCmp = towerGround.getComponent(ƒ.ComponentMesh);
            towerGroundMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 0.1));
            this.appendChild(towerGround);
            //let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere = new ƒ.MeshSphere();
            //let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.2)), this.createMat("Blue"), meshCube);
            let baseMeshCmp = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 0.2));
            baseMeshCmp.pivot.rotateZ(45);
            this.appendChild(base);
            let pointer = new ƒAid.Node("Pointer", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.4)), this.createMat("Grey"), meshCube);
            let pointerMeshCmp = pointer.getComponent(ƒ.ComponentMesh);
            pointerMeshCmp.pivot.scale(new ƒ.Vector3(0.3, 0.3, 0.4));
            pointerMeshCmp.pivot.rotateZ(45);
            this.appendChild(pointer);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            //let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(this.position.x, this.position.y, 0)));
            this.addComponent(towerTransformation);
        }
        buildScience_2() {
            let meshCube = new ƒ.MeshCube();
            let towerGround = new ƒAid.Node("Tower Ground", ƒ.Matrix4x4.IDENTITY(), this.createMat("DarkMagenta"), meshCube);
            let towerGroundMeshCmp = towerGround.getComponent(ƒ.ComponentMesh);
            towerGroundMeshCmp.pivot.scale(new ƒ.Vector3(1, 1, 0.1));
            this.appendChild(towerGround);
            //let meshCube: ƒ.MeshCube = new ƒ.MeshCube();
            let meshSphere = new ƒ.MeshSphere();
            //let mtrCannon: ƒ.Material = new ƒ.Material("towerMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.2, 0.2, 0.2)));
            let base = new ƒAid.Node("Tower Base", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.2)), this.createMat("Pink"), meshCube);
            let baseMeshCmp = base.getComponent(ƒ.ComponentMesh);
            baseMeshCmp.pivot.scale(new ƒ.Vector3(0.5, 0.5, 0.2));
            baseMeshCmp.pivot.rotateZ(45);
            this.appendChild(base);
            let pointer = new ƒAid.Node("Pointer", ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(0.4)), this.createMat("Grey"), meshCube);
            let pointerMeshCmp = pointer.getComponent(ƒ.ComponentMesh);
            pointerMeshCmp.pivot.scale(new ƒ.Vector3(0.3, 0.3, 0.4));
            pointerMeshCmp.pivot.rotateZ(45);
            this.appendChild(pointer);
            let towerTransformation = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(this.position));
            //let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(new ƒ.Vector3(this.position.x, this.position.y, 0)));
            this.addComponent(towerTransformation);
        }
    }
    Tower.material = new ƒ.Material("Tower", ƒ.ShaderFlat, new ƒ.CoatColored());
    //private static meshBase: ƒ.MeshPyramid = new ƒ.MeshPyramid();
    //private static meshTop: ƒ.MeshSphere = new ƒ.MeshSphere(10, 4);
    Tower.meshGun = new ƒ.MeshCube();
    TowerDefenseGame.Tower = Tower;
})(TowerDefenseGame || (TowerDefenseGame = {}));
//# sourceMappingURL=Tower.js.map