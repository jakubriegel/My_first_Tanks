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
        private weapon: object;
        private score: number;
    
        public constructor(tile: Pos, color: string){
            this._position = new Pos(tile.x + Tank.tileWidth/2, tile.y + Tank.tileWidth/2);
            this._angle = Math.random() * 360;
            
            this._color = color;
            this.score = 0;
            
        }
        
        // move tank formward or backward | 1 - forward, 2 - backward
        public move(direction: number){
            // get new position
            let vec = Util.getVector(this.position, Tank.velocity, this.angle);
            switch(direction){
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