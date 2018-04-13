// functions used in vaurios classes
namespace Util{
    // convert degree to radians | Math namespace need angle in radians
    function toRadians(deg : number) { return deg * (Math.PI / 180); }

    // get position after moving it by selected vector
    export function getVector(position: Pos, v: number, angle: number): Pos{ // angle in deg
        angle = toRadians(angle);
        position = new Pos(position.x, position.y); // to avoid reference

        position.x += v * Math.sin(angle);
        position.y -= v * Math.cos(angle);

        return position;
    }

    // chcek if selected position is inside selected tile
    export function belongsToSquare(a: Pos, square: Pos, width: number): boolean{
        if(a.x >= square.x && a.x <= (square.x+width)) if(a.y >= square.y && a.y <= (square.y+width)) return true;
        return false;
    }
}