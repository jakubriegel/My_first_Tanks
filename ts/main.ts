// main file of the application
// all dependencies are declared in index.html

// structure for positions
class Pos{
    constructor(public x: number, public y: number) {};

    public static calculateDistance(a: Pos, b: Pos): number {
        return Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
    }
}

// main class
class Game{
    private holder: HTMLElement;
    private arena: Arena.Arena;
    private redTank: Tank.Tank;
    private blueTank: Tank.Tank;
    private bullets: Bullet.Bullet[];
    private _interval;
    set interval(interval) {this._interval = interval}

    public keys: Map<number, boolean>;

    public constructor(){
        this.holder = document.getElementById('content');

        this.arena = new Arena.Arena(this.holder.clientHeight);
        this.holder.appendChild(this.arena.canvas);
 
        this.redTank = new Tank.Tank(this.arena.getRandomTile(),'red');
        this.blueTank = new Tank.Tank(this.arena.getRandomTile(),'blue');

        this.bullets = [];

        this.keys = new Map<number, boolean>();
    }


    public processKey(event: KeyboardEvent){
        this.keys[event.keyCode] = (event.type == 'keydown');
    }

    public update(){
        // process player input
        // left arrow
        if(this.keys[37]) this.redTank.rotate(false);
        // up arrow
        if(this.keys[38]) this.redTank.move(true);
        // right arrow
        if(this.keys[39]) this.redTank.rotate(true);
        // down arrow
        if(this.keys[40]) this.redTank.move(false);
        // '/'
        if(this.keys[191]){
            if(this.redTank.shots < 3){
                this.fire(this.redTank.position, this.redTank.angle, this.redTank.color);
                this.redTank.shots++;
            }
            // switching the key off, because firing is not a continuous action
            this.keys[191] = false;
        }

        // a
        if(this.keys[65]) this.blueTank.rotate(false);
        // w
        if(this.keys[87]) this.blueTank.move(true);
        // d
        if(this.keys[68]) this.blueTank.rotate(true);
        // s
        if(this.keys[83]) this.blueTank.move(false);
        // q
        if(this.keys[81]) {
            if(this.blueTank.shots < 3) {
                this.fire(this.blueTank.position, this.blueTank.angle, this.blueTank.color);
                this.blueTank.shots++;
            }
            // switching the key off, because firing is not a continuous action
            this.keys[81] = false;
        }

        // make sure any Tank.Tank is not 'in' the wall
        while(!this.arena.validatePosition(this.redTank.position, Tank.Tank.getRadius())) this.redTank.moveBack();
        while(!this.arena.validatePosition(this.blueTank.position, Tank.Tank.getRadius())) this.blueTank.moveBack();
        
        // delete old bullets | using for in, because splice() works on indexes
        for(let i in this.bullets) if(this.bullets[i].duration > Bullet.Bullet.maxDuration){ 
            if(this.bullets[i].color == this.redTank.color) this.redTank.shots--;
            else this.blueTank.shots--;
            this.bullets.splice(+i, 1); // + is paring string to number
        }

        // move bullets
        for(let bullet of this.bullets){
            bullet.move();

            if(!this.arena.validatePosition(bullet.position, Bullet.Bullet.getRadius())){
                // pushing bullet back to allowed area
                while(!this.arena.validatePosition(bullet.position, Bullet.Bullet.getRadius())) bullet.moveBack();
                // reflecing bullet [may be improved]
                if(!this.arena.getEdge(bullet.position)){
                    bullet.angle = (180 - bullet.angle) % 360;
                }
                else{
                    bullet.angle = 360 - bullet.angle;
                }
            }
        }

        // draw frame
        this.arena.redraw(this.redTank, this.blueTank, this.bullets);

        // check collision with bullet
        for(let bullet of this.bullets) {
            let a: Pos;
            for(let angle = 0; angle < 360; angle++){
                a = Util.getVector(bullet.position, Bullet.Bullet.getRadius(), angle);
                if(Pos.calculateDistance(a, this.redTank.position) <= Tank.Tank.getRadius()
                    || Pos.calculateDistance(a, this.blueTank.position) <= Tank.Tank.getRadius()){
                        // end the game
                        window.clearInterval(this._interval);
                        window.location.reload();
                    } 
            }
        }
    }

    // fire a bullet from selected tank
    public fire(position: Pos, angle: number, color: string): void{
        this.bullets.push(new Bullet.Bullet(Util.getVector(position, Tank.Tank.getRadius()+1, angle), angle, color));
    }

}

// start the app
function start(): void {
    let game = new Game();
    
    addEventListener('keydown', (event) => game.processKey(event));
    addEventListener('keyup', (event) => game.processKey(event));

    game.interval = setInterval(() => game.update(), 33);
}

// initialize app
window.onload = start;