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

        private _angle: number;
        get angle(): number { return this._angle; }
        set angle(angle: number) {this._angle = angle; }

        public constructor(position: Pos, angle: number, color: string){
            this._position = position;
            this._angle = angle;
            this._color = color;
            this._duration = 0;
        }

        // move bulet forward
        public move(): void{
            this._position = Util.getVector(this.position, Bullet.velocity, this.angle);
            this._duration++;
        }

        // undo part of move | neccesary for making sure bullet is not 'in' the wall
        public moveBack(): void{
            let newPos = Util.getVector(this.position, -1, this.angle);
            
            this._position = newPos;
        }
    }
}