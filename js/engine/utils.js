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
var rad2deg = 180.0 / Math.PI;

function distance2D(x1, y1, x2, y2) {
    return Math.sqrt(sqr((x2 - x1)) + sqr((y2 - y1)));
}

function colorTint(target, tint) {
    if (tint == 0)
        return target;
    if (((tint >> 24) & 0xFF) == 0xFF)
        return tint;

    var ta = ((target >> 24) & 0xFF);
    var tb = ((target >> 16) & 0xFF);
    var tg = ((target >> 8) & 0xFF);
    var tr = ((target) & 0xFF);
    var w = ((tint >> 24) & 0xFF) / 255.0;
    var rb = fast_floor(tb * (1.0 - w) + ((tint >> 16) & 0xFF) * w);
    var rg = fast_floor(tg * (1.0 - w) + ((tint >> 8) & 0xFF) * w);
    var rr = fast_floor(tr * (1.0 - w) + ((tint) & 0xFF) * w);

    return (ta << 24) | ((rb & 0xFF) << 16) | ((rg & 0xFF) << 8) | (rr & 0xFF);
}

function rgba2int(r, g, b, a) {
    return (r & 0xFF) | ((g & 0xFF) << 8) | ((b & 0xFF) << 16) | ((a & 0xFF) << 24);
}

function rgb2int(r, g, b) {
    return rgba2int(r, g, b, 255);
}

function int2r(i) {
    return i & 0xFF;
}

function int2g(i) {
    return (i >> 8) & 0xFF;
}

function int2b(i) {
    return (i >> 16) & 0xFF;
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

function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

function sqr(x) {
    return x * x;
}

function dist2(ax, ay, bx, by) {
    return sqr(bx - ax) + sqr(by - ay);
}