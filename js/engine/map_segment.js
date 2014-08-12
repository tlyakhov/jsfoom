function MapSegment(options) {
    this.id = "Segment_" + (new ObjectId().toString());
    this.ax = 0.0;
    this.ay = 0.0;
    this.bx = 0.0;
    this.by = 0.0;
    this.midMaterialId = 'Default';
    this.midMaterial = null;
    this.loMaterialId = 'Default';
    this.loMaterial = null;
    this.hiMaterialId = 'Default';
    this.hiMaterial = null;
    this.length = 0;
    this.normalX = 0;
    this.normalY = 0;
    this.adjacentSectorId = null;
    this.adjacentSector = null;
    this.adjacentSegment = null;
    this.playerPortal = false;
    this.flags = 0;

    $.extend(true, this, options);

    this.update();
}

MapSegment.prototype.update = function () {
    this.length = Math.sqrt(sqr((this.ax - this.bx)) + sqr((this.ay - this.by)));
    this.normalX = -(this.by - this.ay) / this.length;
    this.normalY = (this.bx - this.ax) / this.length;
};

MapSegment.prototype.getMidMaterial = function () {
    if (!this.midMaterialId)
        return null;

    if (!this.midMaterial || this.midMaterial.id != this.midMaterialId)
        this.midMaterial = this.sector.map.getMaterial(this.midMaterialId);

    return this.midMaterial;
};

MapSegment.prototype.getHiMaterial = function () {
    if (!this.hiMaterialId)
        return null;

    if (!this.hiMaterial || this.hiMaterial.id != this.hiMaterialId)
        this.hiMaterial = this.sector.map.getMaterial(this.hiMaterialId);

    return this.hiMaterial;
};

MapSegment.prototype.getLoMaterial = function () {
    if (!this.loMaterialId)
        return null;

    if (!this.loMaterial || this.loMaterial.id != this.loMaterialId)
        this.loMaterial = this.sector.map.getMaterial(this.loMaterialId);

    return this.loMaterial;
};

MapSegment.prototype.getAdjacentSector = function () {
    if (!this.adjacentSectorId)
        return null;

    if (!this.adjacentSector || this.adjacentSector.id != this.adjacentSectorId) {
        for (var i = 0; i < this.sector.map.sectors.length; i++) {
            var s = this.sector.map.sectors[i];
            if (this.adjacentSectorId == s.id) {
                this.adjacentSector = s;
                break;
            }
        }
    }

    return this.adjacentSector;
};

MapSegment.prototype.getAdjacentSegment = function () {
    if (!this.adjacentSectorId)
        return null;

    if (!this.adjacentSegment || this.adjacentSector.id != this.adjacentSectorId) {
        var adj = this.getAdjacentSector();

        for (var i = 0; i < adj.segments.length; i++) {
            if (this.sector.id == adj.segments[i].adjacentSectorId) {
                this.adjacentSegment = adj.segments[i];
                break;
            }
        }
    }

    return this.adjacentSegment;
};

MapSegment.prototype.intersect = function (s2) {
    var denom = -1.0;
    var r = -1.0;
    var s = -1.0;
    var s1 = this;
    var s1dx = s1.bx - s1.ax;
    var s1dy = s1.by - s1.ay;
    var s2dx = s2.bx - s2.ax;
    var s2dy = s2.by - s2.ay;

    denom = s1dx * s2dy - s2dx * s1dy;
    if (denom == 0)
        return undefined;
    r = (s1.ay - s2.ay) * s2dx - (s1.ax - s2.ax) * s2dy;
    if (denom <= 0 && r >= 0)
        return undefined;
    if (denom > 0 && r < 0)
        return undefined;
    s = (s1.ay - s2.ay) * s1dx - (s1.ax - s2.ax) * s1dy;
    if (denom <= 0 && s >= 0)
        return undefined;
    if (denom > 0 && s < 0)
        return undefined;
    r /= denom;
    s /= denom;
    if (r > 1.0 || s > 1.0)
        return undefined;

    return { x: s1.ax + r * s1dx, y: s1.ay + r * s1dy, tx: r };
};

/*MapSegment.prototype.distanceToPoint = function (x, y) {
 var dx = (this.bx - this.ax);
    var dy = (this.by - this.ay);

    return (dy * x - dx * y - this.ax * this.by + this.bx * this.ay) /
 Math.sqrt(sqr(dx) + sqr(dy));
 };*/

MapSegment.prototype.distanceToPoint2 = function (x, y) {
    var l2 = dist2(this.ax, this.ay, this.bx, this.by);
    if (l2 == 0)
        return dist2(x, y, this.ax, this.ay);
    var t = ((x - this.ax) * (this.bx - this.ax) + (y - this.ay) * (this.by - this.ay)) / l2;
    if (t < 0)
        return dist2(x, y, this.ax, this.ay);
    if (t > 1)
        return dist2(x, y, this.bx, this.by);
    return dist2(x, y, this.ax + t * (this.bx - this.ax), this.ay + t * (this.by - this.ay));
};

MapSegment.prototype.distanceToPoint = function (x, y) {
    return Math.sqrt(this.distanceToPoint2(x, y));
};

MapSegment.prototype.whichSide = function (x, y) {
    var dx = (this.bx - this.ax);
    var dy = (this.by - this.ay);

    return sign(dy * x - dx * y - this.ax * this.by + this.bx * this.ay);
};

function Ray(ax, ay, bx, by) {
    this.ax = ax;
    this.ay = ay;
    this.bx = bx;
    this.by = by;
}

Ray.prototype.intersect = MapSegment.prototype.intersect;