var Bullet;
(function (Bullet_1) {
    // class for bullets
    class Bullet {
        /* private revertX: number;
         private revertY: number;
         public setReverts(x: number, y: number){
             this.revertX = x;
             this.revertY = y;
         }
         */
        constructor(position, angle, color) {
            this.position = position;
            this.angle = angle;
            this._color = color;
            this._duration = 0;
        }
        get duration() { return this._duration; }
        get color() { return this._color; }
        static setRadius() { Bullet.radius = Tank.Tank.getBarrelWidth() / 2; }
        static getRadius() { return Bullet.radius; }
        get position() { return this._position; }
        set position(position) { this._position = position; }
        get angle() { return this._angle; }
        set angle(angle) { this._angle = angle; }
        // move bulet forward
        move() {
            this.position = Util.getVector(this.position, Bullet.velocity, this.angle);
            this._duration++;
        }
        // undo part of move | neccesary for making sure bullet is not 'in' the wall
        moveBack() {
            let newPos = Util.getVector(this.position, -1, this.angle);
            this.position = newPos;
        }
    }
    Bullet.velocity = 4;
    Bullet.maxDuration = 400;
    Bullet_1.Bullet = Bullet;
})(Bullet || (Bullet = {}));
