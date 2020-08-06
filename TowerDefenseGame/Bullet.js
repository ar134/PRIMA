"use strict";
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
//# sourceMappingURL=Bullet.js.map