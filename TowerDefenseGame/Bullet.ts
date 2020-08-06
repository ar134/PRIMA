namespace TowerDefenseGame {

    export class Bullet extends ƒ.Node {

        private static material: ƒ.Material = new ƒ.Material("Projectile", ƒ.ShaderFlat, new ƒ.CoatColored());
        private static mesh: ƒ.MeshCube = new ƒ.MeshCube();

        
        public speed: number = 10 / 1000;
        public target: Enemy;
        
        private damage: number;

        constructor(_start: ƒ.Vector3, _target: Enemy, _damage: number) {

            super("Projectile");
            this.target = _target;
            this.damage = _damage;

            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_start)));

            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Bullet.material);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("red");
            this.addComponent(cmpMaterial);

            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(Bullet.mesh);
            this.addComponent(cmpMesh);
            cmpMesh.pivot.scale(ƒ.Vector3.ONE(0.1));

            viewport.getGraph().addChild(this);

            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }

        private update = (_event: ƒ.Eventƒ): void => {
        let position: ƒ.Vector3 = this.mtxLocal.translation;
        let distance: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(this.target.mtxLocal.translation, position);
        let distanceToTravel: number = this.speed * ƒ.Loop.timeFrameGame;

        if (distance.magnitudeSquared < distanceToTravel * distanceToTravel) {
            
            this.target.health = this.target.health - this.damage;

            viewport.getGraph().removeChild(this);
            ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            //(<Enemy>this.target).hitCount++;
            return;
        }

        let travel: ƒ.Vector3 = ƒ.Vector3.NORMALIZATION(distance, distanceToTravel);
        this.mtxLocal.translate(travel);
        
        }
    }
}