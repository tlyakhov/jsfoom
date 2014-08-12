function fast_floor(v) {
    return v | 0;
}

function normalizeAngle(a) {
    var result = a;

    while (result < 0) {
        result += 360.0;
    }
    while (result >= 360.0) {
        result -= 360.0;
    }
    return result;
}

var deg2rad = Math.PI / 180.0;

function distance2D(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function colorTint(target, tint) {
    if (tint == 0)
        return target;

    var ta = ((target >> 24) & 0xFF);
    var tb = ((target >> 16) & 0xFF);
    var tg = ((target >> 8) & 0xFF);
    var tr = ((target) & 0xFF);
    var w = ((tint >> 24) & 0xFF) / 255.0;
    var rb = tb * (1.0 - w) + ((tint >> 16) & 0xFF) * w;
    var rg = tg * (1.0 - w) + ((tint >> 8) & 0xFF) * w;
    var rr = tr * (1.0 - w) + ((tint) & 0xFF) * w;

    return (ta << 24) | ((rb & 0xFF) << 16) | ((rg & 0xFF) << 8) | (rr & 0xFF);
}

function nearestPow2(n) {
    n--;

    n |= n >> 1;
    n |= n >> 2;
    n |= n >> 4;
    n |= n >> 8;
    n |= n >> 16;

    return ++n;
}