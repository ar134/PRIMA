"use strict";
var Snake_Game;
(function (Snake_Game) {
    // import ƒ = FudgeCore;
    // import ƒAid = FudgeAid;
    class Enemy extends Snake_Game.Snake {
        constructor(_name = "Enemy", _color = ƒ.Color.CSS("blue")) {
            super(_name, _color);
            this.detectionRange = 5;
        }
        move() {
            let angle = this.chooseTurn();
            this.rotate(ƒ.Vector3.Y(angle));
            super.move();
        }
        chooseTurn() {
            let result = 0;
            let foodInRange = this.detectFood();
            if (!foodInRange.length)
                return result;
            let distances;
            for (let angle of [0, -90, 0, 90]) {
                let minSquareDistance = Number.POSITIVE_INFINITY;
                let test = this.head.mtxLocal.copy;
                if (!distances) {
                    // first iteration on the current position of head
                    distances = [];
                }
                else {
                    // following iterations at possible positions for next step
                    test.rotate(ƒ.Vector3.Y(angle));
                    test.translate(this.dirCurrent);
                }
                for (let food of foodInRange) {
                    let translation = test.getTranslationTo(food.mtxLocal);
                    let squareDistance = translation.magnitudeSquared;
                    minSquareDistance = Math.min(minSquareDistance, squareDistance);
                }
                distances.push({ angle: angle, distance: minSquareDistance });
            }
            distances.sort((_a, _b) => _a.distance < _b.distance ? -1 : 1);
            if (distances.length)
                result = distances[0].angle;
            return result;
        }
        detectFood() {
            let foodInRange = [];
            for (let item of Snake_Game.items.getChildren()) {
                let position = item.mtxLocal.translation;
                if (position.isInsideSphere(this.head.mtxLocal.translation, this.detectionRange))
                    foodInRange.push(item);
            }
            return foodInRange;
        }
    }
    Snake_Game.Enemy = Enemy;
})(Snake_Game || (Snake_Game = {}));
//# sourceMappingURL=Enemy.js.map