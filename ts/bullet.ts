namespace Bullet{
    // class for bullets
    export class Bullet{
        private static readonly velocity: number = 4;
        public static readonly maxDuration: number = 400;
        private _duration: number;
        get duration(): number { return this._duration; }

        private _color: string;
        get color(): string { return this._color; }

        private static radius: number;
        public static setRadius(): void { Bullet.radius = Tank.Tank.getBarrelWidth() / 2; }
        public static getRadius(): number { return Bullet.radius; }
        
        private _position: Pos;
        get position(): Pos { return this._position; }
        set position(position: Pos){ this._position = position; }

        private _angle: number;
        get angle(): number { return this._angle; }
        set angle(angle: number) {this._angle = angle; }

        private revertX: number;
        private revertY: number;
        public setReverts(x: number, y: number){
            this.revertX = x;
            this.revertY = y;
        }
        
        public constructor(position: Pos, angle: number, color: string){
            this.position = position;
            this.angle = angle;
            this._color = color;
            this._duration = 0;
        }

        // move bulet forward
        public move(){
            this.position = Util.getVector(this.position, Bullet.velocity, this.angle);
            this._duration++;
        }

        // undo part of move | neccesary for making sure bullet is not 'in' the wall
        public moveBack(){
            let newPos = Util.getVector(this.position, -1, this.angle);
            
            this.position = newPos;
        }
    }
}