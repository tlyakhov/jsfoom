function Vector3(x, y, z) {
    this.x = x ? x : 0.0;
    this.y = y ? y : 0.0;
    this.z = z ? z : 0.0;
}

Vector3.prototype.clone = function () {
    return new Vector3(this.x, this.y, this.z);
};

Vector3.prototype.add = function (v2) {
    return new Vector3(this.x + v2.x, this.y + v2.y, this.z + v2.z);
};

Vector3.prototype.sub = function (v2) {
    return new Vector3(this.x - v2.x, this.y - v2.y, this.z - v2.z);
};

Vector3.prototype.mul3 = function (v2) {
    return new Vector3(this.x * v2.x, this.y * v2.y, this.z * v2.z);
};

Vector3.prototype.mul = function (x) {
    return new Vector3(this.x * x, this.y * x, this.z * x);
};

Vector3.prototype.getLength = function () {
    return Math.sqrt(sqr(this.x) + sqr(this.y) + sqr(this.z));
};

Vector3.prototype.normalize = function () {
    var l = this.getLength();

    if (l == 0.0)
        return new Vector3(0.0, 0.0, 0.0);

    return new Vector3(this.x / l, this.y / l, this.z / l);
};

Vector3.prototype.dot = function (v2) {
    return this.x * v2.x + this.y * v2.y + this.z * v2.z;
};

Vector3.prototype.reflect = function (normal) {
    return normal.mul(2 * this.dot(normal)).sub(this);
};

Vector3.prototype.clamp = function (min, max) {
    return new Vector3(Math.max(min, Math.min(max, this.x)),
        Math.max(min, Math.min(max, this.y)),
        Math.max(min, Math.min(max, this.z)));
}