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
        if(this.keys[38]) this.redTank.move(1);
        // right arrow
        if(this.keys[39]) this.redTank.rotate(true);
        // down arrow
        if(this.keys[40]) this.redTank.move(2);
        // '/'
        if(this.keys[191]){
            this.fire(this.redTank.position, this.redTank.angle);
            this.keys[191] = false;
        }

        // a
        if(this.keys[65]) this.blueTank.rotate(false);
        // w
        if(this.keys[87]) this.blueTank.move(1);
        // d
        if(this.keys[68]) this.blueTank.rotate(true);
        // s
        if(this.keys[83]) this.blueTank.move(2);
        // 'q'
        if(this.keys[81]) {
            this.fire(this.blueTank.position, this.blueTank.angle);
            this.keys[81] = false;
        }

        // make sure any Tank.Tank is not 'in' the wall
        while(!this.arena.validatePosition(this.redTank.position, Tank.Tank.getRadius())) this.redTank.moveBack();
        while(!this.arena.validatePosition(this.blueTank.position, Tank.Tank.getRadius())) this.blueTank.moveBack();
        
        // delete old bullets
        for(let i in this.bullets) if(this.bullets[i].duration > Bullet.Bullet.maxDuration) this.bullets.splice(+i, 1); // + is paring to number

        // move bullets
        for(let bullet of this.bullets){
            bullet.move();
            if(!this.arena.validatePosition(bullet.position, Bullet.Bullet.getRadius())){
                // pushing bullet back to allowed area
                while(!this.arena.validatePosition(bullet.position, Bullet.Bullet.getRadius())) bullet.moveBack();
                // reflecing bullet [will be iproved]
                if(!this.arena.getEdge(bullet.position)){
                    bullet.angle = (180 - bullet.angle) % 360;
                }
                else{
                    bullet.angle = (90 - bullet.angle) % 360
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
                        // end game [will be improved]
                        window.clearInterval(this._interval);
                        //window.alert("End of the game!");
                        window.location.reload();
                    } 
            }
        }
    }

    // fire a bullet from selected tank
    public fire(position: Pos, angle: number): void{
        this.bullets.push(new Bullet.Bullet(Util.getVector(position, Tank.Tank.getRadius()+1, angle), angle));
    }

}

// start the app
function start(): void {
    let game = new Game();
    
    addEventListener('keydown', function(event){ 
        game.processKey(event);
    });
    addEventListener('keyup', function(event){ 
        game.processKey(event);
    });


    game.interval = setInterval(function(){ game.update(); }, 33);
}

// initialize app
window.onload = start;