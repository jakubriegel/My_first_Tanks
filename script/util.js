// functions used in vaurios classes
var Util;
(function (Util) {
    // convert degree to radians | Math namespace need angle in radians
    function toRadians(deg) { return deg * (Math.PI / 180); }
    // get position after moving it by selected vector
    function getVector(position, v, angle) {
        angle = toRadians(angle);
        position = new Pos(position.x, position.y); // to avoid reference
        position.x += v * Math.sin(angle);
        position.y -= v * Math.cos(angle);
        return position;
    }
    Util.getVector = getVector;
    // chcek if selected position is inside selected tile
    function belongsToSquare(a, square, width) {
        if (a.x >= square.x && a.x <= (square.x + width))
            if (a.y >= square.y && a.y <= (square.y + width))
                return true;
        return false;
    }
    Util.belongsToSquare = belongsToSquare;
})(Util || (Util = {}));
