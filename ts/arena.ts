namespace Arena {

    // class for map
    export class Arena{
        private _canvas: HTMLCanvasElement;
        get canvas(): HTMLCanvasElement { return this._canvas; }
        private context: CanvasRenderingContext2D;

        private static readonly tileNumber: number = 25; // 625
        private tileWidth: number;
        private coverage: number;
        private _tiles: Pos[];
        get tiles(): Pos[] { return this._tiles; }
        public getRandomTile(){ return this.tiles[Math.floor(Math.random() * this.tiles.length)]; }

        public constructor(private height: number){
            this._canvas = document.createElement('canvas');
            this.canvas.width = height;
            this.canvas.height = height;
            this.canvas.style.margin = '0 auto';
            this.canvas.style.display = 'block'
            this.context = this.canvas.getContext('2d');

            // setting measures elements
            this.tileWidth = height / Arena.tileNumber;
            Tank.Tank.setRadius(this.tileWidth);

            this.createTiles();
        };

        // generate allowed tiles
        private createTiles(): void{
            this._tiles = [];
            // count % of allowed area
            this.coverage = Math.ceil(Arena.tileNumber * Arena.tileNumber * (Math.random() * .3 + .4)); // 60%-90%

            // get position of first tile
            let x = Math.floor(Math.random() * Arena.tileNumber) * this.tileWidth;
            let y = Math.floor(Math.random() * Arena.tileNumber) * this.tileWidth;

            // recursively generate tiles | recursion ensures that every tile will be reachable
            while(this.coverage > 0){
                // run first recursion
                if(this.tiles.length == 0) this.generateTile(x, y);
                // if first recursion didn't fill the allowed area, run it again for random of existing tiles
                else{
                    let tile = this.tiles[Math.floor(Math.random() * this.tiles.length)];
                    if(this.checkPosibillity(tile.x+this.tileWidth, tile.y)) this.generateTile(tile.x+this.tileWidth, tile.y);
                    if(this.checkPosibillity(tile.x-this.tileWidth, tile.y)) this.generateTile(tile.x-this.tileWidth, tile.y);
                    if(this.checkPosibillity(tile.x, tile.y+this.tileWidth)) this.generateTile(tile.x, tile.y+this.tileWidth);
                    if(this.checkPosibillity(tile.x, tile.y-this.tileWidth)) this.generateTile(tile.x, tile.y-this.tileWidth);
                }
            }
        }

        // check if tile can be created in selected position
        private checkPosibillity(x: number, y: number): boolean {
            // check wheather the allowed area is filled
            if(this.coverage > 0) 
                // draw if tile will be placed | the number on the right is probabilty
                if(Math.random() <= .6)
                    // check if tile is not going beyond arena
                    if(x >= 0 && x + this.tileWidth < this.height)
                        if(y >= 0 && y + this.tileWidth < this.height){
                            // check if the seleted position is not taken
                            for(let i of this.tiles) if(i.x == x && i.y == y) return false;
                            return true;
                        }
            return false;
        }

        private generateTile(x: number, y: number): void {
            this.tiles.push(new Pos(x, y));
            this.coverage--;

            if(this.checkPosibillity(x+this.tileWidth, y)) this.generateTile(x+this.tileWidth, y);
            if(this.checkPosibillity(x-this.tileWidth, y)) this.generateTile(x-this.tileWidth, y);
            if(this.checkPosibillity(x, y+this.tileWidth)) this.generateTile(x, y+this.tileWidth);
            if(this.checkPosibillity(x, y-this.tileWidth)) this.generateTile(x, y-this.tileWidth);
        }

        // draw new frame
        public redraw(redTank: Tank.Tank, blueTank: Tank.Tank, bullets: Bullet.Bullet[]): void {
            this.context.fillStyle = 'white';
            for(let tile of this.tiles) this.context.fillRect(tile.x, tile.y, this.tileWidth, this.tileWidth); 

            for(let bullet of bullets) this.drawBullet(bullet);

            this.drawTank(redTank);
            this.drawTank(blueTank);
        }

        private drawTank(tank: Tank.Tank): void{
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

        private drawBullet(bullet: Bullet.Bullet): void {
            this.context.beginPath();
            this.context.arc(bullet.position.x, bullet.position.y, Bullet.Bullet.getRadius(), 0, 2 * Math.PI);
            this.context.fillStyle = bullet.color;
            this.context.fill();
            this.context.closePath();
        }

        // check if selected position is on allowed area
        public validatePosition(position: Pos, radius: number): boolean{
            let a: Pos, con: boolean = false;
            for(let angle = 0; angle < 360; angle++){
                a = Util.getVector(position, radius, angle);
                for(let tile of this.tiles) if(Util.belongsToSquare(a, tile, this.tileWidth)){
                    con = true;
                    break;
                }
                if(!con){
                    return false;
                }
                con = false;
            }
            return true;
        }

        // get edge wich is right next to selected position of bullet | true - x, false - y | used on workshop
        public getEdge(position: Pos): boolean{
            let a: Pos;
            // check all points on bullets perimeter
            for(let angle = 0; angle < 360; angle++){
                a = Util.getVector(position, Bullet.Bullet.getRadius(), angle);
        
                for(let tile of this.tiles) if(Util.belongsToSquare(a, tile, this.tileWidth)){
                    if((a.x > tile.x-1 && a.x < tile.x+1) || (a.x > tile.x+this.tileWidth-1 && a.x < tile.x+this.tileWidth+1)){
                        return true;
                    }
                    if((a.y > tile.y-1 && a.y < tile.y+1) || (a.y > tile.y+this.tileWidth-1 && a.y < tile.y+this.tileWidth+1)){
                        return false;
                    }
                }
            }
        }

        // getEdge() with better performance
        /*
        public getEdge(position: Pos, angle: number): boolean {
            let a: Pos;
            // check all points on bullets perimeter
            for(let angle = 0; angle < 360; angle++){
                a = Util.getVector(position, Bullet.Bullet.getRadius(), angle);
        
                for(let tile of this.tiles) if(Util.belongsToSquare(a, tile, this.tileWidth)) if((a, angle) => {
                    let b = Util.getVector(a, 1, angle);
                    for(let i of this.tiles) if(Util.belongsToSquare(b, i, this.tileWidth)) return false;
                    return true;
                }) {
                    if((a.x > tile.x-1 && a.x < tile.x+1) || (a.x > tile.x+this.tileWidth-1 && a.x < tile.x+this.tileWidth+1)){
                        return true;
                    }
                    if((a.y > tile.y-1 && a.y < tile.y+1) || (a.y > tile.y+this.tileWidth-1 && a.y < tile.y+this.tileWidth+1)){
                        return false;
                    }
                }
            }

        }
        */

    }
}