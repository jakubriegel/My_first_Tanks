var Tank;
(function (Tank_1) {
    // class for tanks
    class Tank {
        constructor(tile, color) {
            this._position = new Pos(tile.x + Tank.tileWidth / 2, tile.y + Tank.tileWidth / 2);
            this._angle = Math.random() * 360;
            this._color = color;
            this._shots = 0;
        }
        static getRadius() { return Tank.radius; }
        static getBarrelWidth() { return Tank.barrelWidth; }
        static setRadius(tileWidth) {
            Tank.tileWidth = tileWidth;
            Tank.radius = (Tank.tileWidth / 2) * .8;
            Tank.barrelWidth = tileWidth / 6;
            Bullet.Bullet.setRadius();
        }
        get position() { return this._position; }
        get angle() { return this._angle; }
        get color() { return this._color; }
        get shots() { return this._shots; }
        set shots(shots) { this._shots = shots; }
        // move tank formward or backward | true - forward, false - backward
        move(direction) {
            if (direction) { // forward
                this._position = Util.getVector(this.position, Tank.velocity, this.angle);
                this.lastMove = -1; // neccesary for Tank.moveBack()
            }
            else { // backward
                this._position = Util.getVector(this.position, -Tank.velocity, this.angle);
                this.lastMove = 1; // neccesary for Tank.moveBack()
            }
        }
        // undo part of move | neccesary for making sure tank is not 'in' the wall
        moveBack() {
            this._position = Util.getVector(new Pos(this.position.x, this.position.y), this.lastMove, this.angle);
        }
        // true - right, false - left
        rotate(direction) {
            if (direction)
                this._angle += 4;
            else
                this._angle -= 4;
            if (this.angle >= 360)
                this._angle = this.angle % 360;
        }
    }
    Tank.velocity = 2;
    Tank_1.Tank = Tank;
})(Tank || (Tank = {}));
