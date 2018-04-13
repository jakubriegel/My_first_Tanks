var Tank;
(function (Tank_1) {
    // class for tanks
    class Tank {
        constructor(tile, color) {
            this._position = new Pos(tile.x + Tank.tileWidth / 2, tile.y + Tank.tileWidth / 2);
            this._angle = Math.random() * 360;
            this._color = color;
            this.score = 0;
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
        // move tank formward or backward | 1 - forward, 2 - backward
        move(direction) {
            // get new position
            let vec = Util.getVector(this.position, Tank.velocity, this.angle);
            switch (direction) {
                case 1: // forward
                    this._position = vec;
                    this.lastMove = -1; // neccesary for Tank.moveBack()
                    break;
                case 2: // backward
                    this.position.x -= vec.x - this.position.x; // getting displacement and subtracting it from current position
                    this.position.y -= vec.y - this.position.y;
                    this.lastMove = 1; // neccesary for Tank.moveBack()
                    break;
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