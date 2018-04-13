var Arena;
(function (Arena_1) {
    // class for map
    class Arena {
        constructor(height) {
            this.height = height;
            this._canvas = document.createElement('canvas');
            this.canvas.width = height;
            this.canvas.height = height;
            this.canvas.style.margin = '0 auto';
            this.canvas.style.display = 'block';
            this.context = this.canvas.getContext('2d');
            // setting measures elements
            this.tileWidth = height / Arena.tileNumber;
            Tank.Tank.setRadius(this.tileWidth);
            this.createTiles();
        }
        get canvas() { return this._canvas; }
        get tiles() { return this._tiles; }
        getRandomTile() { return this.tiles[Math.floor(Math.random() * this.tiles.length)]; }
        ;
        // generate allowed tiles
        createTiles() {
            this._tiles = [];
            // count % of allowed area
            this.coverage = Math.ceil(Arena.tileNumber * Arena.tileNumber * (Math.random() * .3 + .4)); // 60%-90%
            // get position of first tile
            let x = Math.floor(Math.random() * Arena.tileNumber) * this.tileWidth;
            let y = Math.floor(Math.random() * Arena.tileNumber) * this.tileWidth;
            // recursively generate tiles | recursion ensures that every tile will be reachable
            while (this.coverage > 0) {
                // run first recursion
                if (this.tiles.length == 0)
                    this.generateTile(x, y);
                // if first recursion didn't fill the allowed area, run it again for random of existing tiles
                else {
                    let tile = this.tiles[Math.floor(Math.random() * this.tiles.length)];
                    if (this.checkPosibillity(tile.x + this.tileWidth, tile.y))
                        this.generateTile(tile.x + this.tileWidth, tile.y);
                    if (this.checkPosibillity(tile.x - this.tileWidth, tile.y))
                        this.generateTile(tile.x - this.tileWidth, tile.y);
                    if (this.checkPosibillity(tile.x, tile.y + this.tileWidth))
                        this.generateTile(tile.x, tile.y + this.tileWidth);
                    if (this.checkPosibillity(tile.x, tile.y - this.tileWidth))
                        this.generateTile(tile.x, tile.y - this.tileWidth);
                }
            }
        }
        // check if tile can be created in selected position
        checkPosibillity(x, y) {
            // check wheather the allowed area is filled
            if (this.coverage > 0)
                // draw if tile will be placed | the number on the right is probabilty
                if (Math.random() <= .6)
                    // check if tile is not going beyond arena
                    if (x >= 0 && x < this.height)
                        if (y >= 0 && y < this.height) {
                            // check if the seleted position is not taken
                            for (let i of this.tiles)
                                if (i.x == x && i.y == y)
                                    return false;
                            return true;
                        }
            return false;
        }
        generateTile(x, y) {
            this.tiles.push(new Pos(x, y));
            this.coverage--;
            if (this.checkPosibillity(x + this.tileWidth, y))
                this.generateTile(x + this.tileWidth, y);
            if (this.checkPosibillity(x - this.tileWidth, y))
                this.generateTile(x - this.tileWidth, y);
            if (this.checkPosibillity(x, y + this.tileWidth))
                this.generateTile(x, y + this.tileWidth);
            if (this.checkPosibillity(x, y - this.tileWidth))
                this.generateTile(x, y - this.tileWidth);
        }
        // draw new frame
        redraw(redTank, blueTank, bullets) {
            this.context.fillStyle = 'white';
            for (let tile of this.tiles)
                this.context.fillRect(tile.x, tile.y, this.tileWidth, this.tileWidth); // +1 to avoid blank borders
            for (let bullet of bullets)
                this.drawBullet(bullet);
            this.drawTank(redTank);
            this.drawTank(blueTank);
        }
        drawTank(tank) {
            let position = tank.position;
            let radius = Tank.Tank.getRadius();
            // tank
            this.context.beginPath();
            this.context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
            this.context.fillStyle = tank.color;
            this.context.fill();
            this.context.closePath();
            // barrel
            radius *= 1.4;
            this.context.beginPath();
            this.context.fillStyle = 'black';
            this.context.lineWidth = Tank.Tank.getBarrelWidth();
            this.context.moveTo(position.x, position.y);
            let end = Util.getVector(new Pos(position.x, position.y), radius, tank.angle);
            this.context.lineTo(end.x, end.y);
            this.context.stroke();
            this.context.closePath();
        }
        drawBullet(bullet) {
            this.context.beginPath();
            this.context.arc(bullet.position.x, bullet.position.y, Bullet.Bullet.getRadius(), 0, 2 * Math.PI);
            this.context.fillStyle = 'green';
            this.context.fill();
            this.context.closePath();
        }
        // check if selected position is on allowed area
        validatePosition(position, radius) {
            let a, con = false;
            for (let angle = 0; angle < 360; angle++) {
                a = Util.getVector(position, radius, angle);
                for (let tile of this.tiles)
                    if (Util.belongsToSquare(a, tile, this.tileWidth)) {
                        con = true;
                        break;
                    }
                if (!con) {
                    return false;
                }
                con = false;
            }
            return true;
        }
        // get edge wich is right next to selected position of bullet | true - x, false - y
        getEdge(position) {
            let a;
            // check all points on bullets perimeter
            for (let angle = 0; angle < 360; angle++) {
                a = Util.getVector(position, Bullet.Bullet.getRadius(), angle);
                for (let tile of this.tiles)
                    if (Util.belongsToSquare(a, tile, this.tileWidth)) {
                        if ((a.x > tile.x - 1 && a.x < tile.x + 1) || (a.x > tile.x + this.tileWidth - 1 && a.x < tile.x + this.tileWidth + 1)) {
                            return true;
                        }
                        if ((a.y > tile.y - 1 && a.y < tile.y + 1) || (a.y > tile.y + this.tileWidth - 1 && a.y < tile.y + this.tileWidth + 1)) {
                            return false;
                        }
                    }
            }
        }
    }
    Arena.tileNumber = 25; // 625
    Arena_1.Arena = Arena;
})(Arena || (Arena = {}));
