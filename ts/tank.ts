namespace Tank{
     // class for tanks
     export class Tank{
        private static radius: number;
        private static barrelWidth: number;
        private static tileWidth: number;
        public static getRadius() { return Tank.radius; }
        public static getBarrelWidth() { return Tank.barrelWidth; }
        public static setRadius(tileWidth : number) { 
            Tank.tileWidth = tileWidth;
            Tank.radius = (Tank.tileWidth / 2) * .8;
            Tank.barrelWidth = tileWidth / 6;
            Bullet.Bullet.setRadius();
        }
        
        private static readonly velocity: number = 2;
        private lastMove: number;
    
        private _position: Pos;
        get position(): Pos { return this._position; }
        private _angle: number;
        get angle(): number { return this._angle; }
        
        private _color: string;
        get color(): string { return this._color; }

        // number of active bullets
        private _shots: number;
        get shots(): number { return this._shots; }
        set shots(shots: number) { this._shots = shots; }
    
        public constructor(tile: Pos, color: string){
            this._position = new Pos(tile.x + Tank.tileWidth/2, tile.y + Tank.tileWidth/2);
            this._angle = Math.random() * 360;
            
            this._color = color;
            this._shots = 0;      
        }
        
        // move tank formward or backward | true - forward, false - backward
        public move(direction: boolean): void{
            if(direction) { // forward
                this._position = Util.getVector(this.position, Tank.velocity, this.angle);
                this.lastMove = -1; // neccesary for Tank.moveBack()
            }
            else { // backward
                this._position = Util.getVector(this.position, -Tank.velocity, this.angle);
                this.lastMove = 1; // neccesary for Tank.moveBack()
            }
        }
    
        // undo part of move | neccesary for making sure tank is not 'in' the wall
        public moveBack(): void {
            this._position = Util.getVector(new Pos(this.position.x, this.position.y), this.lastMove, this.angle);
        }
    
        // true - right, false - left
        public rotate(direction: boolean): void{ 
            if(direction) this._angle += 4;
            else this._angle -= 4;
            if(this.angle >= 360) this._angle = this.angle % 360;
        }
    }
}