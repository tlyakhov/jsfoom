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
    this.flags = 0;
    this.sector = null;

    $.extend(true, this, options);

    this.update();
}

MapSegment.editableProperties = [
    { name: 'id', friendly: 'ID', type: 'string' },
    { name: 'ax', friendly: 'X', type: 'float' },
    { name: 'ay', friendly: 'Y', type: 'float' },
    { name: 'midMaterialId', friendly: 'Middle Material', type: 'material_id' },
    { name: 'loMaterialId', friendly: 'Low Material', type: 'material_id' },
    { name: 'hiMaterialId', friendly: 'High Material', type: 'material_id' }
];

classes['MapSegment'] = MapSegment;

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

MapSegment.prototype.intersect = function (s2ax, s2ay, s2bx, s2by) {
    var s1 = this;
    var s1dx = s1.bx - s1.ax;
    var s1dy = s1.by - s1.ay;
    var s2dx = s2bx - s2ax;
    var s2dy = s2by - s2ay;

    var denom = s1dx * s2dy - s2dx * s1dy;
    if (denom == 0)
        return undefined;
    var r = (s1.ay - s2ay) * s2dx - (s1.ax - s2ax) * s2dy;
    if (denom <= 0 && r >= 0)
        return undefined;
    if (denom > 0 && r < 0)
        return undefined;
    var s = (s1.ay - s2ay) * s1dx - (s1.ax - s2ax) * s1dy;
    if (denom <= 0 && s >= 0)
        return undefined;
    if (denom > 0 && s < 0)
        return undefined;
    r /= denom;
    s /= denom;
    if (r > 1.0 || s > 1.0)
        return undefined;

    return vec3create(s1.ax + r * s1dx, s1.ay + r * s1dy, 0.0, true);
};

MapSegment.prototype.aabbIntersect = function (xMin, yMin, xMax, yMax) {
    // Find min and max X for the segment

    var minX = this.ax;
    var maxX = this.bx;

    if (this.ax > this.bx) {
        minX = this.bx;
        maxX = this.ax;
    }

    // Find the intersection of the segment's and rectangle's x-projections

    if (maxX > xMax)
        maxX = xMax;

    if (minX < xMin)
        minX = xMin;

    if (minX > maxX) // If their projections do not intersect return false
        return false;

    // Find corresponding min and max Y for min and max X we found before
    var minY = this.ay;
    var maxY = this.by;
    var dx = this.bx - this.ax;

    if (Math.abs(dx) > 0.0000001) {
        var a = (this.by - this.ay) / dx;
        var b = this.ay - a * this.ax;
        minY = a * minX + b;
        maxY = a * maxX + b;
    }

    if (minY > maxY) {
        var tmp = maxY;
        maxY = minY;
        minY = tmp;
    }

    // Find the intersection of the segment's and rectangle's y-projections

    if (maxY > yMax)
        maxY = yMax;

    if (minY < yMin)
        minY = yMin;

    return minY <= maxY; // If Y-projections do not intersect return false
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

MapSegment.prototype.serialize = function () {
    var r = {
        id: this.id,
        ax: this.ax,
        ay: this.ay,
        bx: this.bx,
        by: this.by,
        midMaterialId: this.midMaterialId,
        loMaterialId: this.loMaterialId,
        hiMaterialId: this.hiMaterialId,
        length: this.length,
        normalX: this.normalX,
        normalY: this.normalY,
        adjacentSectorId: this.adjacentSectorId,
        flags: this.flags
    };

    return r;
};

MapSegment.deserialize = function (data, sector, segment) {
    if (!segment)
        segment = new MapSegment();

    segment.id = data.id;
    segment.ax = data.ax;
    segment.ay = data.ay;
    segment.bx = data.bx;
    segment.by = data.by;
    segment.midMaterialId = data.midMaterialId;
    segment.loMaterialId = data.loMaterialId;
    segment.hiMaterialId = data.hiMaterialId;
    segment.length = data.length;
    segment.normalX = data.normalX;
    segment.normalY = data.normalY;
    segment.adjacentSectorId = data.adjacentSectorId;
    segment.flags = data.flags;
    segment.sector = sector;

    return segment;
};